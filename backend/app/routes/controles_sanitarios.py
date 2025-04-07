   
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.exc import IntegrityError
from typing import List
from app.database import get_db
from app.models.controles_sanitarios import ControlesSanitarios
from app.schemas.controles_sanitarios import ControlesSanitariosCreate, ControlesSanitariosOut, ControlesSanitariosUpdate
from pydantic import ValidationError

router = APIRouter()

@router.post("/controles_sanitarios/", response_model=ControlesSanitariosOut)
async def create_control_sanitario(data: ControlesSanitariosCreate, db: AsyncSession = Depends(get_db)):
    try:
        control = ControlesSanitarios(**data.dict())
        db.add(control)
        await db.commit()
        await db.refresh(control)
        return control
    except ValidationError as e:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=e.errors())
    except IntegrityError as e:
        await db.rollback()
        if "FOREIGN KEY" in str(e.orig):
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail={"error": "Error de clave foránea. Verifique las claves foráneas."})
        else:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail={"error": "Error de integridad de datos. Verifique los valores ingresados."})

@router.get("/controles_sanitarios/", response_model=List[ControlesSanitariosOut])
async def get_controles_sanitarios(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(ControlesSanitarios))
    return result.scalars().all()

@router.get("/controles_sanitarios/{control_id}", response_model=ControlesSanitariosOut)
async def get_control_sanitario(control_id: int, db: AsyncSession = Depends(get_db)):
    control = await db.get(ControlesSanitarios, control_id)
    if not control:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail={"error": "Control sanitario no encontrado"})
    return control

@router.put("/controles_sanitarios/{control_id}", response_model=ControlesSanitariosOut)
async def update_control_sanitario(control_id: int, control_data: ControlesSanitariosUpdate, db: AsyncSession = Depends(get_db)):
    control = await db.get(ControlesSanitarios, control_id)
    if not control:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail={"error": "Control sanitario no encontrado"})

    update_data = control_data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(control, key, value)

    try:
        await db.commit()
        await db.refresh(control)
        return control
    except ValidationError as e:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=e.errors())
    except IntegrityError as e:
        await db.rollback()
        if "FOREIGN KEY" in str(e.orig):
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail={"error": "Error de clave foránea. Verifique las claves foráneas."})
        else:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail={"error": "Error de integridad de datos. Verifique los valores ingresados."})

@router.delete("/controles_sanitarios/{control_id}")
async def delete_control_sanitario(control_id: int, db: AsyncSession = Depends(get_db)):
    control = await db.get(ControlesSanitarios, control_id)
    if not control:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail={"error": "Control sanitario no encontrado"})

    await db.delete(control)
    await db.commit()
    return {"message": "Control sanitario eliminado correctamente"}