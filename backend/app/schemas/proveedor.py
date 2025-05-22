<<<<<<< Updated upstream
from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class ProveedorBase(BaseModel):
    nombre: str
    identificacion_fiscal: Optional[str] = None
    telefono: Optional[str] = None
    email: Optional[EmailStr] = None
    direccion: Optional[str] = None
    persona_contacto: Optional[str] = None
    tipo_proveedor: Optional[str] = None
=======
from pydantic import BaseModel
from typing import Optional, List

class ProveedorBase(BaseModel):
    nombre: str
    telefono: Optional[str] = None
    direccion: Optional[str] = None
>>>>>>> Stashed changes

class ProveedorCreate(ProveedorBase):
    pass

<<<<<<< Updated upstream
class ProveedorUpdate(ProveedorBase):
    pass

class ProveedorOut(ProveedorBase):
    proveedor_id: int
    fecha_creacion: datetime
    fecha_actualizacion: Optional[datetime] = None

    class Config:
        from_attributes = True
=======
class ProveedorResponse(ProveedorBase):
    id: int

    class Config:
        orm_mode = True
>>>>>>> Stashed changes
