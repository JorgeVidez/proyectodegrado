from pydantic import BaseModel, Field
from typing import Optional
from datetime import date, datetime
from enum import Enum

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

class AnimalOut(BaseModel):
    animal_id: int
    numero_trazabilidad: str
    nombre_identificatorio: Optional[str] = None
    especie: EspecieOut
    raza: RazaOut
    sexo: str
    fecha_nacimiento: Optional[date] = None
    madre: Optional[AnimalSimpleOut] = None
    padre: Optional[AnimalSimpleOut] = None
    estado_actual: EstadoAnimal
    fecha_registro: datetime
    observaciones_generales: Optional[str] = None

    class Config:
        from_attributes = True

class AnimalBase(BaseModel):
    numero_trazabilidad: str = Field(..., max_length=50)
    nombre_identificatorio: Optional[str] = Field(None, max_length=100)
    especie_id: int
    raza_id: int
    sexo: str = Field(..., pattern="^[MH]$")
    fecha_nacimiento: Optional[date] = None
    madre_id: Optional[int] = None
    padre_id: Optional[int] = None
    estado_actual: EstadoAnimal = EstadoAnimal.Activo
    observaciones_generales: Optional[str] = None

class AnimalCreate(AnimalBase):
    pass

class AnimalUpdate(AnimalBase):
    pass