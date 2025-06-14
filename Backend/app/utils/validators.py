from typing import Optional
import mimetypes

def validate_image_file(filename: str, content_type: str) -> bool:
    """Validate if file is a valid image"""
    allowed_types = ['image/jpeg', 'image/jpg', 'image/png', 'image/bmp', 'image/webp']
    allowed_extensions = ['.jpg', '.jpeg', '.png', '.bmp', '.webp']
    
    # Check content type
    if content_type not in allowed_types:
        return False
    
    # Check file extension
    if not any(filename.lower().endswith(ext) for ext in allowed_extensions):
        return False
    
    return True

def validate_measurements(height: float, weight: float) -> tuple[bool, Optional[str]]:
    """Validate height and weight measurements"""
    if height <= 0 or height > 300:
        return False, "Altura deve estar entre 1 e 300 cm"
    
    if weight <= 0 or weight > 500:
        return False, "Peso deve estar entre 1 e 500 kg"
    
    # Check if values are reasonable
    bmi = weight / ((height / 100) ** 2)
    if bmi < 10 or bmi > 60:
        return False, "Combinação de altura e peso parece inválida"
    
    return True, None