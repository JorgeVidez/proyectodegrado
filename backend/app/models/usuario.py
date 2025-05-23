<<<<<<< Updated upstream
from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, BigInteger
from sqlalchemy.orm import relationship
from app.database import Base
import enum
from sqlalchemy.sql import func
=======
from sqlalchemy import Column, Integer, String, Enum
from sqlalchemy.orm import relationship
from app.database import Base
import enum

 
# Definir el Enum para los roles de usuario
class RolUsuario(enum.Enum):
    administrador = "administrador"
    operador = "operador"
    veterinario = "veterinario"
>>>>>>> Stashed changes

class Usuario(Base):
    __tablename__ = "usuarios"

    usuario_id = Column(BigInteger, primary_key=True, index=True)
    nombre = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, nullable=False)
<<<<<<< Updated upstream
    password_hash = Column(String(255), nullable=False)
    rol_id = Column(Integer, ForeignKey("roles_usuario.rol_id"), nullable=False)
    activo = Column(Boolean, default=True)
    fecha_creacion = Column(DateTime(timezone=True), server_default=func.now())
    fecha_actualizacion = Column(DateTime(timezone=True), onupdate=func.now())

    rol = relationship("RolUsuario") #Relacion con la tabla de roles
=======
    password = Column(String(255), nullable=False)
    rol = Column(Enum(RolUsuario), nullable=False)  # ✅ Usamos Enum para roles

    # Relación con controles y reportes
    controles = relationship("Control", back_populates="veterinario")
    reportes = relationship("Reporte", back_populates="usuario", cascade="all, delete")
>>>>>>> Stashed changes

