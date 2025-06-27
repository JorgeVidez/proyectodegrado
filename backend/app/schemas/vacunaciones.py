from pydantic import BaseModel, Field
from typing import Optional
from datetime import date
from .animal import AnimalSimpleOut
from .tipo_vacuna import TipoVacunaOut
from .proveedor import ProveedorOut
from .usuario import UsuarioOut

class VacunacionesBase(BaseModel):
    animal_id: int
    fecha_aplicacion: date
    tipo_vacuna_id: int
    dosis_aplicada: Optional[float] = None
    unidad_dosis: Optional[str] = None
    lote_vacuna: Optional[str] = None
    fecha_vencimiento_lote: Optional[date] = None
    proveedor_vacuna_id: Optional[int] = None
    responsable_aplicacion_id: Optional[int] = None
    proxima_vacunacion_sugerida: Optional[date] = None
    observaciones: Optional[str] = None

class VacunacionesCreate(VacunacionesBase):
    pass

class VacunacionesUpdate(VacunacionesBase):
    pass

class VacunacionesOut(VacunacionesBase):
    vacunacion_id: int
    animal: Optional[AnimalSimpleOut] = None
    tipo_vacuna: Optional[TipoVacunaOut] = None
    proveedor: Optional[ProveedorOut] = None
    responsable: Optional[UsuarioOut] = None


    class Config:
        from_attributes = True