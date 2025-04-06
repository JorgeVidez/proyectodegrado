from sqlalchemy import Column, BigInteger, String, DateTime, func
from app.database import Base

class Proveedor(Base):
    __tablename__ = "proveedores"

    proveedor_id = Column(BigInteger, primary_key=True, autoincrement=True)
    nombre = Column(String(255), nullable=False)
    identificacion_fiscal = Column(String(50), unique=True)
    telefono = Column(String(20))  # Longitud para números de teléfono
    email = Column(String(255))  # Longitud para correos electrónicos
    direccion = Column(String(255))  # Longitud para direcciones
    persona_contacto = Column(String(150))
    tipo_proveedor = Column(String(100))  # Longitud para tipos de proveedor
    fecha_creacion = Column(DateTime(timezone=True), server_default=func.now())
    fecha_actualizacion = Column(DateTime(timezone=True), onupdate=func.now())