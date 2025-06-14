import cv2
import numpy as np
from PIL import Image
import io
import logging
from rembg import remove
from typing import Union
import torch
from torchvision import transforms

logger = logging.getLogger(__name__)

class ImageService:
    """Service for image processing and segmentation"""
    
    def __init__(self):
        self.transform = transforms.Compose([
            transforms.Resize((224, 224)),
            transforms.Grayscale(num_output_channels=3),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
        ])
    
    async def process_image(self, image_data: bytes) -> torch.Tensor:
        """
        Process image: remove background and prepare for model
        
        Args:
            image_data: Raw image bytes
            
        Returns:
            Processed image tensor ready for model inference
        """
        try:
            # Convert bytes to PIL Image
            image = Image.open(io.BytesIO(image_data))
            
            # Convert to RGB if necessary
            if image.mode != 'RGB':
                image = image.convert('RGB')
            
            # Remove background using rembg
            segmented_image = self._remove_background(image)
            
            # Create mask (white silhouette on black background)
            mask = self._create_body_mask(segmented_image)
            
            # Apply transformations for model
            processed_tensor = self.transform(mask)
            
            return processed_tensor
            
        except Exception as e:
            logger.error(f"Error processing image: {e}")
            raise
    
    def _remove_background(self, image: Image.Image) -> Image.Image:
        """Remove background from image using rembg"""
        try:
            # Convert PIL to bytes
            img_byte_arr = io.BytesIO()
            image.save(img_byte_arr, format='PNG')
            img_byte_arr = img_byte_arr.getvalue()
            
            # Remove background
            result = remove(img_byte_arr)
            
            # Convert back to PIL
            return Image.open(io.BytesIO(result))
            
        except Exception as e:
            logger.error(f"Error removing background: {e}")
            # If background removal fails, return original image
            return image
    
    def _create_body_mask(self, image: Image.Image) -> Image.Image:
        """
        Create body mask (white silhouette on black background)
        Similar to the training data format
        """
        try:
            # Convert to numpy array
            img_array = np.array(image)
            
            # Create mask from alpha channel if available
            if img_array.shape[2] == 4:  # RGBA
                alpha = img_array[:, :, 3]
                mask = np.where(alpha > 0, 255, 0).astype(np.uint8)
            else:  # RGB
                # Convert to grayscale and threshold
                gray = cv2.cvtColor(img_array, cv2.COLOR_RGB2GRAY)
                _, mask = cv2.threshold(gray, 1, 255, cv2.THRESH_BINARY)
            
            # Create 3-channel mask (white body on black background)
            mask_3ch = np.stack([mask, mask, mask], axis=2)
            
            # Convert back to PIL
            return Image.fromarray(mask_3ch)
            
        except Exception as e:
            logger.error(f"Error creating body mask: {e}")
            # Return grayscale version of original image
            return image.convert('L').convert('RGB')
    
    def _enhance_mask(self, mask: np.ndarray) -> np.ndarray:
        """Apply morphological operations to enhance mask"""
        try:
            # Remove noise
            kernel = np.ones((3, 3), np.uint8)
            mask = cv2.morphologyEx(mask, cv2.MORPH_OPEN, kernel)
            
            # Fill holes
            mask = cv2.morphologyEx(mask, cv2.MORPH_CLOSE, kernel)
            
            # Smooth edges
            mask = cv2.GaussianBlur(mask, (3, 3), 0)
            
            return mask
            
        except Exception as e:
            logger.error(f"Error enhancing mask: {e}")
            return mask
    
    def save_processed_image(self, image_tensor: torch.Tensor, filepath: str):
        """Save processed image tensor to file (for debugging)"""
        try:
            # Denormalize
            mean = torch.tensor([0.485, 0.456, 0.406]).view(3, 1, 1)
            std = torch.tensor([0.229, 0.224, 0.225]).view(3, 1, 1)
            
            denormalized = image_tensor * std + mean
            denormalized = torch.clamp(denormalized, 0, 1)
            
            # Convert to PIL and save
            to_pil = transforms.ToPILImage()
            image = to_pil(denormalized)
            image.save(filepath)
            
        except Exception as e:
            logger.error(f"Error saving processed image: {e}")