from sqlalchemy import Column, BigInteger, String, DateTime, func
from app.database import Base

class Cliente(Base):
    __tablename__ = "clientes"

    cliente_id = Column(BigInteger, primary_key=True, autoincrement=True)
    nombre = Column(String(255), nullable=False)
    identificacion_fiscal = Column(String(50), unique=True)
    telefono = Column(String(20))
    email = Column(String(255))
    direccion = Column(String(255))
    fecha_creacion = Column(DateTime(timezone=True), server_default=func.now())
    fecha_actualizacion = Column(DateTime(timezone=True), onupdate=func.now())