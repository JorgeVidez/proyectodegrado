from pydantic import BaseModel, Field
from typing import Optional
from datetime import date

class AnimalOut(BaseModel):
    animal_id: int
    numero_trazabilidad: str
    nombre_identificatorio: Optional[str] = None

    class Config:
        from_attributes = True

# app/schemas/lote.py
class LoteOut(BaseModel):
    lote_id: int
    fecha_creacion: date
    codigo_lote: str
    proposito: Optional[str] = None
    descripcion: Optional[str] = None
    activo: Optional[bool] = True

    class Config:
        from_attributes = True

# app/schemas/ubicacion.py
class UbicacionOut(BaseModel):
    ubicacion_id: int
    nombre: str
    tipo: Optional[str] = None
    capacidad_maxima_animales: Optional[int] = None
    descripcion: Optional[str] = None

    class Config:
        from_attributes = True

# app/schemas/tipo_alimento.py
class TipoAlimentoOut(BaseModel):
    tipo_alimento_id: int
    nombre: str
    descripcion: Optional[str] = None
    unidad_medida: Optional[str] = None

    class Config:
        from_attributes = True

class AlimentacionesBase(BaseModel):
    animal_id: Optional[int] = None
    lote_id: Optional[int] = None
    ubicacion_id: Optional[int] = None
    fecha_suministro: date
    tipo_alimento_id: int
    cantidad_suministrada: float
    proveedor_alimento_id: Optional[int] = None
    costo_total_alimento: Optional[float] = None
    responsable_id: Optional[int] = None
    observaciones: Optional[str] = None

class AlimentacionesCreate(AlimentacionesBase):
    pass

class AlimentacionesUpdate(AlimentacionesBase):
    pass

class AlimentacionesOut(AlimentacionesBase):
    alimentacion_id: int
    
    animal: Optional[AnimalOut] = None
    lote: Optional[LoteOut] = None
    ubicacion: Optional[UbicacionOut] = None
    tipo_alimento: TipoAlimentoOut

    class Config:
        from_attributes = True