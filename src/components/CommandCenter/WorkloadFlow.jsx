import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { GitCommit, ArrowRight, Zap, RefreshCw, Layers } from 'lucide-react';

export default function WorkloadFlow({ departments = [] }) {
  const [selectedDept, setSelectedDept] = useState(null);

  // Layout positions for the 6 departments in a futuristic hex-orbital cluster
  const deptPositions = {
    Engineering: { x: 300, y: 110, color: '#06b6d4', status: 'high' },
    Product: { x: 620, y: 130, color: '#a855f7', status: 'high' },
    Design: { x: 170, y: 320, color: '#ec4899', status: 'balanced' },
    Operations: { x: 740, y: 320, color: '#f59e0b', status: 'high' },
    Marketing: { x: 320, y: 470, color: '#10b981', status: 'optimal' },
    HR: { x: 580, y: 470, color: '#6366f1', status: 'optimal' }
  };

  // Flow interconnections between departments
  const flows = [
    { from: 'Engineering', to: 'Product', label: 'Feature Delivery', load: 84, intensity: 'high', speed: '1.2s' },
    { from: 'Design', to: 'Engineering', label: 'Asset Specs', load: 68, intensity: 'balanced', speed: '2.2s' },
    { from: 'Product', to: 'Operations', label: 'Release Readiness', load: 79, intensity: 'high', speed: '1.5s' },
    { from: 'Design', to: 'Product', label: 'UX Validation', load: 62, intensity: 'balanced', speed: '2.5s' },
    { from: 'Marketing', to: 'Product', label: 'Campaign Demands', load: 45, intensity: 'optimal', speed: '3.5s' },
    { from: 'HR', to: 'Operations', label: 'Capacity Provision', load: 40, intensity: 'optimal', speed: '3.8s' },
    { from: 'Operations', to: 'Engineering', label: 'Infra Alerts', load: 76, intensity: 'high', speed: '1.4s' }
  ];

  const getColorByIntensity = (intensity) => {
    switch (intensity) {
      case 'high': return '#f43f5e'; // Red / Coral glowing
      case 'balanced': return '#06b6d4'; // Cyan / Purple
      case 'optimal': return '#10b981'; // Emerald Green
      default: return '#818cf8';
    }
  };

  return (
    <div className="glass-panel rounded-3xl p-6 border border-white/10 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[300px] bg-gradient-to-tr from-cyan-500/10 via-purple-500/10 to-pink-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 relative z-10">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <Zap className="w-4 h-4" />
            </span>
            <h3 className="font-extrabold text-lg text-white font-['Outfit'] tracking-wide">
              WORKLOAD FLOW INTELLIGENCE
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Dynamic inter-departmental task velocity, handover bottlenecks & flow intensities
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-300">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            <span>High Intensity Flow (&gt;75%)</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            <span>Balanced Flow</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Available Capacity</span>
          </div>
        </div>
      </div>

      {/* SVG Interactive Flow Graph Canvas */}
      <div className="relative w-full h-[520px] rounded-2xl bg-[#060a1a]/80 border border-white/5 overflow-hidden flex items-center justify-center">
        <svg 
          viewBox="0 0 920 580" 
          className="w-full h-full object-contain select-none"
        >
          <defs>
            {/* Flow Line Gradients */}
            <linearGradient id="flow-high" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#fb923c" stopOpacity="0.8" />
            </linearGradient>
            <linearGradient id="flow-balanced" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#a855f7" stopOpacity="0.8" />
            </linearGradient>
            <linearGradient id="flow-optimal" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.8" />
            </linearGradient>

            <filter id="neon-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Render Flow Connections */}
          {flows.map((flow, index) => {
            const start = deptPositions[flow.from];
            const end = deptPositions[flow.to];
            if (!start || !end) return null;

            // Generate quadratic or cubic curve
            const midX = (start.x + end.x) / 2 + (start.y - end.y) * 0.15;
            const midY = (start.y + end.y) / 2 + (end.x - start.x) * 0.15;
            const pathD = `M ${start.x} ${start.y} Q ${midX} ${midY} ${end.x} ${end.y}`;

            const isSelected = selectedDept === flow.from || selectedDept === flow.to;
            const flowColor = getColorByIntensity(flow.intensity);

            return (
              <g key={`flow-${index}`} className="group cursor-pointer">
                {/* Background base path */}
                <path
                  d={pathD}
                  fill="none"
                  stroke={flowColor}
                  strokeOpacity={isSelected ? 0.4 : 0.15}
                  strokeWidth={flow.intensity === 'high' ? 4 : 2.5}
                />

                {/* Animated dash flow */}
                <path
                  d={pathD}
                  fill="none"
                  stroke={flowColor}
                  strokeWidth={flow.intensity === 'high' ? 3.5 : 2}
                  strokeDasharray="6 12"
                  filter="url(#neon-glow)"
                  className="transition-all duration-300"
                  style={{
                    animation: `dash-flow ${flow.speed} linear infinite`,
                    opacity: isSelected || !selectedDept ? 0.9 : 0.25
                  }}
                />

                {/* Midpoint flow badge */}
                <g transform={`translate(${midX}, ${midY})`} className="opacity-75 group-hover:opacity-100 transition-opacity">
                  <rect
                    x="-42"
                    y="-11"
                    width="84"
                    height="22"
                    rx="11"
                    fill="#0a0f26"
                    stroke={flowColor}
                    strokeWidth="1.2"
                  />
                  <text
                    x="0"
                    y="3"
                    fill="#e2e8f0"
                    fontSize="9.5"
                    fontFamily="JetBrains Mono"
                    fontWeight="600"
                    textAnchor="middle"
                  >
                    {flow.load}% vol
                  </text>
                </g>
              </g>
            );
          })}

          {/* Render Department Nodes */}
          {Object.entries(deptPositions).map(([deptName, pos]) => {
            const deptInfo = departments.find(d => d.name === deptName) || {
              avgWorkload: pos.status === 'high' ? 78 : pos.status === 'balanced' ? 64 : 48,
              headcount: 36,
              code: deptName.substring(0, 3).toUpperCase()
            };

            const isSelected = selectedDept === deptName;

            return (
              <g
                key={deptName}
                transform={`translate(${pos.x}, ${pos.y})`}
                onClick={() => setSelectedDept(isSelected ? null : deptName)}
                className="cursor-pointer group"
              >
                {/* Glowing Outer Ring */}
                <circle
                  r={isSelected ? 48 : 42}
                  fill="none"
                  stroke={pos.color}
                  strokeWidth="1.5"
                  strokeDasharray="5 5"
                  opacity={isSelected ? 0.9 : 0.35}
                  className="transition-all duration-300"
                />

                {/* Node Solid Glass Center */}
                <circle
                  r={36}
                  fill="#090e24"
                  stroke={pos.color}
                  strokeWidth={isSelected ? 3 : 2}
                  filter="url(#neon-glow)"
                  className="transition-all duration-300 group-hover:stroke-white"
                />

                {/* Department Acronym */}
                <text
                  x="0"
                  y="-4"
                  fill="#ffffff"
                  fontSize="13"
                  fontFamily="Outfit"
                  fontWeight="800"
                  textAnchor="middle"
                >
                  {deptInfo.code || deptName.substring(0, 3).toUpperCase()}
                </text>

                {/* Workload Metric */}
                <text
                  x="0"
                  y="14"
                  fill={pos.color}
                  fontSize="11"
                  fontFamily="JetBrains Mono"
                  fontWeight="700"
                  textAnchor="middle"
                >
                  {deptInfo.avgWorkload}%
                </text>

                {/* Department Label Outside */}
                <text
                  x="0"
                  y="56"
                  fill="#cbd5e1"
                  fontSize="11"
                  fontFamily="Plus Jakarta Sans"
                  fontWeight="600"
                  textAnchor="middle"
                >
                  {deptName}
                </text>

                {/* Headcount Chip */}
                <g transform="translate(0, 68)">
                  <rect
                    x="-28"
                    y="0"
                    width="56"
                    height="16"
                    rx="8"
                    fill="#1e293b"
                    stroke="rgba(255,255,255,0.1)"
                  />
                  <text
                    x="0"
                    y="11"
                    fill="#94a3b8"
                    fontSize="9"
                    fontFamily="JetBrains Mono"
                    textAnchor="middle"
                  >
                    {deptInfo.headcount} staff
                  </text>
                </g>
              </g>
            );
          })}
        </svg>

        {/* Selected Department Floating Detail Overlay */}
        {selectedDept && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 glass-panel rounded-2xl p-4 border border-cyan-500/30 backdrop-blur-xl bg-[#090d24]/90 z-20"
          >
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10">
              <span className="font-extrabold text-sm text-white font-['Outfit']">{selectedDept} Intelligence</span>
              <button 
                onClick={() => setSelectedDept(null)}
                className="text-xs text-slate-400 hover:text-white font-mono px-2 py-0.5 rounded bg-white/5"
              >
                ✕ Close
              </button>
            </div>
            <div className="text-xs text-slate-300 space-y-1.5 font-mono">
              <div className="flex justify-between">
                <span className="text-slate-400">Average Workload:</span>
                <span className="text-cyan-300 font-bold">{deptPositions[selectedDept]?.status === 'high' ? '78%' : '61%'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Active Cross-Flows:</span>
                <span className="text-white">
                  {flows.filter(f => f.from === selectedDept || f.to === selectedDept).length} links
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Flow State:</span>
                <span className={`font-bold ${
                  deptPositions[selectedDept]?.status === 'high' ? 'text-rose-400' : 'text-emerald-400'
                }`}>
                  {deptPositions[selectedDept]?.status.toUpperCase()} VELOCITY
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      <style>{`
        @keyframes dash-flow {
          to {
            stroke-dashoffset: -36;
          }
        }
      `}</style>
    </div>
  );
}
