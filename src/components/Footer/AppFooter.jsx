import React from 'react';
import { Cpu, Sparkles } from 'lucide-react';

export default function AppFooter() {
  return (
    <footer className="mt-20 border-t border-white/5 py-10 px-4 text-center relative z-10">
      <div className="max-w-4xl mx-auto flex flex-col items-center justify-center space-y-2">
        {/* Subtle AI Badge */}
        <div className="flex items-center gap-2 text-xs font-mono text-cyan-400/80 mb-1">
          <Cpu className="w-3.5 h-3.5" />
          <span>AI EMPLOYEE WORKLOAD INTELLIGENCE PLATFORM</span>
        </div>

        {/* User Required Copyright */}
        <p className="text-xs font-mono tracking-widest text-slate-400 uppercase font-semibold">
          © DHAKSHITHA MYLSAMY
        </p>

        {/* User Required Quote */}
        <p className="text-xs text-slate-500 font-sans italic tracking-wide">
          "Turn workload into insight, and insight into better work."
        </p>
      </div>
    </footer>
  );
}
