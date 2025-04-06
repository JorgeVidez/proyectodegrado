from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.exc import IntegrityError, OperationalError
from app.database import get_db
from app.models.ubicacion import Ubicacion
from app.schemas.ubicacion import UbicacionCreate, UbicacionUpdate, UbicacionOut
from typing import List

router = APIRouter()

# ✅ Obtener todas las ubicaciones
@router.get("/ubicaciones/", response_model=List[UbicacionOut])
async def get_ubicaciones(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Ubicacion))
    ubicaciones = result.scalars().all()
    return [UbicacionOut.from_orm(ubicacion) for ubicacion in ubicaciones]

# ✅ Obtener una ubicación por ID
@router.get("/ubicaciones/{ubicacion_id}", response_model=UbicacionOut)
async def get_ubicacion(ubicacion_id: int, db: AsyncSession = Depends(get_db)):
    ubicacion = await db.get(Ubicacion, ubicacion_id)
    if not ubicacion:
        raise HTTPException(status_code=404, detail={"error": "Ubicación no encontrada"})
    return UbicacionOut.from_orm(ubicacion)

# ✅ Crear una nueva ubicación
@router.post("/ubicaciones/", response_model=UbicacionOut)
async def create_ubicacion(data: UbicacionCreate, db: AsyncSession = Depends(get_db)):
    try:
        result = await db.execute(select(Ubicacion).where(Ubicacion.nombre == data.nombre))
        if result.scalars().first():
            raise HTTPException(status_code=400, detail={"error": "El nombre de la ubicación ya existe"})

        ubicacion = Ubicacion(**data.model_dump())
        db.add(ubicacion)
        await db.commit()
        await db.refresh(ubicacion)
        return UbicacionOut.from_orm(ubicacion)
    except IntegrityError:
        await db.rollback()
        raise HTTPException(status_code=400, detail={"error": "Error de integridad, verifique los datos."})
    except OperationalError: #Catch OperationalError
        await db.rollback() #Rollback the transaction.
        raise HTTPException(status_code=400, detail={"error": "Tipo de ubicación no válido. Los valores válidos son: Potrero, Corral, Establo, Enfermeria, Cuarentena."})
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=500, detail={"error": str(e)})

# ✅ Actualizar ubicación
@router.put("/ubicaciones/{ubicacion_id}", response_model=UbicacionOut)
async def update_ubicacion(ubicacion_id: int, ubicacion_data: UbicacionUpdate, db: AsyncSession = Depends(get_db)):
    ubicacion = await db.get(Ubicacion, ubicacion_id)
    if not ubicacion:
        raise HTTPException(status_code=404, detail={"error": "Ubicación no encontrada"})

    update_data = ubicacion_data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(ubicacion, key, value)

    await db.commit()
    await db.refresh(ubicacion)
    return UbicacionOut.from_orm(ubicacion)

# ✅ Eliminar ubicación
@router.delete("/ubicaciones/{ubicacion_id}")
async def delete_ubicacion(ubicacion_id: int, db: AsyncSession = Depends(get_db)):
    ubicacion = await db.get(Ubicacion, ubicacion_id)
    if not ubicacion:
        raise HTTPException(status_code=404, detail={"error": "Ubicación no encontrada"})

    await db.delete(ubicacion)
    await db.commit()
    return {"message": "Ubicación eliminada correctamente"}