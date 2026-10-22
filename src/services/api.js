import { INITIAL_EMPLOYEES, DEPARTMENT_METRICS } from '../data/mockEmployees';
import { INITIAL_TASKS } from '../data/mockTasks';
import { applyTaskAllocation, matchCandidatesForTask, forecastWorkload, predictWorkloadRisk } from './mlEngine';

// Local in-memory store initialized with rich synthetic data
let employeesStore = [...INITIAL_EMPLOYEES];
let tasksStore = [...INITIAL_TASKS];

export const api = {
  // Fetch all employees
  async getEmployees() {
    return new Promise(resolve => {
      setTimeout(() => resolve([...employeesStore]), 150);
    });
  },

  // Add a newly onboarded employee to store
  async addEmployee(newEmployee) {
    employeesStore.unshift(newEmployee);
    return new Promise(resolve => {
      setTimeout(() => resolve({ success: true, employee: newEmployee }), 100);
    });
  },

  // Sync state with external changes
  syncEmployees(updatedList) {
    employeesStore = [...updatedList];
  },

  // Fetch single employee with deep analytics
  async getEmployeeById(id) {
    return new Promise((resolve, reject) => {
      const emp = employeesStore.find(e => e.id === id);
      if (emp) {
        resolve({ ...emp });
      } else {
        reject(new Error(`Employee ${id} not found`));
      }
    });
  },

  // Fetch all active tasks
  async getTasks() {
    return new Promise(resolve => {
      setTimeout(() => resolve([...tasksStore]), 100);
    });
  },

  // Fetch department flow metrics
  async getDepartmentMetrics() {
    return new Promise(resolve => {
      resolve([...DEPARTMENT_METRICS]);
    });
  },

  // Execute Task Allocation with ML State Update
  async allocateTask(taskId, employeeId) {
    return new Promise((resolve, reject) => {
      const empIndex = employeesStore.findIndex(e => e.id === employeeId);
      const taskIndex = tasksStore.findIndex(t => t.id === taskId);

      if (empIndex === -1) {
        reject(new Error(`Employee ${employeeId} not found`));
        return;
      }

      const task = tasksStore[taskIndex] || {
        id: taskId || `TSK-${Math.floor(100 + Math.random() * 900)}`,
        name: "Allocated Dynamic Task",
        estimatedHours: 12
      };

      const employee = employeesStore[empIndex];
      const updatedEmployee = applyTaskAllocation(employee, task);
      employeesStore[empIndex] = updatedEmployee;

      if (taskIndex !== -1) {
        tasksStore[taskIndex] = {
          ...tasksStore[taskIndex],
          assignedEmployee: employeeId,
          status: "In Progress"
        };
      }

      setTimeout(() => {
        resolve({
          success: true,
          employee: updatedEmployee,
          task: tasksStore[taskIndex] || task,
          impact: {
            previousWorkload: employee.currentWorkload,
            newWorkload: updatedEmployee.currentWorkload,
            delta: updatedEmployee.taskImpactDelta,
            riskShift: `${employee.risk} -> ${updatedEmployee.risk}`
          }
        });
      }, 350);
    });
  },

  // Find candidate matches using ML
  async findBestMatches(task) {
    return new Promise(resolve => {
      const matches = matchCandidatesForTask(task, employeesStore);
      setTimeout(() => resolve(matches), 250);
    });
  },

  // Create a new task
  async createTask(newTask) {
    const task = {
      ...newTask,
      id: `TSK-${Math.floor(800 + Math.random() * 199)}`,
      createdAt: new Date().toISOString().split('T')[0],
      status: "Unassigned"
    };
    tasksStore.unshift(task);
    return task;
  },

  // Pre-generate dynamic AI insights based on live state
  async getAIInsights() {
    const highRisk = employeesStore.filter(e => e.risk === 'HIGH');
    const available = employeesStore.filter(e => e.availableCapacity >= 30);
    const engineering = employeesStore.filter(e => e.department === 'Engineering');
    const avgEngWorkload = Math.round(
      engineering.reduce((acc, curr) => acc + curr.currentWorkload, 0) / engineering.length
    );

    return [
      {
        id: "ins-1",
        type: "warning",
        category: "HIGH WORKLOAD DETECTED",
        title: "Engineering Workload Escalation (+14%)",
        description: `Average Engineering workload has risen to ${avgEngWorkload}%. ${highRisk.length} staff members are in the critical risk tier, primarily driven by concurrent release deadlines.`,
        actionLabel: "Rebalance Engineering Queue",
        impactScore: "Critical",
        affectedIds: highRisk.map(e => e.id)
      },
      {
        id: "ins-2",
        type: "success",
        category: "CAPACITY AVAILABLE",
        title: `${available.length} Employees with >30% Bandwidth Available`,
        description: `Substantial talent bandwidth detected in Design (Devon Brooks - 62% capacity) and HR/Operations. Ready for high-priority task dispatch without overtime hazard.`,
        actionLabel: "Open Task Allocator",
        impactScore: "Optimal",
        affectedIds: available.map(e => e.id)
      },
      {
        id: "ins-3",
        type: "predictive",
        category: "PREDICTION ALERT",
        title: "E104 High-Risk Trajectory Within 7 Days",
        description: "ML time-series model projects Senior Engineer Alex Rivera (E104) will surpass 94% capacity threshold due to 5 overlapping milestone deadlines.",
        actionLabel: "Inspect E104 Forecast",
        impactScore: "High",
        affectedIds: ["E104"]
      },
      {
        id: "ins-4",
        type: "recommendation",
        category: "STRATEGIC RECOMMENDATION",
        title: "Redistribute 3 Lower-Priority Sprint Tasks",
        description: "Reallocating non-critical maintenance tasks from E104 and E112 to E102 and E117 will equalize cross-department workload to safe 64% median.",
        actionLabel: "Auto-Simulate Redistribution",
        impactScore: "Moderate",
        affectedIds: ["E104", "E102", "E117"]
      }
    ];
  }
};
