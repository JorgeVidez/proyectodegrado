from pydantic import BaseModel, Field
from typing import Optional
from datetime import date

class ControlesSanitariosBase(BaseModel):
    animal_id: int
    fecha_control: date = Field(default_factory=date.today)
    peso_kg: Optional[float] = None
    condicion_corporal: Optional[float] = None
    altura_cm: Optional[float] = None
    responsable_id: Optional[int] = None
    ubicacion_id: Optional[int] = None
    observaciones: Optional[str] = None

class ControlesSanitariosCreate(ControlesSanitariosBase):
    pass

class ControlesSanitariosUpdate(ControlesSanitariosBase):
    pass

class ControlesSanitariosOut(ControlesSanitariosBase):
    control_id: int

    class Config:
        from_attributes = True