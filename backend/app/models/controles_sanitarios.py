from sqlalchemy import Column, BigInteger, Date, DECIMAL, Integer, ForeignKey, TEXT, func
from sqlalchemy.orm import relationship
from app.database import Base

class ControlesSanitarios(Base):
    __tablename__ = "controles_sanitarios"

    control_id = Column(BigInteger, primary_key=True, autoincrement=True)
    animal_id = Column(BigInteger, ForeignKey("animal.animal_id"), nullable=False)
    fecha_control = Column(Date, nullable=False, server_default=func.current_date())
    peso_kg = Column(DECIMAL(7, 2))
    condicion_corporal = Column(DECIMAL(3, 1))
    altura_cm = Column(DECIMAL(5, 1))
    responsable_id = Column(BigInteger, ForeignKey("usuarios.usuario_id")) #Verifica esta linea.
    ubicacion_id = Column(Integer, ForeignKey("ubicaciones.ubicacion_id"))
    observaciones = Column(TEXT)

    animal = relationship("Animal", backref="controles")
    responsable = relationship("Usuario", backref="controles")
    ubicacion = relationship("Ubicacion", backref="controles")