from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.exc import IntegrityError
from app.database import get_db
from app.models.lote import Lote
from app.schemas.lote import LoteCreate, LoteUpdate, LoteOut
from typing import List

router = APIRouter()

# ✅ Obtener todos los lotes
@router.get("/lotes/", response_model=List[LoteOut])
async def get_lotes(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Lote))
    lotes = result.scalars().all()
    return [LoteOut.from_orm(lote) for lote in lotes]

# ✅ Obtener un lote por ID
@router.get("/lotes/{lote_id}", response_model=LoteOut)
async def get_lote(lote_id: int, db: AsyncSession = Depends(get_db)):
    lote = await db.get(Lote, lote_id)
    if not lote:
        raise HTTPException(status_code=404, detail={"error": "Lote no encontrado"})
    return LoteOut.from_orm(lote)

# ✅ Crear un nuevo lote
@router.post("/lotes/", response_model=LoteOut)
async def create_lote(data: LoteCreate, db: AsyncSession = Depends(get_db)):
    try:
        result = await db.execute(select(Lote).where(Lote.codigo_lote == data.codigo_lote))
        if result.scalars().first():
            raise HTTPException(status_code=400, detail={"error": "El código de lote ya existe"})

        lote = Lote(**data.model_dump())
        db.add(lote)
        await db.commit()
        await db.refresh(lote)
        return LoteOut.from_orm(lote)
    except IntegrityError:
        await db.rollback()
        raise HTTPException(status_code=400, detail={"error": "Error de integridad, verifique los datos."})
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=500, detail={"error": str(e)})

# ✅ Actualizar lote
@router.put("/lotes/{lote_id}", response_model=LoteOut)
async def update_lote(lote_id: int, lote_data: LoteUpdate, db: AsyncSession = Depends(get_db)):
    lote = await db.get(Lote, lote_id)
    if not lote:
        raise HTTPException(status_code=404, detail={"error": "Lote no encontrado"})

    update_data = lote_data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(lote, key, value)

    await db.commit()
    await db.refresh(lote)
    return LoteOut.from_orm(lote)

# ✅ Eliminar lote
@router.delete("/lotes/{lote_id}")
async def delete_lote(lote_id: int, db: AsyncSession = Depends(get_db)):
    lote = await db.get(Lote, lote_id)
    if not lote:
        raise HTTPException(status_code=404, detail={"error": "Lote no encontrado"})

    await db.delete(lote)
    await db.commit()
    return {"message": "Lote eliminado correctamente"}