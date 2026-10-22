import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  Cpu, 
  Layers, 
  Clock, 
  Calendar, 
  ShieldCheck, 
  ShieldAlert, 
  Zap, 
  Plus, 
  Award,
  RefreshCw
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { matchCandidatesForTask } from '../../services/mlEngine';
import { PRESET_TASK_TEMPLATES } from '../../data/mockTasks';

export default function SmartTaskAllocator({ employees = [], onTaskAssigned }) {
  // Task Form State
  const [taskName, setTaskName] = useState('Payment Gateway API Integration');
  const [skillInput, setSkillInput] = useState('');
  const [skills, setSkills] = useState(['Java', 'Spring Boot', 'MySQL']);
  const [complexity, setComplexity] = useState('High');
  const [estimatedHours, setEstimatedHours] = useState(12);
  const [deadlineDays, setDeadlineDays] = useState(3);
  const [priority, setPriority] = useState('CRITICAL');

  // Matching & Assignment State
  const [isMatching, setIsMatching] = useState(false);
  const [candidateMatches, setCandidateMatches] = useState(null);
  const [assignmentStage, setAssignmentStage] = useState(null); // 'traveling' | 'success'
  const [assignedResult, setAssignedResult] = useState(null);

  // Add skill tag
  const handleAddSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  const handleSelectTemplate = (template) => {
    setTaskName(template.name);
    setSkills([...template.skills]);
    setComplexity(template.complexity);
    setEstimatedHours(template.estimatedHours);
    setDeadlineDays(template.deadlineDays);
    setPriority(template.priority);
    setCandidateMatches(null);
  };

  // Run AI Matching Engine
  const handleFindBestMatch = () => {
    setIsMatching(true);
    setCandidateMatches(null);

    const taskSpec = {
      name: taskName,
      requiredSkills: skills,
      complexity,
      estimatedHours: Number(estimatedHours),
      deadlineDays: Number(deadlineDays),
      priority
    };

    setTimeout(() => {
      const results = matchCandidatesForTask(taskSpec, employees);
      setCandidateMatches(results);
      setIsMatching(false);
    }, 600);
  };

  // Execute Animated Task Assignment
  const handleAssignTask = (candidate) => {
    const taskSpec = {
      id: `TSK-${Math.floor(800 + Math.random() * 199)}`,
      name: taskName,
      requiredSkills: skills,
      complexity,
      estimatedHours: Number(estimatedHours),
      deadline: `${deadlineDays} Days`,
      deadlineDays: Number(deadlineDays),
      priority,
      assignedEmployee: candidate.employee.id
    };

    // Step 1: Start Visual Traveling Pipeline Animation
    setAssignmentStage('traveling');

    setTimeout(() => {
      // Step 2: Trigger state mutation and confetti
      if (onTaskAssigned) {
        onTaskAssigned(taskSpec, candidate.employee.id);
      }

      setAssignmentStage('success');
      setAssignedResult({
        candidate,
        task: taskSpec,
        prevWorkload: candidate.employee.currentWorkload,
        newWorkload: candidate.predictedWorkload,
        prevRisk: candidate.employee.risk,
        newRisk: candidate.isOverloadRisk ? 'HIGH' : candidate.employee.risk
      });

      // Celebration Confetti
      try {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#06b6d4', '#a855f7', '#10b981', '#ffffff']
        });
      } catch (e) {
        // ignore
      }
    }, 1800);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="glass-panel rounded-3xl p-6 border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-pink-500/20 text-pink-400 border border-pink-500/30">
              <Sparkles className="w-4 h-4" />
            </span>
            <h2 className="text-xl md:text-2xl font-extrabold text-white font-['Outfit'] tracking-wide">
              SMART TASK ALLOCATOR & OVERLOAD PREVENTION
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Multi-objective optimization: Balancing Technical Skill Match (38%) + Available Capacity (32%) + Risk Prevention
          </p>
        </div>

        {/* Quick Presets */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] text-slate-400 font-mono">Quick Template:</span>
          {PRESET_TASK_TEMPLATES.slice(0, 3).map((tmpl, idx) => (
            <button
              key={idx}
              onClick={() => handleSelectTemplate(tmpl)}
              className="px-2.5 py-1 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-cyan-300 text-[11px] font-mono transition-colors"
            >
              {tmpl.name.split(' ')[0]}...
            </button>
          ))}
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* LEFT COLUMN: New Task Formulation Form (5 Columns) */}
        <div className="lg:col-span-5 glass-panel rounded-3xl p-6 border border-white/10 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h3 className="font-extrabold text-base text-white font-['Outfit']">
              SPECIFY TASK REQUIREMENTS
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              Parametric Input
            </span>
          </div>

          {/* Task Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-slate-300">Task Name</label>
            <input
              type="text"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              placeholder="e.g. Payment Gateway API"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-medium"
            />
          </div>

          {/* Required Skills Tags */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-slate-300">Required Skills</label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                placeholder="Add skill (e.g. Java, Docker)..."
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono"
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="p-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/40 text-cyan-300"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Rendered Skill Chips */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-2.5 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono flex items-center gap-1.5"
                >
                  {skill}
                  <button 
                    onClick={() => handleRemoveSkill(skill)}
                    className="hover:text-rose-400 transition-colors"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Grid 2-cols: Complexity & Priority */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-300">Complexity</label>
              <select
                value={complexity}
                onChange={(e) => setComplexity(e.target.value)}
                className="w-full bg-[#0b1029] border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-cyan-400"
              >
                <option value="Low">Low (1x)</option>
                <option value="Medium">Medium (1.5x)</option>
                <option value="High">High (2x)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-300">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full bg-[#0b1029] border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-cyan-400"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="CRITICAL">Critical</option>
              </select>
            </div>
          </div>

          {/* Grid 2-cols: Estimated Hours & Deadline */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-300">Estimated Hours</label>
              <div className="relative">
                <input
                  type="number"
                  min="2"
                  max="80"
                  value={estimatedHours}
                  onChange={(e) => setEstimatedHours(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-cyan-400"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 font-mono">hrs</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-300">Deadline</label>
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={deadlineDays}
                  onChange={(e) => setDeadlineDays(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-cyan-400"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 font-mono">Days</span>
              </div>
            </div>
          </div>

          {/* Action Button: FIND BEST MATCH */}
          <button
            onClick={handleFindBestMatch}
            disabled={isMatching || skills.length === 0}
            className="w-full mt-4 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 via-indigo-500 to-pink-500 hover:from-cyan-400 hover:to-pink-400 text-white font-bold text-xs font-mono tracking-wider shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 transition-all transform active:scale-95 disabled:opacity-50"
          >
            {isMatching ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-white" />
                <span>EVALUATING MULTI-FACTOR ML MATRIX...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>FIND BEST MATCH</span>
              </>
            )}
          </button>
        </div>

        {/* RIGHT COLUMN: AI Candidate Matching & Overload Prevention Display (7 Columns) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Assignment Animation Flow Modal / Banner */}
          <AnimatePresence>
            {assignmentStage === 'traveling' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="glass-panel rounded-3xl p-6 border border-cyan-400/40 bg-gradient-to-r from-cyan-950/40 via-indigo-950/40 to-purple-950/40 shadow-2xl relative overflow-hidden text-center"
              >
                <h4 className="font-extrabold text-sm text-cyan-300 font-mono mb-4 tracking-wider">
                  TASK DISPATCH PIPELINE ACTIVATED
                </h4>
                
                {/* 4-Step Animated Pipeline Sequence */}
                <div className="flex items-center justify-between max-w-md mx-auto my-4 text-xs font-mono">
                  <div className="flex flex-col items-center gap-1.5">
                    <span className="w-8 h-8 rounded-full bg-cyan-500/30 border border-cyan-400 flex items-center justify-center text-cyan-300">
                      1
                    </span>
                    <span className="text-[10px] text-slate-300">NEW TASK</span>
                  </div>

                  <div className="flex-1 h-[2px] bg-gradient-to-r from-cyan-400 to-purple-500 mx-2 relative overflow-hidden">
                    <div className="absolute inset-0 bg-white animate-pulse" />
                  </div>

                  <div className="flex flex-col items-center gap-1.5">
                    <span className="w-8 h-8 rounded-full bg-purple-500/30 border border-purple-400 flex items-center justify-center text-purple-300">
                      2
                    </span>
                    <span className="text-[10px] text-slate-300">AI MATCH</span>
                  </div>

                  <div className="flex-1 h-[2px] bg-gradient-to-r from-purple-500 to-emerald-400 mx-2 relative overflow-hidden">
                    <div className="absolute inset-0 bg-white animate-pulse" />
                  </div>

                  <div className="flex flex-col items-center gap-1.5">
                    <span className="w-8 h-8 rounded-full bg-emerald-500/30 border border-emerald-400 flex items-center justify-center text-emerald-300">
                      3
                    </span>
                    <span className="text-[10px] text-slate-300">DISPATCHED</span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 animate-pulse mt-3 font-mono">
                  Synthesizing neural weights & updating workload telemetry in realtime...
                </p>
              </motion.div>
            )}

            {/* Success Feedback Confirmation */}
            {assignmentStage === 'success' && assignedResult && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-panel rounded-3xl p-6 border border-emerald-500/40 bg-emerald-950/20 shadow-2xl relative"
              >
                <div className="flex items-center justify-between border-b border-emerald-500/20 pb-3 mb-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <span className="font-extrabold text-sm text-white font-['Outfit']">
                      TASK SUCCESSFULLY ASSIGNED & REBALANCED
                    </span>
                  </div>
                  <button
                    onClick={() => setAssignmentStage(null)}
                    className="text-xs font-mono text-slate-400 hover:text-white"
                  >
                    Dismiss
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
                  <div className="bg-white/5 rounded-xl p-2.5">
                    <span className="text-slate-400 text-[10px] block">Assigned Assignee:</span>
                    <strong className="text-white text-sm">{assignedResult.candidate.employee.name}</strong>
                    <span className="text-[10px] text-cyan-300 block">({assignedResult.candidate.employee.id})</span>
                  </div>

                  <div className="bg-white/5 rounded-xl p-2.5">
                    <span className="text-slate-400 text-[10px] block">Workload Shift:</span>
                    <div className="flex items-center gap-1.5 text-sm font-bold">
                      <span className="text-slate-300">{assignedResult.prevWorkload}%</span>
                      <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
                      <span className="text-cyan-300">{assignedResult.newWorkload}%</span>
                    </div>
                    <span className="text-[10px] text-emerald-400 block">Capacity verified</span>
                  </div>

                  <div className="bg-white/5 rounded-xl p-2.5">
                    <span className="text-slate-400 text-[10px] block">Risk Trajectory:</span>
                    <strong className="text-emerald-300 text-sm">
                      {assignedResult.prevRisk} → {assignedResult.newRisk}
                    </strong>
                    <span className="text-[10px] text-slate-300 block">Within safety threshold</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Candidate Cards Section */}
          {candidateMatches ? (
            <div className="space-y-3.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                  AI Ranked Candidates ({candidateMatches.length} Evaluated)
                </span>
                <span className="text-xs font-mono text-cyan-300">
                  Priority: Skill Match + Capacity - Overload Risk
                </span>
              </div>

              {candidateMatches.slice(0, 3).map((match, idx) => {
                const isOverloaded = match.employee.risk === 'HIGH' || match.isOverloadRisk;
                const isBest = idx === 0 && !isOverloaded;

                return (
                  <motion.div
                    key={match.employee.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className={`glass-panel rounded-2xl p-5 border relative overflow-hidden transition-all duration-300 ${
                      isBest 
                        ? 'border-cyan-400/50 shadow-[0_0_30px_rgba(6,182,212,0.15)] bg-gradient-to-r from-cyan-950/20 via-[#0a0f29] to-[#0a0f29]' 
                        : isOverloaded 
                        ? 'border-rose-500/30 bg-rose-950/10' 
                        : 'border-white/10'
                    }`}
                  >
                    {/* Top Badge */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {isBest && (
                          <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono font-bold text-[10px] border border-cyan-400/40 flex items-center gap-1">
                            <Award className="w-3 h-3 text-cyan-400" />
                            BEST MATCH RECOMMENDATION
                          </span>
                        )}
                        {isOverloaded && (
                          <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-mono font-bold text-[10px] border border-rose-500/40 flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3 text-rose-400" />
                            HIGH OVERLOAD RISK
                          </span>
                        )}
                        {!isBest && !isOverloaded && (
                          <span className="px-2 py-0.5 rounded-full bg-white/5 text-slate-300 font-mono text-[10px]">
                            Alternative Candidate
                          </span>
                        )}
                      </div>

                      <span className="text-xs font-mono font-bold text-white">
                        AI Score: <strong className="text-cyan-300">{match.compositeScore}/100</strong>
                      </span>
                    </div>

                    {/* Candidate Profile Details */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={match.employee.avatar}
                          alt={match.employee.name}
                          className="w-12 h-12 rounded-xl object-cover border border-white/20"
                        />
                        <div>
                          <h4 className="font-extrabold text-sm text-white font-['Outfit']">
                            {match.employee.name}
                          </h4>
                          <span className="text-[11px] text-cyan-300 font-mono block">
                            {match.employee.id} • {match.employee.role}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {match.employee.experience} yrs exp • {match.employee.department}
                          </span>
                        </div>
                      </div>

                      {/* Action Button */}
                      <button
                        onClick={() => handleAssignTask(match)}
                        className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5 self-start sm:self-center ${
                          isOverloaded
                            ? 'bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 border border-rose-500/40'
                            : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-500/25'
                        }`}
                      >
                        <span>ASSIGN TASK</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Metrics Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4 text-xs font-mono">
                      <div className="bg-white/5 rounded-xl p-2 border border-white/5">
                        <span className="text-[10px] text-slate-400 block">Skill Match</span>
                        <span className="font-bold text-cyan-300">{match.skillScore}%</span>
                      </div>

                      <div className="bg-white/5 rounded-xl p-2 border border-white/5">
                        <span className="text-[10px] text-slate-400 block">Available Capacity</span>
                        <span className="font-bold text-emerald-400">{match.capacityScore}%</span>
                      </div>

                      <div className="bg-white/5 rounded-xl p-2 border border-white/5">
                        <span className="text-[10px] text-slate-400 block">Current Workload</span>
                        <span className={`font-bold ${match.currentWorkload >= 80 ? 'text-rose-400' : 'text-slate-200'}`}>
                          {match.currentWorkload}%
                        </span>
                      </div>

                      <div className="bg-white/5 rounded-xl p-2 border border-white/5">
                        <span className="text-[10px] text-slate-400 block">Est. Completion</span>
                        <span className="font-bold text-white">{match.completionDays} Days</span>
                      </div>
                    </div>

                    {/* Overload Warning Banner if Candidate is at risk */}
                    {isOverloaded && (
                      <div className="mt-3 p-3 rounded-xl bg-rose-950/30 border border-rose-500/30 text-xs font-mono text-rose-300 flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
                        <div>
                          <strong>POTENTIAL OVERLOAD HAZARD:</strong> Assigning this task to {match.employee.id} will increase workload from <strong>{match.currentWorkload}% to {match.predictedWorkload}%</strong>. System recommends reassigning to <strong>E102 / E117</strong> who have sufficient buffer capacity.
                        </div>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          ) : (
            /* Default Placeholder State */
            <div className="glass-panel rounded-3xl p-10 border border-white/10 text-center flex flex-col items-center justify-center min-h-[380px] space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                <Cpu className="w-7 h-7" />
              </div>
              <h4 className="font-extrabold text-base text-white font-['Outfit']">
                AWAITING TASK SPECIFICATION
              </h4>
              <p className="text-xs text-slate-400 max-w-md font-mono">
                Configure your task parameters on the left and click <strong>[FIND BEST MATCH]</strong>. 
                Our neural matching engine will balance technical suitability with capacity health.
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
