import asyncio
import logging
import jwt
from fastapi import APIRouter, Depends, HTTPException, Security, Request
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.database import get_db
from app.models.usuario import Usuario
from app.models.rol_usuario import RolUsuario
from app.schemas.usuario import UsuarioCreate, UsuarioOut, UsuarioUpdate, LoginSchema, UsuarioMe
from passlib.context import CryptContext
from typing import List
from sqlalchemy.orm import selectinload
import time
from fastapi.security import OAuth2PasswordRequestForm
from cachetools import TTLCache
from datetime import datetime, timedelta



router = APIRouter()

# Configuración de seguridad
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

SECRET_KEY = "1924828c313d833c45c558745655220e8a99fd3f4651bda9b2a1d19773eab4bf3c7db06e0aa88aa4193169f972dc0b8f3c2e45261ab6f5c8bb671fab0d4a9795b7398fe4d0b78f1136ae00489b23dc8ccae656a19fa6457e6e78aaa57b9cf943d7c008f54919d0b1e668b5d002ea6d1ae51c2a6520a3d65773d80e1795502bd7b0fccc86018c95470fd24fc0038e570a08366a7f384c6517af3fb2f1482028934ad6e8c4e87167f746b7be735554fa50326f257d47c70fefcadf0801baace01bdaacdbc248b02c8a378a54264e834705c3d60170e38a73619097f8c35c817fbb5ef5863722f9c94642c4b0a5112de236f6af6a0ca1c95905b0787380e50bcfbe"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

# Configuración de protección
MAX_LOGIN_ATTEMPTS = 5
LOCKOUT_TIME = 300  # 5 minutos en segundos
FAILED_LOGIN_CACHE = TTLCache(maxsize=1000, ttl=LOCKOUT_TIME)
DELAY_BASE = 0.5  # Tiempo base para el retraso incremental

# Logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def generate_token(email: str, rol: str):
    """Genera un token JWT."""
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    payload = {"sub": email, "rol": rol, "exp": expire}
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


def hash_password(password):
    return pwd_context.hash(password)


async def get_current_user(token: str = Security(oauth2_scheme), db: AsyncSession = Depends(get_db)) -> Usuario:
    """Valida el token JWT y retorna el usuario actual."""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")

        if not email:
            raise HTTPException(status_code=401, detail="Token inválido")

        result = await db.execute(
            select(Usuario).options(selectinload(Usuario.rol)).where(Usuario.email == email)
        )
        user = result.scalars().first()

        if not user:
            raise HTTPException(status_code=401, detail="Usuario no encontrado")

        return user

    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expirado")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Token inválido")


@router.get("/usuarios/me", response_model=UsuarioMe)
async def get_me(current_user: Usuario = Depends(get_current_user)):
    """Retorna el usuario autenticado."""
    return current_user


@router.get("/usuarios/", response_model=List[UsuarioOut])
async def get_usuarios(
    db: AsyncSession = Depends(get_db),
    current_user: Usuario = Depends(get_current_user)
):
    """Obtiene la lista de todos los usuarios (requiere autenticación)."""
    result = await db.execute(select(Usuario).options(selectinload(Usuario.rol)))
    return result.scalars().all()


@router.get("/usuarios/{usuario_id}", response_model=UsuarioOut)
async def get_usuario(
    usuario_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: Usuario = Depends(get_current_user)
):
    """Obtiene un usuario por ID."""
    result = await db.execute(
        select(Usuario).options(selectinload(Usuario.rol)).where(Usuario.usuario_id == usuario_id)
    )
    usuario = result.scalars().first()

    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    return usuario


@router.post("/usuarios/", response_model=UsuarioOut)
async def create_usuario(
    data: UsuarioCreate,
    db: AsyncSession = Depends(get_db),
    current_user: Usuario = Depends(get_current_user)
):
    """Crea un nuevo usuario (requiere autenticación)."""
    result = await db.execute(select(Usuario).where(Usuario.email == data.email))
    if result.scalars().first():
        raise HTTPException(status_code=400, detail="El correo ya está registrado")

    nuevo_usuario = Usuario(
        nombre=data.nombre,
        email=data.email,
        rol_id=data.rol_id,
        password_hash=hash_password(data.password),
        activo=data.activo if data.activo is not None else True,
    )
    db.add(nuevo_usuario)
    await db.commit()
    await db.refresh(nuevo_usuario)
    return nuevo_usuario


@router.put("/usuarios/{usuario_id}", response_model=UsuarioOut)
async def update_usuario(
    usuario_id: int,
    usuario_data: UsuarioUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: Usuario = Depends(get_current_user)
):
    """Actualiza un usuario por ID (requiere autenticación)."""
    result = await db.execute(
        select(Usuario).options(selectinload(Usuario.rol)).where(Usuario.usuario_id == usuario_id)
    )
    usuario = result.scalars().first()

    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    update_data = usuario_data.model_dump(exclude_unset=True)

    if "password" in update_data:
        update_data["password_hash"] = hash_password(update_data.pop("password"))

    for key, value in update_data.items():
        setattr(usuario, key, value)

    await db.commit()
    await db.refresh(usuario)
    return usuario


@router.delete("/usuarios/{usuario_id}")
async def delete_usuario(
    usuario_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: Usuario = Depends(get_current_user)
):
    """Elimina un usuario por ID (requiere autenticación)."""
    usuario = await db.get(Usuario, usuario_id)
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    await db.delete(usuario)
    await db.commit()
    return {"message": "Usuario eliminado correctamente"}


@router.post("/login")
async def login(
    request: Request,
    data: LoginSchema, 
    db: AsyncSession = Depends(get_db)
):
    """Autenticación con protección contra fuerza bruta."""
    client_ip = request.client.host
    
    # Verificar si la IP está bloqueada temporalmente
    if client_ip in FAILED_LOGIN_CACHE:
        attempts, first_attempt = FAILED_LOGIN_CACHE[client_ip]
        if attempts >= MAX_LOGIN_ATTEMPTS:
            remaining_time = LOCKOUT_TIME - (time.time() - first_attempt)
            if remaining_time > 0:
                minutes = int(remaining_time // 60)
                seconds = int(remaining_time % 60)
                
                if minutes > 0:
                    time_msg = f"{minutes} minuto{'s' if minutes != 1 else ''} y {seconds} segundo{'s' if seconds != 1 else ''}"
                else:
                    time_msg = f"{seconds} segundo{'s' if seconds != 1 else ''}"
                
                raise HTTPException(
                    status_code=429,
                    detail=f"Cuenta temporalmente bloqueada por demasiados intentos fallidos. Podrá intentar nuevamente en {time_msg}."
                )
        else:
            # Retraso incremental para ralentizar ataques
            await asyncio.sleep(DELAY_BASE * (attempts + 1))
    
    # Autenticación
    result = await db.execute(
        select(Usuario).options(selectinload(Usuario.rol)).where(Usuario.email == data.email)
    )
    usuario = result.scalars().first()

    # Registrar intento fallido antes de verificar
    attempts, first_attempt = FAILED_LOGIN_CACHE.get(client_ip, (0, time.time()))
    new_attempts = attempts + 1
    remaining_attempts = MAX_LOGIN_ATTEMPTS - new_attempts
    
    # Verificar si el usuario existe
    if not usuario:
        FAILED_LOGIN_CACHE[client_ip] = (new_attempts, first_attempt)
        
        if remaining_attempts > 0:
            detail = f"El correo electrónico no está registrado. Le quedan {remaining_attempts} intento{'s' if remaining_attempts != 1 else ''} antes del bloqueo temporal."
        else:
            detail = "El correo electrónico no está registrado. Su cuenta será bloqueada temporalmente por seguridad."
        
        raise HTTPException(
            status_code=400,
            detail=detail,
            headers={"X-RateLimit-Remaining": str(remaining_attempts)}
        )
    
    # Verificar contraseña
    if not verify_password(data.password, usuario.password_hash):
        FAILED_LOGIN_CACHE[client_ip] = (new_attempts, first_attempt)
        
        if remaining_attempts > 0:
            detail = f"La contraseña es incorrecta. Le quedan {remaining_attempts} intento{'s' if remaining_attempts != 1 else ''} antes del bloqueo temporal."
        else:
            detail = "La contraseña es incorrecta. Su cuenta será bloqueada temporalmente por seguridad."
        
        raise HTTPException(
            status_code=400,
            detail=detail,
            headers={"X-RateLimit-Remaining": str(remaining_attempts)}
        )
    
    # Resetear contador si el login es exitoso
    if client_ip in FAILED_LOGIN_CACHE:
        del FAILED_LOGIN_CACHE[client_ip]
    
    token = generate_token(usuario.email, usuario.rol.nombre_rol)
    return {"access_token": token, "token_type": "bearer"}