from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn
import os
from typing import Optional
import logging
from io import BytesIO
from PIL import Image
import numpy as np
import torch

from .services.prediction_service import PredictionService
from .services.image_service import ImageService
from .models.schemas import PredictionResponse, ErrorResponse
from .core.config import settings

from app.routers import auth
from app.models.database import Base, engine

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="Body Sim Learner AI API",
    description="API para predição de medidas corporais usando machine learning",
    version="1.0.0"
)

app.include_router(auth.router)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
prediction_service = PredictionService()
image_service = ImageService()

@app.on_event("startup")
async def startup_event():
    """Initialize services on startup"""
    try:
        await prediction_service.initialize()
        logger.info("Prediction service initialized successfully")
    except Exception as e:
        logger.error(f"Failed to initialize prediction service: {e}")
        raise

@app.get("/")
async def root():
    """Health check endpoint"""
    return {"message": "Body Sim Learner AI API is running"}

@app.get("/health")
async def health_check():
    """Detailed health check"""
    return {
        "status": "healthy",
        "model_loaded": prediction_service.is_model_loaded(),
        "version": "1.0.0"
    }

@app.post("/predict", response_model=PredictionResponse)
async def predict_measurements(
    image: UploadFile = File(..., description="Imagem da pessoa (frente)"),
    height: float = Form(..., description="Altura em centímetros"),
    weight: float = Form(..., description="Peso em quilogramas")
):
    """
    Prediz medidas corporais baseado na imagem e dados físicos
    """
    try:
        if not image.content_type.startswith('image/'):
            raise HTTPException(status_code=400, detail="Arquivo deve ser uma imagem")

        if height <= 0 or height > 300:
            raise HTTPException(status_code=400, detail="Altura deve estar entre 1 e 300 cm")

        if weight <= 0 or weight > 500:
            raise HTTPException(status_code=400, detail="Peso deve estar entre 1 e 500 kg")

        image_data = await image.read()
        processed_image = await image_service.process_image(image_data)

        measurements = await prediction_service.predict(
            processed_image, height, weight
        )

        return PredictionResponse(
            success=True,
            measurements=measurements,
            message="Predição realizada com sucesso"
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in prediction: {e}")
        raise HTTPException(
            status_code=500, 
            detail=f"Erro interno do servidor: {str(e)}"
        )

@app.post("/predict-multi")
async def predict_with_two_images(
    front: UploadFile = File(...),
    side: UploadFile = File(...),
    height: float = Form(...),
    weight: float = Form(...)
):
    """
    Predição com duas imagens (frontal e lateral)
    """
    try:
        front_data = await front.read()
        side_data = await side.read()

        front_image = await image_service.process_image(front_data)
        side_image = await image_service.process_image(side_data)

        if front_image.shape[1:] != side_image.shape[1:]:
            raise HTTPException(status_code=400, detail="As imagens devem ter a mesma altura e largura")

        # Concatena ao longo da largura (dimensão W)
        combined_image = np.concatenate(
            (front_image.numpy(), side_image.numpy()), axis=2
        )

        combined_tensor = torch.tensor(combined_image, dtype=torch.float32).unsqueeze(0)

        measurements = await prediction_service.predict(
            combined_tensor.squeeze(0), height, weight
        )

        return {
            "success": True,
            "measurements": measurements,
            "message": "Predição com duas imagens realizada com sucesso"
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Erro na predição com duas imagens: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/segment")
async def segment_image(
    image: UploadFile = File(..., description="Imagem para segmentação")
):
    """
    Endpoint para testar apenas a segmentação de imagem
    """
    try:
        if not image.content_type.startswith('image/'):
            raise HTTPException(status_code=400, detail="Arquivo deve ser uma imagem")

        image_data = await image.read()
        processed_image = await image_service.process_image(image_data)

        return {
            "success": True,
            "message": "Imagem segmentada com sucesso",
            "image_shape": processed_image.shape if hasattr(processed_image, 'shape') else None
        }

    except Exception as e:
        logger.error(f"Error in segmentation: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Erro na segmentação: {str(e)}"
        )

if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )



@app.on_event("startup")
async def create_db_tables():
    Base.metadata.create_all(bind=engine)

