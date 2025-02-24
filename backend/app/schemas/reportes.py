from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class ReporteBase(BaseModel):
    usuario_id: int
    tipo: str
    contenido: str

class ReporteCreate(ReporteBase):
    pass

class ReporteSchema(ReporteBase):
    id: int
    fecha_generado: Optional[datetime]  # ✅ Permitir que pueda faltar

    class Config:
        from_attributes = True
