from pydantic import BaseModel
from typing import List
from enum import Enum 
from typing import Optional
from datetime import date
from app.schemas.ubicacion import UbicacionOut 
from app.schemas.proveedor import ProveedorOut
from datetime import datetime

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

class AnimalSimpleOut(BaseModel):
    animal_id: int
    numero_trazabilidad: str
    nombre_identificatorio: Optional[str] = None

    class Config:
        from_attributes = True

class EstadoAnimal(str, Enum):
    Activo = "Activo"
    Vendido = "Vendido"
    Muerto = "Muerto"
    Descartado = "Descartado"
    
# Pydantic Models
class AnimalOut(BaseModel):
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




 


 


class MotivoIngreso(str, Enum):
    Nacimiento = "Nacimiento"
    Compra = "Compra"
    TrasladoInterno = "TrasladoInterno"

class MotivoEgreso(str, Enum):
    Venta = "Venta"
    Muerte = "Muerte"
    Descarte = "Descartado"
    TrasladoExterno = "TrasladoExterno"
    
class InventarioAnimalOut(BaseModel):
    inventario_id: int
    animal_id: int
    fecha_ingreso: date
    motivo_ingreso: MotivoIngreso
    proveedor_compra: Optional[ProveedorOut] = None # Changed to ProveedorOut
    precio_compra: Optional[float] = None
    ubicacion_actual: Optional[UbicacionOut] = None # Changed to UbicacionOut
    lote_actual_id: int
    fecha_egreso: Optional[date] = None
    motivo_egreso: Optional[MotivoEgreso] = None
    activo_en_finca: bool
    animal: AnimalOut  # Use the AnimalOut model

    class Config:
        from_attributes = True

class LoteBase(BaseModel):
    codigo_lote: str
    proposito: Optional[str] = None
    descripcion: Optional[str] = None
    activo: Optional[bool] = True

class LoteCreate(LoteBase):
    pass

class LoteUpdate(BaseModel):
    codigo_lote: Optional[str] = None
    proposito: Optional[str] = None
    descripcion: Optional[str] = None
    activo: Optional[bool] = None

class LoteOut(LoteBase):
    lote_id: int
    fecha_creacion: date
    inventarios: List[InventarioAnimalOut] = [] # Add the list here

    class Config:
        from_attributes = True
        
# Nuevo esquema básico para respuestas livianas
class LoteSimpleOut(LoteBase):
    lote_id: int
    fecha_creacion: date

    class Config:
        from_attributes = True
