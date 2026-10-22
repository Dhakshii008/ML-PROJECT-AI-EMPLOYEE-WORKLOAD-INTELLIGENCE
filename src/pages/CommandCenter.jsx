import React from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, Users, AlertTriangle, Activity, Award, Sparkles, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import KPIWidget from '../components/CommandCenter/KPIWidget';
import WorkloadFlow from '../components/CommandCenter/WorkloadFlow';

export default function CommandCenter({ 
  employees = [], 
  departments = [], 
  onNavigate, 
  onSelectEmployee 
}) {
  const highRiskEmployees = employees.filter(e => e.risk === 'HIGH');
  const avgWorkload = Math.round(
    employees.reduce((acc, curr) => acc + curr.currentWorkload, 0) / (employees.length || 1)
  );
  const avgProductivity = Math.round(
    employees.reduce((acc, curr) => acc + curr.productivity, 0) / (employees.length || 1)
  );

  return (
    <div className="space-y-8 pt-4 pb-12">
      
      {/* Page Header */}
      <div className="glass-panel rounded-3xl p-6 border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <LayoutDashboard className="w-4 h-4" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-white font-['Outfit'] tracking-wide">
              WORKFORCE COMMAND CENTER
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 font-sans mt-1">
            "Real-time intelligence across your organization"
          </p>
        </div>

        {/* Action shortcut to Allocator */}
        <button
          onClick={() => onNavigate('task-allocation')}
          className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-xs font-mono tracking-wider shadow-lg shadow-cyan-500/20 flex items-center gap-2 self-start md:self-center transition-all"
        >
          <Sparkles className="w-4 h-4" />
          <span>ALLOCATE NEW TASK</span>
        </button>
      </div>

      {/* TOP KPI CARDS (Requirements: 248 Total, 37 High Risk, 68% Avg Workload, 82% Productivity) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPIWidget
          title="TOTAL EMPLOYEES"
          targetValue={248}
          unit=""
          trend="+12 this quarter"
          trendPositive={true}
          iconType="users"
          theme="cyan"
          subtitle="6 functional departments"
        />

        <KPIWidget
          title="HIGH RISK"
          targetValue={37}
          unit=""
          trend="↑ 8.4%"
          trendPositive={false}
          iconType="risk"
          theme="red"
          subtitle="Immediate triage recommended"
        />

        <KPIWidget
          title="AVERAGE WORKLOAD"
          targetValue={68}
          unit="%"
          trend="Balanced median"
          trendPositive={true}
          iconType="activity"
          theme="purple"
          subtitle="Threshold safe ceiling: 75%"
        />

        <KPIWidget
          title="PRODUCTIVITY"
          targetValue={82}
          unit="%"
          trend="↑ 4.2% MoM"
          trendPositive={true}
          iconType="productivity"
          theme="emerald"
          subtitle="Calculated on velocity yield"
        />
      </div>

      {/* SIGNATURE WORKLOAD FLOW VISUALIZATION */}
      <WorkloadFlow departments={departments} />

      {/* High-Risk Personnel Quick Triage Grid & Strategic Signals */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* High Risk Critical Watchlist (7 cols) */}
        <div className="lg:col-span-7 glass-panel rounded-3xl p-6 border border-rose-500/30 space-y-4">
          <div className="flex items-center justify-between border-b border-rose-500/20 pb-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              <h3 className="font-extrabold text-base text-white font-['Outfit']">
                HIGH BURNOUT RISK PERSONNEL
              </h3>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
              {highRiskEmployees.length} Critical Flagged
            </span>
          </div>

          <div className="space-y-3">
            {highRiskEmployees.map((emp) => (
              <div
                key={emp.id}
                onClick={() => onSelectEmployee(emp.id)}
                className="bg-white/5 hover:bg-white/[0.08] border border-white/5 rounded-2xl p-4 flex items-center justify-between gap-4 cursor-pointer transition-all group"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={emp.avatar}
                    alt={emp.name}
                    className="w-10 h-10 rounded-xl object-cover border border-rose-500/40"
                  />
                  <div>
                    <h4 className="font-bold text-sm text-white font-['Outfit'] group-hover:text-rose-300 transition-colors">
                      {emp.name} ({emp.id})
                    </h4>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {emp.role} • {emp.department}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 font-mono text-xs text-right">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Workload</span>
                    <strong className="text-rose-400 text-sm font-bold">{emp.currentWorkload}%</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Overtime</span>
                    <strong className="text-white text-sm font-bold">{emp.overtime}h</strong>
                  </div>
                  <button className="p-2 rounded-xl bg-rose-500/20 text-rose-300 group-hover:bg-rose-500/30">
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Available Buffer Capacity & Rebalancing Recommendations (5 cols) */}
        <div className="lg:col-span-5 glass-panel rounded-3xl p-6 border border-emerald-500/30 space-y-4">
          <div className="flex items-center justify-between border-b border-emerald-500/20 pb-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <h3 className="font-extrabold text-base text-white font-['Outfit']">
                AVAILABLE BUFFER CAPACITY
              </h3>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Ready for Dispatch
            </span>
          </div>

          <div className="space-y-3">
            {employees.filter(e => e.availableCapacity >= 40).slice(0, 3).map((emp) => (
              <div
                key={emp.id}
                onClick={() => onSelectEmployee(emp.id)}
                className="bg-white/5 hover:bg-white/[0.08] border border-white/5 rounded-2xl p-4 flex items-center justify-between gap-4 cursor-pointer transition-all group"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={emp.avatar}
                    alt={emp.name}
                    className="w-10 h-10 rounded-xl object-cover border border-emerald-500/40"
                  />
                  <div>
                    <h4 className="font-bold text-sm text-white font-['Outfit'] group-hover:text-emerald-300 transition-colors">
                      {emp.name} ({emp.id})
                    </h4>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {emp.role}
                    </span>
                  </div>
                </div>

                <div className="text-right font-mono">
                  <span className="text-[10px] text-slate-400 block">Available</span>
                  <strong className="text-emerald-400 text-sm font-bold">{emp.availableCapacity}%</strong>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2">
            <button
              onClick={() => onNavigate('task-allocation')}
              className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-cyan-300 text-xs font-mono font-bold flex items-center justify-center gap-2 transition-colors"
            >
              <span>Dispatch via Smart Allocator</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
