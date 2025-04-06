from sqlalchemy import Column, Integer, String, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from app.database import Base

class TipoVacuna(Base):
    __tablename__ = "tipos_vacuna"

    tipo_vacuna_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    nombre_vacuna = Column(String(150), nullable=False)
    enfermedad_prevenida = Column(String(200))
    laboratorio = Column(String(100))
    especie_destino_id = Column(Integer, ForeignKey("especies.especie_id"))

    especie_destino = relationship("Especie")

    __table_args__ = (UniqueConstraint('nombre_vacuna', 'laboratorio', name='_nombre_laboratorio_uc'),)