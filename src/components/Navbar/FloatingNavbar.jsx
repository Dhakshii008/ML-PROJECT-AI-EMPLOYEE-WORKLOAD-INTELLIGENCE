import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Cpu, 
  LayoutDashboard, 
  Users, 
  BarChart3, 
  TrendingUp, 
  Sparkles, 
  Layers, 
  Sun, 
  Moon, 
  Menu, 
  X,
  ShieldAlert
} from 'lucide-react';

export default function FloatingNavbar({ 
  activePage, 
  setActivePage, 
  isDark, 
  setIsDark, 
  highRiskCount = 3,
  currentUser = null,
  onOpenAuth = () => {},
  onLogout = () => {}
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home', icon: Cpu },
    { id: 'command-center', label: 'Command Center', icon: LayoutDashboard },
    { id: 'employees', label: 'Employees', icon: Users },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'workload-intelligence', label: 'Workload Intelligence', icon: TrendingUp },
    { id: 'task-allocation', label: 'Smart Task Allocation', icon: Sparkles },
    { id: 'ai-insights', label: 'AI Insights', icon: Layers, badge: highRiskCount }
  ];

  return (
    <header className="fixed top-4 left-0 right-0 z-50 px-4 md:px-8 max-w-7xl mx-auto">
      <nav className="glass-panel rounded-2xl px-4 py-2.5 flex items-center justify-between border border-white/10 shadow-2xl backdrop-blur-xl bg-[#090d1f]/70">
        
        {/* Logo & Brand */}
        <div 
          onClick={() => setActivePage('home')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="relative w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-pink-500 p-[1.5px] transition-transform group-hover:scale-105 duration-300">
            <div className="w-full h-full bg-[#070b19] rounded-[10px] flex items-center justify-center">
              <Cpu className="w-5 h-5 text-cyan-400 group-hover:rotate-12 transition-transform duration-300" />
            </div>
            <div className="absolute inset-0 rounded-xl bg-cyan-400/20 blur-sm -z-10 group-hover:blur-md" />
          </div>

          <div className="flex flex-col">
            <span className="font-extrabold tracking-wider text-xs md:text-sm bg-gradient-to-r from-white via-cyan-200 to-indigo-300 bg-clip-text text-transparent font-['Outfit'] leading-tight">
              AI WORKFORCE
            </span>
            <span className="text-[10px] font-mono tracking-widest text-cyan-400/90 uppercase font-semibold">
              Intelligence
            </span>
          </div>
        </div>

        {/* Desktop Nav Items */}
        <div className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActivePage(item.id)}
                className={`relative px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 flex items-center gap-2 ${
                  isActive 
                    ? 'text-white font-semibold' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500/25 via-indigo-500/25 to-pink-500/25 border border-cyan-400/40 shadow-[0_0_15px_rgba(6,182,212,0.25)]"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                  />
                )}
                <Icon className={`w-3.5 h-3.5 relative z-10 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                <span className="relative z-10">{item.label}</span>
                {item.badge && (
                  <span className="relative z-10 px-1.5 py-0.2 text-[9px] font-mono font-bold rounded-full bg-rose-500/25 border border-rose-500/40 text-rose-300">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Right Section: AI Status & User Profile & Theme Toggle */}
        <div className="flex items-center gap-2 md:gap-3">
          
          {/* Animated AI Status */}
          <div className="hidden xl:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-[11px] font-mono shadow-[0_0_12px_rgba(16,185,129,0.15)]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-semibold tracking-wide">AI ONLINE</span>
          </div>

          {/* User Account Capsule / Dropdown */}
          {currentUser ? (
            <div className="relative group">
              <button
                type="button"
                className="flex items-center gap-2 pl-1.5 pr-2.5 py-1 rounded-xl bg-white/5 hover:bg-white/10 border border-cyan-500/30 transition-all text-left"
              >
                <img
                  src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                  alt={currentUser.name}
                  className="w-7 h-7 rounded-lg object-cover border border-cyan-400/50"
                />
                <div className="hidden sm:block">
                  <div className="text-[11px] font-semibold text-white leading-tight flex items-center gap-1">
                    <span>{currentUser.name}</span>
                  </div>
                  <div className="text-[9px] font-mono text-cyan-300 leading-none">
                    {currentUser.company || 'Enterprise'}
                  </div>
                </div>
              </button>

              {/* Dropdown Menu on Hover / Click */}
              <div className="absolute right-0 top-full mt-2 w-64 p-3 rounded-2xl bg-[#090d1f] border border-cyan-500/30 shadow-2xl backdrop-blur-2xl opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-200 z-50">
                <div className="flex items-center gap-3 pb-3 mb-2 border-b border-white/10">
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-10 h-10 rounded-xl object-cover border border-cyan-400"
                  />
                  <div className="overflow-hidden">
                    <div className="text-xs font-bold text-white truncate">{currentUser.name}</div>
                    <div className="text-[10px] text-slate-400 truncate">{currentUser.email}</div>
                    <div className="text-[9px] font-mono text-cyan-400 mt-0.5">{currentUser.role}</div>
                  </div>
                </div>

                <div className="px-2 py-1.5 rounded-lg bg-white/5 border border-white/5 mb-3">
                  <div className="text-[9px] font-mono text-slate-400 uppercase tracking-wider">Tenant Partition</div>
                  <div className="text-[11px] font-mono text-cyan-300 font-semibold truncate">
                    {currentUser.id}
                  </div>
                </div>

                <div className="flex flex-col gap-1 text-xs">
                  <button
                    onClick={onOpenAuth}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white transition-colors flex items-center justify-between"
                  >
                    <span>Switch / Register Account</span>
                    <span className="text-[10px] font-mono text-cyan-400">Add +</span>
                  </button>
                  <button
                    onClick={onLogout}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-rose-500/10 text-rose-400 hover:text-rose-300 transition-colors"
                  >
                    Log Out
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-medium text-xs shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all"
            >
              Sign In
            </button>
          )}

          {/* Theme Toggle */}
          <button
            onClick={() => setIsDark(!isDark)}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-colors"
            title="Toggle theme mode"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="lg:hidden mt-2 glass-panel rounded-2xl p-4 border border-white/10 shadow-2xl backdrop-blur-2xl bg-[#090d1f]/95 flex flex-col gap-1.5"
          >
            <div className="flex items-center justify-between pb-3 mb-2 border-b border-white/10 px-2">
              <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>AI SYSTEM ONLINE</span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">v3.4 ML-CORE</span>
            </div>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActivePage(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm transition-all ${
                    isActive 
                      ? 'bg-gradient-to-r from-cyan-500/20 via-indigo-500/20 to-pink-500/20 border border-cyan-400/40 text-cyan-300 font-medium'
                      : 'text-slate-300 hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="px-2 py-0.5 text-xs font-mono font-bold rounded-full bg-rose-500/30 text-rose-300">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}

            {/* Mobile Account Section */}
            <div className="pt-3 mt-2 border-t border-white/10 px-1">
              {currentUser ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img src={currentUser.avatar} alt={currentUser.name} className="w-8 h-8 rounded-lg object-cover" />
                    <div>
                      <div className="text-xs font-semibold text-white">{currentUser.name}</div>
                      <div className="text-[10px] text-cyan-400 font-mono">{currentUser.role}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      onLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="px-2.5 py-1 text-xs text-rose-400 border border-rose-500/30 rounded-lg hover:bg-rose-500/10"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    onOpenAuth();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2 px-3 text-xs font-semibold rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white"
                >
                  Sign In / Register Account
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
