from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.exc import IntegrityError
from typing import List
from app.database import get_db
from app.models.alimentaciones import Alimentaciones
from app.schemas.alimentaciones import AlimentacionesCreate, AlimentacionesOut, AlimentacionesUpdate
from pydantic import ValidationError

router = APIRouter()

@router.post("/alimentaciones/", response_model=AlimentacionesOut)
async def create_alimentacion(data: AlimentacionesCreate, db: AsyncSession = Depends(get_db)):
    try:
        alimentacion = Alimentaciones(**data.dict())
        db.add(alimentacion)
        await db.commit()
        await db.refresh(alimentacion)
        return alimentacion
    except ValidationError as e:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=e.errors())
    except IntegrityError as e:
        await db.rollback()
        if "FOREIGN KEY" in str(e.orig):
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail={"error": "Error de clave foránea. Verifique las claves foráneas."})
        elif "CHECK" in str(e.orig):
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail={"error": "Error de restricción de comprobación. Debe especificarse al menos un destino (animal_id, lote_id o ubicacion_id)."})
        else:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail={"error": "Error de integridad de datos. Verifique los valores ingresados."})

@router.get("/alimentaciones/", response_model=List[AlimentacionesOut])
async def get_alimentaciones(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Alimentaciones))
    return result.scalars().all()

@router.get("/alimentaciones/{alimentacion_id}", response_model=AlimentacionesOut)
async def get_alimentacion(alimentacion_id: int, db: AsyncSession = Depends(get_db)):
    alimentacion = await db.get(Alimentaciones, alimentacion_id)
    if not alimentacion:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail={"error": "Alimentación no encontrada"})
    return alimentacion

@router.put("/alimentaciones/{alimentacion_id}", response_model=AlimentacionesOut)
async def update_alimentacion(alimentacion_id: int, alimentacion_data: AlimentacionesUpdate, db: AsyncSession = Depends(get_db)):
    alimentacion = await db.get(Alimentaciones, alimentacion_id)
    if not alimentacion:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail={"error": "Alimentación no encontrada"})

    update_data = alimentacion_data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(alimentacion, key, value)

    try:
        await db.commit()
        await db.refresh(alimentacion)
        return alimentacion
    except ValidationError as e:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=e.errors())
    except IntegrityError as e:
        await db.rollback()
        if "FOREIGN KEY" in str(e.orig):
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail={"error": "Error de clave foránea. Verifique las claves foráneas."})
        elif "CHECK" in str(e.orig):
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail={"error": "Error de restricción de comprobación. Debe especificarse al menos un destino (animal_id, lote_id o ubicacion_id)."})
        else:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail={"error": "Error de integridad de datos. Verifique los valores ingresados."})

@router.delete("/alimentaciones/{alimentacion_id}")
async def delete_alimentacion(alimentacion_id: int, db: AsyncSession = Depends(get_db)):
    alimentacion = await db.get(Alimentaciones, alimentacion_id)
    if not alimentacion:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail={"error": "Alimentación no encontrada"})

    await db.delete(alimentacion)
    await db.commit()
    return {"message": "Alimentación eliminada correctamente"}