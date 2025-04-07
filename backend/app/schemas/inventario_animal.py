from pydantic import BaseModel, Field
from typing import Optional
from datetime import date
from enum import Enum

class MotivoIngreso(str, Enum):
    Nacimiento = "Nacimiento"
    Compra = "Compra"
    TrasladoInterno = "TrasladoInterno"

class MotivoEgreso(str, Enum):
    Venta = "Venta"
    Muerte = "Muerte"
    Descarte = "Descartado"
    TrasladoExterno = "TrasladoExterno"

class InventarioAnimalBase(BaseModel):
    animal_id: int
    fecha_ingreso: date
    motivo_ingreso: MotivoIngreso
    proveedor_compra_id: Optional[int] = None
    precio_compra: Optional[float] = None
    ubicacion_actual_id: Optional[int] = None
    lote_actual_id: Optional[int] = None
    fecha_egreso: Optional[date] = None
    motivo_egreso: Optional[MotivoEgreso] = None

class InventarioAnimalCreate(InventarioAnimalBase):
    pass

class InventarioAnimalUpdate(InventarioAnimalBase):
    pass

class InventarioAnimalOut(InventarioAnimalBase):
    inventario_id: int
    activo_en_finca: bool

    class Config:
        from_attributes = True