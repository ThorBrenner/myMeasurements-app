from fastapi import APIRouter, HTTPException, Depends, File, UploadFile, Form
from sqlalchemy.orm import Session
from uuid import uuid4
from typing import List
import json
import asyncio

from app.services.image_service import ImageService
from app.services.prediction_service import PredictionService
from app.models import schemas, measurements as measurements_model
from app.models.database import SessionLocal
from app.core.auth import get_current_user
from app.models.user import User
router = APIRouter(prefix="/measurements")

image_service = ImageService()
prediction_service = PredictionService()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=schemas.BodyMeasurementResponse)
def create_measurement(
    measurement: schemas.BodyMeasurementCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Criar uma nova medida corporal para o usuário autenticado"""
    new_measurement = measurements_model.BodyMeasurement(
        id=str(uuid4()),
        user_id=current_user.id,
        height_cm=measurement.height_cm,
        weight_kg=measurement.weight_kg,
        chest_cm=measurement.chest_cm,
        waist_cm=measurement.waist_cm,
        hip_cm=measurement.hip_cm,
        thigh_cm=measurement.thigh_cm,
        bicep_cm=measurement.bicep_cm
    )
    
    db.add(new_measurement)
    db.commit()
    db.refresh(new_measurement)
    
    return new_measurement

@router.get("/", response_model=List[schemas.BodyMeasurementResponse])
def get_user_measurements(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Obter todas as medidas corporais do usuário autenticado"""
    measurements = db.query(measurements_model.BodyMeasurement).filter(
        measurements_model.BodyMeasurement.user_id == current_user.id
    ).order_by(measurements_model.BodyMeasurement.timestamp.desc()).all()
    
    return measurements

@router.get("/{measurement_id}", response_model=schemas.BodyMeasurementResponse)
def get_measurement(
    measurement_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Obter uma medida corporal específica do usuário autenticado"""
    measurement = db.query(measurements_model.BodyMeasurement).filter(
        measurements_model.BodyMeasurement.id == measurement_id,
        measurements_model.BodyMeasurement.user_id == current_user.id
    ).first()
    
    if not measurement:
        raise HTTPException(status_code=404, detail="Measurement not found")
    
    return measurement

@router.put("/{measurement_id}", response_model=schemas.BodyMeasurementResponse)
def update_measurement(
    measurement_id: str,
    measurement_update: schemas.BodyMeasurementCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Atualizar uma medida corporal específica do usuário autenticado"""
    measurement = db.query(measurements_model.BodyMeasurement).filter(
        measurements_model.BodyMeasurement.id == measurement_id,
        measurements_model.BodyMeasurement.user_id == current_user.id
    ).first()
    
    if not measurement:
        raise HTTPException(status_code=404, detail="Measurement not found")
    
    # Atualizar apenas os campos fornecidos
    for field, value in measurement_update.dict(exclude_unset=True).items():
        setattr(measurement, field, value)
    
    db.commit()
    db.refresh(measurement)
    
    return measurement

@router.delete("/{measurement_id}")
def delete_measurement(
    measurement_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Deletar uma medida corporal específica do usuário autenticado"""
    measurement = db.query(measurements_model.BodyMeasurement).filter(
        measurements_model.BodyMeasurement.id == measurement_id,
        measurements_model.BodyMeasurement.user_id == current_user.id
    ).first()
    
    if not measurement:
        raise HTTPException(status_code=404, detail="Measurement not found")
    
    db.delete(measurement)
    db.commit()
    
    return {"message": "Measurement deleted successfully"}

@router.post("/upload-photos")
async def upload_photos_and_calculate(
    height: float = Form(...),
    weight: float = Form(...),
    front_photo: UploadFile = File(...),
    side_photo: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        front_image_data = await front_photo.read()
        side_image_data = await side_photo.read()

        # Processar ambas as imagens
        processed_front = await image_service.process_image(front_image_data)
        processed_side = await image_service.process_image(side_image_data)

        # Inicializar modelo se necessário
        if not prediction_service.is_model_loaded():
            await prediction_service.initialize()

        # Predizer medidas com as duas imagens
        predicted_measurements = await prediction_service.predict(
            processed_front, processed_side, height, weight
        )

        # Salvar no banco como antes
        new_measurement = measurements_model.BodyMeasurement(
            id=str(uuid4()),
            user_id=current_user.id,
            height_cm=height,
            weight_kg=weight,
            chest_cm=predicted_measurements.get("chest"),
            waist_cm=predicted_measurements.get("waist"),
            hip_cm=predicted_measurements.get("hip"),
            thigh_cm=predicted_measurements.get("thigh"),
            bicep_cm=predicted_measurements.get("bicep"),
            ankle_cm=predicted_measurements.get("ankle"),
            arm_length_cm=predicted_measurements.get("arm-length"),
            calf_cm=predicted_measurements.get("calf"),
            forearm_cm=predicted_measurements.get("forearm"),
            leg_length_cm=predicted_measurements.get("leg-length"),
            shoulder_breadth_cm=predicted_measurements.get("shoulder-breadth"),
            shoulder_to_crotch_cm=predicted_measurements.get("shoulder-to-crotch"),
            wrist_cm=predicted_measurements.get("wrist")
        )

        db.add(new_measurement)
        db.commit()
        db.refresh(new_measurement)

        return {
            "success": True,
            "measurement": new_measurement,
            "message": "Photos uploaded and measurements calculated successfully"
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing photos: {str(e)}")

