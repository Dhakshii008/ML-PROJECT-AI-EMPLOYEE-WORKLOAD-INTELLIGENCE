import React from 'react';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  ArrowRight, 
  Cpu, 
  Activity, 
  Layers, 
  TrendingUp, 
  ShieldAlert, 
  Zap, 
  Compass, 
  CheckCircle2 
} from 'lucide-react';
import HeroNetworkVisualization from '../components/Hero/HeroNetworkVisualization';

export default function Home({ onNavigate, employees = [], onSelectEmployee }) {
  const productFlowSteps = [
    { label: "DATA", desc: "Telemetry Streams" },
    { label: "ANALYTICS", desc: "Heuristic Auditing" },
    { label: "ML", desc: "Random Forest Models" },
    { label: "WORKLOAD INTELLIGENCE", desc: "Cognitive Indexing" },
    { label: "PREDICTION", desc: "Time-Series Forecasting" },
    { label: "SMART TASK MATCHING", desc: "Multi-Objective Optimization" },
    { label: "TASK ASSIGNMENT", desc: "Automated Balancing" },
    { label: "WORKLOAD UPDATE", desc: "Live Recalculation" },
    { label: "AI INSIGHTS", desc: "Strategic Prescriptions" }
  ];

  return (
    <div className="space-y-16 pt-6 pb-12">
      
      {/* HERO SECTION */}
      <section className="relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Hero Copy (5 cols) */}
          <div className="lg:col-span-5 space-y-6 text-center lg:text-left z-10">
            {/* Top Badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-panel border border-cyan-400/40 text-cyan-300 text-xs font-mono shadow-[0_0_15px_rgba(6,182,212,0.2)]"
            >
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span>NEXT-GEN AI WORKFORCE OPERATING SYSTEM</span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-black font-['Outfit'] tracking-tight leading-[1.1]"
            >
              <span className="block text-white">AI EMPLOYEE</span>
              <span className="gradient-text-cyan-purple block mt-1">
                WORKLOAD INTELLIGENCE
              </span>
            </motion.h1>

            {/* Required Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-base sm:text-lg text-slate-300 font-sans font-normal max-w-xl mx-auto lg:mx-0 leading-relaxed"
            >
              "Understand the workload. Predict the pressure. Balance the work."
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="text-xs text-slate-400 font-mono leading-normal max-w-lg mx-auto lg:mx-0"
            >
              Empowered by Machine Learning risk classification, time-series capacity forecasting, and multi-variable task allocation algorithms.
            </motion.p>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2"
            >
              <button
                onClick={() => onNavigate('command-center')}
                className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-extrabold text-xs font-mono tracking-wider shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2.5 transition-all transform active:scale-95 group"
              >
                <Compass className="w-4 h-4 text-cyan-200" />
                <span>EXPLORE WORKFORCE</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => onNavigate('task-allocation')}
                className="w-full sm:w-auto px-7 py-3.5 rounded-2xl glass-panel hover:bg-white/10 border border-white/20 text-white font-extrabold text-xs font-mono tracking-wider flex items-center justify-center gap-2.5 transition-all transform active:scale-95"
              >
                <Sparkles className="w-4 h-4 text-pink-400" />
                <span>SMART TASK ALLOCATOR</span>
              </button>
            </motion.div>

            {/* Quick Metrics Ticker */}
            <div className="grid grid-cols-3 gap-3 pt-4 max-w-md mx-auto lg:mx-0 text-left font-mono">
              <div className="glass-panel rounded-2xl p-2.5 border border-white/10 text-center">
                <span className="text-[10px] text-slate-400 block uppercase">Realtime Staff</span>
                <span className="text-lg font-bold text-white font-['Outfit']">248 Active</span>
              </div>
              <div className="glass-panel rounded-2xl p-2.5 border border-rose-500/30 text-center">
                <span className="text-[10px] text-rose-300 block uppercase">Burnout Risk</span>
                <span className="text-lg font-bold text-rose-400 font-['Outfit']">37 High</span>
              </div>
              <div className="glass-panel rounded-2xl p-2.5 border border-emerald-500/30 text-center">
                <span className="text-[10px] text-emerald-300 block uppercase">Available Cap</span>
                <span className="text-lg font-bold text-emerald-400 font-['Outfit']">32% Buffer</span>
              </div>
            </div>
          </div>

          {/* Hero AI Network Visualization (7 cols) */}
          <div className="lg:col-span-7 relative z-10">
            <div className="glass-panel rounded-3xl p-3 border border-white/15 shadow-2xl relative">
              <div className="absolute top-4 left-6 z-20 flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-cyan-400 animate-pulse" />
                <span className="text-xs font-mono font-bold text-white tracking-wider">
                  ENTERPRISE NEURAL NETWORK CLUSTER
                </span>
              </div>

              <HeroNetworkVisualization 
                employees={employees} 
                onSelectEmployee={onSelectEmployee} 
              />
            </div>
          </div>

        </div>
      </section>

      {/* THE COMPLETE COGNITIVE PRODUCT FLOW */}
      <section className="glass-panel rounded-3xl p-8 border border-white/10 relative overflow-hidden">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-widest block mb-1">
            System Architecture
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white font-['Outfit']">
            THE INTELLIGENCE PIPELINE FLOW
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-1">
            From raw organizational telemetry to autonomous cognitive rebalancing
          </p>
        </div>

        {/* Responsive Scrolling/Flowing Pipeline Steps */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-9 gap-3">
          {productFlowSteps.map((step, idx) => (
            <div 
              key={idx} 
              className="bg-white/5 rounded-2xl p-3 border border-white/5 text-center flex flex-col justify-between group hover:border-cyan-400/40 hover:bg-white/[0.08] transition-all"
            >
              <div>
                <span className="text-[10px] font-mono text-cyan-400/90 font-bold block mb-1">
                  0{idx + 1}
                </span>
                <span className="text-xs font-extrabold text-white font-['Outfit'] block leading-tight group-hover:text-cyan-300">
                  {step.label}
                </span>
              </div>
              <span className="text-[9px] font-mono text-slate-400 block mt-2">
                {step.desc}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* THREE VALUE PROPOSITIONS */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel rounded-3xl p-6 border border-white/10 space-y-3 relative overflow-hidden group hover:border-cyan-500/40 transition-all">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300">
            <Activity className="w-6 h-6" />
          </div>
          <h3 className="font-extrabold text-lg text-white font-['Outfit']">
            Workload & Burnout Detection
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Multi-variable scoring incorporates overtime, pending items, meeting exhaustion, and upcoming deadlines into a unified 0-100% capacity index.
          </p>
        </div>

        <div className="glass-panel rounded-3xl p-6 border border-white/10 space-y-3 relative overflow-hidden group hover:border-purple-500/40 transition-all">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-purple-300">
            <TrendingUp className="w-6 h-6" />
          </div>
          <h3 className="font-extrabold text-lg text-white font-['Outfit']">
            4-Week Predictive Forecast
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Time-series algorithms model historical burnout trajectory, detecting staff entering dangerous stress zones up to 7 days in advance.
          </p>
        </div>

        <div className="glass-panel rounded-3xl p-6 border border-white/10 space-y-3 relative overflow-hidden group hover:border-pink-500/40 transition-all">
          <div className="w-12 h-12 rounded-2xl bg-pink-500/20 border border-pink-400/40 flex items-center justify-center text-pink-300">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="font-extrabold text-lg text-white font-['Outfit']">
            Smart Task Matching & Guardrails
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Multi-objective allocation prioritizes both Skill Match and Buffer Capacity, strictly barring assignment to overloaded personnel.
          </p>
        </div>
      </section>

    </div>
  );
}
