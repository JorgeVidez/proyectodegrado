from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.exc import IntegrityError
from app.database import get_db
from app.models.lote import Lote
from app.schemas.lote import LoteCreate, LoteUpdate, LoteOut, LoteSimpleOut
from typing import List
from sqlalchemy.orm import joinedload
from sqlalchemy.orm import selectinload
from app.models.inventario_animal import InventarioAnimal
from app.models.animal import Animal
from app.models.ubicacion import Ubicacion
from app.models.proveedor import Proveedor

router = APIRouter()

# ✅ Obtener todos los lotes con inventarios
@router.get("/lotes/", response_model=List[LoteOut])
async def get_lotes(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Lote).options(
    selectinload(Lote.inventarios)
        .selectinload(InventarioAnimal.animal)
        .selectinload(Animal.especie),
    selectinload(Lote.inventarios)
        .selectinload(InventarioAnimal.animal)
        .selectinload(Animal.raza),
    selectinload(Lote.inventarios)
        .selectinload(InventarioAnimal.ubicacion_actual),
    selectinload(Lote.inventarios)
        .selectinload(InventarioAnimal.proveedor_compra),
)) # Use selectinload
    lotes = result.unique().scalars().all() # Use unique()
    return [LoteOut.from_orm(lote) for lote in lotes]

# ✅ Obtener un lote por ID con inventarios
@router.get("/lotes/{lote_id}", response_model=LoteOut)
async def get_lote(lote_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Lote).options(
    selectinload(Lote.inventarios)
        .selectinload(InventarioAnimal.animal)
        .selectinload(Animal.especie),
    selectinload(Lote.inventarios)
        .selectinload(InventarioAnimal.animal)
        .selectinload(Animal.raza),
    selectinload(Lote.inventarios)
        .selectinload(InventarioAnimal.ubicacion_actual),
    selectinload(Lote.inventarios)
        .selectinload(InventarioAnimal.proveedor_compra),
).filter(Lote.lote_id == lote_id)
    )
    lote = result.unique().scalar() # Use unique() and scalar()
    if not lote:
        raise HTTPException(status_code=404, detail={"error": "Lote no encontrado"})
    return LoteOut.from_orm(lote)

# ✅ Crear un nuevo lote
@router.post("/lotes/", response_model=LoteSimpleOut)
async def create_lote(data: LoteCreate, db: AsyncSession = Depends(get_db)):
    try:
        result = await db.execute(select(Lote).where(Lote.codigo_lote == data.codigo_lote))
        if result.scalars().first():
            raise HTTPException(status_code=400, detail={"error": "El código de lote ya existe"})

        lote = Lote(**data.model_dump())
        db.add(lote)
        await db.commit()
        await db.refresh(lote)
        return LoteSimpleOut.from_orm(lote)
    except IntegrityError:
        await db.rollback()
        raise HTTPException(status_code=400, detail={"error": "Error de integridad, verifique los datos."})
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=500, detail={"error": str(e)})

# ✅ Actualizar lote
@router.put("/lotes/{lote_id}", response_model=LoteSimpleOut)
async def update_lote(lote_id: int, lote_data: LoteUpdate, db: AsyncSession = Depends(get_db)):
    lote = await db.get(Lote, lote_id)
    if not lote:
        raise HTTPException(status_code=404, detail={"error": "Lote no encontrado"})

    update_data = lote_data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(lote, key, value)

    await db.commit()
    await db.refresh(lote)
    return LoteSimpleOut.from_orm(lote)

# ✅ Eliminar lote
@router.delete("/lotes/{lote_id}")
async def delete_lote(lote_id: int, db: AsyncSession = Depends(get_db)):
    lote = await db.get(Lote, lote_id)
    if not lote:
        raise HTTPException(status_code=404, detail={"error": "Lote no encontrado"})

    await db.delete(lote)
    await db.commit()
    return {"message": "Lote eliminado correctamente"}