import logging
import datetime
import jwt
from fastapi import APIRouter, Depends, HTTPException, Security
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.database import get_db
<<<<<<< Updated upstream
from app.models.usuario import Usuario
from app.models.rol_usuario import RolUsuario
from app.schemas.usuario import UsuarioCreate, UsuarioOut, UsuarioUpdate, LoginSchema, UsuarioMe
from passlib.context import CryptContext
from typing import List
from sqlalchemy.orm import selectinload

=======
from app.models.usuario import Usuario, RolUsuario
from app.schemas.usuario import UsuarioCreate, UsuarioOut, UsuarioUpdate, LoginSchema, UsuarioMe
from passlib.context import CryptContext
from typing import List
>>>>>>> Stashed changes

router = APIRouter()

# Configuración de seguridad
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

SECRET_KEY = "1924828c313d833c45c558745655220e8a99fd3f4651bda9b2a1d19773eab4bf3c7db06e0aa88aa4193169f972dc0b8f3c2e45261ab6f5c8bb671fab0d4a9795b7398fe4d0b78f1136ae00489b23dc8ccae656a19fa6457e6e78aaa57b9cf943d7c008f54919d0b1e668b5d002ea6d1ae51c2a6520a3d65773d80e1795502bd7b0fccc86018c95470fd24fc0038e570a08366a7f384c6517af3fb2f1482028934ad6e8c4e87167f746b7be735554fa50326f257d47c70fefcadf0801baace01bdaacdbc248b02c8a378a54264e834705c3d60170e38a73619097f8c35c817fbb5ef5863722f9c94642c4b0a5112de236f6af6a0ca1c95905b0787380e50bcfbe"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

<<<<<<< Updated upstream
# Logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def generate_token(email: str, rol: str):
    """Genera un token JWT."""
    expire = datetime.datetime.utcnow() + datetime.timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    payload = {"sub": email, "rol": rol, "exp": expire}
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


def hash_password(password):
    return pwd_context.hash(password)

=======
# Configuración de logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ✅ Generar token con email y rol
def generate_token(email: str, rol: str):
    access_token_expires = datetime.timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    payload = {
        "sub": email,
        "rol": rol,
        "exp": datetime.datetime.utcnow() + access_token_expires
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

# ✅ Verificar contraseña hasheada
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

# ✅ Hashear contraseña antes de almacenarla
def hash_password(password):
    return pwd_context.hash(password)

# ✅ Obtener usuario actual a partir del token
async def get_current_user(token: str = Security(oauth2_scheme), db: AsyncSession = Depends(get_db)):
    logger.info(f"Token recibido: {token}")
>>>>>>> Stashed changes

async def get_current_user(token: str = Security(oauth2_scheme), db: AsyncSession = Depends(get_db)) -> Usuario:
    """Valida el token JWT y retorna el usuario actual."""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")
<<<<<<< Updated upstream

        if not email:
            raise HTTPException(status_code=401, detail="Token inválido")

        result = await db.execute(
            select(Usuario).options(selectinload(Usuario.rol)).where(Usuario.email == email)
        )
        user = result.scalars().first()

        if not user:
            raise HTTPException(status_code=401, detail="Usuario no encontrado")
=======
        rol = payload.get("rol")

        if not email or not rol:
            raise HTTPException(status_code=401, detail={"error": "Token inválido"})

        stmt = select(Usuario).where(Usuario.email == email)
        result = await db.execute(stmt)
        user = result.scalars().first()

        if not user:
            raise HTTPException(status_code=401, detail={"error": "Usuario no encontrado"})

        if user.rol.value != rol:
            raise HTTPException(status_code=401, detail={"error": "Token inválido"})
>>>>>>> Stashed changes

        return user

    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail={"error": "Token expirado"})
    except jwt.InvalidTokenError:
<<<<<<< Updated upstream
        raise HTTPException(status_code=401, detail="Token inválido")


=======
        raise HTTPException(status_code=401, detail={"error": "Token inválido"})

# ✅ Obtener información del usuario autenticado
>>>>>>> Stashed changes
@router.get("/usuarios/me", response_model=UsuarioMe)
async def get_me(current_user: Usuario = Depends(get_current_user)):
    """Retorna el usuario autenticado."""
    return current_user

<<<<<<< Updated upstream

@router.get("/usuarios/", response_model=List[UsuarioOut])
async def get_usuarios(
    db: AsyncSession = Depends(get_db),
    current_user: Usuario = Depends(get_current_user)
):
    """Obtiene la lista de todos los usuarios (requiere autenticación)."""
    result = await db.execute(select(Usuario).options(selectinload(Usuario.rol)))
    return result.scalars().all()


=======
# ✅ Obtener todos los usuarios (Solo Administradores)
@router.get("/usuarios/", response_model=List[UsuarioOut])
async def get_usuarios(db: AsyncSession = Depends(get_db), current_user: Usuario = Depends(get_current_user)):
    if current_user.rol != RolUsuario.administrador:
        raise HTTPException(status_code=403, detail={"error": "No tienes permisos para ver usuarios"})

    result = await db.execute(select(Usuario))
    return result.scalars().all()

# ✅ Obtener un usuario por ID
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
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

=======
        raise HTTPException(status_code=404, detail={"error": "Usuario no encontrado"})
    return usuario

# ✅ Crear un nuevo usuario
@router.post("/usuarios/", response_model=UsuarioOut)
async def create_usuario(data: UsuarioCreate, db: AsyncSession = Depends(get_db)):
    try:
        result = await db.execute(select(Usuario).where(Usuario.email == data.email))
        if result.scalars().first():
            raise HTTPException(status_code=400, detail={"error": "El correo ya está registrado"})

        usuario = Usuario(
            nombre=data.nombre,
            email=data.email,
            rol=data.rol,
            password=hash_password(data.password)
        )
        db.add(usuario)
        await db.commit()
        await db.refresh(usuario)
        return usuario
    except Exception as e:
        raise HTTPException(status_code=500, detail={"error": str(e)})
>>>>>>> Stashed changes

# ✅ Actualizar usuario
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
<<<<<<< Updated upstream
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
=======
        raise HTTPException(status_code=404, detail={"error": "Usuario no encontrado"})

    if current_user.rol != RolUsuario.administrador and current_user.id != usuario.id:
        raise HTTPException(status_code=403, detail={"error": "No tienes permisos para actualizar este usuario"})
>>>>>>> Stashed changes

    update_data = usuario_data.model_dump(exclude_unset=True)

    if "password" in update_data:
<<<<<<< Updated upstream
        update_data["password_hash"] = hash_password(update_data.pop("password"))
=======
        if not verify_password(update_data["password"], usuario.password):
            update_data["password"] = hash_password(update_data["password"])
>>>>>>> Stashed changes

    for key, value in update_data.items():
        setattr(usuario, key, value)

    await db.commit()
    await db.refresh(usuario)
    return usuario

<<<<<<< Updated upstream

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
=======
# ✅ Eliminar usuario (Solo Administradores)
@router.delete("/usuarios/{usuario_id}")
async def delete_usuario(usuario_id: int, db: AsyncSession = Depends(get_db), current_user: Usuario = Depends(get_current_user)):
    if current_user.rol != RolUsuario.administrador:
        raise HTTPException(status_code=403, detail={"error": "No tienes permisos para eliminar usuarios"})

    usuario = await db.get(Usuario, usuario_id)
    if not usuario:
        raise HTTPException(status_code=404, detail={"error": "Usuario no encontrado"})
>>>>>>> Stashed changes

    await db.delete(usuario)
    await db.commit()
    return {"message": "Usuario eliminado correctamente"}

<<<<<<< Updated upstream

=======
# ✅ Login y generación de token
>>>>>>> Stashed changes
@router.post("/login")
async def login(data: LoginSchema, db: AsyncSession = Depends(get_db)):
    """Autenticación y generación de token JWT."""
    result = await db.execute(
        select(Usuario).options(selectinload(Usuario.rol)).where(Usuario.email == data.email)
    )
    usuario = result.scalars().first()

<<<<<<< Updated upstream
    if not usuario or not verify_password(data.password, usuario.password_hash):
        raise HTTPException(status_code=400, detail="Credenciales incorrectas")

    token = generate_token(usuario.email, usuario.rol.nombre_rol)
    return {"access_token": token, "token_type": "bearer"}
=======
    if not usuario or not verify_password(data.password, usuario.password):
        raise HTTPException(status_code=400, detail={"error": "Credenciales incorrectas"})

    return {"access_token": generate_token(usuario.email, usuario.rol.value), "token_type": "bearer"}

# ✅ Refrescar token
@router.post("/refresh")
async def refresh_token(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        new_token = jwt.encode(
            {"sub": payload["sub"], "rol": payload["rol"], "exp": datetime.datetime.utcnow() + datetime.timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)},
            SECRET_KEY,
            algorithm=ALGORITHM
        )
        return {"access_token": new_token, "token_type": "bearer"}
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail={"error": "Token expirado, vuelve a iniciar sesión"})
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail={"error": "Token inválido"})
>>>>>>> Stashed changes
