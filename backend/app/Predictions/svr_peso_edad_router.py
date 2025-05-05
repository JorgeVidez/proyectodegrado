from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, confloat
import joblib
import numpy as np
from pathlib import Path
import json
import logging
from datetime import date
from dateutil.relativedelta import relativedelta

# Configuración
logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/svr-peso-edad",
    tags=["SVR - Peso por Edad"],
    responses={404: {"description": "No encontrado"}}
)

# Modelo global
model_data = None
graph_data = None

class SvrPesoEdadInput(BaseModel):
    fecha_nacimiento: date
    fecha_control: date

class SvrPesoEdadResponse(BaseModel):
    peso_predicho: float
    edad_meses: float
    metadatos: dict

def calcular_edad_meses(fecha_nac: date, fecha_control: date) -> float:
    """Calcula la edad en meses con decimales"""
    delta = relativedelta(fecha_control, fecha_nac)
    return delta.years * 12 + delta.months + delta.days / 30.44  # Aprox. días a meses

def cargar_modelo_peso_edad():
    global model_data, graph_data
    
    try:
        model_path = Path("models/ModeloSVRPesoEdad/")
        
        # Cargar modelo y escaladores
        model_data = joblib.load(model_path / "modelo_svr_peso_edad.pkl")
        
        # Cargar datos para gráficos
        with open(model_path / "modelo_svr_peso_edad_graph_data.json") as f:
            graph_data = json.load(f)
            
        logger.info("✅ Modelo SVR de peso por edad cargado correctamente")
    except Exception as e:
        logger.error(f"❌ Error cargando modelo SVR peso-edad: {str(e)}", exc_info=True)
        raise

@router.on_event("startup")
async def startup_event():
    try:
        cargar_modelo_peso_edad()
    except Exception as e:
        logger.critical("No se pudo cargar el modelo SVR peso-edad")

@router.post(
    "/predecir",
    response_model=SvrPesoEdadResponse,
    summary="Predecir peso basado en edad con SVR",
    description="Predice el peso del animal usando Support Vector Regression basado en su edad"
)
async def predecir_peso_edad(datos: SvrPesoEdadInput):
    try:
        if not model_data:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Modelo SVR no cargado"
            )
        
        # Calcular edad en meses
        edad_meses = calcular_edad_meses(datos.fecha_nacimiento, datos.fecha_control)
        
        # Validar rango de edad (0-36 meses en este caso)
        if edad_meses < 0 or edad_meses > 36:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Edad fuera del rango modelado (0-36 meses)"
            )
        
        # Preparar entrada
        edad_array = np.array([[edad_meses]])
        
        # Escalar y predecir
        edad_scaled = model_data['scaler_X'].transform(edad_array)
        peso_scaled = model_data['model'].predict(edad_scaled)
        peso = model_data['scaler_y'].inverse_transform(
            peso_scaled.reshape(-1, 1)
        )[0][0]
        
        return {
            "peso_predicho": float(peso),
            "edad_meses": float(edad_meses),
            "metadatos": {
                "modelo": "Support Vector Regression (SVR)",
                "kernel": "rbf",
                "precision_r2": graph_data["metrics"]["r2"] if graph_data else None,
                "error_mse": graph_data["metrics"]["mse"] if graph_data else None,
                "rango_edad_meses": "0-36"  # Ajustar según tu modelo
            }
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error en predicción SVR peso-edad: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error al realizar la predicción"
        )

@router.get("/metadatos")
async def obtener_metadatos_peso_edad():
    if not graph_data:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Datos no cargados"
        )
    
    return {
        "modelo": "Support Vector Regression",
        "kernel": "rbf",
        "metricas": graph_data.get("metrics", {}),
        "muestra_datos": {
            "edades_meses": graph_data.get("X_test", [])[:20],
            "pesos_kg": graph_data.get("y_test", [])[:20],
            "predicciones": graph_data.get("y_pred", [])[:20]
                      
            
        },
        "rango_edad": "0-36 meses"  # Ajustar según tu modelo
    }