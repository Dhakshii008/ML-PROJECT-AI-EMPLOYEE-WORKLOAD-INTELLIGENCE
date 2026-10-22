import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  UserPlus, 
  Plus, 
  Sparkles, 
  Briefcase, 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Clock, 
  Gauge, 
  MapPin, 
  Check, 
  AlertCircle,
  Cpu,
  Upload,
  Camera,
  Image as ImageIcon
} from 'lucide-react';
import { getInitialsAvatar, validateImageFile, readImageAsDataUrl } from '../../utils/avatarUtils';

const SUGGESTED_SKILLS = [
  "Java", "Spring Boot", "Python", "React", "TypeScript", 
  "MySQL", "PostgreSQL", "Machine Learning", "Docker", "Kubernetes", 
  "AWS", "Figma", "Design Systems", "Node.js", "GraphQL"
];

export default function AddEmployeeModal({ isOpen, onClose, onEmployeeCreated, existingCount = 12 }) {
  // Form State
  const [fullName, setFullName] = useState('');
  const [employeeId, setEmployeeId] = useState(`E${100 + existingCount + 1}`);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const [department, setDepartment] = useState('Engineering');
  const [role, setRole] = useState('');
  const [experience, setExperience] = useState('3.0');
  const [joiningDate, setJoiningDate] = useState(new Date().toISOString().split('T')[0]);
  const [employmentStatus, setEmploymentStatus] = useState('Full-Time');

  const [skills, setSkills] = useState(['Java', 'Spring Boot', 'MySQL']);
  const [skillInput, setSkillInput] = useState('');

  const [weeklyHours, setWeeklyHours] = useState('40');
  const [maxCapacity, setMaxCapacity] = useState('100');

  const [location, setLocation] = useState('Remote / Hybrid');
  const [manager, setManager] = useState('Sarah Chen (E102)');
  const [team, setTeam] = useState('Core Engineering');

  // Photo Upload & Avatar State
  const [uploadedPhoto, setUploadedPhoto] = useState(null);
  const [photoError, setPhotoError] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [cropPosition, setCropPosition] = useState('center');
  const fileInputRef = useRef(null);

  const [errors, setErrors] = useState({});

  const handleFileSelected = async (file) => {
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
      setUploadedPhoto(dataUrl);
    } catch (err) {
      setPhotoError('Failed to read image file. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelected(e.dataTransfer.files[0]);
    }
  };

  const handleRemovePhoto = () => {
    setUploadedPhoto(null);
    setPhotoError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (!isOpen) return null;

  const handleAddSkill = (skillToAdd) => {
    const s = (skillToAdd || skillInput).trim();
    if (s && !skills.includes(s)) {
      setSkills([...skills, s]);
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  const validate = () => {
    const newErrors = {};
    if (!fullName.trim()) newErrors.fullName = 'Full Name is required';
    if (!employeeId.trim()) newErrors.employeeId = 'Employee ID is required';
    if (!email.trim() || !email.includes('@')) newErrors.email = 'Valid Email is required';
    if (!role.trim()) newErrors.role = 'Role / Designation is required';
    if (skills.length === 0) newErrors.skills = 'At least 1 technical skill is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    // Build the clean employee model per requirements (with initial 0% workload, 100% capacity)
    const newEmployee = {
      id: employeeId.trim().toUpperCase(),
      name: fullName.trim(),
      email: email.trim(),
      phone: phone.trim() || '+1 (555) 019-2834',
      department,
      role: role.trim(),
      experience: parseFloat(experience) || 1.0,
      joiningDate,
      employmentStatus,
      skills: [...skills],
      workingHours: parseFloat(weeklyHours) || 40.0,
      maxCapacity: parseFloat(maxCapacity) || 100.0,
      location,
      manager,
      team,
      avatar: uploadedPhoto || getInitialsAvatar(fullName.trim() || 'Employee'),

      // Initial Workload Profile (Requirement 4)
      currentWorkload: 0,
      previousWorkload: 0,
      pendingTasks: 0,
      tasksCompleted: 0,
      tasksAssigned: 0,
      overtime: 0.0,
      meetingHours: 4.0,
      deadlineCount: 0,
      availableCapacity: 100,
      risk: 'LOW',
      riskScore: 0.05,
      productivity: 85, // Default baseline for new joiner
      isNewJoiner: true,
      cluster: 'Available Capacity',
      riskFactors: [
        'Newly onboarded team member',
        'No current task congestion (0% workload)',
        '100% buffer capacity ready for immediate allocation'
      ],
      weeklyTrend: [0, 0, 0, 0],
      forecastTrend: [0, 0, 0, 0],
      createdAt: new Date().toISOString()
    };

    onEmployeeCreated(newEmployee);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/75 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 15 }}
          transition={{ type: "spring", bounce: 0.15, duration: 0.4 }}
          className="relative w-full max-w-3xl glass-panel rounded-3xl border border-cyan-500/30 bg-[#090e26]/95 shadow-[0_0_50px_rgba(6,182,212,0.2)] overflow-hidden z-10 my-auto"
        >
          {/* Header */}
          <div className="p-6 border-b border-white/10 bg-gradient-to-r from-cyan-950/40 via-indigo-950/40 to-purple-950/40 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 p-[1.5px] shadow-lg shadow-cyan-500/25">
                <div className="w-full h-full bg-[#080d22] rounded-[14px] flex items-center justify-center">
                  <UserPlus className="w-5 h-5 text-cyan-300" />
                </div>
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-white font-['Outfit'] tracking-wide flex items-center gap-2">
                  <span>ONBOARD NEW EMPLOYEE</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                    ✦ AI Telemetry Ready
                  </span>
                </h2>
                <p className="text-xs text-slate-400 font-sans mt-0.5">
                  Integrate new talent directly into the neural workforce network & smart allocator
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[78vh] overflow-y-auto font-mono text-xs">
            
            {/* SECTION 1: PERSONAL DETAILS */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-cyan-300 font-bold border-b border-white/5 pb-1.5 uppercase tracking-wider text-[11px]">
                <User className="w-3.5 h-3.5" />
                <span>1. Personal Information</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="text-slate-300 block mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Arjun Kumar"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                  {errors.fullName && <span className="text-rose-400 text-[10px] mt-1 block">{errors.fullName}</span>}
                </div>

                <div>
                  <label className="text-slate-300 block mb-1">Employee ID *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. E135"
                    value={employeeId}
                    onChange={(e) => setEmployeeId(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-cyan-300 font-bold placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                  {errors.employeeId && <span className="text-rose-400 text-[10px] mt-1 block">{errors.employeeId}</span>}
                </div>

                <div>
                  <label className="text-slate-300 block mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="arjun.kumar@enterprise.ai"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                  {errors.email && <span className="text-rose-400 text-[10px] mt-1 block">{errors.email}</span>}
                </div>

                <div>
                  <label className="text-slate-300 block mb-1">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 2: WORK DETAILS */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-purple-300 font-bold border-b border-white/5 pb-1.5 uppercase tracking-wider text-[11px]">
                <Briefcase className="w-3.5 h-3.5" />
                <span>2. Work & Department Details</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div>
                  <label className="text-slate-300 block mb-1">Department *</label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full bg-[#0b1029] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Product">Product</option>
                    <option value="Design">Design</option>
                    <option value="Operations">Operations</option>
                    <option value="Marketing">Marketing</option>
                    <option value="HR">HR</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="text-slate-300 block mb-1">Role / Designation *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Backend Developer, UI Specialist"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                  {errors.role && <span className="text-rose-400 text-[10px] mt-1 block">{errors.role}</span>}
                </div>

                <div>
                  <label className="text-slate-300 block mb-1">Experience (Years)</label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    max="30"
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="text-slate-300 block mb-1">Joining Date</label>
                  <input
                    type="date"
                    value={joiningDate}
                    onChange={(e) => setJoiningDate(e.target.value)}
                    className="w-full bg-[#0b1029] border border-white/10 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="text-slate-300 block mb-1">Employment Status</label>
                  <select
                    value={employmentStatus}
                    onChange={(e) => setEmploymentStatus(e.target.value)}
                    className="w-full bg-[#0b1029] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option value="Full-Time">Full-Time</option>
                    <option value="Contract">Contract</option>
                    <option value="Remote Core">Remote Core</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>
              </div>
            </div>

            {/* SECTION 3: SKILLS (DYNAMIC ADDER) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-white/5 pb-1.5">
                <div className="flex items-center gap-2 text-pink-300 font-bold uppercase tracking-wider text-[11px]">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>3. Skills & Competencies *</span>
                </div>
                <span className="text-[10px] text-slate-400">Used for Smart Task Allocation Matching</span>
              </div>

              {/* Input + Add button */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Type a skill and hit Enter or click + (e.g. Java, Docker)..."
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddSkill();
                    }
                  }}
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
                <button
                  type="button"
                  onClick={() => handleAddSkill()}
                  className="px-3.5 py-2 rounded-xl bg-pink-500/20 hover:bg-pink-500/30 border border-pink-400/40 text-pink-300 font-bold flex items-center gap-1 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Skill</span>
                </button>
              </div>

              {/* Selected Skill Badges */}
              <div className="flex flex-wrap gap-1.5 p-3 rounded-2xl bg-white/[0.02] border border-white/5 min-h-[46px]">
                {skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-400/30 text-cyan-200 text-[11px] font-mono flex items-center gap-1.5"
                  >
                    <span>{skill}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="hover:text-rose-400 transition-colors ml-0.5 text-xs"
                    >
                      ×
                    </button>
                  </span>
                ))}
                {skills.length === 0 && (
                  <span className="text-slate-500 text-[11px] italic">No skills added yet. Select quick skills below.</span>
                )}
              </div>
              {errors.skills && <span className="text-rose-400 text-[10px] block">{errors.skills}</span>}

              {/* Quick Preset Skill Suggestions */}
              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 block">Quick Suggestions:</span>
                <div className="flex flex-wrap gap-1">
                  {SUGGESTED_SKILLS.map((sk) => (
                    <button
                      key={sk}
                      type="button"
                      onClick={() => handleAddSkill(sk)}
                      disabled={skills.includes(sk)}
                      className="px-2 py-0.5 rounded-md bg-white/5 hover:bg-white/10 disabled:opacity-30 border border-white/5 text-slate-300 text-[10px] transition-colors"
                    >
                      + {sk}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* SECTION 4: WORK CAPACITY */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-emerald-300 font-bold border-b border-white/5 pb-1.5 uppercase tracking-wider text-[11px]">
                <Clock className="w-3.5 h-3.5" />
                <span>4. Work Capacity & Allocation Baselines</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="text-slate-300 block mb-1">Weekly Working Hours</label>
                  <div className="relative">
                    <input
                      type="number"
                      min="20"
                      max="60"
                      value={weeklyHours}
                      onChange={(e) => setWeeklyHours(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-cyan-400"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-[10px]">hrs/wk</span>
                  </div>
                </div>

                <div>
                  <label className="text-slate-300 block mb-1">Maximum Capacity Target</label>
                  <div className="relative">
                    <input
                      type="number"
                      min="50"
                      max="100"
                      value={maxCapacity}
                      onChange={(e) => setMaxCapacity(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-emerald-300 font-bold focus:outline-none focus:border-cyan-400"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-[10px]">%</span>
                  </div>
                </div>
              </div>

              {/* Notice Banner */}
              <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/25 flex items-center justify-between text-[11px]">
                <span className="text-emerald-300">
                  Initial Workload will be initialized to <strong>0%</strong> with <strong>100% available capacity</strong>.
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold">
                  LOW RISK
                </span>
              </div>
            </div>

            {/* SECTION 5: OPTIONAL DETAILS & PROFILE PHOTO UPLOAD */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-amber-300 font-bold border-b border-white/5 pb-1.5 uppercase tracking-wider text-[11px]">
                <MapPin className="w-3.5 h-3.5" />
                <span>5. Optional Context & Profile Photo</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div>
                  <label className="text-slate-300 block mb-1">Location</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Bengaluru, India"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="text-slate-300 block mb-1">Reporting Manager</label>
                  <input
                    type="text"
                    value={manager}
                    onChange={(e) => setManager(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="text-slate-300 block mb-1">Team / Squad</label>
                  <input
                    type="text"
                    value={team}
                    onChange={(e) => setTeam(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              {/* Profile Photo Upload & Preview Section */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between">
                  <label className="text-slate-300 block text-xs font-semibold">Profile Photo</label>
                  <span className="text-[10px] font-mono text-cyan-400">
                    {uploadedPhoto ? 'Photo Uploaded' : 'Initials Fallback Active'}
                  </span>
                </div>

                {/* Hidden Native File Picker */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleFileSelected(e.target.files[0]);
                    }
                  }}
                  className="hidden"
                />

                {!uploadedPhoto ? (
                  /* UPLOAD AREA */
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5 items-stretch">
                    {/* Clean Initials Fallback Display */}
                    <div className="sm:col-span-4 p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col items-center justify-center text-center gap-2">
                      <div className="relative group">
                        <img
                          src={getInitialsAvatar(fullName.trim() || 'New Employee')}
                          alt="Fallback Initials Avatar"
                          className="w-16 h-16 rounded-2xl object-cover border-2 border-cyan-400/40 shadow-[0_0_15px_rgba(6,182,212,0.2)] transition-transform group-hover:scale-105"
                        />
                        <span className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-md bg-[#090d24] border border-cyan-500/40 text-[9px] font-mono text-cyan-300 font-bold">
                          AUTO
                        </span>
                      </div>
                      <div>
                        <span className="text-[11px] font-mono font-bold text-slate-300 block">
                          Fallback Initials
                        </span>
                        <span className="text-[10px] text-slate-400 font-sans block leading-tight">
                          Active if no photo is uploaded
                        </span>
                      </div>
                    </div>

                    {/* Futuristic Upload Box matching required layout */}
                    <div
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={`sm:col-span-8 relative p-4 rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-300 flex flex-col items-center justify-center text-center group ${
                        isDragging
                          ? 'border-cyan-400 bg-cyan-500/15 shadow-[0_0_25px_rgba(6,182,212,0.35)] scale-[1.01]'
                          : 'border-white/15 bg-white/[0.02] hover:bg-white/[0.05] hover:border-cyan-400/60 hover:shadow-[0_0_20px_rgba(6,182,212,0.15)]'
                      }`}
                    >
                      {/* Loading scan overlay */}
                      {isUploading && (
                        <div className="absolute inset-0 rounded-2xl overflow-hidden bg-[#090d24]/90 backdrop-blur-sm flex flex-col items-center justify-center z-10">
                          <div className="w-8 h-8 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin mb-2" />
                          <span className="text-xs font-mono text-cyan-300 font-bold animate-pulse">
                            PROCESSING IMAGE...
                          </span>
                        </div>
                      )}

                      {/* Top + Icon */}
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-400/30 flex items-center justify-center text-cyan-300 group-hover:scale-110 group-hover:border-cyan-400 transition-all duration-200 shadow-md">
                        <Plus className="w-5 h-5 text-cyan-300" />
                      </div>

                      {/* UPLOAD PROFILE PHOTO / Choose image */}
                      <div className="mt-2 space-y-0.5">
                        <h4 className="text-xs font-extrabold tracking-wider text-white uppercase font-mono group-hover:text-cyan-300 transition-colors">
                          {isDragging ? 'Drop employee photo here' : 'UPLOAD PROFILE PHOTO'}
                        </h4>
                        <p className="text-[11px] text-slate-400 font-sans">
                          {isDragging ? 'Release to upload image' : 'Choose an image from your device / gallery'}
                        </p>
                        <span className="text-[10px] text-slate-500 font-mono block">
                          JPG, JPEG, PNG, WEBP (Max 5 MB)
                        </span>
                      </div>

                      {/* [ + UPLOAD PHOTO ] Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          fileInputRef.current?.click();
                        }}
                        className="mt-3 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 hover:from-cyan-500/30 hover:to-indigo-500/30 border border-cyan-400/40 text-cyan-300 text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-sm group-hover:border-cyan-400"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>UPLOAD PHOTO</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  /* IMAGE PREVIEW AFTER UPLOAD */
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-4 rounded-2xl bg-white/[0.03] border border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.15)] backdrop-blur-md space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                      {/* Circular/Rounded-Square Preview with Cover & Center */}
                      <div className="flex items-center gap-4">
                        <div className="relative group">
                          <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-cyan-400/80 shadow-[0_0_20px_rgba(6,182,212,0.4)] relative bg-[#090d24]">
                            <img
                              src={uploadedPhoto}
                              alt="Uploaded Profile Preview"
                              style={{
                                transform: `scale(${zoomLevel})`,
                                objectPosition: cropPosition
                              }}
                              className="w-full h-full object-cover transition-transform duration-200"
                            />
                          </div>
                          <span className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-md bg-emerald-950 border border-emerald-500/50 text-[9px] font-mono text-emerald-300 font-bold flex items-center gap-1 shadow-md">
                            <Check className="w-2.5 h-2.5" /> READY
                          </span>
                        </div>

                        <div className="text-left space-y-0.5">
                          <span className="text-xs font-bold text-white font-['Outfit'] block">
                            [ Uploaded Photo ]
                          </span>
                          <span className="text-[11px] text-cyan-300 font-mono block">
                            Active Profile Avatar
                          </span>
                          <span className="text-[10px] text-slate-400 font-sans block">
                            Framed with rounded-square crop (Object-fit: cover)
                          </span>
                        </div>
                      </div>

                      {/* Action Buttons: [ CHANGE PHOTO ] and [ REMOVE ] */}
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/40 text-cyan-300 text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-sm"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>CHANGE PHOTO</span>
                        </button>

                        <button
                          type="button"
                          onClick={handleRemovePhoto}
                          className="px-3 py-1.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 text-xs font-mono font-bold flex items-center gap-1.5 transition-all"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>REMOVE</span>
                        </button>
                      </div>
                    </div>

                    {/* Crop / Position Adjust Controls */}
                    <div className="pt-2.5 border-t border-white/5 flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono text-slate-400">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400">Focus Position:</span>
                        <button
                          type="button"
                          onClick={() => setCropPosition('center')}
                          className={`px-2 py-0.5 rounded-md border transition-all ${
                            cropPosition === 'center'
                              ? 'bg-cyan-500/25 border-cyan-400/60 text-cyan-300 font-bold'
                              : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                          }`}
                        >
                          Center
                        </button>
                        <button
                          type="button"
                          onClick={() => setCropPosition('top')}
                          className={`px-2 py-0.5 rounded-md border transition-all ${
                            cropPosition === 'top'
                              ? 'bg-cyan-500/25 border-cyan-400/60 text-cyan-300 font-bold'
                              : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                          }`}
                        >
                          Top
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-slate-400">Crop Scale:</span>
                        {[1, 1.15, 1.3].map((z) => (
                          <button
                            key={z}
                            type="button"
                            onClick={() => setZoomLevel(z)}
                            className={`px-2 py-0.5 rounded-md border transition-all ${
                              zoomLevel === z
                                ? 'bg-purple-500/25 border-purple-400/60 text-purple-300 font-bold'
                                : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                            }`}
                          >
                            {z === 1 ? '1x' : `${z}x`}
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Validation Error Message */}
                {photoError && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-2.5 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs font-mono flex items-center gap-2"
                  >
                    <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                    <span>{photoError}</span>
                  </motion.div>
                )}
              </div>
            </div>

            {/* ACTION BUTTONS (Requirement 2) */}
            <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white font-mono transition-colors"
              >
                CANCEL
              </button>

              <button
                type="submit"
                className="px-7 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-pink-500 hover:from-cyan-400 hover:to-pink-400 text-white font-mono font-bold tracking-wider shadow-lg shadow-cyan-500/25 flex items-center gap-2 transition-all transform active:scale-95"
              >
                <Sparkles className="w-4 h-4 text-cyan-200" />
                <span>ADD EMPLOYEE ✦</span>
              </button>
            </div>

          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
