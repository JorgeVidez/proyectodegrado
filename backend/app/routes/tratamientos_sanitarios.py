from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.exc import IntegrityError
from typing import List
from app.database import get_db
from app.models.tratamientos_sanitarios import TratamientosSanitarios
# Importa los modelos ORM de las entidades relacionadas
from app.models.animal import Animal
from app.models.medicamento import Medicamento # Asegúrate de que este modelo exista
from app.models.proveedor import Proveedor
from app.models.usuario import Usuario

from app.schemas.tratamientos_sanitarios import TratamientosSanitariosCreate, TratamientosSanitariosOut, TratamientosSanitariosUpdate
from pydantic import ValidationError
from sqlalchemy.orm import selectinload

router = APIRouter()

@router.post("/tratamientos_sanitarios/", response_model=TratamientosSanitariosOut)
async def create_tratamiento_sanitario(data: TratamientosSanitariosCreate, db: AsyncSession = Depends(get_db)):
    try:
        # Validar la existencia de las claves foráneas
        animal_exists = await db.scalar(select(Animal).where(Animal.animal_id == data.animal_id))
        if not animal_exists:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail={"error": f"Animal con ID {data.animal_id} no encontrado."})

        if data.medicamento_id:
            medicamento_exists = await db.scalar(select(Medicamento).where(Medicamento.medicamento_id == data.medicamento_id))
            if not medicamento_exists:
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail={"error": f"Medicamento con ID {data.medicamento_id} no encontrado."})
        
        if data.proveedor_medicamento_id:
            proveedor_exists = await db.scalar(select(Proveedor).where(Proveedor.proveedor_id == data.proveedor_medicamento_id))
            if not proveedor_exists:
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail={"error": f"Proveedor de medicamento con ID {data.proveedor_medicamento_id} no encontrado."})
        
        if data.responsable_veterinario_id:
            veterinario_exists = await db.scalar(select(Usuario).where(Usuario.usuario_id == data.responsable_veterinario_id))
            if not veterinario_exists:
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail={"error": f"Veterinario responsable con ID {data.responsable_veterinario_id} no encontrado."})

        tratamiento = TratamientosSanitarios(**data.model_dump()) # Usar .model_dump()
        db.add(tratamiento)
        await db.commit()
        await db.refresh(tratamiento)

        # Cargar las relaciones para el response_model
        tratamiento_con_relaciones = await db.execute(
            select(TratamientosSanitarios)
            .where(TratamientosSanitarios.tratamiento_id == tratamiento.tratamiento_id)
            .options(
                selectinload(TratamientosSanitarios.animal),
                selectinload(TratamientosSanitarios.medicamento),
                selectinload(TratamientosSanitarios.proveedor_medicamento),
                selectinload(TratamientosSanitarios.responsable_veterinario)
            )
        )
        tratamiento_con_relaciones = tratamiento_con_relaciones.scalars().first()
        if not tratamiento_con_relaciones:
             raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="No se pudo cargar el tratamiento creado con sus relaciones.")

        return tratamiento_con_relaciones
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
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail={"error": f"Error inesperado al crear tratamiento sanitario: {e}"})

@router.get("/tratamientos_sanitarios/", response_model=List[TratamientosSanitariosOut])
async def get_tratamientos_sanitarios(db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(TratamientosSanitarios)
        .options(
            selectinload(TratamientosSanitarios.animal),
            selectinload(TratamientosSanitarios.medicamento),
            selectinload(TratamientosSanitarios.proveedor_medicamento),
            selectinload(TratamientosSanitarios.responsable_veterinario)
        )
    )
    return result.scalars().unique().all()

@router.get("/tratamientos_sanitarios/{tratamiento_id}", response_model=TratamientosSanitariosOut)
async def get_tratamiento_sanitario(tratamiento_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(TratamientosSanitarios)
        .where(TratamientosSanitarios.tratamiento_id == tratamiento_id)
        .options(
            selectinload(TratamientosSanitarios.animal),
            selectinload(TratamientosSanitarios.medicamento),
            selectinload(TratamientosSanitarios.proveedor_medicamento),
            selectinload(TratamientosSanitarios.responsable_veterinario)
        )
    )
    tratamiento = result.scalars().first()
    if not tratamiento:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail={"error": "Tratamiento sanitario no encontrado"})
    return tratamiento

@router.put("/tratamientos_sanitarios/{tratamiento_id}", response_model=TratamientosSanitariosOut)
async def update_tratamiento_sanitario(tratamiento_id: int, tratamiento_data: TratamientosSanitariosUpdate, db: AsyncSession = Depends(get_db)):
    # Obtener el tratamiento existente con sus relaciones cargadas
    result = await db.execute(
        select(TratamientosSanitarios)
        .where(TratamientosSanitarios.tratamiento_id == tratamiento_id)
        .options(
            selectinload(TratamientosSanitarios.animal),
            selectinload(TratamientosSanitarios.medicamento),
            selectinload(TratamientosSanitarios.proveedor_medicamento),
            selectinload(TratamientosSanitarios.responsable_veterinario)
        )
    )
    tratamiento = result.scalars().first()

    if not tratamiento:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail={"error": "Tratamiento sanitario no encontrado"})

    # Validar la existencia de las claves foráneas si se están actualizando
    if tratamiento_data.animal_id is not None and tratamiento_data.animal_id != tratamiento.animal_id:
        animal_exists = await db.scalar(select(Animal).where(Animal.animal_id == tratamiento_data.animal_id))
        if not animal_exists:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail={"error": f"Animal con ID {tratamiento_data.animal_id} no encontrado."})
    
    if tratamiento_data.medicamento_id is not None and tratamiento_data.medicamento_id != tratamiento.medicamento_id:
        medicamento_exists = await db.scalar(select(Medicamento).where(Medicamento.medicamento_id == tratamiento_data.medicamento_id))
        if not medicamento_exists:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail={"error": f"Medicamento con ID {tratamiento_data.medicamento_id} no encontrado."})
    
    if tratamiento_data.proveedor_medicamento_id is not None and tratamiento_data.proveedor_medicamento_id != tratamiento.proveedor_medicamento_id:
        proveedor_exists = await db.scalar(select(Proveedor).where(Proveedor.proveedor_id == tratamiento_data.proveedor_medicamento_id))
        if not proveedor_exists:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail={"error": f"Proveedor de medicamento con ID {tratamiento_data.proveedor_medicamento_id} no encontrado."})
    
    if tratamiento_data.responsable_veterinario_id is not None and tratamiento_data.responsable_veterinario_id != tratamiento.responsable_veterinario_id:
        veterinario_exists = await db.scalar(select(Usuario).where(Usuario.usuario_id == tratamiento_data.responsable_veterinario_id))
        if not veterinario_exists:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail={"error": f"Veterinario responsable con ID {tratamiento_data.responsable_veterinario_id} no encontrado."})


    update_data = tratamiento_data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(tratamiento, key, value)

    try:
        await db.commit()
        await db.refresh(tratamiento)
        return tratamiento
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
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail={"error": f"Error inesperado al actualizar tratamiento sanitario: {e}"})

@router.delete("/tratamientos_sanitarios/{tratamiento_id}")
async def delete_tratamiento_sanitario(tratamiento_id: int, db: AsyncSession = Depends(get_db)):
    tratamiento = await db.get(TratamientosSanitarios, tratamiento_id)
    if not tratamiento:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail={"error": "Tratamiento sanitario no encontrado"})

    await db.delete(tratamiento)
    await db.commit()
    return {"message": "Tratamiento sanitario eliminado correctamente"}