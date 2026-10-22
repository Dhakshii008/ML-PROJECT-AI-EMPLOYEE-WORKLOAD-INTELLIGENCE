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

export default function FloatingNavbar({ activePage, setActivePage, isDark, setIsDark, highRiskCount = 3 }) {
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

        {/* Right Section: AI Status & Theme Toggle */}
        <div className="flex items-center gap-3">
          
          {/* Animated AI Status */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-[11px] font-mono shadow-[0_0_12px_rgba(16,185,129,0.15)]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-semibold tracking-wide">AI SYSTEM ONLINE</span>
          </div>

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
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
