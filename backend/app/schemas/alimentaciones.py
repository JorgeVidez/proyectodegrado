from pydantic import BaseModel, Field
from typing import Optional
from datetime import date

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

    class Config:
        from_attributes = True