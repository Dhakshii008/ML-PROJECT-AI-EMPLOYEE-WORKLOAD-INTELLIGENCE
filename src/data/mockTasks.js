export const INITIAL_TASKS = [
  {
    id: "TSK-801",
    name: "Payment Gateway API Integration",
    requiredSkills: ["Java", "Spring Boot", "MySQL"],
    complexity: "High",
    estimatedHours: 12,
    deadline: "3 Days",
    deadlineDays: 3,
    priority: "CRITICAL",
    assignedEmployee: null,
    status: "Unassigned",
    department: "Engineering",
    createdAt: "2026-10-03"
  },
  {
    id: "TSK-802",
    name: "Zero-Trust Service Mesh Authentication",
    requiredSkills: ["Kubernetes", "AWS", "Docker"],
    complexity: "High",
    estimatedHours: 16,
    deadline: "5 Days",
    deadlineDays: 5,
    priority: "HIGH",
    assignedEmployee: "E115",
    status: "In Progress",
    department: "Engineering",
    createdAt: "2026-10-01"
  },
  {
    id: "TSK-803",
    name: "Micro-Interaction Design System 3.0",
    requiredSkills: ["Figma", "CSS Animations", "Design Systems"],
    complexity: "Medium",
    estimatedHours: 8,
    deadline: "4 Days",
    deadlineDays: 4,
    priority: "MEDIUM",
    assignedEmployee: "E109",
    status: "In Progress",
    department: "Design",
    createdAt: "2026-10-02"
  },
  {
    id: "TSK-804",
    name: "Realtime Workload Anomaly Detection Pipeline",
    requiredSkills: ["Python", "SQL", "Data Pipelines"],
    complexity: "High",
    estimatedHours: 20,
    deadline: "6 Days",
    deadlineDays: 6,
    priority: "CRITICAL",
    assignedEmployee: "E123",
    status: "In Progress",
    department: "Operations",
    createdAt: "2026-09-29"
  },
  {
    id: "TSK-805",
    name: "Q4 Engineering Capacity Rebalance Plan",
    requiredSkills: ["Workforce Analytics", "Tableau", "Roadmapping"],
    complexity: "Medium",
    estimatedHours: 6,
    deadline: "2 Days",
    deadlineDays: 2,
    priority: "HIGH",
    assignedEmployee: "E125",
    status: "Review",
    department: "HR",
    createdAt: "2026-10-02"
  },
  {
    id: "TSK-806",
    name: "Distributed Cache Layer Invalidation",
    requiredSkills: ["Java", "Distributed Systems", "Kafka"],
    complexity: "High",
    estimatedHours: 14,
    deadline: "4 Days",
    deadlineDays: 4,
    priority: "HIGH",
    assignedEmployee: "E102",
    status: "In Progress",
    department: "Engineering",
    createdAt: "2026-10-02"
  }
];

export const PRESET_TASK_TEMPLATES = [
  {
    name: "Payment Gateway API",
    skills: ["Java", "Spring Boot", "MySQL"],
    complexity: "High",
    estimatedHours: 12,
    deadline: "3 Days",
    deadlineDays: 3,
    priority: "CRITICAL"
  },
  {
    name: "Kubernetes Cloud Cluster Hardening",
    skills: ["Kubernetes", "AWS", "Terraform", "CI/CD"],
    complexity: "High",
    estimatedHours: 18,
    deadline: "5 Days",
    deadlineDays: 5,
    priority: "HIGH"
  },
  {
    name: "Design System 3.0 Tokens & Tokens Sync",
    skills: ["Figma", "Design Systems", "Prototyping"],
    complexity: "Medium",
    estimatedHours: 9,
    deadline: "4 Days",
    deadlineDays: 4,
    priority: "MEDIUM"
  },
  {
    name: "Next.js High-Throughput SSR Hydration Fix",
    skills: ["React", "TypeScript", "Next.js", "Web Performance"],
    complexity: "High",
    estimatedHours: 10,
    deadline: "2 Days",
    deadlineDays: 2,
    priority: "HIGH"
  },
  {
    name: "Retention & Capacity Modeling Algorithm",
    skills: ["Workforce Analytics", "Python", "Data Analytics"],
    complexity: "Medium",
    estimatedHours: 8,
    deadline: "5 Days",
    deadlineDays: 5,
    priority: "LOW"
  }
];
