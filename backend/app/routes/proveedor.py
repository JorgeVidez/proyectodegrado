from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
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
