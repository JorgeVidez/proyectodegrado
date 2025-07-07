from pydantic import BaseModel, Field
from typing import Optional
from datetime import date
from enum import Enum
from app.schemas.ubicacion import UbicacionOut
from app.schemas.proveedor import ProveedorOut
from app.schemas.lote import LoteBase
from datetime import datetime

class EstadoAnimal(str, Enum):
    Activo = "Activo"
    Vendido = "Vendido"
    Muerto = "Muerto"
    Descartado = "Descartado"

class EspecieOut(BaseModel):
    especie_id: int
    nombre_comun: str

    class Config:
        from_attributes = True

class RazaOut(BaseModel):
    raza_id: int
    nombre_raza: str

    class Config:
        from_attributes = True

class LoteOut(LoteBase):
    lote_id: int
    fecha_creacion: date

    class Config:
        from_attributes = True

class MotivoIngreso(str, Enum):
    Nacimiento = "Nacimiento"
    Compra = "Compra"
    TrasladoInterno = "TrasladoInterno"

class MotivoEgreso(str, Enum):
    Venta = "Venta"
    Muerte = "Muerte"
    Descarte = "Descarte"
    TrasladoExterno = "TrasladoExterno"
    

class AnimalSimpleOut(BaseModel):
    animal_id: int
    numero_trazabilidad: str
    nombre_identificatorio: Optional[str] = None
    especie: EspecieOut
    raza: RazaOut
    sexo: str
    fecha_nacimiento: Optional[date] = None
    estado_actual: EstadoAnimal
    fecha_registro: datetime
    observaciones_generales: Optional[str] = None

    class Config:
        from_attributes = True

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
    activo_en_finca: Optional[bool] = None # <-- ¡Aquí está el cambio!

class InventarioAnimalOut(InventarioAnimalBase):
    inventario_id: int
    activo_en_finca: bool
    animal: AnimalSimpleOut
    ubicacion_actual: Optional[UbicacionOut] = None
    lote_actual: Optional[LoteOut] = None
    proveedor_compra: Optional[ProveedorOut] = None  # ✅ correcto nombre
    

    class Config:
        from_attributes = True