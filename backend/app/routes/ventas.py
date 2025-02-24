from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.database import get_db
from app.models.venta import Venta
from app.schemas.venta import VentaCreate, VentaResponse
from typing import List

router = APIRouter(prefix="/ventas", tags=["Ventas"])

@router.post("/", response_model=VentaResponse)
async def create_venta(venta_data: VentaCreate, db: AsyncSession = Depends(get_db)):
    nueva_venta = Venta(**venta_data.model_dump())
    db.add(nueva_venta)
    await db.commit()
    await db.refresh(nueva_venta)
    return nueva_venta

@router.get("/", response_model=List[VentaResponse])
async def get_ventas(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Venta))
    return result.scalars().all()

@router.get("/{venta_id}", response_model=VentaResponse)
async def get_venta(venta_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Venta).filter(Venta.id == venta_id))
    venta = result.scalars().first()
    if not venta:
        raise HTTPException(status_code=404, detail="Venta no encontrada")
    return venta

@router.delete("/{venta_id}")
async def delete_venta(venta_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Venta).filter(Venta.id == venta_id))
    venta = result.scalars().first()
    if not venta:
        raise HTTPException(status_code=404, detail="Venta no encontrada")
    
    await db.delete(venta)
    await db.commit()
    return {"message": "Venta eliminada correctamente"}
