from sqlalchemy import Column, Integer, String, Float, Date, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class Ganado(Base):
    __tablename__ = "ganado"

    id = Column(Integer, primary_key=True, index=True)
    tipo = Column(String(100), nullable=False)
    raza = Column(String(100), nullable=False)
    edad = Column(Integer, nullable=False)
    peso = Column(Float, nullable=False)
    estado_salud = Column(String(255), nullable=False)
    fecha_ingreso = Column(Date, nullable=False)
    proveedor_id = Column(Integer, ForeignKey("proveedores.id"), nullable=False)  # ✅ Clave foránea obligatoria

    # Relación con proveedor
    proveedor = relationship("Proveedor", back_populates="ganado")

    # Relación con otras tablas
    controles = relationship("Control", back_populates="ganado", cascade="all, delete")
    ventas = relationship("Venta", back_populates="ganado", cascade="all, delete")
