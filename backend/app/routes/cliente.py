from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List
from app.database import get_db
from app.models.cliente import Cliente
from app.schemas.cliente import ClienteCreate, ClienteOut, ClienteUpdate

router = APIRouter()

@router.post("/cliente/", response_model=ClienteOut)
async def create_cliente(data: ClienteCreate, db: AsyncSession = Depends(get_db)):
    cliente = Cliente(**data.dict())
    db.add(cliente)
    await db.commit()
    await db.refresh(cliente)
    return cliente

@router.get("/cliente/", response_model=List[ClienteOut])
async def get_clientes(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Cliente))
    return result.scalars().all()

@router.get("/cliente/{cliente_id}", response_model=ClienteOut)
async def get_cliente(cliente_id: int, db: AsyncSession = Depends(get_db)):
    cliente = await db.get(Cliente, cliente_id)
    if not cliente:
        raise HTTPException(status_code=404, detail={"error": "Cliente no encontrado"})
    return cliente

@router.put("/cliente/{cliente_id}", response_model=ClienteOut)
async def update_cliente(cliente_id: int, cliente_data: ClienteUpdate, db: AsyncSession = Depends(get_db)):
    cliente = await db.get(Cliente, cliente_id)
    if not cliente:
        raise HTTPException(status_code=404, detail={"error": "Cliente no encontrado"})

    update_data = cliente_data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(cliente, key, value)

    await db.commit()
    await db.refresh(cliente)
    return cliente

@router.delete("/cliente/{cliente_id}")
async def delete_cliente(cliente_id: int, db: AsyncSession = Depends(get_db)):
    cliente = await db.get(Cliente, cliente_id)
    if not cliente:
        raise HTTPException(status_code=404, detail={"error": "Cliente no encontrado"})

    await db.delete(cliente)
    await db.commit()
    return {"message": "Cliente eliminado correctamente"}