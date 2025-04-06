from sqlalchemy import Column, Integer, String, ForeignKey, Text, DateTime, func
from sqlalchemy.orm import relationship
from app.database import Base

class Reporte(Base):
    __tablename__ = "reportes"

    id = Column(Integer, primary_key=True, index=True)
    usuario_id = Column(Integer, ForeignKey("usuarios.usuario_id"), nullable=False)
    tipo = Column(String(100), nullable=False)
    contenido = Column(Text, nullable=False)
    fecha_generado = Column(DateTime, default=func.now())  # Asegurar que tenga un valor por defecto

    usuario = relationship("Usuario", back_populates="reportes")
