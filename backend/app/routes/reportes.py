from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from datetime import datetime

from app.database import get_db  # ✅ Importar conexión a la BD
from app.models.reportes import Reporte  # ✅ Importar modelo correctamente
from app.schemas.reportes import ReporteCreate, ReporteSchema  # ✅ Importar esquemas

router = APIRouter(prefix="/reportes", tags=["Reportes"])

# 📌 Crear un reporte
@router.post("/", response_model=ReporteSchema)
async def crear_reporte(reporte: ReporteCreate, db: AsyncSession = Depends(get_db)):
    nuevo_reporte = Reporte(
        usuario_id=reporte.usuario_id,
        tipo=reporte.tipo,
        contenido=reporte.contenido,
        fecha_generado=datetime.utcnow()
    )
    db.add(nuevo_reporte)
    await db.commit()
    await db.refresh(nuevo_reporte)
    return nuevo_reporte

# 📌 Obtener todos los reportes
@router.get("/", response_model=list[ReporteSchema])
async def obtener_reportes(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Reporte))
    return result.scalars().all()

# 📌 Obtener un reporte por ID
@router.get("/{reporte_id}", response_model=ReporteSchema)
async def obtener_reporte(reporte_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Reporte).where(Reporte.id == reporte_id))
    reporte = result.scalars().first()
    if not reporte:
        raise HTTPException(status_code=404, detail="Reporte no encontrado")
    return reporte

# 📌 Eliminar un reporte por ID
@router.delete("/{reporte_id}")
async def eliminar_reporte(reporte_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Reporte).where(Reporte.id == reporte_id))
    reporte = result.scalars().first()
    if not reporte:
        raise HTTPException(status_code=404, detail="Reporte no encontrado")
    
    await db.delete(reporte)
    await db.commit()
    return {"message": "Reporte eliminado exitosamente"}
