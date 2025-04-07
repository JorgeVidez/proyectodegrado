from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.exc import IntegrityError
from typing import List
from app.database import get_db
from app.models.tratamientos_sanitarios import TratamientosSanitarios
from app.schemas.tratamientos_sanitarios import TratamientosSanitariosCreate, TratamientosSanitariosOut, TratamientosSanitariosUpdate
from pydantic import ValidationError

router = APIRouter()

@router.post("/tratamientos_sanitarios/", response_model=TratamientosSanitariosOut)
async def create_tratamiento_sanitario(data: TratamientosSanitariosCreate, db: AsyncSession = Depends(get_db)):
    try:
        tratamiento = TratamientosSanitarios(**data.dict())
        db.add(tratamiento)
        await db.commit()
        await db.refresh(tratamiento)
        return tratamiento
    except ValidationError as e:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=e.errors())
    except IntegrityError as e:
        await db.rollback()
        if "FOREIGN KEY" in str(e.orig):
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail={"error": "Error de clave foránea. Verifique las claves foráneas."})
        else:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail={"error": "Error de integridad de datos. Verifique los valores ingresados."})

@router.get("/tratamientos_sanitarios/", response_model=List[TratamientosSanitariosOut])
async def get_tratamientos_sanitarios(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(TratamientosSanitarios))
    return result.scalars().all()

@router.get("/tratamientos_sanitarios/{tratamiento_id}", response_model=TratamientosSanitariosOut)
async def get_tratamiento_sanitario(tratamiento_id: int, db: AsyncSession = Depends(get_db)):
    tratamiento = await db.get(TratamientosSanitarios, tratamiento_id)
    if not tratamiento:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail={"error": "Tratamiento sanitario no encontrado"})
    return tratamiento

@router.put("/tratamientos_sanitarios/{tratamiento_id}", response_model=TratamientosSanitariosOut)
async def update_tratamiento_sanitario(tratamiento_id: int, tratamiento_data: TratamientosSanitariosUpdate, db: AsyncSession = Depends(get_db)):
    tratamiento = await db.get(TratamientosSanitarios, tratamiento_id)
    if not tratamiento:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail={"error": "Tratamiento sanitario no encontrado"})

    update_data = tratamiento_data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(tratamiento, key, value)

    try:
        await db.commit()
        await db.refresh(tratamiento)
        return tratamiento
    except ValidationError as e:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=e.errors())
    except IntegrityError as e:
        await db.rollback()
        if "FOREIGN KEY" in str(e.orig):
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail={"error": "Error de clave foránea. Verifique las claves foráneas."})
        else:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail={"error": "Error de integridad de datos. Verifique los valores ingresados."})

@router.delete("/tratamientos_sanitarios/{tratamiento_id}")
async def delete_tratamiento_sanitario(tratamiento_id: int, db: AsyncSession = Depends(get_db)):
    tratamiento = await db.get(TratamientosSanitarios, tratamiento_id)
    if not tratamiento:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail={"error": "Tratamiento sanitario no encontrado"})

    await db.delete(tratamiento)
    await db.commit()
    return {"message": "Tratamiento sanitario eliminado correctamente"}