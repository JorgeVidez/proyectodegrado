from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from enum import Enum

class TipoMovimiento(str, Enum):
    IngresoCompra = "IngresoCompra"
    IngresoNacimiento = "IngresoNacimiento"
    EgresoVenta = "EgresoVenta"
    EgresoMuerte = "EgresoMuerte"
    EgresoDescarte = "EgresoDescarte"
    TrasladoInterno = "TrasladoInterno"
    CambioLote = "CambioLote"

class MovimientoAnimalBase(BaseModel):
    animal_id: int
    tipo_movimiento: TipoMovimiento
    origen_ubicacion_id: Optional[int] = None
    destino_ubicacion_id: Optional[int] = None
    origen_lote_id: Optional[int] = None
    destino_lote_id: Optional[int] = None
    proveedor_id: Optional[int] = None
    cliente_id: Optional[int] = None
    documento_referencia: Optional[str] = None
    usuario_id: Optional[int] = None
    observaciones: Optional[str] = None

class MovimientoAnimalCreate(MovimientoAnimalBase):
    pass

class MovimientoAnimalUpdate(MovimientoAnimalBase):
    pass

class MovimientoAnimalOut(MovimientoAnimalBase):
    movimiento_id: int
    fecha_movimiento: datetime

    class Config:
        from_attributes = True