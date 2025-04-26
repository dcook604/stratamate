from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import models
import schemas
import deps

router = APIRouter()

# Helper: Only allow manager/admin

def require_manager_admin(current_user: models.User = Depends(deps.get_current_user)):
    if current_user.role not in [models.UserRole.manager, models.UserRole.admin]:
        raise HTTPException(status_code=403, detail="Insufficient permissions")
    return current_user

@router.post("/", response_model=schemas.PropertyOut, status_code=201)
def create_property(
    property_in: schemas.PropertyCreate,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(require_manager_admin),
):
    db_property = models.Property(**property_in.dict())
    db.add(db_property)
    db.commit()
    db.refresh(db_property)
    return db_property

@router.get("/", response_model=List[schemas.PropertyOut])
def list_properties(db: Session = Depends(deps.get_db)):
    return db.query(models.Property).all()

@router.get("/{property_id}", response_model=schemas.PropertyOut)
def get_property(property_id: int, db: Session = Depends(deps.get_db)):
    prop = db.query(models.Property).filter(models.Property.id == property_id).first()
    if not prop:
        raise HTTPException(status_code=404, detail="Property not found")
    return prop

@router.put("/{property_id}", response_model=schemas.PropertyOut)
def update_property(
    property_id: int,
    property_in: schemas.PropertyCreate,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(require_manager_admin),
):
    prop = db.query(models.Property).filter(models.Property.id == property_id).first()
    if not prop:
        raise HTTPException(status_code=404, detail="Property not found")
    for k, v in property_in.dict().items():
        setattr(prop, k, v)
    db.commit()
    db.refresh(prop)
    return prop

@router.delete("/{property_id}", status_code=204)
def delete_property(
    property_id: int,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(require_manager_admin),
):
    prop = db.query(models.Property).filter(models.Property.id == property_id).first()
    if not prop:
        raise HTTPException(status_code=404, detail="Property not found")
    db.delete(prop)
    db.commit()
    return None
