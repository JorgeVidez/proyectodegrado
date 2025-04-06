from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.exc import NoResultFound
from app.database import get_db
from app.models.proveedor import Proveedor  # ✅ Importar Proveedor para validar proveedor_id
from app.models.ganado import Ganado
from app.schemas.ganado import GanadoCreate, GanadoResponse, GanadoUpdate
from typing import List
from sqlalchemy.orm import selectinload, joinedload
from app.models.control import Control  # ✅ Importar ControlResponse para la relación


router = APIRouter()

# ✅ Obtener todos los registros de ganado
@router.get("/ganado/", response_model=List[GanadoResponse])
async def get_ganado(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Ganado).options(selectinload(Ganado.proveedor), selectinload(Ganado.controles).options(joinedload(Control.veterinario))))
    return result.scalars().all()

# ✅ Obtener un solo registro de ganado por ID
@router.get("/ganado/{ganado_id}", response_model=GanadoResponse)
async def get_ganado_by_id(ganado_id: int, db: AsyncSession = Depends(get_db)):
    stmt = select(Ganado).filter(Ganado.id == ganado_id)
    result = await db.execute(stmt)
    ganado = result.scalars().first()
    
    if not ganado:
        raise HTTPException(status_code=404, detail="Ganado no encontrado")
    
    return ganado

# ✅ Crear un nuevo registro de ganado con validación de proveedor_id
@router.post("/ganado/", response_model=GanadoResponse)
async def create_ganado(ganado: GanadoCreate, db: AsyncSession = Depends(get_db)):
    # 🔍 Verificar si el proveedor existe antes de crear ganado
    stmt = select(Proveedor).filter(Proveedor.id == ganado.proveedor_id)
    result = await db.execute(stmt)
    proveedor = result.scalars().first()

    if not proveedor:
        raise HTTPException(status_code=400, detail="El proveedor_id no existe")

    # 📌 Crear el ganado
    nuevo_ganado = Ganado(**ganado.model_dump())
    db.add(nuevo_ganado)
    await db.commit()
    await db.refresh(nuevo_ganado)
    
    return nuevo_ganado

# ✅ Actualizar un registro de ganado
@router.put("/ganado/{ganado_id}", response_model=GanadoResponse)
async def update_ganado(ganado_id: int, ganado_data: GanadoUpdate, db: AsyncSession = Depends(get_db)):
    stmt = select(Ganado).filter(Ganado.id == ganado_id)
    result = await db.execute(stmt)
    ganado = result.scalars().first()
    
    if not ganado:
        raise HTTPException(status_code=404, detail="Ganado no encontrado")

    for key, value in ganado_data.model_dump(exclude_unset=True).items():
        setattr(ganado, key, value)

    await db.commit()
    await db.refresh(ganado)
    return ganado

# ✅ Eliminar un registro de ganado
@router.delete("/ganado/{ganado_id}")
async def delete_ganado(ganado_id: int, db: AsyncSession = Depends(get_db)):
    stmt = select(Ganado).filter(Ganado.id == ganado_id)
    result = await db.execute(stmt)
    ganado = result.scalars().first()
    
    if not ganado:
        raise HTTPException(status_code=404, detail="Ganado no encontrado")

    await db.delete(ganado)
    await db.commit()
    return {"message": "Ganado eliminado correctamente"}
