from pydantic import BaseModel, Field
from typing import Optional
from datetime import date, datetime

class VentasBase(BaseModel):
    cliente_id: int
    fecha_venta: date
    documento_venta_ref: Optional[str] = None
    precio_venta_total_general: Optional[float] = None
    condicion_pago: Optional[str] = None
    lote_origen_id: Optional[int] = None
    usuario_registra_id: Optional[int] = None
    observaciones: Optional[str] = None

class VentasCreate(VentasBase):
    pass

class VentasUpdate(VentasBase):
    pass

class VentasOut(VentasBase):
    venta_id: int
    fecha_registro: datetime

    class Config:
        from_attributes = True