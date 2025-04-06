from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.database import get_db
from app.models.especie import Especie
from app.schemas.especie import EspecieCreate, EspecieUpdate, EspecieOut
from typing import List

router = APIRouter()

# ✅ Obtener todas las especies
@router.get("/especies/", response_model=List[EspecieOut])
async def get_especies(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Especie))
    especies = result.scalars().all()
    return [EspecieOut.from_orm(especie) for especie in especies]

# ✅ Obtener una especie por ID
@router.get("/especies/{especie_id}", response_model=EspecieOut)
async def get_especie(especie_id: int, db: AsyncSession = Depends(get_db)):
    especie = await db.get(Especie, especie_id)
    if not especie:
        raise HTTPException(status_code=404, detail={"error": "Especie no encontrada"})
    return EspecieOut.from_orm(especie)

# ✅ Crear una nueva especie
@router.post("/especies/", response_model=EspecieOut)
async def create_especie(data: EspecieCreate, db: AsyncSession = Depends(get_db)):
    try:
        result = await db.execute(select(Especie).where(Especie.nombre_comun == data.nombre_comun))
        if result.scalars().first():
            raise HTTPException(status_code=400, detail={"error": "El nombre común de la especie ya existe"})

        especie = Especie(**data.model_dump())
        db.add(especie)
        await db.commit()
        await db.refresh(especie)
        return EspecieOut.from_orm(especie)
    except Exception as e:
        raise HTTPException(status_code=500, detail={"error": str(e)})

# ✅ Actualizar especie
@router.put("/especies/{especie_id}", response_model=EspecieOut)
async def update_especie(especie_id: int, especie_data: EspecieUpdate, db: AsyncSession = Depends(get_db)):
    especie = await db.get(Especie, especie_id)
    if not especie:
        raise HTTPException(status_code=404, detail={"error": "Especie no encontrada"})

    update_data = especie_data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(especie, key, value)

    await db.commit()
    await db.refresh(especie)
    return EspecieOut.from_orm(especie)

# ✅ Eliminar especie
@router.delete("/especies/{especie_id}")
async def delete_especie(especie_id: int, db: AsyncSession = Depends(get_db)):
    especie = await db.get(Especie, especie_id)
    if not especie:
        raise HTTPException(status_code=404, detail={"error": "Especie no encontrada"})

    await db.delete(especie)
    await db.commit()
    return {"message": "Especie eliminada correctamente"}