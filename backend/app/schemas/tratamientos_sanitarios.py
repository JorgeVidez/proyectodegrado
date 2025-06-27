from pydantic import BaseModel, Field
from typing import Optional
from datetime import date
from app.schemas.movimientos_animal import AnimalOutShort, UsuarioOut, ProveedorOut
class MedicamentoOut(BaseModel):
    medicamento_id: int
    nombre_comercial: str
    principio_activo: Optional[str] = None 
    class Config:
        from_attributes = True

class TratamientosSanitariosBase(BaseModel):
    animal_id: int
    fecha_diagnostico: date
    sintomas_observados: Optional[str] = None
    diagnostico: Optional[str] = None
    fecha_inicio_tratamiento: Optional[date] = None
    medicamento_id: Optional[int] = None
    dosis_aplicada: Optional[float] = None
    unidad_dosis: Optional[str] = None
    via_administracion: Optional[str] = None
    duracion_tratamiento_dias: Optional[int] = None
    fecha_fin_tratamiento: Optional[date] = None
    proveedor_medicamento_id: Optional[int] = None
    responsable_veterinario_id: Optional[int] = None
    periodo_retiro_aplicable_dias: Optional[int] = None
    fecha_fin_retiro: Optional[date] = None
    proxima_revision: Optional[date] = None
    resultado_tratamiento: Optional[str] = None
    observaciones: Optional[str] = None

class TratamientosSanitariosCreate(TratamientosSanitariosBase):
    pass

class TratamientosSanitariosUpdate(TratamientosSanitariosBase):
    pass

class TratamientosSanitariosOut(TratamientosSanitariosBase):
    tratamiento_id: int
    animal: AnimalOutShort  
    medicamento: Optional[MedicamentoOut] = None  
    proveedor_medicamento: Optional[ProveedorOut] = None
    responsable_veterinario: Optional[UsuarioOut] = None

    class Config:
        from_attributes = True