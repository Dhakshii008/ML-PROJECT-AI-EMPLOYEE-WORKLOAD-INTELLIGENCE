import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, 
  Sparkles, 
  UserCheck, 
  ArrowRight, 
  X, 
  ShieldCheck, 
  Zap, 
  Clock, 
  Briefcase,
  Cpu
} from 'lucide-react';

export default function EmployeeProfileCreatedModal({ employee, isOpen, onClose, onAllocateTask }) {
  if (!isOpen || !employee) return null;

  // Generate grounded AI profile summary strictly based on entered information
  const aiSummary = `${employee.name} is a ${employee.role} in ${employee.department} with ${employee.experience} years of experience in ${employee.skills.join(', ')}. Initialized with 0% current workload and 100% available capacity, this employee is immediately prepared for ${employee.department.toLowerCase()} task allocation without risk of burnout.`;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Confirmation Glass Window */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
          className="relative w-full max-w-xl glass-panel rounded-3xl border border-emerald-500/40 bg-[#080d24]/95 shadow-[0_0_60px_rgba(16,185,129,0.25)] overflow-hidden z-10 text-center my-auto p-6 sm:p-8"
        >
          {/* Glowing Ambient Blob */}
          <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Animated Success Badge */}
          <div className="flex flex-col items-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 200, damping: 12 }}
              className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-emerald-400 to-cyan-500 p-[2px] shadow-xl shadow-emerald-500/30 mb-4"
            >
              <div className="w-full h-full bg-[#070c1e] rounded-[22px] flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-emerald-400" />
              </div>
            </motion.div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-mono text-[11px] font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>✦ PROFILE CREATED</span>
            </div>

            <h2 className="text-2xl font-black text-white font-['Outfit'] tracking-wide">
              EMPLOYEE PROFILE CREATED ✓
            </h2>
            <p className="text-sm text-cyan-300 font-sans italic mt-0.5">
              "Welcome to the Workforce"
            </p>
            <span className="text-[11px] font-mono text-emerald-400 mt-1 block">
              AI Workforce Intelligence Updated
            </span>
          </div>

          {/* New Profile Quick Card */}
          <div className="mt-6 glass-panel rounded-2xl p-4 border border-white/10 text-left space-y-3 bg-white/[0.02]">
            <div className="flex items-center gap-3 border-b border-white/10 pb-3">
              <img
                src={employee.avatar}
                alt={employee.name}
                className="w-12 h-12 rounded-xl object-cover border border-emerald-400/40"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-base text-white font-['Outfit']">
                    {employee.name}
                  </h3>
                  <span className="px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 font-mono text-[10px] font-bold">
                    {employee.id}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold border border-emerald-500/30">
                    NEW JOINER
                  </span>
                </div>
                <p className="text-xs text-slate-300 font-medium mt-0.5 font-mono">
                  {employee.role} • {employee.department} ({employee.experience} yrs exp)
                </p>
              </div>
            </div>

            {/* Initial Telemetry Metrics Grid */}
            <div className="grid grid-cols-3 gap-2 text-center font-mono text-xs">
              <div className="bg-white/5 rounded-xl p-2.5 border border-white/5">
                <span className="text-[10px] text-slate-400 block">Workload</span>
                <span className="text-base font-bold text-emerald-400 font-['Outfit']">
                  {employee.currentWorkload}%
                </span>
                <span className="text-[9px] text-slate-400 block">Baseline</span>
              </div>

              <div className="bg-white/5 rounded-xl p-2.5 border border-white/5">
                <span className="text-[10px] text-slate-400 block">Capacity</span>
                <span className="text-base font-bold text-cyan-300 font-['Outfit']">
                  {employee.availableCapacity}%
                </span>
                <span className="text-[9px] text-emerald-400 block">100% Ready</span>
              </div>

              <div className="bg-white/5 rounded-xl p-2.5 border border-white/5">
                <span className="text-[10px] text-slate-400 block">Initial Risk</span>
                <span className="text-base font-bold text-emerald-400 font-['Outfit']">
                  {employee.risk}
                </span>
                <span className="text-[9px] text-slate-400 block">Optimal</span>
              </div>
            </div>

            {/* Skills */}
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                Technical Competencies:
              </span>
              <div className="flex flex-wrap gap-1">
                {employee.skills.map((skill, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-cyan-300 text-[10px] font-mono"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* AI-Generated Profile Summary (Requirement 5) */}
            <div className="p-3 rounded-xl bg-cyan-950/20 border border-cyan-500/30 text-xs font-mono text-slate-200 leading-relaxed">
              <div className="flex items-center gap-1.5 text-cyan-300 font-bold mb-1 text-[11px]">
                <Cpu className="w-3.5 h-3.5" />
                <span>AI Workforce Synthesizer:</span>
              </div>
              <p className="text-slate-300 text-[11px]">
                "{aiSummary}"
              </p>
            </div>
          </div>

          {/* Action Footer */}
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-xs font-mono transition-colors"
            >
              VIEW IN WORKFORCE
            </button>

            <button
              onClick={() => {
                onClose();
                if (onAllocateTask) onAllocateTask(employee);
              }}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-white font-mono font-bold text-xs shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 transition-all transform active:scale-95"
            >
              <span>ALLOCATE FIRST TASK</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
