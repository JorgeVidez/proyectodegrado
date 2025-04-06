from pydantic import BaseModel
from typing import Optional
from datetime import date

class LoteBase(BaseModel):
    codigo_lote: str
    proposito: Optional[str] = None
    descripcion: Optional[str] = None
    activo: Optional[bool] = True

class LoteCreate(LoteBase):
    pass

class LoteUpdate(BaseModel):
    codigo_lote: Optional[str] = None
    proposito: Optional[str] = None
    descripcion: Optional[str] = None
    activo: Optional[bool] = None

class LoteOut(LoteBase):
    lote_id: int
    fecha_creacion: date

    class Config:
        from_attributes = True