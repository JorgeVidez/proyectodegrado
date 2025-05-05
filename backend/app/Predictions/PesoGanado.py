from pydantic import BaseModel, confloat
from datetime import date
from typing import Literal, Optional
import joblib
import numpy as np
from fastapi import APIRouter, HTTPException, status
import json
import logging
from pathlib import Path

# Configurar logging
logger = logging.getLogger(__name__)

# Definir tipos de ganado conocidos (ajusta según tus necesidades)
TIPOS_GANADO = ["Vaca", "Toro", "Torillo", "Novillo", "Vaquilla", "T.Buey"]

class ItemPrediccion(BaseModel):
    """Esquema para los datos de entrada de predicción"""
    edad: confloat(gt=0, le=20)  # type: ignore # Validación: edad entre 0 y 20 años
    fecha: date
    tipo: Literal[tuple(TIPOS_GANADO)]  # type: ignore # Solo valores permitidos
    
class PrediccionResponse(BaseModel):
    """Esquema para la respuesta de predicción"""
    precio_predicho: float
    confianza: Optional[float] = None  # Podrías añadir métricas de confianza
    metadatos: dict
    
    
# Router para los endpoints
router = APIRouter(
    prefix="/modelo-peso",
    tags=["Modelo Predictivo de Peso"],
    responses={404: {"description": "No encontrado"}}
)

# Variables globales para los modelos
modelo = None
escalador = None
label_encoder = None
metadatos = None

def cargar_modelos():
    """Carga los modelos y transformadores necesarios"""
    global modelo, escalador, label_encoder, metadatos
    
    try:
        model_path = Path("models/ModeloPesoGanado/")
        
        # Cargar con verificación de existencia
        if not model_path.exists():
            raise FileNotFoundError(f"Directorio de modelos no encontrado: {model_path}")
            
        modelo = joblib.load(model_path / "modelo_svr.pkl")
        escalador = joblib.load(model_path / "escalador.pkl")
        label_encoder = joblib.load(model_path / "label_encoder_tipo.pkl")
        
        with open(model_path / "metadata_modelo.json") as f:
            metadatos = json.load(f)
            
        logger.info("✅✅ Modelos cargados correctamente")
        return True
    except Exception as e:
        logger.error(f"❌ Error cargando modelos: {str(e)}", exc_info=True)
        raise

@router.on_event("startup")
async def startup_event():
    """Evento para cargar los modelos al iniciar la aplicación"""
    try:
        cargar_modelos()
    except Exception as e:
        logger.critical("No se pudo cargar el modelo. La API no funcionará correctamente.")
        # Aquí podrías decidir si quieres que la aplicación falle completamente o no

@router.post(
    '/predecir-peso', 
    response_model=PrediccionResponse,
    summary="Predecir peso del ganado",
    description="""Endpoint para predecir el peso vivo del ganado basado en:
    - Edad del animal (en años)
    - Fecha de estimación
    - Tipo de ganado""",
    response_description="Objeto con la predicción y metadatos del modelo"
)
async def predecir_peso(item: ItemPrediccion):
    """
    Realiza una predicción del peso vivo del ganado usando un modelo SVR.
    
    Parámetros:
    - edad: Edad del animal en años (0-20)
    - fecha: Fecha para la predicción (formato YYYY-MM-DD)
    - tipo: Tipo de ganado (Vaca, Toro, Becerro, etc.)
    
    Retorna:
    - precio_predicho: Valor estimado del peso
    - metadatos: Información sobre el modelo usado
    """
    try:
        # Verificar que los modelos estén cargados
        if None in (modelo, escalador, label_encoder):
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Modelo no cargado. Intente nuevamente más tarde."
            )
        
        # Convertir fecha a ordinal
        fecha_ordinal = item.fecha.toordinal()
        
        # Codificar tipo con manejo de errores
        try:
            tipo_encoded = label_encoder.transform([item.tipo])[0]
        except ValueError as e:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail=f"Tipo de ganado no válido. Opciones permitidas: {TIPOS_GANADO}"
            )
        
        # Crear array de características con validación
        try:
            features = np.array([[item.edad, fecha_ordinal, tipo_encoded]], dtype=np.float64)
        except Exception as e:
            logger.error(f"Error creando array de features: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Error procesando los datos de entrada"
            )
        
        # Escalar características
        try:
            features_scaled = escalador.transform(features)
        except Exception as e:
            logger.error(f"Error escalando features: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Error procesando los datos (escalado)"
            )
        
        # Predecir
        try:
            prediccion = modelo.predict(features_scaled)[0]
            logger.info(f"Predicción realizada: {prediccion} para {item}")
        except Exception as e:
            logger.error(f"Error en predicción: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Error al realizar la predicción"
            )
        
        return {
            "precio_predicho": float(prediccion),
            "metadatos": {
                "modelo": metadatos.get("model_type", "SVR"),
                "precision_r2": metadatos.get("r2", None),
                "ultimo_entrenamiento": metadatos.get("creation_date", None),
                "variables": metadatos.get("features", [])
            }
        }
        
    except HTTPException:
        # Re-lanzar excepciones HTTP que ya hemos manejado
        raise
    except Exception as e:
        logger.error(f"Error inesperado: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error interno del servidor"
        )

@router.get("/metadatos-modelo", summary="Obtener metadatos del modelo")
async def obtener_metadatos():
    """Endpoint para obtener información sobre el modelo cargado"""
    if metadatos is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Modelo no cargado"
        )
    return metadatos