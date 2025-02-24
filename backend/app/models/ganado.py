from sqlalchemy import Column, Integer, String, Float, Date
from app.database import Base
from sqlalchemy.orm import relationship


class Ganado(Base):
    __tablename__ = "ganado"

    id = Column(Integer, primary_key=True, index=True)
    tipo = Column(String(100), nullable=False)
    raza = Column(String(100), nullable=False)
    edad = Column(Integer, nullable=False)
    peso = Column(Float, nullable=False)
    estado_salud = Column(String(255), nullable=False)
    fecha_ingreso = Column(Date, nullable=False)
    
    controles = relationship("Controles", back_populates="ganado", cascade="all, delete")
    # Relación con las ventas
    ventas = relationship("Venta", back_populates="ganado", cascade="all, delete")

