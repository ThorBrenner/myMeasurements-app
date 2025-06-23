from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from uuid import uuid4

from app.models import schemas, user as user_model
from app.models.database import SessionLocal
from app.core.auth import hash_password, verify_password, create_access_token

from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from app.core.auth import SECRET_KEY, ALGORITHM
from app.models import user as user_model
from app.models.database import SessionLocal
from sqlalchemy.orm import Session

router = APIRouter(prefix="/auth")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/register", response_model=schemas.UserResponse)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    if db.query(user_model.User).filter_by(email=user.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")

    new_user = user_model.User(
        id=str(uuid4()),
        email=user.email,
        name=user.name,
        hashed_password=hash_password(user.password)
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return schemas.UserResponse(id=new_user.id, email=new_user.email, name=new_user.name)

@router.post("/login")
def login(data: schemas.UserLogin, db: Session = Depends(get_db)):
    user = db.query(user_model.User).filter_by(email=data.email).first()
    if not user or not verify_password(data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token(data={"sub": user.id})
    return {"access_token": token, "token_type": "bearer"}


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise JWTError("Missing user ID in token")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

    user = db.query(user_model.User).filter_by(id=user_id).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.get("/me", response_model=schemas.UserResponse)
def read_users_me(current_user: user_model.User = Depends(get_current_user)):
    return schemas.UserResponse(id=current_user.id, email=current_user.email, name=current_user.name)