from sqlalchemy import Column, BigInteger, String, DateTime, Date, CHAR, TEXT, Integer, ForeignKey, CheckConstraint, Enum
from sqlalchemy.orm import relationship
from app.database import Base
import enum
from sqlalchemy.sql import func

class EstadoAnimal(enum.Enum):
    Activo = "Activo"
    Vendido = "Vendido"
    Muerto = "Muerto"
    Descartado = "Descartado"

class Animal(Base):
    __tablename__ = "animal"

    animal_id = Column(BigInteger, primary_key=True, autoincrement=True)
    numero_trazabilidad = Column(String(50), unique=True, nullable=False)
    nombre_identificatorio = Column(String(100))
    especie_id = Column(Integer, ForeignKey("especies.especie_id"), nullable=False)
    raza_id = Column(Integer, ForeignKey("razas.raza_id"), nullable=False)
    sexo = Column(CHAR(1), nullable=False)
    fecha_nacimiento = Column(Date)
    madre_id = Column(BigInteger, ForeignKey("animal.animal_id"), nullable=True)
    padre_id = Column(BigInteger, ForeignKey("animal.animal_id"), nullable=True)
    estado_actual = Column(Enum(EstadoAnimal), nullable=False, default=EstadoAnimal.Activo)
    fecha_registro = Column(DateTime(timezone=True), server_default=func.now())
    observaciones_generales = Column(TEXT)

    madre = relationship("Animal", remote_side=[animal_id], backref="hijos_madre", foreign_keys=[madre_id])
    padre = relationship("Animal", remote_side=[animal_id], backref="hijos_padre", foreign_keys=[padre_id])
    especie = relationship("Especie", backref="animales")
    raza = relationship("Raza", backref="animales")
    inventarios = relationship("InventarioAnimal", back_populates="animal")