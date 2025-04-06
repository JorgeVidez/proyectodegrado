from sqlalchemy import Column, Integer, String, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from app.database import Base

class Raza(Base):
    __tablename__ = "razas"

    raza_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    especie_id = Column(Integer, ForeignKey("especies.especie_id"), nullable=False)
    nombre_raza = Column(String(100), nullable=False)

    especie = relationship("Especie")

    __table_args__ = (UniqueConstraint('especie_id', 'nombre_raza', name='_especie_raza_uc'),)
    
    
   