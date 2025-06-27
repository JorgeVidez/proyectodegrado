from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.exc import IntegrityError
from typing import List
from app.database import get_db
from app.models.inventario_animal import InventarioAnimal, MotivoIngreso, MotivoEgreso
from app.schemas.inventario_animal import InventarioAnimalCreate, InventarioAnimalOut, InventarioAnimalUpdate
from pydantic import ValidationError
from sqlalchemy.orm import selectinload, joinedload
from app.models.animal import Animal
from datetime import date
from sqlalchemy import and_, or_

router = APIRouter(tags=["Inventario Animal"])

async def _get_inventario_with_relations(db: AsyncSession, inventario_id: int) -> InventarioAnimal:
    """Función auxiliar para cargar un inventario con todas sus relaciones."""
    result = await db.execute(
        select(InventarioAnimal)
        .where(InventarioAnimal.inventario_id == inventario_id)
        .options(
            selectinload(InventarioAnimal.animal)
            .selectinload(Animal.especie),
            selectinload(InventarioAnimal.animal)
            .selectinload(Animal.raza),
            selectinload(InventarioAnimal.proveedor_compra),
            selectinload(InventarioAnimal.ubicacion_actual),
            selectinload(InventarioAnimal.lote_actual),
        )
    )
    return result.scalars().first()

@router.post("/inventario_animal/", response_model=InventarioAnimalOut, status_code=status.HTTP_201_CREATED)
async def create_inventario_animal(
    data: InventarioAnimalCreate, 
    db: AsyncSession = Depends(get_db)
):
    try:
        # Validación adicional de datos
        if data.motivo_ingreso == MotivoIngreso.Compra and not data.proveedor_compra_id:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="proveedor_compra_id es requerido cuando motivo_ingreso es Compra"
            )
        
        if data.fecha_egreso and not data.motivo_egreso:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="motivo_egreso es requerido cuando fecha_egreso está presente"
            )

        # Crear el inventario
        inventario = InventarioAnimal(**data.dict())
        db.add(inventario)
        await db.commit()
        
        # Recargar con relaciones
        inventario = await _get_inventario_with_relations(db, inventario.inventario_id)
        if not inventario:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Inventario creado pero no se pudo cargar con sus relaciones"
            )
            
        return inventario

    except ValidationError as e:
        error_details = []
        for error in e.errors():
            if error["loc"][0] in ["motivo_ingreso", "motivo_egreso"]:
                error["valid_values"] = [e.value for e in (
                    MotivoIngreso if error["loc"][0] == "motivo_ingreso" else MotivoEgreso
                )]
            error_details.append(error)
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, 
            detail=error_details
        )
        
    except IntegrityError as e:
        await db.rollback()
        error_detail = {"error": "Error de integridad de datos"}
        
        if "FOREIGN KEY" in str(e.orig):
            error_detail["detail"] = "Error de clave foránea. Verifique las referencias a animal, proveedor, ubicación o lote."
        elif "UNIQUE" in str(e.orig):
            error_detail["detail"] = "El animal ya existe en el inventario activo."
        elif "CHECK" in str(e.orig):
            error_detail["detail"] = "Violación de restricción. Verifique las reglas de negocio."
            
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=error_detail
        )

@router.get("/inventario_animal/", response_model=List[InventarioAnimalOut])
async def get_inventario_animales(
    activo: bool = None,
    db: AsyncSession = Depends(get_db)
):
    query = select(InventarioAnimal)
    
    # Filtro para activos/inactivos
    if activo is not None:
        query = query.where(InventarioAnimal.activo_en_finca == activo)
    
    result = await db.execute(
        query.options(
            selectinload(InventarioAnimal.animal)
            .selectinload(Animal.especie),
            selectinload(InventarioAnimal.animal)
            .selectinload(Animal.raza),
            selectinload(InventarioAnimal.proveedor_compra),
            selectinload(InventarioAnimal.ubicacion_actual),
            selectinload(InventarioAnimal.lote_actual),
        )
        .order_by(InventarioAnimal.fecha_ingreso.desc())
    )
    return result.scalars().all()

@router.get("/inventario_animal/{inventario_id}", response_model=InventarioAnimalOut)
async def get_inventario_animal(
    inventario_id: int, 
    db: AsyncSession = Depends(get_db)
):
    inventario = await _get_inventario_with_relations(db, inventario_id)
    if not inventario:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Inventario de animal no encontrado"
        )
    return inventario

@router.put("/inventario_animal/{inventario_id}", response_model=InventarioAnimalOut)
async def update_inventario_animal(
    inventario_id: int, 
    data: InventarioAnimalUpdate, 
    db: AsyncSession = Depends(get_db)
):
    # Cargar el inventario existente con relaciones
    inventario = await _get_inventario_with_relations(db, inventario_id)
    if not inventario:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Inventario de animal no encontrado"
        )

    # Validación de transición de estado
    if data.fecha_egreso and not inventario.fecha_egreso:
        if not data.motivo_egreso:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="motivo_egreso es requerido al registrar fecha_egreso"
            )
        data.activo_en_finca = False

    # Actualizar campos
    update_data = data.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(inventario, key, value)

    try:
        await db.commit()
        await db.refresh(inventario)
        return inventario
    except IntegrityError as e:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Error de integridad de datos: {str(e)}"
        )

@router.delete("/inventario_animal/{inventario_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_inventario_animal(
    inventario_id: int, 
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(InventarioAnimal)
        .where(InventarioAnimal.inventario_id == inventario_id)
    )
    inventario = result.scalars().first()

    if not inventario:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Inventario de animal no encontrado"
        )

    await db.delete(inventario)
    await db.commit()

@router.get("/inventario_animal/lote/{lote_id}", response_model=List[InventarioAnimalOut])
async def get_inventario_animal_by_lote(
    lote_id: int, 
    activo: bool = True,
    db: AsyncSession = Depends(get_db)
):
    query = select(InventarioAnimal).where(
        and_(
            InventarioAnimal.lote_actual_id == lote_id,
            InventarioAnimal.activo_en_finca == activo
        )
    )

    result = await db.execute(
        query.options(
            selectinload(InventarioAnimal.animal)
            .selectinload(Animal.especie),
            selectinload(InventarioAnimal.animal)
            .selectinload(Animal.raza),
            selectinload(InventarioAnimal.proveedor_compra),
            selectinload(InventarioAnimal.ubicacion_actual),
            selectinload(InventarioAnimal.lote_actual),
        )
        .order_by(InventarioAnimal.fecha_ingreso.desc())
    )
    
    inventarios = result.scalars().all()
    
    if not inventarios and activo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No se encontraron animales activos en el lote {lote_id}"
        )
        
    return inventarios

@router.get("/inventario_animal/animal/{animal_id}", response_model=List[InventarioAnimalOut])
async def get_historial_animal(
    animal_id: int,
    db: AsyncSession = Depends(get_db)
):
    """Obtiene todo el historial de un animal en el inventario"""
    result = await db.execute(
        select(InventarioAnimal)
        .where(InventarioAnimal.animal_id == animal_id)
        .options(
            selectinload(InventarioAnimal.animal)
            .selectinload(Animal.especie),
            selectinload(InventarioAnimal.animal)
            .selectinload(Animal.raza),
            selectinload(InventarioAnimal.proveedor_compra),
            selectinload(InventarioAnimal.ubicacion_actual),
            selectinload(InventarioAnimal.lote_actual),
        )
        .order_by(InventarioAnimal.fecha_ingreso.desc())
    )
    
    historial = result.scalars().all()
    if not historial:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No se encontró historial para el animal {animal_id}"
        )
        
    return historial