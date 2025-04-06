from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class RolUsuarioOut(BaseModel):
    rol_id: int
    nombre_rol: str
    descripcion: Optional[str] = None

    class Config:
        from_attributes = True

class UsuarioBase(BaseModel):
    nombre: str
    email: EmailStr
    activo: Optional[bool] = True

class UsuarioCreate(UsuarioBase):
    password: str
    rol_id: int

class UsuarioUpdate(BaseModel):
    nombre: Optional[str] = None
    email: Optional[EmailStr] = None
    activo: Optional[bool] = None
    password: Optional[str] = None
    rol_id: Optional[int] = None

class UsuarioOut(UsuarioBase):
    usuario_id: int
    fecha_creacion: datetime
    fecha_actualizacion: Optional[datetime] = None
    rol: RolUsuarioOut

    class Config:
        from_attributes = True

class LoginSchema(BaseModel):
    email: EmailStr
    password: str

class UsuarioMe(UsuarioOut):
    pass