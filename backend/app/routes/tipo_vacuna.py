from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.exc import IntegrityError
from app.database import get_db
from app.models.tipo_vacuna import TipoVacuna
from app.models.especie import Especie
from app.schemas.tipo_vacuna import TipoVacunaCreate, TipoVacunaUpdate, TipoVacunaOut
from typing import List
from sqlalchemy.orm import selectinload

router = APIRouter()

# ✅ Obtener todos los tipos de vacuna
@router.get("/tipos_vacuna/", response_model=List[TipoVacunaOut])
async def get_tipos_vacuna(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(TipoVacuna).options(selectinload(TipoVacuna.especie_destino)))
    tipos_vacuna = result.scalars().all()
    return [TipoVacunaOut.from_orm(tipo_vacuna) for tipo_vacuna in tipos_vacuna]

# ✅ Obtener un tipo de vacuna por ID
@router.get("/tipos_vacuna/{tipo_vacuna_id}", response_model=TipoVacunaOut)
async def get_tipo_vacuna(tipo_vacuna_id: int, db: AsyncSession = Depends(get_db)):
    tipo_vacuna = await db.get(TipoVacuna, tipo_vacuna_id, options=[selectinload(TipoVacuna.especie_destino)])
    if not tipo_vacuna:
        raise HTTPException(status_code=404, detail={"error": "Tipo de vacuna no encontrado"})
    return TipoVacunaOut.from_orm(tipo_vacuna)

# ✅ Crear un nuevo tipo de vacuna
@router.post("/tipos_vacuna/", response_model=TipoVacunaOut)
async def create_tipo_vacuna(data: TipoVacunaCreate, db: AsyncSession = Depends(get_db)):
    try:
        #Verificar existencia de especie_destino_id
        if data.especie_destino_id is not None:
            especie = await db.get(Especie, data.especie_destino_id)
            if not especie:
                raise HTTPException(status_code=400, detail={"error": "Especie de destino no encontrada, verifique el especie_destino_id."})

        result = await db.execute(select(TipoVacuna).where(TipoVacuna.nombre_vacuna == data.nombre_vacuna, TipoVacuna.laboratorio == data.laboratorio))
        if result.scalars().first():
            raise HTTPException(status_code=400, detail={"error": "Ya existe una vacuna con el mismo nombre y laboratorio"})

        tipo_vacuna = TipoVacuna(**data.model_dump())
        db.add(tipo_vacuna)
        await db.commit()
        await db.refresh(tipo_vacuna)
        return TipoVacunaOut.from_orm(tipo_vacuna)
    except IntegrityError:
        await db.rollback()
        raise HTTPException(status_code=400, detail={"error": "Error de integridad, verifique los datos."})
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=500, detail={"error": str(e)})

# ✅ Actualizar tipo de vacuna
@router.put("/tipos_vacuna/{tipo_vacuna_id}", response_model=TipoVacunaOut)
async def update_tipo_vacuna(tipo_vacuna_id: int, tipo_vacuna_data: TipoVacunaUpdate, db: AsyncSession = Depends(get_db)):
    tipo_vacuna = await db.get(TipoVacuna, tipo_vacuna_id)
    if not tipo_vacuna:
        raise HTTPException(status_code=404, detail={"error": "Tipo de vacuna no encontrado"})

    #Verificar existencia de especie_destino_id
    if tipo_vacuna_data.especie_destino_id is not None:
        especie = await db.get(Especie, tipo_vacuna_data.especie_destino_id)
        if not especie:
            raise HTTPException(status_code=400, detail={"error": "Especie de destino no encontrada, verifique el especie_destino_id."})

    update_data = tipo_vacuna_data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(tipo_vacuna, key, value)

    await db.commit()
    await db.refresh(tipo_vacuna)
    return TipoVacunaOut.from_orm(tipo_vacuna)

# ✅ Eliminar tipo de vacuna
@router.delete("/tipos_vacuna/{tipo_vacuna_id}")
async def delete_tipo_vacuna(tipo_vacuna_id: int, db: AsyncSession = Depends(get_db)):
    tipo_vacuna = await db.get(TipoVacuna, tipo_vacuna_id)
    if not tipo_vacuna:
        raise HTTPException(status_code=404, detail={"error": "Tipo de vacuna no encontrado"})

    await db.delete(tipo_vacuna)
    await db.commit()
    return {"message": "Tipo de vacuna eliminado correctamente"}