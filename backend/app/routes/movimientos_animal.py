from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.exc import IntegrityError
from typing import List
from app.database import get_db
from app.models.movimientos_animal import MovimientoAnimal, TipoMovimiento
# Asegúrate de importar los modelos ORM de tus otras entidades
from app.models.animal import Animal
from app.models.ubicacion import Ubicacion
from app.models.lote import Lote
from app.models.proveedor import Proveedor
from app.models.cliente import Cliente
from app.models.usuario import Usuario

from app.schemas.movimientos_animal import MovimientoAnimalCreate, MovimientoAnimalOut, MovimientoAnimalUpdate
from pydantic import ValidationError
from sqlalchemy.orm import selectinload # Importa selectinload

router = APIRouter()

# ---
## Crear Movimiento de Animal
@router.post("/movimiento_animal/", response_model=MovimientoAnimalOut)
async def create_movimiento_animal(data: MovimientoAnimalCreate, db: AsyncSession = Depends(get_db)):
    try:
        movimiento = MovimientoAnimal(**data.model_dump()) # Usar .model_dump() para Pydantic v2+
        db.add(movimiento)
        await db.commit()
        await db.refresh(movimiento)

        # Después de la creación, carga las relaciones para el response_model
        # Esto es importante para que el objeto 'movimiento' tenga las relaciones cargadas
        # antes de ser serializado por MovimientoAnimalOut.
        # Si estas relaciones ya se cargan automáticamente o con un event listener,
        # quizás no sea estrictamente necesario, pero es una buena práctica.
        # Para garantizar, podemos recargar el objeto con las opciones de carga:
        movimiento_con_relaciones = await db.execute(
            select(MovimientoAnimal)
            .where(MovimientoAnimal.movimiento_id == movimiento.movimiento_id)
            .options(
                selectinload(MovimientoAnimal.animal),
                selectinload(MovimientoAnimal.origen_ubicacion),
                selectinload(MovimientoAnimal.destino_ubicacion),
                selectinload(MovimientoAnimal.origen_lote),
                selectinload(MovimientoAnimal.destino_lote),
                selectinload(MovimientoAnimal.proveedor),
                selectinload(MovimientoAnimal.cliente),
                selectinload(MovimientoAnimal.usuario)
            )
        )
        movimiento_con_relaciones = movimiento_con_relaciones.scalars().first()
        if not movimiento_con_relaciones:
             raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="No se pudo cargar el movimiento creado con sus relaciones.")

        return movimiento_con_relaciones
    except ValidationError as e:
        error_details = e.errors()
        for error in error_details:
            if error["loc"][0] == "tipo_movimiento":
                error["valid_values"] = [e.value for e in TipoMovimiento]
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=error_details)
    except IntegrityError as e:
        await db.rollback()
        if "FOREIGN KEY" in str(e.orig):
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail={"error": "Error de clave foránea. Verifique las claves foráneas."})
        elif "CHECK" in str(e.orig):
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail={"error": "Error de restricción de comprobación. Verifique el tipo_movimiento."})
        else:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail={"error": "Error de integridad de datos. Verifique los valores ingresados."})

# ---
## Obtener Todos los Movimientos de Animal
@router.get("/movimiento_animal/", response_model=List[MovimientoAnimalOut])
async def get_movimientos_animales(db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(MovimientoAnimal)
        .options(
            selectinload(MovimientoAnimal.animal),
            selectinload(MovimientoAnimal.origen_ubicacion),
            selectinload(MovimientoAnimal.destino_ubicacion),
            selectinload(MovimientoAnimal.origen_lote),
            selectinload(MovimientoAnimal.destino_lote),
            selectinload(MovimientoAnimal.proveedor),
            selectinload(MovimientoAnimal.cliente),
            selectinload(MovimientoAnimal.usuario)
        )
    )
    return result.scalars().unique().all() # .unique() para evitar duplicados si hay joins muchos a uno

# ---
## Obtener un Movimiento de Animal por ID
@router.get("/movimiento_animal/{movimiento_id}", response_model=MovimientoAnimalOut)
async def get_movimiento_animal(movimiento_id: int, db: AsyncSession = Depends(get_db)):
    # Usar .get() no permite selectinload directamente.
    # Necesitamos una consulta completa para cargar las relaciones.
    result = await db.execute(
        select(MovimientoAnimal)
        .where(MovimientoAnimal.movimiento_id == movimiento_id)
        .options(
            selectinload(MovimientoAnimal.animal),
            selectinload(MovimientoAnimal.origen_ubicacion),
            selectinload(MovimientoAnimal.destino_ubicacion),
            selectinload(MovimientoAnimal.origen_lote),
            selectinload(MovimientoAnimal.destino_lote),
            selectinload(MovimientoAnimal.proveedor),
            selectinload(MovimientoAnimal.cliente),
            selectinload(MovimientoAnimal.usuario)
        )
    )
    movimiento = result.scalars().first()
    if not movimiento:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail={"error": "Movimiento animal no encontrado"})
    return movimiento

# ---
## Actualizar Movimiento de Animal
@router.put("/movimiento_animal/{movimiento_id}", response_model=MovimientoAnimalOut)
async def update_movimiento_animal(movimiento_id: int, movimiento_data: MovimientoAnimalUpdate, db: AsyncSession = Depends(get_db)):
    # Primero obtenemos el movimiento, cargando también las relaciones para el retorno
    result = await db.execute(
        select(MovimientoAnimal)
        .where(MovimientoAnimal.movimiento_id == movimiento_id)
        .options(
            selectinload(MovimientoAnimal.animal),
            selectinload(MovimientoAnimal.origen_ubicacion),
            selectinload(MovimientoAnimal.destino_ubicacion),
            selectinload(MovimientoAnimal.origen_lote),
            selectinload(MovimientoAnimal.destino_lote),
            selectinload(MovimientoAnimal.proveedor),
            selectinload(MovimientoAnimal.cliente),
            selectinload(MovimientoAnimal.usuario)
        )
    )
    movimiento = result.scalars().first()

    if not movimiento:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail={"error": "Movimiento animal no encontrado"})

    update_data = movimiento_data.model_dump(exclude_unset=True) # Usar .model_dump() para Pydantic v2+
    for key, value in update_data.items():
        setattr(movimiento, key, value)

    try:
        await db.commit()
        await db.refresh(movimiento) # Esto refrescará el objeto y potencialmente recargará relaciones si están lazy loaded
        return movimiento
    except ValidationError as e:
        error_details = e.errors()
        for error in error_details:
            if error["loc"][0] == "tipo_movimiento":
                error["valid_values"] = [e.value for e in TipoMovimiento]
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=error_details)
    except IntegrityError as e:
        await db.rollback()
        if "FOREIGN KEY" in str(e.orig):
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail={"error": "Error de clave foránea. Verifique las claves foráneas."})
        elif "CHECK" in str(e.orig):
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail={"error": "Error de restricción de comprobación. Verifique el tipo_movimiento."})
        else:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail={"error": "Error de integridad de datos. Verifique los valores ingresados."})

# ---
## Eliminar Movimiento de Animal
@router.delete("/movimiento_animal/{movimiento_id}")
async def delete_movimiento_animal(movimiento_id: int, db: AsyncSession = Depends(get_db)):
    movimiento = await db.get(MovimientoAnimal, movimiento_id)
    if not movimiento:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail={"error": "Movimiento animal no encontrado"})

    await db.delete(movimiento)
    await db.commit()
    return {"message": "Movimiento animal eliminado correctamente"}