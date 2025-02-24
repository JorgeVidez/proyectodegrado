from pydantic import BaseModel, Field
from datetime import date
from typing import Optional

class GanadoBase(BaseModel):
    tipo: str = Field(..., min_length=2, max_length=100, description="Tipo de ganado (ejemplo: bovino, ovino)")
    raza: str = Field(..., min_length=2, max_length=100, description="Raza del ganado")
    edad: int = Field(..., gt=0, description="Edad del ganado en años")
    peso: float = Field(..., gt=0, description="Peso del ganado en kg")
    estado_salud: str = Field(..., min_length=2, max_length=255, description="Estado de salud del ganado")
    fecha_ingreso: date = Field(..., description="Fecha de ingreso del ganado")

class GanadoCreate(GanadoBase):
    pass

class GanadoUpdate(BaseModel):
    tipo: Optional[str] = Field(None, min_length=2, max_length=100)
    raza: Optional[str] = Field(None, min_length=2, max_length=100)
    edad: Optional[int] = Field(None, gt=0)
    peso: Optional[float] = Field(None, gt=0)
    estado_salud: Optional[str] = Field(None, min_length=2, max_length=255)
    fecha_ingreso: Optional[date] = Field(None)

class GanadoResponse(GanadoBase):
    id: int

    class Config:
        from_attributes = True
