from sqlalchemy import Column, Integer, ForeignKey, Date, Float, Text
from sqlalchemy.orm import relationship
from app.database import Base

class Control(Base):
    __tablename__ = "controles"

    id = Column(Integer, primary_key=True, index=True)
    ganado_id = Column(Integer, ForeignKey("ganado.id", ondelete="CASCADE"), nullable=False)
    fecha = Column(Date, nullable=False)
    peso = Column(Float, nullable=True)
    observaciones = Column(Text, nullable=True)
    veterinario_id = Column(Integer, ForeignKey("usuarios.id", ondelete="SET NULL"), nullable=True)

    ganado = relationship("Ganado", back_populates="controles")
    veterinario = relationship("Usuario", back_populates="controles", lazy="joined")
