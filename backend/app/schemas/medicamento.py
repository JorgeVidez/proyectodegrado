from pydantic import BaseModel
from typing import Optional

class MedicamentoBase(BaseModel):
    nombre_comercial: str
    principio_activo: Optional[str] = None
    laboratorio: Optional[str] = None
    presentacion: Optional[str] = None
    periodo_retiro_carne_dias: Optional[int] = 0
    periodo_retiro_leche_dias: Optional[int] = 0

class MedicamentoCreate(MedicamentoBase):
    pass

class MedicamentoUpdate(BaseModel):
    nombre_comercial: Optional[str] = None
    principio_activo: Optional[str] = None
    laboratorio: Optional[str] = None
    presentacion: Optional[str] = None
    periodo_retiro_carne_dias: Optional[int] = None
    periodo_retiro_leche_dias: Optional[int] = None

class MedicamentoOut(MedicamentoBase):
    medicamento_id: int

    class Config:
        from_attributes = True