from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from app.database import Base

class Proveedor(Base):
    __tablename__ = "proveedores"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(255), nullable=False)
    telefono = Column(String(50), nullable=True)
    direccion = Column(String(255), nullable=True)

    # Relación con la tabla Ganado
    ganado = relationship("Ganado", back_populates="proveedor")
