from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.exc import IntegrityError
from typing import List
from app.database import get_db
from app.models.ventas import Ventas
from app.schemas.ventas import VentasCreate, VentasOut, VentasUpdate
from pydantic import ValidationError
from sqlalchemy.orm import selectinload
from app.models.ventas_detalle import VentasDetalle  # para futuras mejoras
from app.models.animal import Animal
from app.models.usuario import Usuario  

router = APIRouter()

@router.post("/ventas/", response_model=VentasOut)
async def create_venta(data: VentasCreate, db: AsyncSession = Depends(get_db)):
    try:
        venta = Ventas(**data.dict())
        db.add(venta)
        await db.commit()

        result = await db.execute(
            select(Ventas)
            .where(Ventas.venta_id == venta.venta_id)
            .options(
                selectinload(Ventas.detalles)
                    .selectinload(VentasDetalle.animal)
                    .selectinload(Animal.especie),
                selectinload(Ventas.detalles)
                    .selectinload(VentasDetalle.animal)
                    .selectinload(Animal.raza),
                selectinload(Ventas.cliente),
                selectinload(Ventas.lote_origen),
                selectinload(Ventas.usuario_registra)
                    .selectinload(Usuario.rol)
            )
        )
        venta = result.scalars().first()

        return venta

    except ValidationError as e:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=e.errors())

    except IntegrityError as e:
        await db.rollback()
        if "FOREIGN KEY" in str(e.orig):
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail={"error": "Error de clave foránea. Verifique las claves foráneas."})
        elif "UNIQUE" in str(e.orig):
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail={"error": "Error de unicidad. El documento_venta_ref debe ser único."})
        else:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail={"error": "Error de integridad de datos. Verifique los valores ingresados."})

@router.get("/ventas/", response_model=List[VentasOut])
async def get_ventas(db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Ventas)
        .options(
            selectinload(Ventas.detalles)
                .selectinload(VentasDetalle.animal)
                .selectinload(Animal.especie),
            selectinload(Ventas.detalles)
                .selectinload(VentasDetalle.animal)
                .selectinload(Animal.raza),
            selectinload(Ventas.cliente),
            selectinload(Ventas.lote_origen),
            selectinload(Ventas.usuario_registra)
                .selectinload(Usuario.rol)
        )
    )
    return result.scalars().all()


@router.get("/ventas/{venta_id}", response_model=VentasOut)
async def get_venta(venta_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Ventas)
        .where(Ventas.venta_id == venta_id)
        .options(
            selectinload(Ventas.detalles)
                .selectinload(VentasDetalle.animal)
                .selectinload(Animal.especie),
            selectinload(Ventas.detalles)
                .selectinload(VentasDetalle.animal)
                .selectinload(Animal.raza),
            selectinload(Ventas.cliente),
            selectinload(Ventas.lote_origen),
            selectinload(Ventas.usuario_registra)
                .selectinload(Usuario.rol)
        )
    )
    venta = result.scalars().first()

    if not venta:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail={"error": "Venta no encontrada"})

    return venta


@router.put("/ventas/{venta_id}", response_model=VentasOut)
async def update_venta(venta_id: int, venta_data: VentasUpdate, db: AsyncSession = Depends(get_db)):
    venta = await db.get(Ventas, venta_id)
    if not venta:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail={"error": "Venta no encontrada"})

    update_data = venta_data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(venta, key, value)

    try:
        await db.commit()
        await db.refresh(venta)
        return venta
    except ValidationError as e:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=e.errors())
    except IntegrityError as e:
        await db.rollback()
        if "FOREIGN KEY" in str(e.orig):
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail={"error": "Error de clave foránea. Verifique las claves foráneas."})
        elif "UNIQUE" in str(e.orig):
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail={"error": "Error de unicidad. El documento_venta_ref debe ser único."})
        else:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail={"error": "Error de integridad de datos. Verifique los valores ingresados."})

@router.delete("/ventas/{venta_id}")
async def delete_venta(venta_id: int, db: AsyncSession = Depends(get_db)):
    venta = await db.get(Ventas, venta_id)
    if not venta:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail={"error": "Venta no encontrada"})

    await db.delete(venta)
    await db.commit()
    return {"message": "Venta eliminada correctamente"}