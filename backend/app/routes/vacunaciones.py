from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.exc import IntegrityError
from typing import List
from app.database import get_db
from app.models.vacunaciones import Vacunaciones
from app.schemas.vacunaciones import VacunacionesCreate, VacunacionesOut, VacunacionesUpdate
from pydantic import ValidationError
from sqlalchemy.orm import selectinload, load_only
from app.models.animal import Animal
from app.models.tipo_vacuna import TipoVacuna
from app.models.proveedor import Proveedor
from app.models.usuario import Usuario

router = APIRouter()

# Utilidad para cargar relaciones
VACUNACION_RELATIONS = (
    selectinload(Vacunaciones.animal).load_only(
        Animal.animal_id, 
        Animal.numero_trazabilidad, 
        Animal.nombre_identificatorio
    ),
    selectinload(Vacunaciones.tipo_vacuna).selectinload(TipoVacuna.especie_destino),
    selectinload(Vacunaciones.proveedor),
    selectinload(Vacunaciones.responsable).selectinload(Usuario.rol)
)

@router.post("/vacunaciones/", response_model=VacunacionesOut)
async def create_vacunacion(data: VacunacionesCreate, db: AsyncSession = Depends(get_db)):
    try:
        vacunacion = Vacunaciones(**data.dict())
        db.add(vacunacion)
        await db.commit()

        # Refrescar con relaciones cargadas
        await db.refresh(vacunacion)
        result = await db.execute(
            select(Vacunaciones)
            .where(Vacunaciones.vacunacion_id == vacunacion.vacunacion_id)
            .options(*VACUNACION_RELATIONS)
        )
        vacunacion_with_relations = result.scalars().first()
        return vacunacion_with_relations

    except ValidationError as e:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=e.errors())
    except IntegrityError as e:
        await db.rollback()
        if "FOREIGN KEY" in str(e.orig):
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail={"error": "Error de clave foránea. Verifique las claves foráneas."})
        else:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail={"error": "Error de integridad de datos. Verifique los valores ingresados."})

@router.get("/vacunaciones/", response_model=List[VacunacionesOut])
async def get_vacunaciones(db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Vacunaciones).options(*VACUNACION_RELATIONS)
    )
    return result.scalars().all()

@router.get("/vacunaciones/{vacunacion_id}", response_model=VacunacionesOut)
async def get_vacunacion(vacunacion_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Vacunaciones)
        .where(Vacunaciones.vacunacion_id == vacunacion_id)
        .options(*VACUNACION_RELATIONS)
    )
    vacunacion = result.scalars().first()
    if not vacunacion:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail={"error": "Vacunación no encontrada"})
    return vacunacion

@router.put("/vacunaciones/{vacunacion_id}", response_model=VacunacionesOut)
async def update_vacunacion(vacunacion_id: int, vacunacion_data: VacunacionesUpdate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Vacunaciones)
        .where(Vacunaciones.vacunacion_id == vacunacion_id)
    )
    vacunacion = result.scalars().first()
    if not vacunacion:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail={"error": "Vacunación no encontrada"})

    update_data = vacunacion_data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(vacunacion, key, value)

    try:
        await db.commit()
        await db.refresh(vacunacion)

        # Volver a cargar con relaciones
        result = await db.execute(
            select(Vacunaciones)
            .where(Vacunaciones.vacunacion_id == vacunacion_id)
            .options(*VACUNACION_RELATIONS)
        )
        vacunacion_with_relations = result.scalars().first()
        return vacunacion_with_relations

    except ValidationError as e:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=e.errors())
    except IntegrityError as e:
        await db.rollback()
        if "FOREIGN KEY" in str(e.orig):
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail={"error": "Error de clave foránea. Verifique las claves foráneas."})
        else:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail={"error": "Error de integridad de datos. Verifique los valores ingresados."})

@router.delete("/vacunaciones/{vacunacion_id}")
async def delete_vacunacion(vacunacion_id: int, db: AsyncSession = Depends(get_db)):
    vacunacion = await db.get(Vacunaciones, vacunacion_id)
    if not vacunacion:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail={"error": "Vacunación no encontrada"})

    await db.delete(vacunacion)
    await db.commit()
    return {"message": "Vacunación eliminada correctamente"}
