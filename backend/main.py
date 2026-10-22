"""
AI Employee Workload Intelligence - FastAPI Production Server
"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from ml_models import ml_engine

app = FastAPI(
    title="AI Employee Workload Intelligence API",
    description="Smart Workforce Analytics & Intelligent Task Allocation Backend",
    version="1.0.0"
)

# Enable CORS for Vite frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TaskSpec(BaseModel):
    name: str
    requiredSkills: List[str]
    complexity: str = "High"
    estimatedHours: float = 12.0
    deadlineDays: float = 3.0
    priority: str = "CRITICAL"

class RiskRequest(BaseModel):
    currentWorkload: float
    overtime: float
    deadlineCount: int
    pendingTasks: int
    productivity: float

class EmployeeCreate(BaseModel):
    id: str
    name: str
    email: Optional[str] = None
    phone: Optional[str] = None
    department: str
    role: str
    experience: float = 3.0
    joiningDate: Optional[str] = None
    skills: List[str]
    workingHours: float = 40.0
    maxCapacity: float = 100.0
    location: Optional[str] = None
    manager: Optional[str] = None
    team: Optional[str] = None
    avatar: Optional[str] = None

@app.get("/")
def read_root():
    return {
        "status": "online",
        "service": "AI Employee Workload Intelligence",
        "ml_version": "v3.4-RF"
    }

@app.post("/api/employees")
def create_employee(emp: EmployeeCreate):
    # Initialize with 0% workload, 100% capacity, LOW risk
    employee_dict = emp.dict()
    employee_dict.update({
        "currentWorkload": 0.0,
        "previousWorkload": 0.0,
        "availableCapacity": 100.0,
        "pendingTasks": 0,
        "tasksCompleted": 0,
        "tasksAssigned": 0,
        "overtime": 0.0,
        "risk": "LOW",
        "riskScore": 0.05,
        "productivity": 85.0,
        "isNewJoiner": True
    })
    return {"success": True, "employee": employee_dict}

@app.post("/api/predict-risk")
def predict_risk_endpoint(req: RiskRequest):
    result = ml_engine.predict_risk(
        workload=req.currentWorkload,
        overtime=req.overtime,
        deadlines=req.deadlineCount,
        pending=req.pendingTasks,
        productivity=req.productivity
    )
    return result

@app.post("/api/forecast")
def forecast_endpoint(trend: List[float], periods: int = 4, growth: float = 1.0):
    predictions = ml_engine.forecast_workload(trend, periods, growth)
    return {"forecast": predictions}

@app.post("/api/task-match")
def match_candidates(task: TaskSpec, employees: List[dict]):
    candidates = ml_engine.match_task(task.dict(), employees)
    return {"candidates": candidates}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
