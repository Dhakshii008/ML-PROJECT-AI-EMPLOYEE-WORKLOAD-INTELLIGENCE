import React, { useState, useMemo } from 'react';
import { Search, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, ArrowUpDown, Filter } from 'lucide-react';

export default function EmployeeTable({ employees = [], onSelectEmployee }) {
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('ALL');
  const [riskFilter, setRiskFilter] = useState('ALL');
  const [sortField, setSortField] = useState('currentWorkload');
  const [sortAsc, setSortAsc] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  // Filter & Sort
  const processedEmployees = useMemo(() => {
    return employees
      .filter(emp => {
        const matchesSearch = 
          emp.name.toLowerCase().includes(search.toLowerCase()) ||
          emp.id.toLowerCase().includes(search.toLowerCase()) ||
          emp.role.toLowerCase().includes(search.toLowerCase()) ||
          emp.skills.some(s => s.toLowerCase().includes(search.toLowerCase()));

        const matchesDept = deptFilter === 'ALL' || emp.department === deptFilter;
        const matchesRisk = riskFilter === 'ALL' || emp.risk === riskFilter;

        return matchesSearch && matchesDept && matchesRisk;
      })
      .sort((a, b) => {
        let valA = a[sortField];
        let valB = b[sortField];
        if (typeof valA === 'string') {
          return sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
        }
        return sortAsc ? valA - valB : valB - valA;
      });
  }, [employees, search, deptFilter, riskFilter, sortField, sortAsc]);

  const totalPages = Math.ceil(processedEmployees.length / pageSize) || 1;
  const paginatedEmployees = processedEmployees.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false); // Default descending for metrics
    }
  };

  return (
    <div className="glass-panel rounded-3xl p-6 border border-white/10 space-y-4">
      {/* Title & Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="font-extrabold text-lg text-white font-['Outfit'] tracking-wide">
            ENTERPRISE WORKFORCE TELEMETRY TABLE
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Operational ledger with multi-column sorting, capacity auditing & deep risk profiling
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Filter by name, skill..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-white/5 border border-white/10 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 font-mono w-44 md:w-52 focus:outline-none focus:border-cyan-400"
            />
          </div>

          {/* Dept Filter */}
          <select
            value={deptFilter}
            onChange={(e) => {
              setDeptFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-slate-200 font-mono focus:outline-none focus:border-cyan-400"
          >
            <option value="ALL" className="bg-[#0b1026]">All Departments</option>
            <option value="Engineering" className="bg-[#0b1026]">Engineering</option>
            <option value="Product" className="bg-[#0b1026]">Product</option>
            <option value="Design" className="bg-[#0b1026]">Design</option>
            <option value="Operations" className="bg-[#0b1026]">Operations</option>
            <option value="Marketing" className="bg-[#0b1026]">Marketing</option>
            <option value="HR" className="bg-[#0b1026]">HR</option>
          </select>

          {/* Risk Filter */}
          <select
            value={riskFilter}
            onChange={(e) => {
              setRiskFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-slate-200 font-mono focus:outline-none focus:border-cyan-400"
          >
            <option value="ALL" className="bg-[#0b1026]">All Risk Levels</option>
            <option value="HIGH" className="bg-[#0b1026]">High Risk</option>
            <option value="MEDIUM" className="bg-[#0b1026]">Medium Risk</option>
            <option value="LOW" className="bg-[#0b1026]">Low Risk</option>
          </select>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto rounded-2xl border border-white/5">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-white/10 bg-white/[0.02] text-slate-400 font-mono text-[11px] uppercase tracking-wider">
              <th className="py-3 px-4 cursor-pointer" onClick={() => handleSort('name')}>
                <div className="flex items-center gap-1.5">
                  <span>Employee</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-3 px-3 cursor-pointer" onClick={() => handleSort('department')}>
                <div className="flex items-center gap-1.5">
                  <span>Dept / Role</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-3 px-3 cursor-pointer" onClick={() => handleSort('currentWorkload')}>
                <div className="flex items-center gap-1.5">
                  <span>Workload</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-3 px-3 cursor-pointer" onClick={() => handleSort('productivity')}>
                <div className="flex items-center gap-1.5">
                  <span>Productivity</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-3 px-3 cursor-pointer" onClick={() => handleSort('pendingTasks')}>
                <div className="flex items-center gap-1.5">
                  <span>Pending Tasks</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-3 px-3 cursor-pointer" onClick={() => handleSort('availableCapacity')}>
                <div className="flex items-center gap-1.5">
                  <span>Capacity</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-3 px-3 cursor-pointer" onClick={() => handleSort('risk')}>
                <div className="flex items-center gap-1.5">
                  <span>Risk Status</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-3 px-4">Core Skills</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 font-mono">
            {paginatedEmployees.map((emp) => {
              const isHigh = emp.risk === 'HIGH';
              const isMed = emp.risk === 'MEDIUM';

              return (
                <tr 
                  key={emp.id} 
                  onClick={() => onSelectEmployee(emp.id)}
                  className="hover:bg-white/[0.04] transition-colors cursor-pointer group"
                >
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2.5">
                      <img 
                        src={emp.avatar} 
                        alt={emp.name} 
                        className="w-8 h-8 rounded-xl object-cover border border-white/10" 
                      />
                      <div>
                        <span className="font-bold text-white group-hover:text-cyan-300 font-['Outfit'] block text-xs">
                          {emp.name}
                        </span>
                        <span className="text-[10px] text-cyan-400">
                          {emp.id}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-3">
                    <span className="text-slate-200 block font-medium">{emp.role}</span>
                    <span className="text-[10px] text-slate-400">{emp.department}</span>
                  </td>

                  <td className="py-3.5 px-3">
                    <div className="flex items-center gap-2">
                      <span className={`font-bold ${isHigh ? 'text-rose-400' : isMed ? 'text-amber-400' : 'text-emerald-400'}`}>
                        {emp.currentWorkload}%
                      </span>
                      <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${isHigh ? 'bg-rose-500' : isMed ? 'bg-amber-400' : 'bg-emerald-400'}`}
                          style={{ width: `${emp.currentWorkload}%` }}
                        />
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-3">
                    <span className="text-cyan-300 font-semibold">{emp.productivity}%</span>
                  </td>

                  <td className="py-3.5 px-3">
                    <span className="text-amber-300 font-semibold">{emp.pendingTasks} tasks</span>
                    <span className="text-[10px] text-slate-400 block">{emp.deadlineCount} deadlines</span>
                  </td>

                  <td className="py-3.5 px-3">
                    <span className="text-emerald-400 font-semibold">{emp.availableCapacity}%</span>
                  </td>

                  <td className="py-3.5 px-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                      isHigh ? 'bg-rose-500/20 text-rose-300 border-rose-500/30' :
                      isMed ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' :
                      'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                    }`}>
                      {emp.risk}
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="flex flex-wrap gap-1 max-w-[200px]">
                      {emp.skills.slice(0, 3).map((s, idx) => (
                        <span key={idx} className="px-1.5 py-0.5 rounded bg-white/5 border border-white/5 text-[10px] text-slate-300">
                          {s}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between pt-2 text-xs font-mono text-slate-400">
        <span>Showing {paginatedEmployees.length} of {processedEmployees.length} workforce personnel</span>
        
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="p-1.5 rounded-lg bg-white/5 border border-white/10 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 text-white"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          <span className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-white font-bold">
            {currentPage} / {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="p-1.5 rounded-lg bg-white/5 border border-white/10 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 text-white"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
