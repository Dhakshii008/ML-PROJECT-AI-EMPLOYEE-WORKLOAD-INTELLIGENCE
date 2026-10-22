import React, { useState } from 'react';
import { 
  AreaChart, Area, 
  BarChart, Bar, 
  LineChart, Line, 
  ScatterChart, Scatter, 
  PieChart, Pie, Cell, 
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid 
} from 'recharts';
import { BarChart3, TrendingUp, AlertTriangle, PieChart as PieIcon, Crosshair, Zap } from 'lucide-react';

export default function WorkloadAnalytics({ employees = [], departments = [] }) {
  const [activeTab, setActiveTab] = useState('overview');

  // 1. Department Workload Data
  const deptData = departments.map(d => ({
    name: d.name,
    workload: d.avgWorkload,
    capacity: 100 - d.avgWorkload,
    headcount: d.headcount,
    riskCount: d.riskCount
  }));

  // 2. Scatter Data: Productivity vs Workload
  const scatterData = employees.map(e => ({
    name: e.name,
    id: e.id,
    workload: e.currentWorkload,
    productivity: e.productivity,
    overtime: e.overtime,
    risk: e.risk,
    department: e.department
  }));

  // 3. Overtime & Deadline Intensity by Department
  const overtimeData = departments.map(d => {
    const deptEmps = employees.filter(e => e.department === d.name);
    const avgOvertime = deptEmps.length ? (deptEmps.reduce((acc, e) => acc + e.overtime, 0) / deptEmps.length).toFixed(1) : 0;
    const totalDeadlines = deptEmps.reduce((acc, e) => acc + e.deadlineCount, 0);
    return {
      name: d.name,
      overtime: Number(avgOvertime),
      deadlines: totalDeadlines
    };
  });

  // 4. Cluster Distribution Donut
  const clusterCounts = {
    'Balanced': employees.filter(e => e.risk === 'LOW').length,
    'High Risk / Overloaded': employees.filter(e => e.risk === 'HIGH').length,
    'Moderate Pressure': employees.filter(e => e.risk === 'MEDIUM').length,
    'High Capacity Available': employees.filter(e => e.availableCapacity >= 45).length,
  };

  const donutData = Object.entries(clusterCounts).map(([name, value]) => ({ name, value }));
  const DONUT_COLORS = ['#06b6d4', '#f43f5e', '#fbbf24', '#10b981'];

  // 5. Radar Dimensions for Team Capabilities
  const radarData = [
    { subject: 'Workload Velocity', Engineering: 88, Product: 82, Design: 65 },
    { subject: 'Overtime Margin', Engineering: 74, Product: 86, Design: 40 },
    { subject: 'Deadline Density', Engineering: 85, Product: 90, Design: 55 },
    { subject: 'Capacity Buffer', Engineering: 35, Product: 22, Design: 62 },
    { subject: 'Productivity Yield', Engineering: 92, Product: 88, Design: 90 },
    { subject: 'Cross-Flow Agility', Engineering: 78, Product: 84, Design: 70 }
  ];

  // Custom Glass Tooltip for Recharts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-panel rounded-xl p-3 border border-white/15 bg-[#0a0f29]/95 text-xs font-mono shadow-2xl">
          <p className="font-bold text-white mb-1.5 font-['Outfit']">{label || payload[0]?.payload?.name || ''}</p>
          {payload.map((entry, index) => (
            <div key={`item-${index}`} className="flex items-center justify-between gap-4 py-0.5 text-slate-300">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color || entry.fill }} />
                <span>{entry.name}:</span>
              </span>
              <span className="font-bold text-white">
                {entry.value}{entry.unit || ''}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      
      {/* Analytics Section Header */}
      <div className="glass-panel rounded-3xl p-6 border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <BarChart3 className="w-4 h-4" />
            </span>
            <h2 className="text-xl md:text-2xl font-extrabold text-white font-['Outfit'] tracking-wide">
              MULTI-DIMENSIONAL WORKFORCE ANALYTICS
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Empirical data science telemetry, workload distribution, overtime heat & productivity regression
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-2xl p-1 text-xs font-mono">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              activeTab === 'overview' ? 'bg-cyan-500 text-slate-950 font-bold shadow-lg shadow-cyan-500/20' : 'text-slate-400 hover:text-white'
            }`}
          >
            Workload & Depts
          </button>
          <button
            onClick={() => setActiveTab('productivity')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              activeTab === 'productivity' ? 'bg-cyan-500 text-slate-950 font-bold shadow-lg shadow-cyan-500/20' : 'text-slate-400 hover:text-white'
            }`}
          >
            Productivity vs Stress
          </button>
          <button
            onClick={() => setActiveTab('radar')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              activeTab === 'radar' ? 'bg-cyan-500 text-slate-950 font-bold shadow-lg shadow-cyan-500/20' : 'text-slate-400 hover:text-white'
            }`}
          >
            Capability Radar
          </button>
        </div>
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Chart 1: Department Workload vs Available Capacity */}
        <div className="glass-panel rounded-3xl p-6 border border-white/10 relative">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-base text-white font-['Outfit']">
                Department Workload vs. Available Capacity
              </h3>
              <span className="text-[11px] text-slate-400 font-mono">
                Comparative threshold across 6 operational units
              </span>
            </div>
            <span className="px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 font-mono text-[10px] border border-cyan-500/30">
              Stacked Index
            </span>
          </div>

          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="barWorkloadGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.6} />
                  </linearGradient>
                  <linearGradient id="barCapacityGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="#059669" stopOpacity={0.4} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} fontFamily="JetBrains Mono" />
                <YAxis stroke="#94a3b8" fontSize={11} fontFamily="JetBrains Mono" domain={[0, 100]} />
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  wrapperStyle={{ fontSize: '11px', fontFamily: 'JetBrains Mono', paddingTop: '10px' }} 
                />
                <Bar dataKey="workload" name="Avg Workload %" fill="url(#barWorkloadGrad)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="capacity" name="Buffer Capacity %" fill="url(#barCapacityGrad)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Overtime Hours & Deadline Pressure Trends */}
        <div className="glass-panel rounded-3xl p-6 border border-white/10 relative">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-base text-white font-['Outfit']">
                Overtime Load & Critical Deadlines
              </h3>
              <span className="text-[11px] text-slate-400 font-mono">
                Dual-axis correlation of stress drivers by department
              </span>
            </div>
            <span className="px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-300 font-mono text-[10px] border border-rose-500/30">
              Stress Telemetry
            </span>
          </div>

          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={overtimeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="areaOvertime" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f43f5e" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="#f43f5e" stopOpacity={0.05} />
                  </linearGradient>
                  <linearGradient id="areaDeadlines" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#a855f7" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="#a855f7" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} fontFamily="JetBrains Mono" />
                <YAxis stroke="#94a3b8" fontSize={11} fontFamily="JetBrains Mono" />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'JetBrains Mono', paddingTop: '10px' }} />
                <Area type="monotone" dataKey="overtime" name="Avg Overtime (hrs)" stroke="#f43f5e" fillOpacity={1} fill="url(#areaOvertime)" strokeWidth={2.5} />
                <Area type="monotone" dataKey="deadlines" name="Active Deadlines" stroke="#a855f7" fillOpacity={1} fill="url(#areaDeadlines)" strokeWidth={2.5} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Productivity vs Workload Scatter (The Burnout / Flow Quadrant) */}
        <div className="glass-panel rounded-3xl p-6 border border-white/10 relative">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-base text-white font-['Outfit']">
                Productivity vs. Workload Scatter Matrix
              </h3>
              <span className="text-[11px] text-slate-400 font-mono">
                Individual personnel plotted across the four performance quadrants
              </span>
            </div>
            <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-mono text-[10px] border border-emerald-500/30">
              Quadrant Analysis
            </span>
          </div>

          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 10, right: 15, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis 
                  type="number" 
                  dataKey="workload" 
                  name="Workload %" 
                  domain={[30, 100]} 
                  stroke="#94a3b8" 
                  fontSize={11} 
                  fontFamily="JetBrains Mono"
                  unit="%"
                />
                <YAxis 
                  type="number" 
                  dataKey="productivity" 
                  name="Productivity %" 
                  domain={[75, 100]} 
                  stroke="#94a3b8" 
                  fontSize={11} 
                  fontFamily="JetBrains Mono"
                  unit="%"
                />
                <Tooltip 
                  cursor={{ strokeDasharray: '3 3', stroke: '#06b6d4' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="glass-panel rounded-xl p-3 border border-white/15 bg-[#0a0f29]/95 text-xs font-mono shadow-2xl">
                          <p className="font-bold text-white">{data.name} ({data.id})</p>
                          <p className="text-cyan-300">{data.department}</p>
                          <div className="mt-1 space-y-0.5 text-slate-300">
                            <div>Workload: <strong className="text-white">{data.workload}%</strong></div>
                            <div>Productivity: <strong className="text-white">{data.productivity}%</strong></div>
                            <div>Risk Status: <strong className={data.risk === 'HIGH' ? 'text-rose-400' : 'text-emerald-400'}>{data.risk}</strong></div>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }} 
                />
                <Scatter name="Employees" data={scatterData} fill="#06b6d4">
                  {scatterData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.risk === 'HIGH' ? '#f43f5e' : entry.risk === 'MEDIUM' ? '#fbbf24' : '#10b981'} 
                    />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 flex items-center justify-between text-[10px] font-mono text-slate-400 px-2">
            <span>← Optimal Bandwidth</span>
            <span className="text-rose-400 font-bold">Burnout Danger Zone (&gt;80% workload) →</span>
          </div>
        </div>

        {/* Chart 4: Employee Risk & Segmentation Donut */}
        <div className="glass-panel rounded-3xl p-6 border border-white/10 relative">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-base text-white font-['Outfit']">
                Organizational Risk Segmentation
              </h3>
              <span className="text-[11px] text-slate-400 font-mono">
                Distribution across supervised ML risk classifications
              </span>
            </div>
            <span className="px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 font-mono text-[10px] border border-purple-500/30">
              ML Segmentation
            </span>
          </div>

          <div className="h-[300px] w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={donutData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={105}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {donutData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={DONUT_COLORS[index % DONUT_COLORS.length]} stroke="rgba(0,0,0,0.5)" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'JetBrains Mono' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Full-Width Capability Radar Matrix */}
      {activeTab === 'radar' && (
        <div className="glass-panel rounded-3xl p-6 border border-white/10 animate-fade-in">
          <div className="mb-4">
            <h3 className="font-bold text-base text-white font-['Outfit']">
              Multi-Axis Departmental Equilibrium Radar
            </h3>
            <span className="text-xs text-slate-400 font-mono">
              Six-dimensional cross-functional balance comparing Engineering, Product, and Design teams
            </span>
          </div>

          <div className="h-[360px] w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart outerRadius={120} data={radarData}>
                <PolarGrid stroke="rgba(255,255,255,0.1)" />
                <PolarAngleAxis dataKey="subject" stroke="#94a3b8" fontSize={11} fontFamily="JetBrains Mono" />
                <PolarRadiusAxis stroke="#64748b" angle={30} domain={[0, 100]} />
                <Radar name="Engineering" dataKey="Engineering" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.3} />
                <Radar name="Product" dataKey="Product" stroke="#a855f7" fill="#a855f7" fillOpacity={0.3} />
                <Radar name="Design" dataKey="Design" stroke="#ec4899" fill="#ec4899" fillOpacity={0.3} />
                <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'JetBrains Mono', paddingTop: '10px' }} />
                <Tooltip content={<CustomTooltip />} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
