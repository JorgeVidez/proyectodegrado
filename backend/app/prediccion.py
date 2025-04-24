import pandas as pd
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import pickle
import time
import joblib

router = APIRouter()

# Variables para almacenar el modelo cargado y el tiempo de carga
modelo = None
tiempo_carga = None

# Función para cargar el modelo (carga diferida)
def cargar_modelo():
    global modelo, tiempo_carga
    if modelo is None:
        try:
            start_time = time.time()
            modelo = joblib.load('models/modelo_ganado_faenado.pkl')
            end_time = time.time()
            tiempo_carga = end_time - start_time
            print(f"Modelo cargado. Tiempo de carga: {tiempo_carga:.4f} segundos")
        except FileNotFoundError:
            raise RuntimeError("El archivo 'models/modelo_ganado_faenado.pkl' no se encontró .")

class PrediccionEntrada(BaseModel):
    fecha: str  # Formato: 'YYYY-MM-DD'

class PrediccionSalida(BaseModel):
    ganado_faenado: float

@router.post('/predecir', response_model=PrediccionSalida)
async def predecir(entrada: PrediccionEntrada):
    """Realiza una predicción de ganado faenado para una fecha dada."""
    try:
        cargar_modelo()  # Cargar el modelo si aún no se ha cargado
        fecha_ordinal = pd.to_datetime(entrada.fecha).toordinal()
        ganado_predicho = modelo.predict([[fecha_ordinal]])[0]
        return {'ganado_faenado': ganado_predicho}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))