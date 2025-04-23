from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.exc import IntegrityError
from typing import List
from app.database import get_db
from app.models.inventario_animal import InventarioAnimal, MotivoIngreso, MotivoEgreso
from app.schemas.inventario_animal import InventarioAnimalCreate, InventarioAnimalOut, InventarioAnimalUpdate
from pydantic import ValidationError

router = APIRouter()

@router.post("/inventario_animal/", response_model=InventarioAnimalOut)
async def create_inventario_animal(data: InventarioAnimalCreate, db: AsyncSession = Depends(get_db)):
    try:
        inventario = InventarioAnimal(**data.dict())
        db.add(inventario)
        await db.commit()
        await db.refresh(inventario)
        return inventario
    except ValidationError as e:
        error_details = e.errors()
        for error in error_details:
            if error["loc"][0] in ["motivo_ingreso", "motivo_egreso"]:
                error["valid_values"] = [e.value for e in (MotivoIngreso if error["loc"][0] == "motivo_ingreso" else MotivoEgreso)]
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=error_details)
    except IntegrityError as e:
        await db.rollback()
        if "FOREIGN KEY" in str(e.orig):
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail={"error": "Error de clave foránea. Verifique las claves foráneas (animal_id, proveedor_compra_id, ubicacion_actual_id, lote_actual_id)."})
        elif "UNIQUE" in str(e.orig):
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail={"error": "Error de unicidad. El animal_id debe ser único en el inventario activo."})
        elif "CHECK" in str(e.orig):
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail={"error": "Error de restricción de comprobación. Verifique el motivo_ingreso (Nacimiento, Compra, TrasladoInterno) y el motivo_egreso (Venta, Muerte, Descartado, TrasladoExterno). También verifique que si motivo_ingreso es Compra, proveedor_compra_id y precio_compra estén presentes, y que fecha_egreso y motivo_egreso estén ambos presentes o ambos nulos."})
        else:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail={"error": "Error de integridad de datos. Verifique los valores ingresados."})

@router.get("/inventario_animal/", response_model=List[InventarioAnimalOut])
async def get_inventario_animales(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(InventarioAnimal))
    return result.scalars().all()

@router.get("/inventario_animal/{inventario_id}", response_model=InventarioAnimalOut)
async def get_inventario_animal(inventario_id: int, db: AsyncSession = Depends(get_db)):
    inventario = await db.get(InventarioAnimal, inventario_id)
    if not inventario:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail={"error": "Inventario de animal no encontrado"})
    return inventario

@router.put("/inventario_animal/{inventario_id}", response_model=InventarioAnimalOut)
async def update_inventario_animal(inventario_id: int, data: InventarioAnimalUpdate, db: AsyncSession = Depends(get_db)):
    inventario = await db.get(InventarioAnimal, inventario_id)
    if not inventario:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail={"error": "Inventario de animal no encontrado"})
    
    for field, value in data.dict(exclude_unset=True).items():
        setattr(inventario, field, value)

    try:
        await db.commit()
        await db.refresh(inventario)
        return inventario
    except IntegrityError as e:
        await db.rollback()
        if "FOREIGN KEY" in str(e.orig):
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail={"error": "Error de clave foránea. Verifique las claves foráneas."})
        elif "CHECK" in str(e.orig):
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail={"error": "Error de restricción de comprobación. Verifique los valores de entrada."})
        else:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail={"error": "Error al actualizar el inventario. Verifique los datos."})


@router.delete("/inventario_animal/{inventario_id}", response_model=InventarioAnimalOut)
async def delete_inventario_animal(inventario_id: int, db: AsyncSession = Depends(get_db)):
    inventario = await db.get(InventarioAnimal, inventario_id)
    if not inventario:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail={"error": "Inventario de animal no encontrado"})
    
    inventario.activo_en_finca = False

    await db.commit()
    await db.refresh(inventario)
    return inventario
