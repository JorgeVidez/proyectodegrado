from sqlalchemy import Column, Integer, String, Enum
from sqlalchemy.orm import relationship
from app.database import Base
import enum

 
# Definir el Enum para los roles de usuario
class RolUsuario(enum.Enum):
    administrador = "administrador"
    operador = "operador"
    veterinario = "veterinario"

class Usuario(Base):
    __tablename__ = "usuarios"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    password = Column(String(255), nullable=False)
    rol = Column(Enum(RolUsuario), nullable=False)  # ✅ Usamos Enum para roles

    # Relación con controles y reportes
    controles = relationship("Control", back_populates="veterinario")
    reportes = relationship("Reporte", back_populates="usuario", cascade="all, delete")

