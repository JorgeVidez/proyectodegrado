from sqlalchemy import Column, Integer, String, Text, Date, Boolean, UniqueConstraint
from sqlalchemy.sql import func
from app.database import Base
from sqlalchemy.orm import relationship

class Lote(Base):
    __tablename__ = "lotes"

    lote_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    codigo_lote = Column(String(50), unique=True, nullable=False)
    fecha_creacion = Column(Date, nullable=False, server_default=func.current_date())
    proposito = Column(Text)
    descripcion = Column(Text)
    activo = Column(Boolean, default=True)
    
    inventarios = relationship("InventarioAnimal", back_populates="lote_actual")
