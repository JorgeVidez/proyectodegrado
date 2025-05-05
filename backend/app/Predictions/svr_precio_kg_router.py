from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, confloat
import joblib
import numpy as np
from pathlib import Path
import json
import logging

# Configuración
logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/svr-precio-kg",
    tags=["SVR - Precio por Kilogramo"],
    responses={404: {"description": "No encontrado"}}
)

# Modelo global
model_data = None
graph_data = None

class SvrPrecioKgInput(BaseModel):
    peso_venta_kg: confloat(gt=50, le=800) # type: ignore

class SvrPrecioKgResponse(BaseModel):
    precio_por_kg: float
    metadatos: dict

def cargar_modelo_svr():
    global model_data, graph_data
    
    try:
        model_path = Path("models/ModeloSVRPrecioKg/")
        
        # Cargar modelo y escaladores
        model_data = joblib.load(model_path / "modelo_svr_precio_kg.pkl")
        
        # Cargar datos para gráficos
        with open(model_path / "modelo_svr_precio_kg_graph_data.json") as f:
            graph_data = json.load(f)
            
        logger.info("✅ Modelo SVR de precio por kg cargado correctamente")
    except Exception as e:
        logger.error(f"❌ Error cargando modelo SVR: {str(e)}", exc_info=True)
        raise

@router.on_event("startup")
async def startup_event():
    try:
        cargar_modelo_svr()
    except Exception as e:
        logger.critical("No se pudo cargar el modelo SVR")

@router.post(
    "/predecir_precio",
    response_model=SvrPrecioKgResponse,
    summary="Predecir precio por kg con SVR",
    description="Predice el precio por kilogramo usando Support Vector Regression"
)
async def predecir_precio_svr(datos: SvrPrecioKgInput):
    try:
        if not model_data:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Modelo SVR no cargado"
            )
        
        # Preparar entrada
        peso_array = np.array([[datos.peso_venta_kg]])
        
        # Escalar y predecir
        peso_scaled = model_data['scaler_X'].transform(peso_array)
        precio_scaled = model_data['model'].predict(peso_scaled)
        precio = model_data['scaler_y'].inverse_transform(
            precio_scaled.reshape(-1, 1)
        )[0][0]
        
        return {
            "precio_por_kg": float(precio),
            "metadatos": {
                "modelo": "Support Vector Regression (SVR)",
                "kernel": "rbf",
                "precision_r2": graph_data["metrics"]["r2"] if graph_data else None,
                "error_mse": graph_data["metrics"]["mse"] if graph_data else None
            }
        }
        
    except Exception as e:
        logger.error(f"Error en predicción SVR: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error al realizar la predicción"
        )

@router.get("/metadatos")
async def obtener_metadatos_svr():
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
            "pesos": graph_data.get("X_test", [])[:20],
            "precios": graph_data.get("y_test", [])[:20]
        }
    }