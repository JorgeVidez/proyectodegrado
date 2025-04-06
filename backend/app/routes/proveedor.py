from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List
from app.database import get_db
from app.models.proveedor import Proveedor
from app.schemas.proveedor import ProveedorCreate, ProveedorOut, ProveedorUpdate

router = APIRouter()

@router.post("/proveedor/", response_model=ProveedorOut)
async def create_proveedor(data: ProveedorCreate, db: AsyncSession = Depends(get_db)):
    proveedor = Proveedor(**data.dict())
    db.add(proveedor)
    await db.commit()
    await db.refresh(proveedor)
    return proveedor

@router.get("/proveedor/", response_model=List[ProveedorOut])
async def get_proveedores(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Proveedor))
    return result.scalars().all()

@router.get("/proveedor/{proveedor_id}", response_model=ProveedorOut)
async def get_proveedor(proveedor_id: int, db: AsyncSession = Depends(get_db)):
    proveedor = await db.get(Proveedor, proveedor_id)
    if not proveedor:
        raise HTTPException(status_code=404, detail={"error": "Proveedor no encontrado"})
    return proveedor

@router.put("/proveedor/{proveedor_id}", response_model=ProveedorOut)
async def update_proveedor(proveedor_id: int, proveedor_data: ProveedorUpdate, db: AsyncSession = Depends(get_db)):
    proveedor = await db.get(Proveedor, proveedor_id)
    if not proveedor:
        raise HTTPException(status_code=404, detail={"error": "Proveedor no encontrado"})

    update_data = proveedor_data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(proveedor, key, value)

    await db.commit()
    await db.refresh(proveedor)
    return proveedor

@router.delete("/proveedor/{proveedor_id}")
async def delete_proveedor(proveedor_id: int, db: AsyncSession = Depends(get_db)):
    proveedor = await db.get(Proveedor, proveedor_id)
    if not proveedor:
        raise HTTPException(status_code=404, detail={"error": "Proveedor no encontrado"})

    await db.delete(proveedor)
    await db.commit()
    return {"message": "Proveedor eliminado correctamente"}