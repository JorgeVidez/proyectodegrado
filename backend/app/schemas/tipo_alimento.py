from pydantic import BaseModel
from typing import Optional

class TipoAlimentoBase(BaseModel):
    nombre: str
    descripcion: Optional[str] = None
    unidad_medida: Optional[str] = None

class TipoAlimentoCreate(TipoAlimentoBase):
    pass

class TipoAlimentoUpdate(BaseModel):
    nombre: Optional[str] = None
    descripcion: Optional[str] = None
    unidad_medida: Optional[str] = None

class TipoAlimentoOut(TipoAlimentoBase):
    tipo_alimento_id: int

    class Config:
        from_attributes = True