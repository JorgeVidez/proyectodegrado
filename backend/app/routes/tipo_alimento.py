from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.database import get_db
from app.models.tipo_alimento import TipoAlimento
from app.schemas.tipo_alimento import TipoAlimentoCreate, TipoAlimentoUpdate, TipoAlimentoOut
from typing import List

router = APIRouter()

# ✅ Obtener todos los tipos de alimento
@router.get("/tipos_alimento/", response_model=List[TipoAlimentoOut])
async def get_tipos_alimento(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(TipoAlimento))
    tipos_alimento = result.scalars().all()
    return [TipoAlimentoOut.from_orm(tipo_alimento) for tipo_alimento in tipos_alimento]

# ✅ Obtener un tipo de alimento por ID
@router.get("/tipos_alimento/{tipo_alimento_id}", response_model=TipoAlimentoOut)
async def get_tipo_alimento(tipo_alimento_id: int, db: AsyncSession = Depends(get_db)):
    tipo_alimento = await db.get(TipoAlimento, tipo_alimento_id)
    if not tipo_alimento:
        raise HTTPException(status_code=404, detail={"error": "Tipo de alimento no encontrado"})
    return TipoAlimentoOut.from_orm(tipo_alimento)

# ✅ Crear un nuevo tipo de alimento
@router.post("/tipos_alimento/", response_model=TipoAlimentoOut)
async def create_tipo_alimento(data: TipoAlimentoCreate, db: AsyncSession = Depends(get_db)):
    try:
        result = await db.execute(select(TipoAlimento).where(TipoAlimento.nombre == data.nombre))
        if result.scalars().first():
            raise HTTPException(status_code=400, detail={"error": "El nombre del tipo de alimento ya existe"})

        tipo_alimento = TipoAlimento(**data.model_dump())
        db.add(tipo_alimento)
        await db.commit()
        await db.refresh(tipo_alimento)
        return TipoAlimentoOut.from_orm(tipo_alimento)
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=500, detail={"error": str(e)})

# ✅ Actualizar tipo de alimento
@router.put("/tipos_alimento/{tipo_alimento_id}", response_model=TipoAlimentoOut)
async def update_tipo_alimento(tipo_alimento_id: int, tipo_alimento_data: TipoAlimentoUpdate, db: AsyncSession = Depends(get_db)):
    tipo_alimento = await db.get(TipoAlimento, tipo_alimento_id)
    if not tipo_alimento:
        raise HTTPException(status_code=404, detail={"error": "Tipo de alimento no encontrado"})

    update_data = tipo_alimento_data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(tipo_alimento, key, value)

    await db.commit()
    await db.refresh(tipo_alimento)
    return TipoAlimentoOut.from_orm(tipo_alimento)

# ✅ Eliminar tipo de alimento
@router.delete("/tipos_alimento/{tipo_alimento_id}")
async def delete_tipo_alimento(tipo_alimento_id: int, db: AsyncSession = Depends(get_db)):
    tipo_alimento = await db.get(TipoAlimento, tipo_alimento_id)
    if not tipo_alimento:
        raise HTTPException(status_code=404, detail={"error": "Tipo de alimento no encontrado"})

    await db.delete(tipo_alimento)
    await db.commit()
    return {"message": "Tipo de alimento eliminado correctamente"}