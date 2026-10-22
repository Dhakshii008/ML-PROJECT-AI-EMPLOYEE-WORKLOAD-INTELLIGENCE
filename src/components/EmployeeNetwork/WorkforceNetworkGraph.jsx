import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Filter, Search, Layers, UserCheck, ShieldAlert, Cpu } from 'lucide-react';

export default function WorkforceNetworkGraph({ employees = [], onSelectEmployee }) {
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [selectedRisk, setSelectedRisk] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const departments = ['ALL', 'Engineering', 'Design', 'Product', 'Operations', 'Marketing', 'HR'];
  const riskLevels = ['ALL', 'HIGH', 'MEDIUM', 'LOW'];

  // Filtered employees
  const filteredEmployees = useMemo(() => {
    return employees.filter(emp => {
      const matchDept = selectedDept === 'ALL' || emp.department === selectedDept;
      const matchRisk = selectedRisk === 'ALL' || emp.risk === selectedRisk;
      const matchSearch = searchQuery === '' || 
        emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchDept && matchRisk && matchSearch;
    });
  }, [employees, selectedDept, selectedRisk, searchQuery]);

  const getNodeColor = (risk, workload) => {
    if (risk === 'HIGH' || workload >= 80) return '#f43f5e';
    if (risk === 'MEDIUM' || workload >= 65) return '#fbbf24';
    return '#10b981';
  };

  return (
    <div className="glass-panel rounded-3xl p-6 border border-white/10 space-y-6">
      
      {/* Header and Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <Cpu className="w-4 h-4" />
            </span>
            <h3 className="font-extrabold text-lg text-white font-['Outfit'] tracking-wide">
              WORKFORCE NEURAL NETWORK
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time multi-dimensional node constellation of talent, workload pressure & risk
          </p>
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search employee, skill, role..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 w-48 md:w-56 font-mono transition-colors"
            />
          </div>

          {/* Department Select */}
          <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-xl p-1 text-xs font-mono">
            {departments.slice(0, 5).map(dept => (
              <button
                key={dept}
                onClick={() => setSelectedDept(dept)}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  selectedDept === dept 
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {dept}
              </button>
            ))}
          </div>

          {/* Risk Level Filter */}
          <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-xl p-1 text-xs font-mono">
            {riskLevels.map(r => (
              <button
                key={r}
                onClick={() => setSelectedRisk(r)}
                className={`px-2 py-1 rounded-lg transition-all ${
                  selectedRisk === r 
                    ? r === 'HIGH' ? 'bg-rose-500 text-white font-bold'
                    : r === 'MEDIUM' ? 'bg-amber-500 text-slate-950 font-bold'
                    : r === 'LOW' ? 'bg-emerald-500 text-slate-950 font-bold'
                    : 'bg-indigo-500 text-white font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Network Constellation Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredEmployees.map((emp) => {
          const color = getNodeColor(emp.risk, emp.currentWorkload);
          const isHigh = emp.risk === 'HIGH';

          return (
            <motion.div
              key={emp.id}
              whileHover={{ y: -4, scale: 1.02 }}
              onClick={() => onSelectEmployee(emp.id)}
              className={`glass-panel rounded-2xl p-4 border transition-all duration-300 cursor-pointer relative overflow-hidden group ${
                isHigh ? 'hover:border-rose-500/60 shadow-[0_4px_20px_rgba(244,63,94,0.15)]' : 'hover:border-cyan-500/40'
              }`}
            >
              {/* Dynamic Glow Accent */}
              <div 
                className="absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl opacity-15 pointer-events-none group-hover:opacity-35 transition-opacity" 
                style={{ backgroundColor: color }}
              />

              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img 
                      src={emp.avatar} 
                      alt={emp.name} 
                      className="w-11 h-11 rounded-xl object-cover border border-white/20"
                    />
                    <span 
                      className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-[#090d24]"
                      style={{ backgroundColor: color }}
                    />
                  </div>

                  <div>
                    <h4 className="font-bold text-sm text-white font-['Outfit'] group-hover:text-cyan-300 transition-colors">
                      {emp.name}
                    </h4>
                    <span className="text-[10px] font-mono text-cyan-400/90 block">
                      {emp.id} • {emp.department}
                    </span>
                  </div>
                </div>

                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                  emp.risk === 'HIGH' ? 'bg-rose-500/20 text-rose-300 border-rose-500/40' :
                  emp.risk === 'MEDIUM' ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' :
                  'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                }`}>
                  {emp.risk}
                </span>
              </div>

              <div className="mt-2.5 text-xs text-slate-300 font-medium line-clamp-1">
                {emp.role}
              </div>

              {/* Workload Progress Bar */}
              <div className="mt-3 space-y-1">
                <div className="flex justify-between text-[11px] font-mono">
                  <span className="text-slate-400">Workload</span>
                  <span className="font-bold text-white">{emp.currentWorkload}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-800/80 overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-500" 
                    style={{ 
                      width: `${emp.currentWorkload}%`,
                      backgroundColor: color 
                    }}
                  />
                </div>
              </div>

              {/* Skills Chips */}
              <div className="mt-3 flex flex-wrap gap-1">
                {emp.skills.slice(0, 3).map((skill, i) => (
                  <span key={i} className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-slate-300 border border-white/5">
                    {skill}
                  </span>
                ))}
                {emp.skills.length > 3 && (
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/5 text-slate-400">
                    +{emp.skills.length - 3}
                  </span>
                )}
              </div>

              {/* Footer Quick Metrics */}
              <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span>Prod: <strong className="text-cyan-300">{emp.productivity}%</strong></span>
                <span>Cap: <strong className="text-emerald-400">{emp.availableCapacity}%</strong></span>
                <span>Tasks: <strong className="text-amber-300">{emp.pendingTasks}</strong></span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {filteredEmployees.length === 0 && (
        <div className="text-center py-12 glass-panel rounded-2xl border border-white/5">
          <p className="text-slate-400 font-mono text-sm">No employees matched your active filter criteria.</p>
        </div>
      )}
    </div>
  );
}
