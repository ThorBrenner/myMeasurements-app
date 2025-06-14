from pydantic import BaseModel
from typing import Dict, Optional

class PredictionResponse(BaseModel):
    """Response model for predictions"""
    success: bool
    measurements: Dict[str, float]
    message: str
    confidence: Optional[float] = None

class ErrorResponse(BaseModel):
    """Error response model"""
    success: bool = False
    error: str
    detail: Optional[str] = None

class HealthResponse(BaseModel):
    """Health check response"""
    status: str
    model_loaded: bool
    version: str