from pydantic import BaseModel, EmailStr
from typing import Optional
<<<<<<< Updated upstream
from datetime import datetime

class RolUsuarioOut(BaseModel):
    rol_id: int
    nombre_rol: str
    descripcion: Optional[str] = None

    class Config:
        from_attributes = True
=======
from app.models.usuario import RolUsuario  # Importamos el Enum de roles
>>>>>>> Stashed changes

class UsuarioBase(BaseModel):
    nombre: str
    email: EmailStr
<<<<<<< Updated upstream
    activo: Optional[bool] = True
=======
    rol: RolUsuario  # ✅ Ahora el rol es un Enum, asegurando valores válidos
>>>>>>> Stashed changes

class UsuarioCreate(UsuarioBase):
    password: str
    rol_id: int

class UsuarioUpdate(BaseModel):
    nombre: Optional[str] = None
    email: Optional[EmailStr] = None
<<<<<<< Updated upstream
    activo: Optional[bool] = None
    password: Optional[str] = None
    rol_id: Optional[int] = None
=======
    rol: Optional[RolUsuario] = None  # ✅ Asegura que solo acepte valores válidos
    password: Optional[str] = None  # Si se envía, se encripta antes de guardar
>>>>>>> Stashed changes

class UsuarioOut(UsuarioBase):
    usuario_id: int
    fecha_creacion: datetime
    fecha_actualizacion: Optional[datetime] = None
    rol: RolUsuarioOut

    class Config:
        from_attributes = True  # ✅ Reemplaza orm_mode (más actualizado en Pydantic)

class LoginSchema(BaseModel):
    email: EmailStr
    password: str

<<<<<<< Updated upstream
class UsuarioMe(UsuarioOut):
    pass
=======
class UsuarioMe(BaseModel):
    id: int
    nombre: str
    email: EmailStr
    rol: RolUsuario  # ✅ Usa el Enum en la respuesta

    class Config:
        from_attributes = True  # ✅ Asegura compatibilidad con SQLAlchemy
>>>>>>> Stashed changes
