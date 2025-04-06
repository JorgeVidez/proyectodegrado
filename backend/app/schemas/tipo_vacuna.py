from pydantic import BaseModel
from typing import Optional

class TipoVacunaBase(BaseModel):
    nombre_vacuna: str
    enfermedad_prevenida: Optional[str] = None
    laboratorio: Optional[str] = None
    especie_destino_id: Optional[int] = None

class TipoVacunaCreate(TipoVacunaBase):
    pass

class TipoVacunaUpdate(BaseModel):
    nombre_vacuna: Optional[str] = None
    enfermedad_prevenida: Optional[str] = None
    laboratorio: Optional[str] = None
    especie_destino_id: Optional[int] = None

class TipoVacunaOut(TipoVacunaBase):
    tipo_vacuna_id: int

    class Config:
        from_attributes = True