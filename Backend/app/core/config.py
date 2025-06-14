from pydantic_settings import BaseSettings
from typing import Optional
import os

class Settings(BaseSettings):
    """Application settings"""
    
    # API Settings
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "Body Sim Learner AI"
    
    # Model Settings
    MODEL_PATH: str = "models/bmnet.pth"
    DEVICE: str = "cuda" if os.system("nvidia-smi") == 0 else "cpu"
    
    # Image Processing Settings
    IMAGE_SIZE: tuple = (224, 224)
    MAX_IMAGE_SIZE: int = 10 * 1024 * 1024  # 10MB
    
    # Directories
    UPLOAD_DIR: str = "uploads"
    TEMP_DIR: str = "temp"
    
    class Config:
        env_file = ".env"

settings = Settings()

# Create directories if they don't exist
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
os.makedirs(settings.TEMP_DIR, exist_ok=True)
os.makedirs("models", exist_ok=True)