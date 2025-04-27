from pydantic import BaseModel, Field
from typing import Optional
from datetime import date, datetime
from app.schemas.ventas_detalle import VentasDetalleOut
from app.schemas.cliente import ClienteOut
from app.schemas.usuario import UsuarioOut
from app.schemas.lote import LoteBase

class LoteOut(LoteBase):
    lote_id: int
    fecha_creacion: date

    class Config:
        from_attributes = True

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
    detalles: list[VentasDetalleOut] = []
    cliente: Optional[ClienteOut] = None
    lote_origen: Optional[LoteOut] = None
    usuario_registra: Optional[UsuarioOut] = None
    

    class Config:
        from_attributes = True