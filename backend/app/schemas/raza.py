from pydantic import BaseModel
from typing import Optional

class RazaBase(BaseModel):
    especie_id: int
    nombre_raza: str

class RazaCreate(RazaBase):
    pass

class RazaUpdate(BaseModel):
    especie_id: Optional[int] = None
    nombre_raza: Optional[str] = None

class RazaOut(RazaBase):
    raza_id: int

    class Config:
        from_attributes = True