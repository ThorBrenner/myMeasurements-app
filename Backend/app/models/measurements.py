from sqlalchemy import Column, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base

class BodyMeasurement(Base):
    __tablename__ = "body_measurements"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)
    height_cm = Column(Float)
    weight_kg = Column(Float)
    chest_cm = Column(Float)
    waist_cm = Column(Float)
    hip_cm = Column(Float)
    thigh_cm = Column(Float)
    bicep_cm = Column(Float)
    ankle_cm = Column(Float)
    arm_length_cm = Column(Float)
    calf_cm = Column(Float)
    forearm_cm = Column(Float)
    leg_length_cm = Column(Float)
    shoulder_breadth_cm = Column(Float)
    shoulder_to_crotch_cm = Column(Float)
    wrist_cm = Column(Float)

    user = relationship("User")


