from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.exc import IntegrityError
from typing import List
from app.database import get_db
from app.models.ventas_detalle import VentasDetalle
from app.schemas.ventas_detalle import VentasDetalleCreate, VentasDetalleOut, VentasDetalleUpdate
from pydantic import ValidationError
from sqlalchemy.orm import selectinload
from app.models.animal import Animal

router = APIRouter()

@router.post("/ventas_detalles/", response_model=VentasDetalleOut)
async def create_venta_detalle(data: VentasDetalleCreate, db: AsyncSession = Depends(get_db)):
    try:
        venta_detalle = VentasDetalle(**data.dict())
        db.add(venta_detalle)
        await db.commit()

        # volver a cargar con relaciones
        result = await db.execute(
            select(VentasDetalle)
            .where(VentasDetalle.venta_detalle_id == venta_detalle.venta_detalle_id)
            .options(selectinload(VentasDetalle.animal))
        )
        venta_detalle = result.scalars().first()

        return venta_detalle

    except ValidationError as e:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=e.errors())
    except IntegrityError as e:
        await db.rollback()
        if "FOREIGN KEY" in str(e.orig):
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail={"error": "Error de clave foránea. Verifique las claves foráneas."})
        elif "UNIQUE" in str(e.orig):
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail={"error": "Error de unicidad. Un animal no puede añadirse dos veces a la misma venta."})
        else:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail={"error": "Error de integridad de datos. Verifique los valores ingresados."})


@router.get("/ventas_detalles/", response_model=List[VentasDetalleOut])
async def get_ventas_detalles(db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(VentasDetalle).options(selectinload(VentasDetalle.animal))
    )
    return result.scalars().all()


@router.get("/ventas_detalles/{venta_detalle_id}", response_model=VentasDetalleOut)
async def get_venta_detalle(venta_detalle_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(VentasDetalle)
        .where(VentasDetalle.venta_detalle_id == venta_detalle_id)
        .options(selectinload(VentasDetalle.animal))
    )
    venta_detalle = result.scalars().first()

    if not venta_detalle:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail={"error": "Detalle de venta no encontrado"})

    return venta_detalle


@router.put("/ventas_detalles/{venta_detalle_id}", response_model=VentasDetalleOut)
async def update_venta_detalle(venta_detalle_id: int, venta_detalle_data: VentasDetalleUpdate, db: AsyncSession = Depends(get_db)):
    venta_detalle = await db.get(VentasDetalle, venta_detalle_id)
    if not venta_detalle:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail={"error": "Detalle de venta no encontrado"})

    update_data = venta_detalle_data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(venta_detalle, key, value)

    try:
        await db.commit()
        await db.refresh(venta_detalle)
        return venta_detalle
    except ValidationError as e:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=e.errors())
    except IntegrityError as e:
        await db.rollback()
        if "FOREIGN KEY" in str(e.orig):
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail={"error": "Error de clave foránea. Verifique las claves foráneas."})
        elif "UNIQUE" in str(e.orig):
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail={"error": "Error de unicidad. Un animal no puede añadirse dos veces a la misma venta."})
        else:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail={"error": "Error de integridad de datos. Verifique los valores ingresados."})

@router.delete("/ventas_detalles/{venta_detalle_id}")
async def delete_venta_detalle(venta_detalle_id: int, db: AsyncSession = Depends(get_db)):
    venta_detalle = await db.get(VentasDetalle, venta_detalle_id)
    if not venta_detalle:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail={"error": "Detalle de venta no encontrado"})

    await db.delete(venta_detalle)
    await db.commit()
    return {"message": "Detalle de venta eliminado correctamente"}