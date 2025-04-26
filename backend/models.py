from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Enum, Boolean, Text, func, Table
from sqlalchemy.orm import relationship, declarative_base
import enum

Base = declarative_base()

# Association table for many-to-many relationship between Users and Units
user_unit_association = Table(
    'user_unit_association', Base.metadata,
    Column('user_id', Integer, ForeignKey('users.id'), primary_key=True),
    Column('unit_id', Integer, ForeignKey('units.id'), primary_key=True)
)

class UserRole(enum.Enum):
    resident = "resident"
    manager = "manager"
    admin = "admin"

class TicketStatus(enum.Enum):
    open = "open"
    in_progress = "in_progress"
    closed = "closed"

class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=False)
    role = Column(Enum(UserRole), default=UserRole.resident, nullable=False)
    is_active = Column(Boolean, default=True)
    units = relationship("Unit", secondary=user_unit_association, back_populates="residents")
    tickets = relationship("MaintenanceTicket", back_populates="submitter")

class Property(Base):
    __tablename__ = 'properties'
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    address = Column(String, nullable=False)
    units = relationship("Unit", back_populates="property")

class Unit(Base):
    __tablename__ = 'units'
    id = Column(Integer, primary_key=True, index=True)
    property_id = Column(Integer, ForeignKey('properties.id'), nullable=False)
    number = Column(String, nullable=False)  # e.g., "101A"
    property = relationship("Property", back_populates="units")
    residents = relationship("User", secondary=user_unit_association, back_populates="units")
    tickets = relationship("MaintenanceTicket", back_populates="unit")

class MaintenanceTicket(Base):
    __tablename__ = 'maintenance_tickets'
    id = Column(Integer, primary_key=True, index=True)
    unit_id = Column(Integer, ForeignKey('units.id'), nullable=False)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    status = Column(Enum(TicketStatus), default=TicketStatus.open, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    unit = relationship("Unit", back_populates="tickets")
    submitter = relationship("User", back_populates="tickets")
