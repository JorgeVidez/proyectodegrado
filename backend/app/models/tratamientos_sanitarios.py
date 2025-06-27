from sqlalchemy import Column, BigInteger, Date, DECIMAL, String, Integer, ForeignKey, TEXT
from sqlalchemy.orm import relationship
from app.database import Base

class TratamientosSanitarios(Base):
    __tablename__ = "tratamientos_sanitarios"

    tratamiento_id = Column(BigInteger, primary_key=True, autoincrement=True)
    animal_id = Column(BigInteger, ForeignKey("animal.animal_id"), nullable=False)
    fecha_diagnostico = Column(Date, nullable=False)
    sintomas_observados = Column(TEXT)
    diagnostico = Column(TEXT)
    fecha_inicio_tratamiento = Column(Date)
    medicamento_id = Column(Integer, ForeignKey("medicamentos.medicamento_id"))
    dosis_aplicada = Column(DECIMAL(8, 2))
    unidad_dosis = Column(String(20))
    via_administracion = Column(String(50))
    duracion_tratamiento_dias = Column(Integer)
    fecha_fin_tratamiento = Column(Date)
    proveedor_medicamento_id = Column(BigInteger, ForeignKey("proveedores.proveedor_id"))
    responsable_veterinario_id = Column(BigInteger, ForeignKey("usuarios.usuario_id"))
    periodo_retiro_aplicable_dias = Column(Integer)
    fecha_fin_retiro = Column(Date)
    proxima_revision = Column(Date)
    resultado_tratamiento = Column(TEXT)
    observaciones = Column(TEXT)

    animal = relationship("Animal", backref="tratamientos")
    medicamento = relationship("Medicamento", backref="tratamientos_con_medicamento") # Puedes ajustar el backref si hay colisión
    proveedor_medicamento = relationship("Proveedor", backref="tratamientos_suministrados") # <-- RENOMBRADO de 'proveedor'
    responsable_veterinario = relationship("Usuario", backref="tratamientos_supervisados") # <-- RENOMBRADO de 'responsable'