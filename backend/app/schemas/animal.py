from pydantic import BaseModel, Field
from typing import Optional
from datetime import date, datetime
from enum import Enum

class EstadoAnimal(str, Enum):
    Activo = "Activo"
    Vendido = "Vendido"
    Muerto = "Muerto"
    Descartado = "Descartado"

class AnimalBase(BaseModel):
    numero_trazabilidad: str = Field(..., max_length=50)
    nombre_identificatorio: Optional[str] = Field(None, max_length=100)
    especie_id: int
    raza_id: int
    sexo: str = Field(..., pattern="^[MH]$")  # ✅ Reemplazar regex con pattern
    fecha_nacimiento: Optional[date] = None
    madre_id: Optional[int] = None
    padre_id: Optional[int] = None
    estado_actual: EstadoAnimal = EstadoAnimal.Activo
    observaciones_generales: Optional[str] = None

class AnimalCreate(AnimalBase):
    pass

class AnimalUpdate(AnimalBase):
    pass

class AnimalOut(AnimalBase):
    animal_id: int
    fecha_registro: datetime

    class Config:
        from_attributes = True