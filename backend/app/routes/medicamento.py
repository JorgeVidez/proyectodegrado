from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.exc import IntegrityError
from app.database import get_db
from app.models.medicamento import Medicamento
from app.schemas.medicamento import MedicamentoCreate, MedicamentoUpdate, MedicamentoOut
from typing import List

router = APIRouter()

# ✅ Obtener todos los medicamentos
@router.get("/medicamentos/", response_model=List[MedicamentoOut])
async def get_medicamentos(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Medicamento))
    medicamentos = result.scalars().all()
    return [MedicamentoOut.from_orm(medicamento) for medicamento in medicamentos]

# ✅ Obtener un medicamento por ID
@router.get("/medicamentos/{medicamento_id}", response_model=MedicamentoOut)
async def get_medicamento(medicamento_id: int, db: AsyncSession = Depends(get_db)):
    medicamento = await db.get(Medicamento, medicamento_id)
    if not medicamento:
        raise HTTPException(status_code=404, detail={"error": "Medicamento no encontrado"})
    return MedicamentoOut.from_orm(medicamento)

# ✅ Crear un nuevo medicamento
@router.post("/medicamentos/", response_model=MedicamentoOut)
async def create_medicamento(data: MedicamentoCreate, db: AsyncSession = Depends(get_db)):
    try:
        result = await db.execute(select(Medicamento).where(
            Medicamento.nombre_comercial == data.nombre_comercial,
            Medicamento.laboratorio == data.laboratorio,
            Medicamento.presentacion == data.presentacion
        ))
        if result.scalars().first():
            raise HTTPException(status_code=400, detail={"error": "Ya existe un medicamento con el mismo nombre, laboratorio y presentación"})

        medicamento = Medicamento(**data.model_dump())
        db.add(medicamento)
        await db.commit()
        await db.refresh(medicamento)
        return MedicamentoOut.from_orm(medicamento)
    except IntegrityError:
        await db.rollback()
        raise HTTPException(status_code=400, detail={"error": "Error de integridad, verifique los datos."})
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=500, detail={"error": str(e)})

# ✅ Actualizar medicamento
@router.put("/medicamentos/{medicamento_id}", response_model=MedicamentoOut)
async def update_medicamento(medicamento_id: int, medicamento_data: MedicamentoUpdate, db: AsyncSession = Depends(get_db)):
    medicamento = await db.get(Medicamento, medicamento_id)
    if not medicamento:
        raise HTTPException(status_code=404, detail={"error": "Medicamento no encontrado"})

    update_data = medicamento_data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(medicamento, key, value)

    await db.commit()
    await db.refresh(medicamento)
    return MedicamentoOut.from_orm(medicamento)

# ✅ Eliminar medicamento
@router.delete("/medicamentos/{medicamento_id}")
async def delete_medicamento(medicamento_id: int, db: AsyncSession = Depends(get_db)):
    medicamento = await db.get(Medicamento, medicamento_id)
    if not medicamento:
        raise HTTPException(status_code=404, detail={"error": "Medicamento no encontrado"})

    await db.delete(medicamento)
    await db.commit()
    return {"message": "Medicamento eliminado correctamente"}