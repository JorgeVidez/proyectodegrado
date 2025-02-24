from pydantic import BaseModel, Field
from datetime import date
from typing import Optional

class ControlBase(BaseModel):
    ganado_id: int = Field(..., description="ID del ganado al que pertenece el control")
    fecha: date = Field(..., description="Fecha en que se realizó el control")
    peso: Optional[float] = Field(None, gt=0, description="Peso del ganado en kg (opcional)")
    observaciones: Optional[str] = Field(None, description="Notas adicionales sobre el control")
    veterinario_id: Optional[int] = Field(None, description="ID del veterinario que realizó el control (opcional)")

class ControlCreate(ControlBase):
    pass

class ControlUpdate(BaseModel):
    ganado_id: Optional[int] = Field(None, description="ID del ganado al que pertenece el control")
    fecha: Optional[date] = Field(None, description="Fecha en que se realizó el control")
    peso: Optional[float] = Field(None, gt=0, description="Peso del ganado en kg (opcional)")
    observaciones: Optional[str] = Field(None, description="Notas adicionales sobre el control")
    veterinario_id: Optional[int] = Field(None, description="ID del veterinario que realizó el control (opcional)")

class ControlResponse(ControlBase):
    id: int

    class Config:
        from_attributes = True
