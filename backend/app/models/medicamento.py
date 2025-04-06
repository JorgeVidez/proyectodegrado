from sqlalchemy import Column, Integer, String, UniqueConstraint
from app.database import Base

class Medicamento(Base):
    __tablename__ = "medicamentos"

    medicamento_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    nombre_comercial = Column(String(150), nullable=False)
    principio_activo = Column(String(200))
    laboratorio = Column(String(100))
    presentacion = Column(String(100))
    periodo_retiro_carne_dias = Column(Integer, default=0)
    periodo_retiro_leche_dias = Column(Integer, default=0)

    __table_args__ = (UniqueConstraint('nombre_comercial', 'laboratorio', 'presentacion', name='_nombre_laboratorio_presentacion_uc'),)