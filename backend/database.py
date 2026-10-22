"""
Database Schema & ORM Model for Workforce Telemetry
Supports MySQL with SQLite fallback for seamless plug-and-play execution.
"""
from sqlalchemy import create_engine, Column, Integer, String, Float, JSON
from sqlalchemy.orm import declarative_base, sessionmaker
import os

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./workforce_intelligence.db")

engine = create_engine(
    DATABASE_URL, 
    connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class EmployeeModel(Base):
    __tablename__ = "employees"

    id = Column(String(20), primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(120), nullable=True)
    phone = Column(String(50), nullable=True)
    department = Column(String(50), nullable=False)
    role = Column(String(100), nullable=False)
    experience = Column(Float, default=3.0)
    joining_date = Column(String(50), nullable=True)
    skills = Column(JSON)
    tasks_assigned = Column(Integer, default=0)
    tasks_completed = Column(Integer, default=0)
    pending_tasks = Column(Integer, default=0)
    working_hours = Column(Float, default=40.0)
    overtime = Column(Float, default=0.0)
    meeting_hours = Column(Float, default=4.0)
    task_complexity = Column(String(20), default="Medium")
    deadline_count = Column(Integer, default=0)
    productivity = Column(Float, default=85.0)
    previous_workload = Column(Float, default=0.0)
    current_workload = Column(Float, default=0.0)
    available_capacity = Column(Float, default=100.0)
    risk = Column(String(20), default="LOW")
    risk_score = Column(Float, default=0.05)
    status = Column(String(30), default="Active")
    created_at = Column(String(50), nullable=True)

class TaskModel(Base):
    __tablename__ = "tasks"

    id = Column(String(20), primary_key=True, index=True)
    name = Column(String(150), nullable=False)
    required_skills = Column(JSON)
    complexity = Column(String(20), default="High")
    estimated_hours = Column(Float, default=12.0)
    deadline = Column(String(50), default="3 Days")
    priority = Column(String(20), default="CRITICAL")
    assigned_employee = Column(String(20), nullable=True)
    status = Column(String(30), default="Unassigned")

# Auto-create tables
Base.metadata.create_all(bind=engine)
