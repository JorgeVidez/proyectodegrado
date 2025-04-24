from pydantic import BaseModel, Field
from typing import Optional
from datetime import date
from enum import Enum
from app.schemas.animal import AnimalOut
from app.schemas.ubicacion import UbicacionOut
from app.schemas.lote import LoteOut
from app.schemas.proveedor import ProveedorOut

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
    animal: AnimalOut
    ubicacion_actual: Optional[UbicacionOut] = None
    lote_actual: Optional[LoteOut] = None
    proveedor_compra: Optional[ProveedorOut] = None  # ✅ correcto nombre
    

    class Config:
        from_attributes = True