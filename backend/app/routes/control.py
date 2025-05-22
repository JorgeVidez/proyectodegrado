from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from typing import List

from app.database import get_db
from app.models.control import Control
from app.schemas.control import ControlCreate, ControlResponse, ControlUpdate  # Agregar `ControlUpdate`

# 📌 Definir el router con prefijo y tags
router = APIRouter(prefix="/controles", tags=["Controles"])

# 📌 Obtener todos los controles
@router.get("/", response_model=List[ControlResponse])
async def get_controles(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Control))
    controles = result.scalars().all()

    if not controles:
        raise HTTPException(status_code=404, detail="No se encontraron controles.")

    return controles

# 📌 Obtener un solo control por ID
@router.get("/{control_id}", response_model=ControlResponse)
async def get_control(control_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Control).where(Control.id == control_id))
    control = result.scalars().first()

    if not control:
        raise HTTPException(status_code=404, detail="Control no encontrado.")

    return control

# 📌 Crear un nuevo control
@router.post("/", response_model=ControlResponse, status_code=201)
async def create_control(control: ControlCreate, db: AsyncSession = Depends(get_db)):
    nuevo_control = Control(**control.model_dump())

    try:
        db.add(nuevo_control)
        await db.commit()
        await db.refresh(nuevo_control)
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=500, detail=f"Error al crear control: {str(e)}")

    return nuevo_control

# 📌 Actualizar un control existente
@router.put("/{control_id}", response_model=ControlResponse)
async def update_control(control_id: int, control_data: ControlUpdate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Control).where(Control.id == control_id))
    control = result.scalars().first()

    if not control:
        raise HTTPException(status_code=404, detail="Control no encontrado.")

    for key, value in control_data.model_dump(exclude_unset=True).items():
        setattr(control, key, value)

    try:
        await db.commit()
        await db.refresh(control)
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=500, detail=f"Error al actualizar control: {str(e)}")

    return control

# 📌 Eliminar un control
@router.delete("/{control_id}", status_code=204)
async def delete_control(control_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Control).where(Control.id == control_id))
    control = result.scalars().first()

    if not control:
        raise HTTPException(status_code=404, detail="Control no encontrado.")

    try:
        await db.delete(control)
        await db.commit()
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=500, detail=f"Error al eliminar control: {str(e)}")

    return {"message": "Control eliminado exitosamente."}
