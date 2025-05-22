<<<<<<< Updated upstream
from sqlalchemy import Column, BigInteger, String, DateTime, func
from app.database import Base
from sqlalchemy.orm import relationship
=======
from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from app.database import Base
>>>>>>> Stashed changes

class Proveedor(Base):
    __tablename__ = "proveedores"

<<<<<<< Updated upstream
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
    
    inventarios = relationship("InventarioAnimal", back_populates="proveedor_compra")
=======
    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(255), nullable=False)
    telefono = Column(String(50), nullable=True)
    direccion = Column(String(255), nullable=True)

    # Relación con la tabla Ganado
    ganado = relationship("Ganado", back_populates="proveedor")
>>>>>>> Stashed changes
