import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  AlertTriangle, 
  Clock, 
  Calendar, 
  CheckCircle2, 
  Award, 
  Cpu, 
  ArrowUpRight, 
  TrendingUp,
  Briefcase,
  Zap,
  Upload,
  AlertCircle
} from 'lucide-react';
import { getInitialsAvatar, validateImageFile, readImageAsDataUrl } from '../../utils/avatarUtils';

export default function EmployeeDetailModal({ 
  employee, 
  isOpen, 
  onClose, 
  onNavigateAllocator,
  onUpdateEmployee 
}) {
  const [photoError, setPhotoError] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  if (!isOpen || !employee) return null;

  const handlePhotoUpload = async (file) => {
    if (!file) return;
    setPhotoError(null);
    const { valid, error } = validateImageFile(file);
    if (!valid) {
      setPhotoError(error);
      return;
    }

    try {
      setIsUploading(true);
      const dataUrl = await readImageAsDataUrl(file);
      if (onUpdateEmployee) {
        onUpdateEmployee({
          ...employee,
          avatar: dataUrl
        });
      }
    } catch (err) {
      setPhotoError('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemovePhoto = () => {
    setPhotoError(null);
    const fallbackAvatar = getInitialsAvatar(employee.name);
    if (onUpdateEmployee) {
      onUpdateEmployee({
        ...employee,
        avatar: fallbackAvatar
      });
    }
  };

  const isHighRisk = employee.risk === 'HIGH';
  const isMedRisk = employee.risk === 'MEDIUM';

  // Circular gauge calculations
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (employee.currentWorkload / 100) * circumference;

  const getRiskBadgeClass = () => {
    if (isHighRisk) return 'bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-[0_0_15px_rgba(244,63,94,0.3)]';
    if (isMedRisk) return 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.2)]';
    return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.2)]';
  };

  const getRiskColor = () => {
    if (isHighRisk) return '#f43f5e';
    if (isMedRisk) return '#fbbf24';
    return '#10b981';
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-end p-0 md:p-6 overflow-hidden">
        {/* Backdrop blur overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-md"
        />

        {/* Slide-out Glass Panel */}
        <motion.div
          initial={{ x: '100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 26, stiffness: 220 }}
          className="relative w-full max-w-xl h-full md:h-[92vh] glass-panel rounded-none md:rounded-3xl border border-white/15 bg-[#090d24]/95 shadow-2xl overflow-hidden flex flex-col z-10"
        >
          {/* Header Banner */}
          <div className="p-6 border-b border-white/10 relative overflow-hidden bg-gradient-to-r from-cyan-950/40 via-indigo-950/40 to-purple-950/40 shrink-0">
            <div className="absolute top-0 right-0 p-4">
              <button
                onClick={onClose}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative">
                <img
                  src={employee.avatar}
                  alt={employee.name}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-white/20 shadow-xl"
                />
                <span className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-md bg-[#090d24] border border-white/20 text-[10px] font-mono text-cyan-300 font-bold">
                  {employee.id}
                </span>
              </div>

              <div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h2 className="text-xl font-extrabold text-white font-['Outfit']">
                    {employee.name}
                  </h2>
                  <span className={`px-2.5 py-0.5 text-[11px] font-mono font-bold rounded-full border ${getRiskBadgeClass()}`}>
                    {employee.risk} RISK
                  </span>
                  {employee.isNewJoiner && (
                    <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono text-[10px] font-bold border border-cyan-500/40">
                      ✦ NEW JOINER
                    </span>
                  )}
                </div>
                <p className="text-xs text-cyan-300 font-medium mt-0.5">
                  {employee.role} • {employee.department}
                </p>
                <span className="text-[11px] text-slate-400 font-mono mt-1 block">
                  Cluster: {employee.cluster || 'Balanced Core'}
                </span>
              </div>
            </div>

            {/* EDIT EMPLOYEE: Profile Photo Actions */}
            <div className="mt-4 pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-2.5">
              <div className="flex items-center gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handlePhotoUpload(e.target.files[0]);
                    }
                  }}
                  className="hidden"
                />

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 hover:from-cyan-500/30 hover:to-indigo-500/30 border border-cyan-400/40 text-cyan-300 text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-sm active:scale-95 disabled:opacity-50"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{isUploading ? 'UPLOADING...' : 'CHANGE PROFILE PHOTO'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  className="px-3 py-1.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 text-xs font-mono font-bold flex items-center gap-1.5 transition-all active:scale-95"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>REMOVE PHOTO</span>
                </button>
              </div>

              <span className="text-[10px] font-mono text-slate-400">
                JPG, PNG, WEBP (Max 5 MB)
              </span>
            </div>

            {photoError && (
              <div className="mt-2.5 p-2 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs font-mono flex items-center gap-2">
                <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                <span>{photoError}</span>
              </div>
            )}
          </div>

          {/* Body Content */}
          <div className="p-6 space-y-6 flex-1 overflow-y-auto">
            
            {/* Workload Circular Gauge + Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center glass-panel rounded-2xl p-4 border border-white/10 bg-white/[0.02]">
              
              {/* Radial Workload Gauge */}
              <div className="flex flex-col items-center justify-center p-2">
                <div className="relative w-36 h-36 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 130 130">
                    <circle
                      cx="65"
                      cy="65"
                      r={radius}
                      className="text-slate-800"
                      strokeWidth="10"
                      stroke="currentColor"
                      fill="transparent"
                    />
                    <circle
                      cx="65"
                      cy="65"
                      r={radius}
                      stroke={getRiskColor()}
                      strokeWidth="10"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                      fill="transparent"
                      className="transition-all duration-1000 ease-out"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-2xl font-extrabold font-['Outfit'] text-white">
                      {employee.currentWorkload}%
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">
                      Workload
                    </span>
                  </div>
                </div>

                <div className="mt-2 text-[11px] font-mono text-slate-300 flex items-center gap-1.5">
                  <span>Available Capacity:</span>
                  <span className="text-emerald-400 font-bold">{employee.availableCapacity}%</span>
                </div>
              </div>

              {/* Core Telemetry Cards */}
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                  <span className="text-[10px] text-slate-400 block">Productivity</span>
                  <span className="text-base font-bold text-cyan-300 font-['Outfit']">
                    {employee.productivity}%
                  </span>
                  <span className="text-[9px] text-emerald-400 block mt-0.5">Top Tier</span>
                </div>

                <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                  <span className="text-[10px] text-slate-400 block">Overtime</span>
                  <span className={`text-base font-bold font-['Outfit'] ${employee.overtime > 6 ? 'text-rose-400' : 'text-slate-200'}`}>
                    {employee.overtime}h
                  </span>
                  <span className="text-[9px] text-slate-400 block mt-0.5">This week</span>
                </div>

                <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                  <span className="text-[10px] text-slate-400 block">Pending Tasks</span>
                  <span className="text-base font-bold text-amber-300 font-['Outfit']">
                    {employee.pendingTasks}
                  </span>
                  <span className="text-[9px] text-slate-400 block mt-0.5">Active queue</span>
                </div>

                <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                  <span className="text-[10px] text-slate-400 block">Deadlines</span>
                  <span className={`text-base font-bold font-['Outfit'] ${employee.deadlineCount >= 4 ? 'text-rose-400' : 'text-slate-200'}`}>
                    {employee.deadlineCount}
                  </span>
                  <span className="text-[9px] text-slate-400 block mt-0.5">&lt; 7 days</span>
                </div>
              </div>
            </div>

            {/* "WHY IS THIS EMPLOYEE AT RISK?" Deep ML Diagnostic Section */}
            <div className={`rounded-2xl p-4 border transition-all ${
              isHighRisk 
                ? 'bg-rose-950/25 border-rose-500/30' 
                : isMedRisk 
                ? 'bg-amber-950/25 border-amber-500/30' 
                : 'bg-emerald-950/25 border-emerald-500/30'
            }`}>
              <div className="flex items-center gap-2 mb-2.5">
                <AlertTriangle className={`w-4 h-4 ${isHighRisk ? 'text-rose-400' : isMedRisk ? 'text-amber-400' : 'text-emerald-400'}`} />
                <h4 className="font-mono font-bold text-xs uppercase tracking-wider text-white">
                  WHY IS THIS EMPLOYEE {isHighRisk ? 'AT HIGH RISK' : isMedRisk ? 'AT MODERATE RISK' : 'STABLE'}?
                </h4>
              </div>

              <div className="space-y-2 text-xs">
                {employee.riskFactors?.map((factor, index) => (
                  <div key={index} className="flex items-start gap-2 text-slate-300">
                    <span className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${
                      isHighRisk ? 'bg-rose-400' : isMedRisk ? 'bg-amber-400' : 'bg-emerald-400'
                    }`} />
                    <span>{factor}</span>
                  </div>
                ))}
              </div>

              {isHighRisk && (
                <div className="mt-3 pt-3 border-t border-rose-500/20 flex items-center justify-between">
                  <span className="text-[11px] text-rose-300/90 font-mono">
                    Action: Freeze further tasks & redistribute
                  </span>
                  <button 
                    onClick={() => {
                      onClose();
                      if (onNavigateAllocator) onNavigateAllocator();
                    }}
                    className="px-2.5 py-1 rounded-lg bg-rose-500/30 hover:bg-rose-500/40 border border-rose-500/40 text-white text-[11px] font-mono flex items-center gap-1 transition-colors"
                  >
                    <span>Reallocate Tasks</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>

            {/* Skills & Experience */}
            <div className="space-y-2">
              <h4 className="font-mono font-bold text-xs uppercase tracking-wider text-slate-400">
                Skills & Technical Competencies ({employee.experience} yrs exp)
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {employee.skills.map((skill, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-cyan-300 text-xs font-mono"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* 4-Week Workload History Sparkline */}
            <div className="glass-panel rounded-2xl p-4 border border-white/10">
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono font-bold text-xs uppercase text-slate-400">
                  4-Week Workload Progression
                </span>
                {!employee.isNewJoiner && employee.weeklyTrend && (
                  <span className="text-xs font-mono text-cyan-400 font-semibold flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5" />
                    +{employee.weeklyTrend[3] - employee.weeklyTrend[0]}% trend
                  </span>
                )}
              </div>

              {employee.isNewJoiner || !employee.weeklyTrend || employee.weeklyTrend.every(v => v === 0) ? (
                <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-center font-mono text-xs text-slate-400">
                  <Clock className="w-4 h-4 text-cyan-400 mx-auto mb-1.5 animate-pulse" />
                  <span className="text-cyan-300 font-semibold">Building workload history...</span>
                  <p className="text-[10px] text-slate-400 mt-1">
                    Newly onboarded employee. Historical sprint telemetry will accumulate as tasks are completed.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-4 gap-2 text-center font-mono">
                  {employee.weeklyTrend.map((val, idx) => (
                    <div key={idx} className="bg-white/5 rounded-xl p-2 border border-white/5">
                      <span className="text-[10px] text-slate-400 block">W-{4 - idx}</span>
                      <span className={`text-sm font-bold ${val >= 80 ? 'text-rose-400' : 'text-slate-200'}`}>
                        {val}%
                      </span>
                      <div className="w-full bg-slate-800 h-1 rounded-full mt-1.5 overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${val >= 80 ? 'bg-rose-500' : 'bg-cyan-400'}`} 
                          style={{ width: `${val}%` }} 
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Action Footer */}
          <div className="p-4 border-t border-white/10 bg-black/40 flex items-center justify-between gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-xs font-mono transition-colors"
            >
              Close Diagnostic
            </button>
            <button
              onClick={() => {
                onClose();
                if (onNavigateAllocator) onNavigateAllocator();
              }}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white text-xs font-mono font-bold shadow-lg shadow-cyan-500/25 flex items-center gap-2 transition-all"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Smart Allocator Check</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
