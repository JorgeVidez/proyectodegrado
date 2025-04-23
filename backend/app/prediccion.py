import pandas as pd
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import pickle
import time
import joblib

router = APIRouter()


with open("models/svr_model.pkl", "rb") as f:
    model_data = pickle.load(f)

model_svr = model_data["model"]
scaler_X = model_data["scaler_X"]
scaler_y = model_data["scaler_y"]


class PredictionRequest(BaseModel):
    date: str

class PredictionResponse(BaseModel):
    prediction: float

@router.post("/predict", response_model=PredictionResponse)
async def predict(request: PredictionRequest):
    try:
        date_ordinal = pd.to_datetime(request.date).toordinal()
        date_ordinal_scaled = scaler_X.transform([[date_ordinal]])
        prediction_scaled = model_svr.predict(date_ordinal_scaled)
        prediction = scaler_y.inverse_transform(prediction_scaled.reshape(-1, 1)).flatten()[0]
        return {"prediction": prediction}
    except Exception as e:
        return {"prediction": None}