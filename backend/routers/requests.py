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

@router.post("/", response_model=schemas.MaintenanceTicketOut, status_code=201)
def create_ticket(
    ticket_in: schemas.MaintenanceTicketCreate,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_user),
):
    # Only residents can create tickets
    if current_user.role != models.UserRole.resident:
        raise HTTPException(status_code=403, detail="Only residents can create tickets")
    db_ticket = models.MaintenanceTicket(
        title=ticket_in.title,
        description=ticket_in.description,
        unit_id=ticket_in.unit_id,
        user_id=current_user.id,
        status=models.TicketStatus.open
    )
    db.add(db_ticket)
    db.commit()
    db.refresh(db_ticket)
    return db_ticket

@router.get("/", response_model=List[schemas.MaintenanceTicketOut])
def list_tickets(db: Session = Depends(deps.get_db), current_user: models.User = Depends(deps.get_current_user)):
    if current_user.role in [models.UserRole.manager, models.UserRole.admin]:
        return db.query(models.MaintenanceTicket).all()
    return db.query(models.MaintenanceTicket).filter(models.MaintenanceTicket.user_id == current_user.id).all()

@router.get("/{ticket_id}", response_model=schemas.MaintenanceTicketOut)
def get_ticket(ticket_id: int, db: Session = Depends(deps.get_db), current_user: models.User = Depends(deps.get_current_user)):
    ticket = db.query(models.MaintenanceTicket).filter(models.MaintenanceTicket.id == ticket_id).first()
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    if current_user.role not in [models.UserRole.manager, models.UserRole.admin] and ticket.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to view this ticket")
    return ticket

@router.put("/{ticket_id}/status", response_model=schemas.MaintenanceTicketOut)
def update_ticket_status(
    ticket_id: int,
    status: schemas.TicketStatus,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(require_manager_admin),
):
    ticket = db.query(models.MaintenanceTicket).filter(models.MaintenanceTicket.id == ticket_id).first()
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    ticket.status = status
    db.commit()
    db.refresh(ticket)
    return ticket
