from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class UsuarioBase(BaseModel):
    nombre: str
    email: EmailStr
    rol_id: int
    activo: Optional[bool] = True

class UsuarioCreate(UsuarioBase):
    password: str

class UsuarioUpdate(BaseModel):
    nombre: Optional[str] = None
    email: Optional[EmailStr] = None
    rol_id: Optional[int] = None
    activo: Optional[bool] = None
    password: Optional[str] = None

class UsuarioOut(UsuarioBase):
    usuario_id: int
    fecha_creacion: datetime
    fecha_actualizacion: Optional[datetime] = None

    class Config:
        from_attributes = True  # ✅ Soporte para ORM

class LoginSchema(BaseModel):
    email: EmailStr
    password: str

class UsuarioMe(BaseModel):
    usuario_id: int
    nombre: str
    email: EmailStr
    rol: str  # ✅ Usamos string para evitar problemas con JSON y Enums

    class Config:
        from_attributes = True
