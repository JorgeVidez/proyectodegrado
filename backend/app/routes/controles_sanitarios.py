from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.exc import IntegrityError
from typing import List
from app.database import get_db
from app.models.controles_sanitarios import ControlesSanitarios
# Importa los modelos ORM de las entidades relacionadas
from app.models.animal import Animal
from app.models.usuario import Usuario
from app.models.ubicacion import Ubicacion

from app.schemas.controles_sanitarios import ControlesSanitariosCreate, ControlesSanitariosOut, ControlesSanitariosUpdate
from pydantic import ValidationError
from sqlalchemy.orm import selectinload

router = APIRouter()

@router.post("/controles_sanitarios/", response_model=ControlesSanitariosOut)
async def create_control_sanitario(data: ControlesSanitariosCreate, db: AsyncSession = Depends(get_db)):
    try:
        # Validar la existencia de las claves foráneas antes de crear el movimiento
        if data.animal_id:
            animal_exists = await db.scalar(select(Animal).where(Animal.animal_id == data.animal_id))
            if not animal_exists:
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail={"error": f"Animal con ID {data.animal_id} no encontrado."})
        if data.responsable_id:
            responsable_exists = await db.scalar(select(Usuario).where(Usuario.usuario_id == data.responsable_id))
            if not responsable_exists:
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail={"error": f"Usuario responsable con ID {data.responsable_id} no encontrado."})
        if data.ubicacion_id:
            ubicacion_exists = await db.scalar(select(Ubicacion).where(Ubicacion.ubicacion_id == data.ubicacion_id))
            if not ubicacion_exists:
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail={"error": f"Ubicación con ID {data.ubicacion_id} no encontrada."})

        control = ControlesSanitarios(**data.model_dump())
        db.add(control)
        await db.commit()
        await db.refresh(control)

        # Cargar las relaciones para el response_model
        control_con_relaciones = await db.execute(
            select(ControlesSanitarios)
            .where(ControlesSanitarios.control_id == control.control_id)
            .options(
                selectinload(ControlesSanitarios.animal),
                selectinload(ControlesSanitarios.responsable),
                selectinload(ControlesSanitarios.ubicacion)
            )
        )
        control_con_relaciones = control_con_relaciones.scalars().first()
        if not control_con_relaciones:
             raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="No se pudo cargar el control creado con sus relaciones.")

        return control_con_relaciones
    except ValidationError as e:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=e.errors())
    except IntegrityError as e:
        await db.rollback()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail={"error": "Error de integridad de datos: " + str(e.orig)})
    except HTTPException as e: # Captura las HTTPException que lanzamos
        await db.rollback()
        raise e
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail={"error": f"Error inesperado al crear control sanitario: {e}"})

@router.get("/controles_sanitarios/", response_model=List[ControlesSanitariosOut])
async def get_controles_sanitarios(db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(ControlesSanitarios)
        .options(
            selectinload(ControlesSanitarios.animal),
            selectinload(ControlesSanitarios.responsable),
            selectinload(ControlesSanitarios.ubicacion)
        )
    )
    return result.scalars().unique().all()

@router.get("/controles_sanitarios/{control_id}", response_model=ControlesSanitariosOut)
async def get_control_sanitario(control_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(ControlesSanitarios)
        .where(ControlesSanitarios.control_id == control_id)
        .options(
            selectinload(ControlesSanitarios.animal),
            selectinload(ControlesSanitarios.responsable),
            selectinload(ControlesSanitarios.ubicacion)
        )
    )
    control = result.scalars().first()
    if not control:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail={"error": "Control sanitario no encontrado"})
    return control

@router.put("/controles_sanitarios/{control_id}", response_model=ControlesSanitariosOut)
async def update_control_sanitario(control_id: int, control_data: ControlesSanitariosUpdate, db: AsyncSession = Depends(get_db)):
    # Obtener el control existente con sus relaciones cargadas
    result = await db.execute(
        select(ControlesSanitarios)
        .where(ControlesSanitarios.control_id == control_id)
        .options(
            selectinload(ControlesSanitarios.animal),
            selectinload(ControlesSanitarios.responsable),
            selectinload(ControlesSanitarios.ubicacion)
        )
    )
    control = result.scalars().first()

    if not control:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail={"error": "Control sanitario no encontrado"})

    # Validar la existencia de las claves foráneas si se están actualizando
    if control_data.animal_id is not None and control_data.animal_id != control.animal_id:
        animal_exists = await db.scalar(select(Animal).where(Animal.animal_id == control_data.animal_id))
        if not animal_exists:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail={"error": f"Animal con ID {control_data.animal_id} no encontrado."})
    if control_data.responsable_id is not None and control_data.responsable_id != control.responsable_id:
        responsable_exists = await db.scalar(select(Usuario).where(Usuario.usuario_id == control_data.responsable_id))
        if not responsable_exists:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail={"error": f"Usuario responsable con ID {control_data.responsable_id} no encontrado."})
    if control_data.ubicacion_id is not None and control_data.ubicacion_id != control.ubicacion_id:
        ubicacion_exists = await db.scalar(select(Ubicacion).where(Ubicacion.ubicacion_id == control_data.ubicacion_id))
        if not ubicacion_exists:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail={"error": f"Ubicación con ID {control_data.ubicacion_id} no encontrada."})

    update_data = control_data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(control, key, value)

    try:
        await db.commit()
        await db.refresh(control)
        # Después de refresh, el objeto 'control' debería tener las relaciones cargadas
        # debido a la consulta inicial con selectinload.
        return control
    except ValidationError as e:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=e.errors())
    except IntegrityError as e:
        await db.rollback()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail={"error": "Error de integridad de datos: " + str(e.orig)})
    except HTTPException as e: # Captura las HTTPException que lanzamos
        await db.rollback()
        raise e
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail={"error": f"Error inesperado al actualizar control sanitario: {e}"})

@router.delete("/controles_sanitarios/{control_id}")
async def delete_control_sanitario(control_id: int, db: AsyncSession = Depends(get_db)):
    control = await db.get(ControlesSanitarios, control_id)
    if not control:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail={"error": "Control sanitario no encontrado"})

    await db.delete(control)
    await db.commit()
    return {"message": "Control sanitario eliminado correctamente"}