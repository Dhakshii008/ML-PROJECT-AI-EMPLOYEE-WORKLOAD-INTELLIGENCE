import { dbService } from './dbService';
import { applyTaskAllocation, matchCandidatesForTask, forecastWorkload, predictWorkloadRisk } from './mlEngine';

export const api = {
  // Switch active database tenant partition
  switchTenant(tenantId) {
    dbService.switchTenant(tenantId);
  },

  // Fetch all employees for current authenticated tenant
  async getEmployees() {
    return new Promise(resolve => {
      const employees = dbService.getEmployees();
      setTimeout(() => resolve([...employees]), 100);
    });
  },

  // Add a newly onboarded employee to persistent store
  async addEmployee(newEmployee) {
    const saved = dbService.addEmployee(newEmployee);
    return new Promise(resolve => {
      setTimeout(() => resolve({ success: true, employee: saved }), 80);
    });
  },

  // Sync state with external changes
  syncEmployees(updatedList) {
    dbService.saveEmployees(updatedList);
  },

  // Update a single employee
  updateEmployee(updatedEmployee) {
    return dbService.updateEmployee(updatedEmployee);
  },

  // Fetch single employee with deep analytics
  async getEmployeeById(id) {
    return new Promise((resolve, reject) => {
      const employees = dbService.getEmployees();
      const emp = employees.find(e => e.id === id);
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
      const tasks = dbService.getTasks();
      setTimeout(() => resolve([...tasks]), 80);
    });
  },

  // Fetch department flow metrics
  async getDepartmentMetrics() {
    return new Promise(resolve => {
      const metrics = dbService.getDepartmentMetrics();
      resolve([...metrics]);
    });
  },

  // Execute Task Allocation with ML State Update & Database Persistence
  async allocateTask(taskId, employeeId) {
    return new Promise((resolve, reject) => {
      const employees = dbService.getEmployees();
      const tasks = dbService.getTasks();

      const empIndex = employees.findIndex(e => e.id === employeeId);
      const taskIndex = tasks.findIndex(t => t.id === taskId);

      if (empIndex === -1) {
        reject(new Error(`Employee ${employeeId} not found`));
        return;
      }

      const task = tasks[taskIndex] || {
        id: taskId || `TSK-${Math.floor(100 + Math.random() * 900)}`,
        name: "Allocated Dynamic Task",
        estimatedHours: 12
      };

      const employee = employees[empIndex];
      const updatedEmployee = applyTaskAllocation(employee, task);
      employees[empIndex] = updatedEmployee;

      // Update task record
      if (taskIndex !== -1) {
        tasks[taskIndex] = {
          ...tasks[taskIndex],
          assignedEmployee: employeeId,
          status: "In Progress"
        };
        dbService.saveTasks(tasks);
      }

      // Persist updated employee in tenant database
      dbService.saveEmployees(employees);

      setTimeout(() => {
        resolve({
          success: true,
          employee: updatedEmployee,
          task: tasks[taskIndex] || task,
          impact: {
            previousWorkload: employee.currentWorkload,
            newWorkload: updatedEmployee.currentWorkload,
            delta: updatedEmployee.taskImpactDelta,
            riskShift: `${employee.risk} -> ${updatedEmployee.risk}`
          }
        });
      }, 250);
    });
  },

  // Find candidate matches using ML
  async findBestMatches(task) {
    return new Promise(resolve => {
      const employees = dbService.getEmployees();
      const matches = matchCandidatesForTask(task, employees);
      setTimeout(() => resolve(matches), 150);
    });
  },

  // Create a new task in tenant database
  async createTask(newTask) {
    const task = {
      ...newTask,
      id: `TSK-${Math.floor(800 + Math.random() * 199)}`,
      createdAt: new Date().toISOString().split('T')[0],
      status: "Unassigned"
    };
    return dbService.addTask(task);
  },

  // Pre-generate dynamic AI insights based on live state
  async getAIInsights() {
    const employees = dbService.getEmployees();
    const highRisk = employees.filter(e => e.risk === 'HIGH');
    const available = employees.filter(e => e.availableCapacity >= 30);
    const engineering = employees.filter(e => e.department === 'Engineering');
    const avgEngWorkload = engineering.length > 0
      ? Math.round(engineering.reduce((acc, curr) => acc + curr.currentWorkload, 0) / engineering.length)
      : 65;

    return [
      {
        id: "ins-1",
        type: "warning",
        category: "HIGH WORKLOAD DETECTED",
        title: `Engineering Workload Escalation (${avgEngWorkload}%)`,
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
        description: `Substantial talent bandwidth detected in workforce. Ready for high-priority task dispatch without overtime hazard.`,
        actionLabel: "Open Task Allocator",
        impactScore: "Optimal",
        affectedIds: available.map(e => e.id)
      },
      {
        id: "ins-3",
        type: "predictive",
        category: "PREDICTION ALERT",
        title: "Workforce High-Risk Trajectory Within 7 Days",
        description: "ML time-series model projects workload shifts across pending milestone deadlines.",
        actionLabel: "Inspect Forecast Telemetry",
        impactScore: "High",
        affectedIds: highRisk.length > 0 ? [highRisk[0].id] : ["E104"]
      },
      {
        id: "ins-4",
        type: "recommendation",
        category: "STRATEGIC RECOMMENDATION",
        title: "Redistribute Backlog Sprint Tasks",
        description: "Reallocating non-critical maintenance tasks to available personnel equalizes cross-department workload to safe median.",
        actionLabel: "Auto-Simulate Redistribution",
        impactScore: "Moderate",
        affectedIds: ["E104", "E102"]
      }
    ];
  },

  // Reset database partition for current tenant
  async resetTenantData() {
    return dbService.resetTenantData();
  }
};
