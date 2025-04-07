from sqlalchemy import Column, BigInteger, Date, DECIMAL, TEXT, Integer, ForeignKey, DateTime, func
from sqlalchemy.orm import relationship
from app.database import Base

class Ventas(Base):
    __tablename__ = "ventas"

    venta_id = Column(BigInteger, primary_key=True, autoincrement=True)
    cliente_id = Column(BigInteger, ForeignKey("clientes.cliente_id"), nullable=False)
    fecha_venta = Column(Date, nullable=False)
    documento_venta_ref = Column(TEXT, unique=True)
    precio_venta_total_general = Column(DECIMAL(14, 2))
    condicion_pago = Column(TEXT)
    lote_origen_id = Column(Integer, ForeignKey("lotes.lote_id"))
    usuario_registra_id = Column(BigInteger, ForeignKey("usuarios.usuario_id"))
    fecha_registro = Column(DateTime(timezone=True), server_default=func.now())
    observaciones = Column(TEXT)

    cliente = relationship("Cliente", backref="ventas")
    lote_origen = relationship("Lote", backref="ventas")
    usuario_registra = relationship("Usuario", backref="ventas")