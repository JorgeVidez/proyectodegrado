from sqlalchemy import Column, Integer, String
from app.database import Base

class Especie(Base):
    __tablename__ = "especies"

    especie_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    nombre_comun = Column(String(100), unique=True, nullable=False)
    nombre_cientifico = Column(String(100))