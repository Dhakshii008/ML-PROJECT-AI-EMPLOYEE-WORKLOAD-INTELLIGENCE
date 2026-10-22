import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Grid, Table, Sparkles, Filter } from 'lucide-react';
import WorkforceNetworkGraph from '../components/EmployeeNetwork/WorkforceNetworkGraph';
import EmployeeTable from '../components/EmployeeNetwork/EmployeeTable';

export default function Employees({ employees = [], onSelectEmployee, onOpenAddEmployee }) {
  const [viewMode, setViewMode] = useState('network'); // 'network' | 'table'

  return (
    <div className="space-y-6 pt-4 pb-12">
      {/* Header and View Mode Switcher */}
      <div className="glass-panel rounded-3xl p-6 border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <Users className="w-4 h-4" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-white font-['Outfit'] tracking-wide">
              EMPLOYEE WORKFORCE INTELLIGENCE
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 font-sans mt-1">
            Explore neural network topology, cross-functional competencies, and stress metrics
          </p>
        </div>

        {/* Toolbar: + ADD EMPLOYEE and View Toggle */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Requirement 1: [ + ADD EMPLOYEE ] Button */}
          <button
            onClick={onOpenAddEmployee}
            className="px-4 py-2 rounded-2xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-pink-500 hover:from-cyan-400 hover:to-pink-400 text-white font-mono font-bold text-xs shadow-lg shadow-cyan-500/25 flex items-center gap-2 transition-all transform active:scale-95 group border border-cyan-400/40"
          >
            <span className="text-cyan-200 text-base font-extrabold leading-none">+</span>
            <span>ADD EMPLOYEE</span>
          </button>

          {/* View Toggle */}
          <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-2xl p-1 text-xs font-mono">
            <button
              onClick={() => setViewMode('network')}
              className={`px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 transition-all ${
                viewMode === 'network'
                  ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-bold shadow-lg shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span>Neural Graph</span>
            </button>

            <button
              onClick={() => setViewMode('table')}
              className={`px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 transition-all ${
                viewMode === 'table'
                  ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-bold shadow-lg shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Table className="w-3.5 h-3.5" />
              <span>Telemetry Table</span>
            </button>
          </div>
        </div>
      </div>

      {/* Render Active View */}
      {viewMode === 'network' ? (
        <WorkforceNetworkGraph 
          employees={employees} 
          onSelectEmployee={onSelectEmployee} 
        />
      ) : (
        <EmployeeTable 
          employees={employees} 
          onSelectEmployee={onSelectEmployee} 
        />
      )}
    </div>
  );
}
