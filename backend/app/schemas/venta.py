from pydantic import BaseModel
from datetime import date
from typing import Optional

class VentaBase(BaseModel):
    ganado_id: int
    fecha_venta: date
    precio_venta: float
    comprador: str
    estado_trazabilidad: Optional[str] = None

class VentaCreate(VentaBase):
    pass

class VentaResponse(VentaBase):
    id: int

    class Config:
        from_attributes = True
