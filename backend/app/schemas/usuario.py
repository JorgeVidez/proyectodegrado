from pydantic import BaseModel, EmailStr
from typing import Optional
from app.models.usuario import RolUsuario  # Importamos el Enum de roles

class UsuarioBase(BaseModel):
    nombre: str
    email: EmailStr
    rol: RolUsuario  # ✅ Ahora el rol es un Enum, asegurando valores válidos

class UsuarioCreate(UsuarioBase):
    password: str  # Solo se usa al crear un usuario

class UsuarioUpdate(BaseModel):
    nombre: Optional[str] = None
    email: Optional[EmailStr] = None
    rol: Optional[RolUsuario] = None  # ✅ Asegura que solo acepte valores válidos
    password: Optional[str] = None  # Si se envía, se encripta antes de guardar

class UsuarioOut(UsuarioBase):
    id: int

    class Config:
        from_attributes = True  # ✅ Reemplaza orm_mode (más actualizado en Pydantic)

class LoginSchema(BaseModel):
    email: EmailStr
    password: str

class UsuarioMe(BaseModel):
    id: int
    nombre: str
    email: EmailStr
    rol: RolUsuario  # ✅ Usa el Enum en la respuesta

    class Config:
        from_attributes = True  # ✅ Asegura compatibilidad con SQLAlchemy
