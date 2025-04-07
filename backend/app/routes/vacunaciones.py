from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.exc import IntegrityError
from typing import List
from app.database import get_db
from app.models.vacunaciones import Vacunaciones
from app.schemas.vacunaciones import VacunacionesCreate, VacunacionesOut, VacunacionesUpdate
from pydantic import ValidationError

router = APIRouter()

@router.post("/vacunaciones/", response_model=VacunacionesOut)
async def create_vacunacion(data: VacunacionesCreate, db: AsyncSession = Depends(get_db)):
    try:
        vacunacion = Vacunaciones(**data.dict())
        db.add(vacunacion)
        await db.commit()
        await db.refresh(vacunacion)
        return vacunacion
    except ValidationError as e:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=e.errors())
    except IntegrityError as e:
        await db.rollback()
        if "FOREIGN KEY" in str(e.orig):
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail={"error": "Error de clave foránea. Verifique las claves foráneas."})
        else:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail={"error": "Error de integridad de datos. Verifique los valores ingresados."})

@router.get("/vacunaciones/", response_model=List[VacunacionesOut])
async def get_vacunaciones(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Vacunaciones))
    return result.scalars().all()

@router.get("/vacunaciones/{vacunacion_id}", response_model=VacunacionesOut)
async def get_vacunacion(vacunacion_id: int, db: AsyncSession = Depends(get_db)):
    vacunacion = await db.get(Vacunaciones, vacunacion_id)
    if not vacunacion:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail={"error": "Vacunación no encontrada"})
    return vacunacion

@router.put("/vacunaciones/{vacunacion_id}", response_model=VacunacionesOut)
async def update_vacunacion(vacunacion_id: int, vacunacion_data: VacunacionesUpdate, db: AsyncSession = Depends(get_db)):
    vacunacion = await db.get(Vacunaciones, vacunacion_id)
    if not vacunacion:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail={"error": "Vacunación no encontrada"})

    update_data = vacunacion_data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(vacunacion, key, value)

    try:
        await db.commit()
        await db.refresh(vacunacion)
        return vacunacion
    except ValidationError as e:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=e.errors())
    except IntegrityError as e:
        await db.rollback()
        if "FOREIGN KEY" in str(e.orig):
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail={"error": "Error de clave foránea. Verifique las claves foráneas."})
        else:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail={"error": "Error de integridad de datos. Verifique los valores ingresados."})

@router.delete("/vacunaciones/{vacunacion_id}")
async def delete_vacunacion(vacunacion_id: int, db: AsyncSession = Depends(get_db)):
    vacunacion = await db.get(Vacunaciones, vacunacion_id)
    if not vacunacion:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail={"error": "Vacunación no encontrada"})

    await db.delete(vacunacion)
    await db.commit()
    return {"message": "Vacunación eliminada correctamente"}