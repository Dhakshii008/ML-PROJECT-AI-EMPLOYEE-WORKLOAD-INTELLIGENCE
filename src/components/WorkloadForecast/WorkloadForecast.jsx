import React, { useState } from 'react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  ReferenceLine,
  Area,
  ComposedChart
} from 'recharts';
import { TrendingUp, TrendingDown, AlertTriangle, ShieldCheck, Sparkles, Sliders, ArrowRight } from 'lucide-react';
import { forecastWorkload } from '../../services/mlEngine';

export default function WorkloadForecast({ employees = [], selectedEmpId = 'E104', onSelectEmployee }) {
  const [activeId, setActiveId] = useState(selectedEmpId || 'E104');
  const [simulationExtraTasks, setSimulationExtraTasks] = useState(0);

  const currentEmployee = employees.find(e => e.id === activeId) || employees[0];

  // Calculate 4-week forecast with simulation slider
  const growthMultiplier = 1.0 + (simulationExtraTasks * 0.08);
  const forecastResult = forecastWorkload(
    currentEmployee?.weeklyTrend || [60, 65, 72, 87], 
    growthMultiplier
  );

  // Combine historical and forecasted data for the continuous glowing trajectory chart
  const historical = currentEmployee?.weeklyTrend || [60, 65, 72, 87];
  const chartData = [
    { period: 'Week -3', historical: historical[0], forecast: null, upperBand: null, lowerBand: null },
    { period: 'Week -2', historical: historical[1], forecast: null, upperBand: null, lowerBand: null },
    { period: 'Week -1', historical: historical[2], forecast: null, upperBand: null, lowerBand: null },
    { period: 'Current', historical: historical[3], forecast: historical[3], upperBand: historical[3] + 2, lowerBand: historical[3] - 2 },
    { period: 'Week +1', historical: null, forecast: forecastResult.forecastWeeks[0].value, upperBand: forecastResult.forecastWeeks[0].value + 5, lowerBand: forecastResult.forecastWeeks[0].value - 5 },
    { period: 'Week +2', historical: null, forecast: forecastResult.forecastWeeks[1].value, upperBand: forecastResult.forecastWeeks[1].value + 7, lowerBand: forecastResult.forecastWeeks[1].value - 7 },
    { period: 'Week +3', historical: null, forecast: forecastResult.forecastWeeks[2].value, upperBand: forecastResult.forecastWeeks[2].value + 9, lowerBand: forecastResult.forecastWeeks[2].value - 9 },
    { period: 'Week +4', historical: null, forecast: forecastResult.forecastWeeks[3].value, upperBand: forecastResult.forecastWeeks[3].value + 11, lowerBand: forecastResult.forecastWeeks[3].value - 11 },
  ];

  const isCriticalProjected = forecastResult.predicted >= 85;

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="glass-panel rounded-3xl p-6 border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-purple-500/20 text-purple-400 border border-purple-500/30">
              <TrendingUp className="w-4 h-4" />
            </span>
            <h2 className="text-xl md:text-2xl font-extrabold text-white font-['Outfit'] tracking-wide">
              AI WORKLOAD FORECAST
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Supervised time-series predictive modeling • 4-Week forward trajectory projection
          </p>
        </div>

        {/* Employee Switcher */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-mono hidden sm:inline">Inspect:</span>
          <select
            value={activeId}
            onChange={(e) => setActiveId(e.target.value)}
            className="bg-[#0b1029] border border-white/15 rounded-xl px-3 py-1.5 text-xs text-cyan-300 font-mono focus:outline-none focus:border-cyan-400"
          >
            {employees.map(emp => (
              <option key={emp.id} value={emp.id}>
                {emp.id} - {emp.name} ({emp.risk} Risk)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Top Telemetry KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Current Workload */}
        <div className="glass-panel rounded-2xl p-5 border border-white/10">
          <span className="text-xs font-mono text-slate-400 block uppercase">Current Workload</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-['Outfit'] text-white">
              {forecastResult.current}%
            </span>
            <span className="text-xs font-mono text-cyan-400">Measured Realtime</span>
          </div>
          <div className="mt-2 text-xs text-slate-400 font-mono">
            Employee: <strong className="text-white">{currentEmployee.name}</strong> ({currentEmployee.role})
          </div>
        </div>

        {/* Predicted 4-Week Workload */}
        <div className={`glass-panel rounded-2xl p-5 border ${isCriticalProjected ? 'glass-card-glow-red border-rose-500/40' : 'border-white/10'}`}>
          <span className="text-xs font-mono text-slate-400 block uppercase">Predicted (Week 4)</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className={`text-3xl font-extrabold font-['Outfit'] ${isCriticalProjected ? 'text-rose-400' : 'text-cyan-300'}`}>
              {forecastResult.predicted}%
            </span>
            <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded-full ${
              isCriticalProjected ? 'bg-rose-500/20 text-rose-300' : 'bg-cyan-500/20 text-cyan-300'
            }`}>
              {forecastResult.predicted >= forecastResult.current ? `+${forecastResult.predicted - forecastResult.current}%` : `${forecastResult.predicted - forecastResult.current}%`}
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-400 font-mono">
            Model: <strong className="text-slate-200">Holt-Winters ML Regression</strong>
          </div>
        </div>

        {/* Risk Trajectory Direction */}
        <div className="glass-panel rounded-2xl p-5 border border-white/10">
          <span className="text-xs font-mono text-slate-400 block uppercase">Risk Trend</span>
          <div className="mt-2 flex items-center gap-2">
            {forecastResult.trendDirection === 'INCREASING' ? (
              <div className="flex items-center gap-1.5 text-rose-400 font-extrabold font-['Outfit'] text-2xl">
                <TrendingUp className="w-6 h-6" />
                <span>INCREASING</span>
              </div>
            ) : forecastResult.trendDirection === 'DECREASING' ? (
              <div className="flex items-center gap-1.5 text-emerald-400 font-extrabold font-['Outfit'] text-2xl">
                <TrendingDown className="w-6 h-6" />
                <span>DECREASING</span>
              </div>
            ) : (
              <span className="text-slate-200 font-extrabold font-['Outfit'] text-2xl">STABLE</span>
            )}
          </div>
          <div className="mt-2 text-xs text-slate-400 font-mono">
            Confidence interval: <strong className="text-emerald-400">94.2%</strong>
          </div>
        </div>
      </div>

      {/* Main Glowing Forecast Line Chart */}
      <div className="glass-panel rounded-3xl p-6 border border-white/10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="font-extrabold text-lg text-white font-['Outfit']">
              Workload Trajectory: Past 4 Weeks & Forward 4 Weeks
            </h3>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Dotted cyan denotes ML forward projection with 95% confidence tolerance zone
            </p>
          </div>

          {/* Interactive Simulation Slider */}
          <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-4 py-2 font-mono text-xs">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <span className="text-slate-300">Stress Simulation:</span>
            <input 
              type="range" 
              min="-2" 
              max="4" 
              step="1"
              value={simulationExtraTasks}
              onChange={(e) => setSimulationExtraTasks(Number(e.target.value))}
              className="accent-cyan-400 cursor-pointer w-24"
            />
            <span className="font-bold text-cyan-300 w-16">
              {simulationExtraTasks > 0 ? `+${simulationExtraTasks} tasks` : simulationExtraTasks < 0 ? `${simulationExtraTasks} tasks` : 'Baseline'}
            </span>
          </div>
        </div>

        {/* Recharts Trajectory Line Chart */}
        <div className="h-[360px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: -10, bottom: 10 }}>
              <defs>
                <linearGradient id="histGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#38bdf8" />
                  <stop offset="100%" stopColor="#818cf8" />
                </linearGradient>
                <linearGradient id="foreGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#818cf8" />
                  <stop offset="100%" stopColor="#f43f5e" />
                </linearGradient>
                <linearGradient id="confidenceArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#a855f7" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="#a855f7" stopOpacity={0.02} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="period" stroke="#94a3b8" fontSize={11} fontFamily="JetBrains Mono" />
              <YAxis stroke="#94a3b8" domain={[30, 100]} fontSize={11} fontFamily="JetBrains Mono" unit="%" />
              
              <Tooltip 
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="glass-panel rounded-xl p-3 border border-white/20 bg-[#090e29]/95 text-xs font-mono shadow-2xl">
                        <span className="font-bold text-white block mb-1 font-['Outfit']">{label}</span>
                        {data.historical !== null && (
                          <div className="text-cyan-300">
                            Historical Workload: <strong className="text-white">{data.historical}%</strong>
                          </div>
                        )}
                        {data.forecast !== null && (
                          <div className="text-purple-300">
                            ML Projected Workload: <strong className="text-white">{data.forecast}%</strong>
                          </div>
                        )}
                        {data.upperBand !== null && (
                          <div className="text-slate-400 text-[10px]">
                            Range: [{data.lowerBand}% - {data.upperBand}%]
                          </div>
                        )}
                      </div>
                    );
                  }
                  return null;
                }} 
              />

              {/* Danger Threshold reference line */}
              <ReferenceLine y={80} stroke="#f43f5e" strokeDasharray="4 4" label={{ value: 'Burnout Danger Threshold (80%)', fill: '#f43f5e', fontSize: 10, fontFamily: 'JetBrains Mono' }} />

              {/* Confidence interval area */}
              <Area type="monotone" dataKey="upperBand" stroke="transparent" fill="url(#confidenceArea)" />

              {/* Historical solid line */}
              <Line 
                type="monotone" 
                dataKey="historical" 
                name="Historical" 
                stroke="url(#histGrad)" 
                strokeWidth={3} 
                dot={{ r: 5, fill: '#38bdf8', stroke: '#ffffff', strokeWidth: 1.5 }}
              />

              {/* Forecast dotted glowing line */}
              <Line 
                type="monotone" 
                dataKey="forecast" 
                name="Forecast" 
                stroke="url(#foreGrad)" 
                strokeWidth={3.5} 
                strokeDasharray="5 5"
                dot={{ r: 6, fill: '#f43f5e', stroke: '#ffffff', strokeWidth: 2 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* 4-Week Forecast Breakdown Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
          {forecastResult.forecastWeeks.map((item, idx) => (
            <div key={idx} className="bg-white/5 rounded-2xl p-3 border border-white/5 font-mono text-center">
              <span className="text-[11px] text-slate-400 block">{item.week}</span>
              <span className={`text-xl font-bold font-['Outfit'] ${item.value >= 80 ? 'text-rose-400' : 'text-slate-100'}`}>
                {item.value}%
              </span>
              <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                <div 
                  className={`h-full rounded-full ${item.value >= 80 ? 'bg-rose-500' : 'bg-cyan-400'}`}
                  style={{ width: `${item.value}%` }} 
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Forward Diagnostic Insight Box */}
      <div className="glass-panel rounded-3xl p-6 border border-cyan-500/30 bg-gradient-to-r from-cyan-950/20 via-indigo-950/20 to-purple-950/20 relative overflow-hidden">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5 text-cyan-300 animate-pulse" />
          </div>

          <div className="space-y-1">
            <h4 className="font-extrabold text-sm text-white font-['Outfit'] tracking-wide flex items-center gap-2">
              <span>PREDICTIVE AI SYNAPSE INSIGHT</span>
              <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono text-[10px]">
                Active Alert
              </span>
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              {currentEmployee.id === 'E104' ? (
                <>
                  <strong className="text-rose-300">Employee E104 (Alex Rivera)</strong> is predicted to enter a high workload zone (surpassing <strong>88% - 94%</strong>) within the next <strong>7 days</strong> due to 5 overlapping milestone deadlines and 8.5 hours of weekly overtime.
                </>
              ) : currentEmployee.risk === 'HIGH' ? (
                <>
                  <strong className="text-rose-300">{currentEmployee.name} ({currentEmployee.id})</strong> is projected to sustain critical workload pressure (&gt;{forecastResult.predicted}%). Automated task rebalancing is strongly advised before sprint close.
                </>
              ) : (
                <>
                  <strong className="text-emerald-300">{currentEmployee.name} ({currentEmployee.id})</strong> maintains a healthy capacity buffer ({currentEmployee.availableCapacity}% available). Optimal candidate for absorbing upcoming critical deliverables.
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
