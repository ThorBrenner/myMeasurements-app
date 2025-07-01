from pydantic import BaseModel
from typing import Dict, Optional
from pydantic import BaseModel, EmailStr
from datetime import datetime

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

class UserBase(BaseModel):
    email: EmailStr
    name: str

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserInDB(UserBase):
    id: str
    hashed_password: str

class UserResponse(UserBase):
    id: str

class BodyMeasurementBase(BaseModel):
    height_cm: Optional[float] = None
    weight_kg: Optional[float] = None
    chest_cm: Optional[float] = None
    waist_cm: Optional[float] = None
    hip_cm: Optional[float] = None
    thigh_cm: Optional[float] = None
    bicep_cm: Optional[float] = None
    ankle_cm: Optional[float] = None
    arm_length_cm: Optional[float] = None
    calf_cm: Optional[float] = None
    forearm_cm: Optional[float] = None
    leg_length_cm: Optional[float] = None
    shoulder_breadth_cm: Optional[float] = None
    shoulder_to_crotch_cm: Optional[float] = None
    wrist_cm: Optional[float] = None

class BodyMeasurementCreate(BodyMeasurementBase):
    pass

class BodyMeasurementResponse(BodyMeasurementBase):
    id: str
    user_id: str
    timestamp: datetime

    class Config:
        orm_mode = True


