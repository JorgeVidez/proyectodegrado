from sqlalchemy import Column, BigInteger, Date, DECIMAL, Integer, ForeignKey, TEXT, CheckConstraint
from sqlalchemy.orm import relationship
from app.database import Base

class Alimentaciones(Base):
    __tablename__ = "alimentaciones"

    alimentacion_id = Column(BigInteger, primary_key=True, autoincrement=True)
    animal_id = Column(BigInteger, ForeignKey("animal.animal_id"))
    lote_id = Column(Integer, ForeignKey("lotes.lote_id"))
    ubicacion_id = Column(Integer, ForeignKey("ubicaciones.ubicacion_id"))
    fecha_suministro = Column(Date, nullable=False)
    tipo_alimento_id = Column(Integer, ForeignKey("tipos_alimento.tipo_alimento_id"), nullable=False)
    cantidad_suministrada = Column(DECIMAL(10, 2), nullable=False)
    proveedor_alimento_id = Column(BigInteger, ForeignKey("proveedores.proveedor_id"))
    costo_total_alimento = Column(DECIMAL(12, 2))
    responsable_id = Column(BigInteger, ForeignKey("usuarios.usuario_id"))
    observaciones = Column(TEXT)

    animal = relationship("Animal", backref="alimentaciones")
    lote = relationship("Lote", backref="alimentaciones")
    ubicacion = relationship("Ubicacion", backref="alimentaciones")
    tipo_alimento = relationship("TipoAlimento", backref="alimentaciones")
    proveedor = relationship("Proveedor", backref="alimentaciones")
    responsable = relationship("Usuario", backref="alimentaciones")

    __table_args__ = (
        CheckConstraint("animal_id IS NOT NULL OR lote_id IS NOT NULL OR ubicacion_id IS NOT NULL"),
    )