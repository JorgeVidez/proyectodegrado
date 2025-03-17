from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import joblib
import pandas as pd
import time

router = APIRouter()

# Variable para almacenar el modelo cargado
modelo = None
tiempo_carga = None

# Definir el modelo de datos de entrada
class DatosEntrada(BaseModel):
    Precio_del_Ganado_Vivo: float
    Precio_de_la_Carne: float
    Datos_Historicos_de_Venta: int
    Precio_de_Venta_del_Ganado: float
    Publicidad: int

# Función para cargar el modelo (carga diferida)
def cargar_modelo():
    global modelo, tiempo_carga
    if modelo is None:
        try:
            start_time = time.time()
            modelo = joblib.load('models/modelo_ganado.joblib')
            end_time = time.time()
            tiempo_carga = end_time - start_time
            print(f"Modelo cargado. Tiempo de carga: {tiempo_carga:.4f} segundos")
        except FileNotFoundError:
            raise RuntimeError("El archivo 'modelo_ganado.joblib' no se encontró.")

# Ruta para hacer predicciones
@router.post("/prediccion/ganado/", tags=["Predicciones"])
async def predecir(datos: DatosEntrada):
    try:
        # Cargar el modelo si aún no se ha cargado
        cargar_modelo()

        # Convertir los datos de entrada a un DataFrame de pandas
        df = pd.DataFrame([datos.dict()])

        # Imprimir las columnas del DataFrame recibido
        print("Columnas del DataFrame recibido:", df.columns)

        # Imprimir los datos recibidos
        print("Datos recibidos:", datos.dict())

        # Hacer la predicción
        prediccion = modelo.predict(df)

        # Imprimir la predicción
        print("Predicción:", prediccion[0])

        # Devolver la predicción
        return {"prediccion": prediccion[0]}
    except Exception as e:
        print(f"Error durante la predicción: {e}")  # Imprimir el error
        raise HTTPException(status_code=500, detail=str(e))