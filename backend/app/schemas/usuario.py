from pydantic import BaseModel, EmailStr
from typing import Optional

class UsuarioBase(BaseModel):
    nombre: str
    email: EmailStr
    rol: str

class UsuarioCreate(UsuarioBase):
    password: str  # Solo se usa al crear un usuario

class UsuarioUpdate(BaseModel):
    nombre: Optional[str] = None
    email: Optional[EmailStr] = None
    rol: Optional[str] = None
    password: Optional[str] = None  # Si se envía, se encripta antes de guardar

class UsuarioOut(UsuarioBase):
    id: int

    class Config:
        from_attributes = True

class LoginSchema(BaseModel):
    email: EmailStr
    password: str

class UsuarioMe(BaseModel):
    id: int
    nombre: str
    email: EmailStr
    rol: str

    class Config:
        from_attributes = True