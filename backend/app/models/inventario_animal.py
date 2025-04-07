from sqlalchemy import Column, BigInteger, Date, String, DECIMAL, Integer, ForeignKey, Boolean, CheckConstraint, Enum
from sqlalchemy.orm import relationship
from app.database import Base
import enum

class MotivoIngreso(enum.Enum):
    Nacimiento = "Nacimiento"
    Compra = "Compra"
    TrasladoInterno = "TrasladoInterno"

class MotivoEgreso(enum.Enum):
    Venta = "Venta"
    Muerte = "Muerte"
    Descarte = "Descartado"
    TrasladoExterno = "TrasladoExterno"

class InventarioAnimal(Base):
    __tablename__ = "inventario_animal"

    inventario_id = Column(BigInteger, primary_key=True, autoincrement=True)
    animal_id = Column(BigInteger, ForeignKey("animal.animal_id"), unique=True, nullable=False)
    fecha_ingreso = Column(Date, nullable=False)
    motivo_ingreso = Column(Enum(MotivoIngreso), nullable=False)
    proveedor_compra_id = Column(BigInteger, ForeignKey("proveedores.proveedor_id"))
    precio_compra = Column(DECIMAL(12, 2))
    ubicacion_actual_id = Column(Integer, ForeignKey("ubicaciones.ubicacion_id"))
    lote_actual_id = Column(Integer, ForeignKey("lotes.lote_id"))
    fecha_egreso = Column(Date)
    motivo_egreso = Column(Enum(MotivoEgreso))
    activo_en_finca = Column(Boolean, default=True)

    animal = relationship("Animal", backref="inventarios")
    proveedor = relationship("Proveedor", backref="inventarios")
    ubicacion = relationship("Ubicacion", backref="inventarios")
    lote = relationship("Lote", backref="inventarios")

    __table_args__ = (
        CheckConstraint("motivo_ingreso != 'Compra' OR (proveedor_compra_id IS NOT NULL AND precio_compra IS NOT NULL)"),
        CheckConstraint("(fecha_egreso IS NULL AND motivo_egreso IS NULL) OR (fecha_egreso IS NOT NULL AND motivo_egreso IS NOT NULL)"),
    )