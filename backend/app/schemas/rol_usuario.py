from pydantic import BaseModel
from typing import Optional

class RolUsuarioBase(BaseModel):
    nombre_rol: str
    descripcion: Optional[str] = None

class RolUsuarioCreate(RolUsuarioBase):
    pass

class RolUsuarioUpdate(BaseModel):
    nombre_rol: Optional[str] = None
    descripcion: Optional[str] = None

class RolUsuarioOut(RolUsuarioBase):
    rol_id: int

    class Config:
        from_attributes = True  # Pydantic 2.x
