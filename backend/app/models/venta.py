from sqlalchemy import Column, Integer, ForeignKey, Date, Float, Text, String
from sqlalchemy.orm import relationship
from app.database import Base

class Venta(Base):
    __tablename__ = "ventas"

    id = Column(Integer, primary_key=True, index=True)
    ganado_id = Column(Integer, ForeignKey("ganado.id", ondelete="CASCADE"), nullable=False)
    fecha_venta = Column(Date, nullable=False)
    precio_venta = Column(Float, nullable=False)
    comprador = Column(String(255), nullable=False)
    estado_trazabilidad = Column(Text, nullable=True)

    ganado = relationship("Ganado", back_populates="ventas")
