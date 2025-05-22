from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
<<<<<<< Updated upstream
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
=======
from app.database import get_db  # ✅ Importar conexión a la BD
from app.models.proveedor import Proveedor
from app.schemas.proveedor import ProveedorCreate, ProveedorResponse

router = APIRouter(prefix="/proveedores", tags=["Proveedores"])

# ✅ Crear un proveedor de forma asíncrona
@router.post("/", response_model=ProveedorResponse)
async def create_proveedor(proveedor: ProveedorCreate, db: AsyncSession = Depends(get_db)):
    new_proveedor = Proveedor(**proveedor.dict())
    db.add(new_proveedor)
    await db.commit()  # ✅ Se usa await en commit()
    await db.refresh(new_proveedor)  # ✅ Se usa await en refresh()
    return new_proveedor

# ✅ Obtener todos los proveedores
@router.get("/", response_model=list[ProveedorResponse])
async def get_proveedores(db: AsyncSession = Depends(get_db)):
    stmt = select(Proveedor)
    result = await db.execute(stmt)  # ✅ Se usa await en execute()
    proveedores = result.scalars().all()  # ✅ Se usa scalars().all() para extraer resultados
    return proveedores

# ✅ Obtener un proveedor por ID
@router.get("/{proveedor_id}", response_model=ProveedorResponse)
async def get_proveedor(proveedor_id: int, db: AsyncSession = Depends(get_db)):
    stmt = select(Proveedor).filter(Proveedor.id == proveedor_id)
    result = await db.execute(stmt)  # ✅ Se usa await en execute()
    proveedor = result.scalars().first()
    
    if not proveedor:
        raise HTTPException(status_code=404, detail="Proveedor no encontrado")
    
    return proveedor
>>>>>>> Stashed changes
