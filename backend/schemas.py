from pydantic import BaseModel, EmailStr
from typing import Optional, List
from enum import Enum

class UserRole(str, Enum):
    resident = "resident"
    manager = "manager"
    admin = "admin"

class TicketStatus(str, Enum):
    open = "open"
    in_progress = "in_progress"
    closed = "closed"

class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    role: UserRole = UserRole.resident
    is_active: bool = True

class UserCreate(UserBase):
    password: str

class UserOut(UserBase):
    id: int
    class Config:
        orm_mode = True

class PropertyBase(BaseModel):
    name: str
    address: str

class PropertyCreate(PropertyBase):
    pass

class PropertyOut(PropertyBase):
    id: int
    class Config:
        orm_mode = True

class UnitBase(BaseModel):
    number: str
    property_id: int

class UnitOut(UnitBase):
    id: int
    class Config:
        orm_mode = True

class MaintenanceTicketBase(BaseModel):
    title: str
    description: str
    unit_id: int

class MaintenanceTicketCreate(MaintenanceTicketBase):
    pass

class MaintenanceTicketOut(MaintenanceTicketBase):
    id: int
    user_id: int
    status: TicketStatus
    created_at: Optional[str]
    updated_at: Optional[str]
    class Config:
        orm_mode = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    user_id: Optional[int] = None
