from sqlalchemy import Column, Integer, String, Numeric, Text, CheckConstraint
from app.database import Base
from sqlalchemy.orm import relationship

class Ubicacion(Base):
    __tablename__ = "ubicaciones"

    ubicacion_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    nombre = Column(String(100), unique=True, nullable=False)
    tipo = Column(String(50), CheckConstraint("tipo IN ('Potrero', 'Corral', 'Establo', 'Enfermeria', 'Cuarentena')"))
    area_hectareas = Column(Numeric(10, 2))
    capacidad_maxima_animales = Column(Integer)
    descripcion = Column(Text)
    
    inventarios = relationship("InventarioAnimal", back_populates="ubicacion_actual")
