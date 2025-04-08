from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.exc import IntegrityError
from app.database import get_db
from app.models.raza import Raza
from app.models.especie import Especie
from app.schemas.raza import RazaCreate, RazaUpdate, RazaOut
from typing import List
from sqlalchemy.orm import selectinload

router = APIRouter()

# ✅ Obtener todas las razas
@router.get("/razas/", response_model=List[RazaOut])
async def get_razas(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Raza).options(selectinload(Raza.especie))) #Importante incluir selectinload
    razas = result.scalars().all()
    return [RazaOut.from_orm(raza) for raza in razas]

# ✅ Obtener una raza por ID
@router.get("/razas/{raza_id}", response_model=RazaOut)
async def get_raza(raza_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Raza).options(selectinload(Raza.especie)).where(Raza.raza_id == raza_id))
    raza = result.scalars().first()
    if not raza:
        raise HTTPException(status_code=404, detail={"error": "Raza no encontrada"})
    return RazaOut.from_orm(raza)

# ✅ Crear una nueva raza
@router.post("/razas/", response_model=RazaOut)
async def create_raza(data: RazaCreate, db: AsyncSession = Depends(get_db)):
    try:
        # Verificar la existencia de especie_id
        especie = await db.get(Especie, data.especie_id)
        if not especie:
            raise HTTPException(status_code=400, detail={"error": "Especie no encontrada, verifique el especie_id."})

        result = await db.execute(select(Raza).where(Raza.especie_id == data.especie_id, Raza.nombre_raza == data.nombre_raza))
        if result.scalars().first():
            raise HTTPException(status_code=400, detail={"error": "La raza ya existe para esta especie"})

        raza = Raza(**data.model_dump())
        db.add(raza)
        await db.commit()
        await db.refresh(raza)
        return RazaOut.from_orm(raza)
    except IntegrityError:
        await db.rollback()
        raise HTTPException(status_code=400, detail={"error": "Error de integridad, verifique los datos."})
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=500, detail={"error": str(e)})

# ✅ Actualizar raza
@router.put("/razas/{raza_id}", response_model=RazaOut)
async def update_raza(raza_id: int, raza_data: RazaUpdate, db: AsyncSession = Depends(get_db)):
    raza = await db.get(Raza, raza_id)
    if not raza:
        raise HTTPException(status_code=404, detail={"error": "Raza no encontrada"})

    #Verificar existencia de especie_id
    if raza_data.especie_id is not None:
        especie = await db.get(Especie, raza_data.especie_id)
        if not especie:
            raise HTTPException(status_code=400, detail={"error": "Especie no encontrada, verifique el especie_id."})

    update_data = raza_data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(raza, key, value)

    await db.commit()
    await db.refresh(raza)
    return RazaOut.from_orm(raza)

# ✅ Eliminar raza
@router.delete("/razas/{raza_id}")
async def delete_raza(raza_id: int, db: AsyncSession = Depends(get_db)):
    raza = await db.get(Raza, raza_id)
    if not raza:
        raise HTTPException(status_code=404, detail={"error": "Raza no encontrada"})

    await db.delete(raza)
    await db.commit()
    return {"message": "Raza eliminada correctamente"}