import React from 'react';
import { motion } from 'framer-motion';
import { 
  AlertTriangle, 
  CheckCircle2, 
  TrendingUp, 
  Lightbulb, 
  Sparkles, 
  ArrowRight, 
  Layers, 
  ShieldAlert,
  Zap
} from 'lucide-react';

export default function AIInsightsView({ insights = [], onActionClick, onSelectEmployee }) {
  const getCardStyle = (type) => {
    switch (type) {
      case 'warning':
        return {
          glow: 'glass-card-glow-red hover:border-rose-500/50 bg-rose-950/10',
          badgeBg: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
          icon: <AlertTriangle className="w-5 h-5 text-rose-400" />,
          accentColor: '#f43f5e'
        };
      case 'success':
        return {
          glow: 'glass-card-glow-emerald hover:border-emerald-500/50 bg-emerald-950/10',
          badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
          icon: <CheckCircle2 className="w-5 h-5 text-emerald-400" />,
          accentColor: '#10b981'
        };
      case 'predictive':
        return {
          glow: 'glass-card-glow-purple hover:border-purple-500/50 bg-purple-950/10',
          badgeBg: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
          icon: <TrendingUp className="w-5 h-5 text-purple-400" />,
          accentColor: '#a855f7'
        };
      default:
        return {
          glow: 'glass-card-glow-cyan hover:border-cyan-500/50 bg-cyan-950/10',
          badgeBg: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
          icon: <Lightbulb className="w-5 h-5 text-cyan-400" />,
          accentColor: '#06b6d4'
        };
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="glass-panel rounded-3xl p-6 border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <Layers className="w-4 h-4" />
            </span>
            <h2 className="text-xl md:text-2xl font-extrabold text-white font-['Outfit'] tracking-wide">
              AUTONOMOUS AI WORKFORCE INSIGHTS
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time heuristic anomaly detection, capacity discovery & strategic task rebalancing synthesis
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-mono">
          <Sparkles className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '8s' }} />
          <span>Continuous Synthesizer Active</span>
        </div>
      </div>

      {/* Grid of Dynamic AI Insight Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {insights.map((item, index) => {
          const style = getCardStyle(item.type);

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -4 }}
              className={`glass-panel rounded-3xl p-6 border transition-all duration-300 relative overflow-hidden flex flex-col justify-between ${style.glow}`}
            >
              {/* Corner Ambient Glow */}
              <div 
                className="absolute -top-12 -right-12 w-32 h-32 rounded-full blur-2xl opacity-20 pointer-events-none"
                style={{ backgroundColor: style.accentColor }}
              />

              <div>
                {/* Category & Impact Tag */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-white/5 border border-white/10">
                      {style.icon}
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold border ${style.badgeBg}`}>
                      {item.category}
                    </span>
                  </div>

                  <span className="text-[10px] font-mono text-slate-400">
                    Impact: <strong className="text-white">{item.impactScore}</strong>
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-base font-extrabold text-white font-['Outfit'] mb-2">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="text-xs text-slate-300 leading-relaxed font-sans mb-4">
                  {item.description}
                </p>

                {/* Affected Entities Chips */}
                {item.affectedIds && item.affectedIds.length > 0 && (
                  <div className="flex items-center gap-1.5 flex-wrap mb-4">
                    <span className="text-[10px] text-slate-400 font-mono">Linked Entities:</span>
                    {item.affectedIds.map(id => (
                      <button
                        key={id}
                        onClick={() => onSelectEmployee && onSelectEmployee(id)}
                        className="px-2 py-0.5 rounded-md bg-white/5 hover:bg-white/15 border border-white/10 text-cyan-300 text-[10px] font-mono transition-colors"
                      >
                        {id}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Button */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-mono">
                  Autonomous heuristic match
                </span>

                <button
                  onClick={() => onActionClick && onActionClick(item)}
                  className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white text-xs font-mono font-bold flex items-center gap-1.5 transition-colors group"
                >
                  <span>{item.actionLabel}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
