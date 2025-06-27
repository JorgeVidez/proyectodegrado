# app/routes/password_reset.py
import random
import logging
from fastapi import APIRouter, HTTPException, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from datetime import datetime, timedelta
from app.database import get_db
from app.models.password_reset import PasswordResetCode
from app.models.usuario import Usuario
from app.schemas.password_reset import PasswordResetRequest, PasswordResetVerify, PasswordResetComplete
from app.routes.usuario import hash_password
from app.utils.email_utils import send_password_reset_email
from sqlalchemy import and_
from datetime import timezone



router = APIRouter()
logger = logging.getLogger(__name__)

@router.post("/auth/forgot-password", status_code=200)
async def forgot_password(payload: PasswordResetRequest, db: AsyncSession = Depends(get_db)):
    try:
        result = await db.execute(select(Usuario).where(Usuario.email == payload.email))
        user = result.scalar()

        if not user:
            raise HTTPException(status_code=404, detail="Usuario no encontrado")

        code = f"{random.randint(100000, 999999)}"
        now_utc = datetime.utcnow()

        reset = PasswordResetCode(email=payload.email, code=code, created_at=now_utc)
        db.add(reset)
        await db.commit()

        await send_password_reset_email(payload.email, code)
        return {"message": "Código enviado al correo"}
    
    except HTTPException as he:
        raise he
    except Exception as e:
        logger.exception("Error al generar código de recuperación")
        raise HTTPException(status_code=500, detail="Error interno del servidor")

@router.post("/auth/verify-code", status_code=200)
async def verify_code(payload: PasswordResetVerify, db: AsyncSession = Depends(get_db)):
    logger.info("Verificando código de recuperación")
    logger.info(f"Payload recibido: {payload}")

    try:
        tiempo_limite = datetime.utcnow() - timedelta(minutes=15)
        logger.info(f"Tiempo límite: {tiempo_limite.isoformat()}")

        result = await db.execute(
            select(PasswordResetCode).where(
                and_(
                    PasswordResetCode.email == payload.email,
                    PasswordResetCode.code == payload.code,
                    PasswordResetCode.used == False,
                    PasswordResetCode.created_at >= tiempo_limite
                )
            )
        )
        code = result.scalar()

        if not code:
            logger.warning("No se encontró código válido para los criterios dados")
            raise HTTPException(status_code=400, detail="Código inválido o expirado")

        logger.info("Código verificado correctamente")
        return {"message": "Código válido"}

    except HTTPException as he:
        raise he
    except Exception as e:
        logger.exception("Error inesperado al verificar el código")
        raise HTTPException(status_code=500, detail="Error interno del servidor")

@router.post("/auth/reset-password", status_code=200)
async def reset_password(payload: PasswordResetComplete, db: AsyncSession = Depends(get_db)):
    try:
        result = await db.execute(
            select(PasswordResetCode).where(
                PasswordResetCode.email == payload.email,
                PasswordResetCode.code == payload.code,
                PasswordResetCode.used == False,
                PasswordResetCode.created_at >= datetime.utcnow() - timedelta(minutes=15)
            )
        )
        print(f"Resultado de la consulta: {result}")
        reset_code = result.scalar()
        if not reset_code:
            raise HTTPException(status_code=400, detail="Código inválido o expirado")

        user_result = await db.execute(select(Usuario).where(Usuario.email == payload.email))
        print(f"Resultado de la consulta de usuario: {user_result}")
        user = user_result.scalar()
        if not user:
            raise HTTPException(status_code=404, detail="Usuario no encontrado")

        print(f"Contraseña actual del usuario: {user.password_hash}")
        print(f"Nueva contraseña proporcionada: {payload.new_password}")
        
        user.password_hash = hash_password(payload.new_password)
        print(f"Contraseña actualizada para el usuario: {user.email}")
        reset_code.used = True

        await db.commit()
        
        
        return {"message": "Contraseña actualizada correctamente"}
    
    except HTTPException as he:
        raise he
    except Exception as e:
        logger.exception("Error al restablecer la contraseña")
        raise HTTPException(status_code=500, detail="Error interno del servidor")
