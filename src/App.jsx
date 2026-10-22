import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import FuturisticBackground from './components/Background/FuturisticBackground';
import FloatingNavbar from './components/Navbar/FloatingNavbar';
import EmployeeDetailModal from './components/EmployeeNetwork/EmployeeDetailModal';
import AddEmployeeModal from './components/EmployeeNetwork/AddEmployeeModal';
import EmployeeProfileCreatedModal from './components/EmployeeNetwork/EmployeeProfileCreatedModal';
import AICopilotOrb from './components/AICopilot/AICopilotOrb';
import AppFooter from './components/Footer/AppFooter';
import confetti from 'canvas-confetti';

import Home from './pages/Home';
import CommandCenter from './pages/CommandCenter';
import Employees from './pages/Employees';
import AnalyticsPage from './pages/AnalyticsPage';
import WorkloadForecastPage from './pages/WorkloadForecastPage';
import SmartTaskAllocationPage from './pages/SmartTaskAllocationPage';
import AIInsightsPage from './pages/AIInsightsPage';

import { INITIAL_EMPLOYEES, DEPARTMENT_METRICS } from './data/mockEmployees';
import { api } from './services/api';
import { applyTaskAllocation } from './services/mlEngine';

export default function App() {
  const [activePage, setActivePage] = useState('home');
  const [isDark, setIsDark] = useState(true);
  const [employees, setEmployees] = useState(INITIAL_EMPLOYEES);
  const [departments, setDepartments] = useState(DEPARTMENT_METRICS);
  const [insights, setInsights] = useState([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const [activeToast, setActiveToast] = useState(null);
  const [isAddEmployeeOpen, setIsAddEmployeeOpen] = useState(false);
  const [createdEmployee, setCreatedEmployee] = useState(null);

  // Sync theme with HTML class
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
    }
  }, [isDark]);

  // Load live dynamic insights
  useEffect(() => {
    api.getAIInsights().then(res => setInsights(res));
  }, [employees]);

  // Handle task assignment from Allocator
  const handleTaskAssigned = (task, employeeId) => {
    const empIndex = employees.findIndex(e => e.id === employeeId);
    if (empIndex === -1) return;

    const emp = employees[empIndex];
    const updated = applyTaskAllocation(emp, task);

    const newEmployees = [...employees];
    newEmployees[empIndex] = updated;
    setEmployees(newEmployees);

    // Trigger Notification Toast
    setActiveToast({
      title: "TASK ALLOCATED & REBALANCED",
      message: `${task.name} assigned to ${updated.name} (${updated.id}). Workload adjusted to ${updated.currentWorkload}%.`,
      type: updated.risk === 'HIGH' ? 'warning' : 'success'
    });

    setTimeout(() => setActiveToast(null), 5000);
  };

  // Handle new employee onboarding
  const handleEmployeeCreated = (newEmployee) => {
    // 1. Add new employee to active workforce state
    setEmployees(prev => [newEmployee, ...prev]);

    // 2. Sync to local API store
    api.addEmployee(newEmployee);

    // 3. Close onboarding form & open AI confirmation view
    setIsAddEmployeeOpen(false);
    setCreatedEmployee(newEmployee);

    // 4. Trigger celebration animation
    try {
      confetti({
        particleCount: 55,
        spread: 65,
        origin: { y: 0.6 },
        colors: ['#06b6d4', '#10b981', '#a855f7', '#ffffff']
      });
    } catch (e) {}

    // 5. Toast notification
    setActiveToast({
      title: "✦ PROFILE CREATED",
      message: `${newEmployee.name} (${newEmployee.id}) added to the workforce. AI Workforce Intelligence Updated.`,
      type: 'success'
    });

    setTimeout(() => setActiveToast(null), 5000);
  };

  // Handle employee profile updates (e.g. photo upload, change, removal)
  const handleUpdateEmployee = (updatedEmployee) => {
    const updatedList = employees.map(e => e.id === updatedEmployee.id ? updatedEmployee : e);
    setEmployees(updatedList);
    api.syncEmployees(updatedList);
    setActiveToast({
      title: "PROFILE UPDATED",
      message: `${updatedEmployee.name}'s profile photo has been updated across the workforce.`,
      type: 'success'
    });
    setTimeout(() => setActiveToast(null), 4000);
  };

  // Find currently selected employee for modal
  const selectedEmployee = employees.find(e => e.id === selectedEmployeeId);

  const handleSelectEmployee = (id) => {
    setSelectedEmployeeId(id);
  };

  const handleInsightAction = (insight) => {
    if (insight.type === 'predictive') {
      setActivePage('workload-intelligence');
      if (insight.affectedIds && insight.affectedIds[0]) {
        setSelectedEmployeeId(insight.affectedIds[0]);
      }
    } else if (insight.type === 'success' || insight.type === 'warning') {
      setActivePage('task-allocation');
    } else {
      setActivePage('command-center');
    }
  };

  return (
    <div className={`min-h-screen relative font-sans transition-colors duration-300 ${isDark ? 'bg-[#030712] text-slate-100' : 'bg-[#f8fafc] text-slate-900'}`}>
      
      {/* Signature Animated Ambient Background */}
      <FuturisticBackground />

      {/* Floating Glass Navbar */}
      <FloatingNavbar
        activePage={activePage}
        setActivePage={setActivePage}
        isDark={isDark}
        setIsDark={setIsDark}
        highRiskCount={employees.filter(e => e.risk === 'HIGH').length}
      />

      {/* Main Page Layout Container */}
      <main className="relative z-10 pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-[calc(100vh-140px)]">
        <AnimatePresence mode="wait">
          {activePage === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <Home 
                onNavigate={setActivePage} 
                employees={employees} 
                onSelectEmployee={handleSelectEmployee} 
              />
            </motion.div>
          )}

          {activePage === 'command-center' && (
            <motion.div
              key="command-center"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <CommandCenter
                employees={employees}
                departments={departments}
                onNavigate={setActivePage}
                onSelectEmployee={handleSelectEmployee}
              />
            </motion.div>
          )}

          {activePage === 'employees' && (
            <motion.div
              key="employees"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <Employees
                employees={employees}
                onSelectEmployee={handleSelectEmployee}
                onOpenAddEmployee={() => setIsAddEmployeeOpen(true)}
              />
            </motion.div>
          )}

          {activePage === 'analytics' && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <AnalyticsPage
                employees={employees}
                departments={departments}
              />
            </motion.div>
          )}

          {activePage === 'workload-intelligence' && (
            <motion.div
              key="workload-intelligence"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <WorkloadForecastPage
                employees={employees}
                selectedEmpId={selectedEmployeeId || 'E104'}
                onSelectEmployee={handleSelectEmployee}
              />
            </motion.div>
          )}

          {activePage === 'task-allocation' && (
            <motion.div
              key="task-allocation"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <SmartTaskAllocationPage
                employees={employees}
                onTaskAssigned={handleTaskAssigned}
              />
            </motion.div>
          )}

          {activePage === 'ai-insights' && (
            <motion.div
              key="ai-insights"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <AIInsightsPage
                insights={insights}
                onActionClick={handleInsightAction}
                onSelectEmployee={handleSelectEmployee}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Floating AI Workforce Copilot Assistant */}
      <AICopilotOrb
        employees={employees}
        departments={departments}
        onSelectEmployee={handleSelectEmployee}
      />

      {/* Deep Employee Telemetry Slide-Out Modal */}
      <EmployeeDetailModal
        employee={selectedEmployee}
        isOpen={Boolean(selectedEmployee)}
        onClose={() => setSelectedEmployeeId(null)}
        onNavigateAllocator={() => {
          setSelectedEmployeeId(null);
          setActivePage('task-allocation');
        }}
        onUpdateEmployee={handleUpdateEmployee}
      />

      {/* Onboard New Employee Modal */}
      <AddEmployeeModal
        isOpen={isAddEmployeeOpen}
        onClose={() => setIsAddEmployeeOpen(false)}
        onEmployeeCreated={handleEmployeeCreated}
        existingCount={employees.length}
      />

      {/* AI Workforce Profile Confirmation View */}
      <EmployeeProfileCreatedModal
        employee={createdEmployee}
        isOpen={Boolean(createdEmployee)}
        onClose={() => setCreatedEmployee(null)}
        onAllocateTask={(emp) => {
          setCreatedEmployee(null);
          setActivePage('task-allocation');
        }}
      />

      {/* Notification Toast */}
      <AnimatePresence>
        {activeToast && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.9 }}
            className={`fixed bottom-6 left-6 z-50 glass-panel rounded-2xl p-4 border max-w-sm shadow-2xl backdrop-blur-xl ${
              activeToast.type === 'warning' ? 'border-amber-500/50 bg-amber-950/80' : 'border-emerald-500/50 bg-emerald-950/80'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="font-extrabold text-xs font-mono tracking-wider text-white block">
                  {activeToast.title}
                </span>
                <p className="text-xs text-slate-200 mt-1 font-sans">
                  {activeToast.message}
                </p>
              </div>
              <button
                onClick={() => setActiveToast(null)}
                className="text-xs text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mandatory Elegant Footer */}
      <AppFooter />
    </div>
  );
}
