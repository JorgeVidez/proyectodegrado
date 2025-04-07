from sqlalchemy import Column, BigInteger, DECIMAL, TEXT, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from app.database import Base

class VentasDetalle(Base):
    __tablename__ = "ventas_detalle"

    venta_detalle_id = Column(BigInteger, primary_key=True, autoincrement=True)
    venta_id = Column(BigInteger, ForeignKey("ventas.venta_id"), nullable=False)
    animal_id = Column(BigInteger, ForeignKey("animal.animal_id"), nullable=False)
    peso_venta_kg = Column(DECIMAL(7, 2))
    precio_individual = Column(DECIMAL(12, 2))
    precio_por_kg = Column(DECIMAL(10, 2))
    observaciones = Column(TEXT)

    venta = relationship("Ventas", backref="detalles")
    animal = relationship("Animal", backref="detalles_ventas")

    __table_args__ = (
        UniqueConstraint("venta_id", "animal_id", name="uq_venta_animal"),
    )