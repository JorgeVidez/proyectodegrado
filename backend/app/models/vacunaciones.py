from sqlalchemy import Column, BigInteger, Date, DECIMAL, String, Integer, ForeignKey, TEXT
from sqlalchemy.orm import relationship
from app.database import Base

class Vacunaciones(Base):
    __tablename__ = "vacunaciones"

    vacunacion_id = Column(BigInteger, primary_key=True, autoincrement=True)
    animal_id = Column(BigInteger, ForeignKey("animal.animal_id"), nullable=False)
    fecha_aplicacion = Column(Date, nullable=False)
    tipo_vacuna_id = Column(Integer, ForeignKey("tipos_vacuna.tipo_vacuna_id"), nullable=False)
    dosis_aplicada = Column(DECIMAL(6, 2))
    unidad_dosis = Column(String(10))
    lote_vacuna = Column(String(100))
    fecha_vencimiento_lote = Column(Date)
    proveedor_vacuna_id = Column(BigInteger, ForeignKey("proveedores.proveedor_id"))
    responsable_aplicacion_id = Column(BigInteger, ForeignKey("usuarios.usuario_id"))
    proxima_vacunacion_sugerida = Column(Date)
    observaciones = Column(TEXT)

    animal = relationship("Animal", backref="vacunaciones")
    tipo_vacuna = relationship("TipoVacuna", backref="vacunaciones")
    proveedor = relationship("Proveedor", backref="vacunaciones")
    responsable = relationship("Usuario", backref="vacunaciones")