from sqlalchemy import Column, Integer, String, Text
from app.database import Base

class RolUsuario(Base):
    __tablename__ = "roles_usuario"

    rol_id = Column(Integer, primary_key=True, index=True)
    nombre_rol = Column(String(50), unique=True, nullable=False)
    descripcion = Column(Text)
