from pydantic import BaseModel
from typing import Optional
from decimal import Decimal

class UbicacionBase(BaseModel):
    nombre: str
    tipo: Optional[str] = None
    area_hectareas: Optional[Decimal] = None
    capacidad_maxima_animales: Optional[int] = None
    descripcion: Optional[str] = None

class UbicacionCreate(UbicacionBase):
    pass

class UbicacionUpdate(BaseModel):
    nombre: Optional[str] = None
    tipo: Optional[str] = None
    area_hectareas: Optional[Decimal] = None
    capacidad_maxima_animales: Optional[int] = None
    descripcion: Optional[str] = None

class UbicacionOut(UbicacionBase):
    ubicacion_id: int

    class Config:
        from_attributes = True