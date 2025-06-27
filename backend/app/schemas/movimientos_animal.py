from pydantic import BaseModel, Field, EmailStr
from typing import Optional
from datetime import datetime
from enum import Enum
from datetime import date

# Modelos para las entidades relacionadas (ejemplos, puedes ajustarlos a tus necesidades)
class UbicacionOut(BaseModel):
    ubicacion_id: int
    nombre: str
    # Agrega otros campos de Ubicacion que quieras mostrar
    class Config:
        from_attributes = True

class LoteOut(BaseModel):
    lote_id: int
    fecha_creacion: date
    codigo_lote: str
    proposito: Optional[str] = None
    descripcion: Optional[str] = None
    
    # Agrega otros campos de Lote que quieras mostrar
    class Config:
        from_attributes = True

class ProveedorOut(BaseModel):
    proveedor_id: int
    fecha_creacion: datetime
    nombre: str
    # Agrega otros campos de Proveedor que quieras mostrar
    class Config:
        from_attributes = True

class ClienteOut(BaseModel):
    cliente_id: int
    fecha_creacion: datetime
    nombre: str
    identificacion_fiscal: Optional[str] = None
    telefono: Optional[str] = None
    # Agrega otros campos de Cliente que quieras mostrar
    class Config:
        from_attributes = True

class UsuarioOut(BaseModel):
    usuario_id: int
    fecha_creacion: datetime
    nombre: str
    email: EmailStr
    # Agrega otros campos de Usuario que quieras mostrar
    class Config:
        from_attributes = True

class AnimalOutShort(BaseModel):
    animal_id: int
    numero_trazabilidad: str
    nombre_identificatorio: Optional[str] = None
    # Agrega otros campos de Animal que quieras mostrar (pero no demasiados para evitar anidamiento excesivo)
    class Config:
        from_attributes = True

class TipoMovimiento(str, Enum):
    IngresoCompra = "IngresoCompra"
    IngresoNacimiento = "IngresoNacimiento"
    EgresoVenta = "EgresoVenta"
    EgresoMuerte = "EgresoMuerte"
    EgresoDescarte = "EgresoDescarte"
    TrasladoInterno = "TrasladoInterno"
    CambioLote = "CambioLote"

class MovimientoAnimalBase(BaseModel):
    animal_id: int
    tipo_movimiento: TipoMovimiento
    origen_ubicacion_id: Optional[int] = None
    destino_ubicacion_id: Optional[int] = None
    origen_lote_id: Optional[int] = None
    destino_lote_id: Optional[int] = None
    proveedor_id: Optional[int] = None
    cliente_id: Optional[int] = None
    documento_referencia: Optional[str] = None
    usuario_id: Optional[int] = None
    observaciones: Optional[str] = None

class MovimientoAnimalCreate(MovimientoAnimalBase):
    pass

class MovimientoAnimalUpdate(MovimientoAnimalBase):
    pass

class MovimientoAnimalOut(MovimientoAnimalBase):
    movimiento_id: int
    fecha_movimiento: datetime
    
    animal: AnimalOutShort # Aquí anidamos el objeto Animal
    tipo_movimiento: TipoMovimiento
    origen_ubicacion: Optional[UbicacionOut] = None # Objeto Ubicacion completo
    destino_ubicacion: Optional[UbicacionOut] = None # Objeto Ubicacion completo
    origen_lote: Optional[LoteOut] = None # Objeto Lote completo
    destino_lote: Optional[LoteOut] = None # Objeto Lote completo
    proveedor: Optional[ProveedorOut] = None # Objeto Proveedor completo
    cliente: Optional[ClienteOut] = None # Objeto Cliente completo
    documento_referencia: Optional[str] = None
    usuario: Optional[UsuarioOut] = None # Objeto Usuario completo
    observaciones: Optional[str] = None

    class Config:
        from_attributes = True