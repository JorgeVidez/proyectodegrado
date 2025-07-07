from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.exc import IntegrityError
from typing import List
from app.database import get_db
from app.models.animal import Animal, EstadoAnimal
from app.schemas.animal import AnimalCreate, AnimalOut, AnimalUpdate, EspecieOut, RazaOut, AnimalSimpleOut
from pydantic import ValidationError
from sqlalchemy.orm import selectinload

router = APIRouter()

@router.post("/animal/", response_model=AnimalOut)
async def create_animal(data: AnimalCreate, db: AsyncSession = Depends(get_db)):
    try:
        animal = Animal(**data.dict())
        db.add(animal)
        await db.commit()
        await db.refresh(animal)

        result = await db.execute(select(Animal).options(
            selectinload(Animal.especie),
            selectinload(Animal.raza),
            selectinload(Animal.madre),
            selectinload(Animal.padre)
        ).where(Animal.animal_id == animal.animal_id))
        animal = result.scalars().first()

        especie_out = EspecieOut.from_orm(animal.especie)
        raza_out = RazaOut.from_orm(animal.raza)
        madre_out = AnimalSimpleOut.from_orm(animal.madre) if animal.madre else None
        padre_out = AnimalSimpleOut.from_orm(animal.padre) if animal.padre else None

        animal_out = AnimalOut.from_orm(animal)
        animal_out.especie = especie_out
        animal_out.raza = raza_out
        animal_out.madre = madre_out
        animal_out.padre = padre_out

        return animal_out

    except ValidationError as e:
        error_details = e.errors()
        for error in error_details:
            if error["loc"][0] == "estado_actual":
                error["valid_values"] = [e.value for e in EstadoAnimal]
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=error_details)
    except IntegrityError as e:
        await db.rollback()
        if "FOREIGN KEY" in str(e.orig):
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail={"error": "Error de clave foránea. Verifique las claves foráneas (especie_id, raza_id, madre_id, padre_id)."})
        elif "UNIQUE" in str(e.orig):
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail={"error": "Error de unicidad. El número de trazabilidad debe ser único."})
        elif "CHECK" in str(e.orig):
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail={"error": "Error de restricción de comprobación. Verifique el sexo (M o H) y el estado actual (Activo, Vendido, Muerto, Descartado)."})
        else:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail={"error": "Error de integridad de datos. Verifique los valores ingresados."})

@router.get("/animal/", response_model=List[AnimalOut])
async def get_animales(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Animal).options(
        selectinload(Animal.especie),
        selectinload(Animal.raza),
        selectinload(Animal.madre),
        selectinload(Animal.padre)
    ).order_by(Animal.fecha_registro.desc()))
    animales = result.scalars().all()
    animales_out = []
    for animal in animales:
        especie_out = EspecieOut.from_orm(animal.especie)
        raza_out = RazaOut.from_orm(animal.raza)
        madre_out = AnimalSimpleOut.from_orm(animal.madre) if animal.madre else None
        padre_out = AnimalSimpleOut.from_orm(animal.padre) if animal.padre else None

        animal_out = AnimalOut.from_orm(animal)
        animal_out.especie = especie_out
        animal_out.raza = raza_out
        animal_out.madre = madre_out
        animal_out.padre = padre_out
        animales_out.append(animal_out)
    return animales_out

@router.get("/animal/{animal_id}", response_model=AnimalOut)
async def get_animal(animal_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Animal).options(
        selectinload(Animal.especie),
        selectinload(Animal.raza),
        selectinload(Animal.madre),
        selectinload(Animal.padre)
    ).where(Animal.animal_id == animal_id))
    animal = result.scalars().first()
    if not animal:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail={"error": "Animal no encontrado"})

    especie_out = EspecieOut.from_orm(animal.especie)
    raza_out = RazaOut.from_orm(animal.raza)
    madre_out = AnimalSimpleOut.from_orm(animal.madre) if animal.madre else None
    padre_out = AnimalSimpleOut.from_orm(animal.padre) if animal.padre else None

    animal_out = AnimalOut.from_orm(animal)
    animal_out.especie = especie_out
    animal_out.raza = raza_out
    animal_out.madre = madre_out
    animal_out.padre = padre_out
    return animal_out

@router.put("/animal/{animal_id}", response_model=AnimalOut)
async def update_animal(animal_id: int, animal_data: AnimalUpdate, db: AsyncSession = Depends(get_db)):
    animal = await db.get(Animal, animal_id)
    if not animal:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail={"error": "Animal no encontrado"})

    update_data = animal_data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(animal, key, value)

    try:
        await db.commit()
        await db.refresh(animal)

        result = await db.execute(select(Animal).options(
            selectinload(Animal.especie),
            selectinload(Animal.raza),
            selectinload(Animal.madre),
            selectinload(Animal.padre)
        ).where(Animal.animal_id == animal.animal_id))
        animal = result.scalars().first()

        especie_out = EspecieOut.from_orm(animal.especie)
        raza_out = RazaOut.from_orm(animal.raza)
        madre_out = AnimalSimpleOut.from_orm(animal.madre) if animal.madre else None
        padre_out = AnimalSimpleOut.from_orm(animal.padre) if animal.padre else None

        animal_out = AnimalOut.from_orm(animal)
        animal_out.especie = especie_out
        animal_out.raza = raza_out
        animal_out.madre = madre_out
        animal_out.padre = padre_out
        return animal_out

    except ValidationError as e:
        error_details = e.errors()
        for error in error_details:
            if error["loc"][0] == "estado_actual":
                error["valid_values"] = [e.value for e in EstadoAnimal]
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=error_details)
    except IntegrityError as e:
        await db.rollback()
        if "FOREIGN KEY" in str(e.orig):
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail={"error": "Error de clave foránea. Verifique las claves foráneas (especie_id, raza_id, madre_id, padre_id)."})
        elif "UNIQUE" in str(e.orig):
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail={"error": "Error de unicidad. El número de trazabilidad debe ser único."})
        elif "CHECK" in str(e.orig):
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail={"error": "Error de restricción de comprobación. Verifique el sexo (M o H) y el estado actual (Activo, Vendido, Muerto, Descartado)."})
        else:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail={"error": "Error de integridad de datos. Verifique los valores ingresados."})

@router.delete("/animal/{animal_id}")
async def delete_animal(animal_id: int, db: AsyncSession = Depends(get_db)):
    animal = await db.get(Animal, animal_id)
    if not animal:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail={"error": "Animal no encontrado"})

    await db.delete(animal)
    await db.commit()
    return {"message": "Animal eliminado correctamente"}