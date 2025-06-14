import torch
import numpy as np
import logging
from typing import Dict, Tuple
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
                logger.warning(f"Model file not found at {model_path}")
                logger.info("Creating dummy model for testing purposes")
                self.model = BMnet().to(self.device)
                self.model.eval()
                return
            
            # Load model
            self.model = BMnet().to(self.device)
            
            # Load state dict
            state_dict = torch.load(model_path, map_location=self.device)
            self.model.load_state_dict(state_dict)
            
            # Set to evaluation mode
            self.model.eval()
            
            logger.info(f"Model loaded successfully from {model_path}")
            
        except Exception as e:
            logger.error(f"Error loading model: {e}")
            # Create dummy model for testing
            logger.info("Creating dummy model for testing purposes")
            self.model = BMnet().to(self.device)
            self.model.eval()
    
    def is_model_loaded(self) -> bool:
        """Check if model is loaded"""
        return self.model is not None
    
    async def predict(
        self, 
        image_tensor: torch.Tensor, 
        height: float, 
        weight: float
    ) -> Dict[str, float]:
        """
        Make prediction for body measurements
        
        Args:
            image_tensor: Processed image tensor
            height: Height in centimeters
            weight: Weight in kilograms
            
        Returns:
            Dictionary with predicted measurements
        """
        try:
            if self.model is None:
                raise RuntimeError("Model not loaded")
            
            # Prepare input
            image_batch = image_tensor.unsqueeze(0).to(self.device)  # Add batch dimension
            height_weight = torch.tensor([[height, weight]], dtype=torch.float32).to(self.device)
            
            # Make prediction
            with torch.no_grad():
                predictions = self.model((image_batch, height_weight))
                predictions = predictions.cpu().numpy().flatten()
            
            # Convert to dictionary
            measurements = {}
            for i, column in enumerate(self.measurement_columns):
                measurements[column] = float(predictions[i])
            
            # Add some basic validation/post-processing
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
        """
        Post-process predictions to ensure reasonable values
        """
        try:
            # Ensure all measurements are positive
            for key in measurements:
                measurements[key] = max(0.1, measurements[key])
            
            # Apply some basic sanity checks
            # Height should be close to input height
            if 'height' in measurements:
                # Allow some variation but keep it reasonable
                height_diff = abs(measurements['height'] - height)
                if height_diff > 20:  # More than 20cm difference
                    measurements['height'] = height
            
            # Chest should generally be larger than waist
            if 'chest' in measurements and 'waist' in measurements:
                if measurements['waist'] > measurements['chest']:
                    # Swap if waist is larger than chest (unusual)
                    measurements['chest'], measurements['waist'] = measurements['waist'], measurements['chest']
            
            # Round to reasonable precision
            for key in measurements:
                measurements[key] = round(measurements[key], 1)
            
            return measurements
            
        except Exception as e:
            logger.error(f"Error post-processing predictions: {e}")
            return measurements
    
    def _generate_dummy_predictions(self, height: float, weight: float) -> Dict[str, float]:
        """Generate dummy predictions for testing when model is not available"""
        # Simple heuristic-based predictions for testing
        bmi = weight / ((height / 100) ** 2)
        
        # Base measurements scaled by height and BMI
        base_measurements = {
            'ankle': height * 0.08,
            'arm-length': height * 0.36,
            'bicep': 20 + (bmi - 22) * 1.5,
            'calf': 30 + (bmi - 22) * 2,
            'chest': 80 + (bmi - 22) * 3,
            'forearm': 22 + (bmi - 22) * 1,
            'height': height,
            'hip': 85 + (bmi - 22) * 3.5,
            'leg-length': height * 0.45,
            'shoulder-breadth': 35 + (bmi - 22) * 1.5,
            'shoulder-to-crotch': height * 0.32,
            'thigh': 45 + (bmi - 22) * 2.5,
            'waist': 70 + (bmi - 22) * 4,
            'wrist': 15 + (bmi - 22) * 0.5
        }
        
        # Add some random variation
        for key in base_measurements:
            if key != 'height':
                variation = np.random.normal(0, 0.05)  # 5% variation
                base_measurements[key] *= (1 + variation)
                base_measurements[key] = max(0.1, base_measurements[key])
                base_measurements[key] = round(base_measurements[key], 1)
        
        return base_measurements