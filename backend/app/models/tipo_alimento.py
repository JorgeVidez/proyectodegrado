from sqlalchemy import Column, Integer, String, Text
from app.database import Base

class TipoAlimento(Base):
    __tablename__ = "tipos_alimento"

    tipo_alimento_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    nombre = Column(String(100), unique=True, nullable=False)
    descripcion = Column(Text)
    unidad_medida = Column(String(20))