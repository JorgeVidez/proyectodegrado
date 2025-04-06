from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.database import get_db
from app.models.rol_usuario import RolUsuario
from app.schemas.rol_usuario import RolUsuarioCreate, RolUsuarioUpdate, RolUsuarioOut
from typing import List

router = APIRouter()

@router.get("/roles/", response_model=List[RolUsuarioOut])
async def get_roles(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(RolUsuario))
    roles = result.scalars().all()
    return [RolUsuarioOut.model_validate(rol) for rol in roles]  # Pydantic v2

@router.get("/roles/{rol_id}", response_model=RolUsuarioOut)
async def get_rol(rol_id: int, db: AsyncSession = Depends(get_db)):
    rol = await db.get(RolUsuario, rol_id)
    if not rol:
        raise HTTPException(status_code=404, detail={"error": "Rol no encontrado"})
    return RolUsuarioOut.model_validate(rol)

@router.post("/roles/", response_model=RolUsuarioOut)
async def create_rol(data: RolUsuarioCreate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(RolUsuario).where(RolUsuario.nombre_rol == data.nombre_rol))
    if result.scalars().first():
        raise HTTPException(status_code=400, detail={"error": "El nombre del rol ya existe"})

    rol = RolUsuario(**data.model_dump())
    db.add(rol)
    await db.commit()
    await db.refresh(rol)
    return RolUsuarioOut.model_validate(rol)

@router.put("/roles/{rol_id}", response_model=RolUsuarioOut)
async def update_rol(rol_id: int, rol_data: RolUsuarioUpdate, db: AsyncSession = Depends(get_db)):
    rol = await db.get(RolUsuario, rol_id)
    if not rol:
        raise HTTPException(status_code=404, detail={"error": "Rol no encontrado"})

    update_data = rol_data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(rol, key, value)

    await db.commit()
    await db.refresh(rol)
    return RolUsuarioOut.model_validate(rol)

@router.delete("/roles/{rol_id}")
async def delete_rol(rol_id: int, db: AsyncSession = Depends(get_db)):
    rol = await db.get(RolUsuario, rol_id)
    if not rol:
        raise HTTPException(status_code=404, detail={"error": "Rol no encontrado"})

    await db.delete(rol)
    await db.commit()
    return {"message": "Rol eliminado correctamente"}
