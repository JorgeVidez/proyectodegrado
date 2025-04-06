from pydantic import BaseModel
from typing import Optional

class EspecieBase(BaseModel):
    nombre_comun: str
    nombre_cientifico: Optional[str] = None

class EspecieCreate(EspecieBase):
    pass

class EspecieUpdate(BaseModel):
    nombre_comun: Optional[str] = None
    nombre_cientifico: Optional[str] = None

class EspecieOut(EspecieBase):
    especie_id: int

    class Config:
        from_attributes = True