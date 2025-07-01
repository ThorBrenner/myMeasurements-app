import torch
import numpy as np
import logging
from typing import Dict
import os
from ..models.bmnet import BMnet
from ..core.config import settings

logger = logging.getLogger(__name__)

class PredictionService:
    """Service for body measurement predictions"""

    def __init__(self):
        self.model = None
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.measurement_columns = [
            'ankle', 'arm-length', 'bicep', 'calf', 'chest', 'forearm',
            'height', 'hip', 'leg-length', 'shoulder-breadth',
            'shoulder-to-crotch', 'thigh', 'waist', 'wrist'
        ]
        logger.info(f"Using device: {self.device}")

    async def initialize(self):
        """Initialize the prediction service and load model"""
        try:
            await self._load_model()
            logger.info("Prediction service initialized successfully")
        except Exception as e:
            logger.error(f"Failed to initialize prediction service: {e}")
            raise

    async def _load_model(self):
        """Load the trained BMnet model"""
        try:
            model_path = settings.MODEL_PATH

            if not os.path.exists(model_path):
                raise FileNotFoundError(f"Model file not found at {model_path}")

            self.model = BMnet().to(self.device)
            state_dict = torch.load(model_path, map_location=self.device)
            self.model.load_state_dict(state_dict)
            self.model.eval()

            logger.info(f"Model loaded successfully from {model_path}")

        except Exception as e:
            logger.error(f"Error loading model: {e}")
            raise RuntimeError(f"Failed to load model from {settings.MODEL_PATH}") from e

    def is_model_loaded(self) -> bool:
        """Check if model is loaded"""
        return self.model is not None

    async def predict(
        self,
        front_tensor: torch.Tensor,
        side_tensor: torch.Tensor,
        height: float,
        weight: float
    ) -> Dict[str, float]:
        try:
            if self.model is None:
                raise RuntimeError("Model not loaded")

            front_tensor = front_tensor.unsqueeze(0).to(self.device)
            side_tensor = side_tensor.unsqueeze(0).to(self.device)
            height_weight = torch.tensor([[height, weight]], dtype=torch.float32).to(self.device)

            with torch.no_grad():
                predictions = self.model((front_tensor, side_tensor, height_weight))
                predictions = predictions.cpu().numpy().flatten()

            measurements = {
                column: float(predictions[i])
                for i, column in enumerate(self.measurement_columns)
            }

            measurements = self._post_process_predictions(measurements, height, weight)
            return measurements

        except Exception as e:
            logger.error(f"Error making prediction: {e}")
            raise

    def _post_process_predictions(
        self,
        measurements: Dict[str, float],
        height: float,
        weight: float
    ) -> Dict[str, float]:
        """Post-process predictions to ensure reasonable values"""
        try:
            for key in measurements:
                measurements[key] = max(0.1, measurements[key])

            if 'height' in measurements:
                height_diff = abs(measurements['height'] - height)
                if height_diff > 20:
                    measurements['height'] = height

            if 'chest' in measurements and 'waist' in measurements:
                if measurements['waist'] > measurements['chest']:
                    measurements['chest'], measurements['waist'] = measurements['waist'], measurements['chest']

            for key in measurements:
                measurements[key] = round(measurements[key], 1)

            return measurements

        except Exception as e:
            logger.error(f"Error post-processing predictions: {e}")
            return measurements
