from sqlalchemy import Column, BigInteger, DateTime, String, Integer, ForeignKey, TEXT, func, Enum
from sqlalchemy.orm import relationship
from app.database import Base
import enum

class TipoMovimiento(enum.Enum):
    IngresoCompra = "IngresoCompra"
    IngresoNacimiento = "IngresoNacimiento"
    EgresoVenta = "EgresoVenta"
    EgresoMuerte = "EgresoMuerte"
    EgresoDescarte = "EgresoDescarte"
    TrasladoInterno = "TrasladoInterno"
    CambioLote = "CambioLote"

class MovimientoAnimal(Base):
    __tablename__ = "movimientos_animal"

    movimiento_id = Column(BigInteger, primary_key=True, autoincrement=True)
    animal_id = Column(BigInteger, ForeignKey("animal.animal_id"), nullable=False)
    fecha_movimiento = Column(DateTime(timezone=True), nullable=False, server_default=func.now())
    tipo_movimiento = Column(Enum(TipoMovimiento), nullable=False)
    origen_ubicacion_id = Column(Integer, ForeignKey("ubicaciones.ubicacion_id"))
    destino_ubicacion_id = Column(Integer, ForeignKey("ubicaciones.ubicacion_id"))
    origen_lote_id = Column(Integer, ForeignKey("lotes.lote_id"))
    destino_lote_id = Column(Integer, ForeignKey("lotes.lote_id"))
    proveedor_id = Column(BigInteger, ForeignKey("proveedores.proveedor_id"))
    cliente_id = Column(BigInteger, ForeignKey("clientes.cliente_id"))
    documento_referencia = Column(TEXT)
    usuario_id = Column(BigInteger, ForeignKey("usuarios.usuario_id"))
    observaciones = Column(TEXT)

    animal = relationship("Animal", backref="movimientos")
    origen_ubicacion = relationship("Ubicacion", foreign_keys=[origen_ubicacion_id], backref="movimientos_origen")
    destino_ubicacion = relationship("Ubicacion", foreign_keys=[destino_ubicacion_id], backref="movimientos_destino")
    origen_lote = relationship("Lote", foreign_keys=[origen_lote_id], backref="movimientos_origen")
    destino_lote = relationship("Lote", foreign_keys=[destino_lote_id], backref="movimientos_destino")
    proveedor = relationship("Proveedor", backref="movimientos")
    cliente = relationship("Cliente", backref="movimientos")
    usuario = relationship("Usuario", backref="movimientos")