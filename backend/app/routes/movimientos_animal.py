from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.exc import IntegrityError
from typing import List
from app.database import get_db
from app.models.movimientos_animal import MovimientoAnimal, TipoMovimiento
from app.schemas.movimientos_animal import MovimientoAnimalCreate, MovimientoAnimalOut, MovimientoAnimalUpdate
from pydantic import ValidationError

router = APIRouter()

@router.post("/movimiento_animal/", response_model=MovimientoAnimalOut)
async def create_movimiento_animal(data: MovimientoAnimalCreate, db: AsyncSession = Depends(get_db)):
    try:
        movimiento = MovimientoAnimal(**data.dict())
        db.add(movimiento)
        await db.commit()
        await db.refresh(movimiento)
        return movimiento
    except ValidationError as e:
        error_details = e.errors()
        for error in error_details:
            if error["loc"][0] == "tipo_movimiento":
                error["valid_values"] = [e.value for e in TipoMovimiento]
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=error_details)
    except IntegrityError as e:
        await db.rollback()
        if "FOREIGN KEY" in str(e.orig):
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail={"error": "Error de clave foránea. Verifique las claves foráneas."})
        elif "CHECK" in str(e.orig):
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail={"error": "Error de restricción de comprobación. Verifique el tipo_movimiento."})
        else:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail={"error": "Error de integridad de datos. Verifique los valores ingresados."})

@router.get("/movimiento_animal/", response_model=List[MovimientoAnimalOut])
async def get_movimientos_animales(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(MovimientoAnimal))
    return result.scalars().all()

@router.get("/movimiento_animal/{movimiento_id}", response_model=MovimientoAnimalOut)
async def get_movimiento_animal(movimiento_id: int, db: AsyncSession = Depends(get_db)):
    movimiento = await db.get(MovimientoAnimal, movimiento_id)
    if not movimiento:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail={"error": "Movimiento animal no encontrado"})
    return movimiento

@router.put("/movimiento_animal/{movimiento_id}", response_model=MovimientoAnimalOut)
async def update_movimiento_animal(movimiento_id: int, movimiento_data: MovimientoAnimalUpdate, db: AsyncSession = Depends(get_db)):
    movimiento = await db.get(MovimientoAnimal, movimiento_id)
    if not movimiento:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail={"error": "Movimiento animal no encontrado"})

    update_data = movimiento_data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(movimiento, key, value)

    try:
        await db.commit()
        await db.refresh(movimiento)
        return movimiento
    except ValidationError as e:
        error_details = e.errors()
        for error in error_details:
            if error["loc"][0] == "tipo_movimiento":
                error["valid_values"] = [e.value for e in TipoMovimiento]
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=error_details)
    except IntegrityError as e:
        await db.rollback()
        if "FOREIGN KEY" in str(e.orig):
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail={"error": "Error de clave foránea. Verifique las claves foráneas."})
        elif "CHECK" in str(e.orig):
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail={"error": "Error de restricción de comprobación. Verifique el tipo_movimiento."})
        else:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail={"error": "Error de integridad de datos. Verifique los valores ingresados."})

@router.delete("/movimiento_animal/{movimiento_id}")
async def delete_movimiento_animal(movimiento_id: int, db: AsyncSession = Depends(get_db)):
    movimiento = await db.get(MovimientoAnimal, movimiento_id)
    if not movimiento:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail={"error": "Movimiento animal no encontrado"})

    await db.delete(movimiento)
    await db.commit()
    return {"message": "Movimiento animal eliminado correctamente"}