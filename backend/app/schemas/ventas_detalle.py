from pydantic import BaseModel, Field
from typing import Optional
from app.schemas.animal import AnimalOut

class VentasDetalleBase(BaseModel):
    venta_id: int
    animal_id: int
    peso_venta_kg: Optional[float] = None
    precio_individual: Optional[float] = None
    precio_por_kg: Optional[float] = None
    observaciones: Optional[str] = None

class VentasDetalleCreate(VentasDetalleBase):
    pass

class VentasDetalleUpdate(VentasDetalleBase):
    pass

class VentasDetalleOut(VentasDetalleBase):
    venta_detalle_id: int
    animal: Optional[AnimalOut] = None

    class Config:
        from_attributes = True