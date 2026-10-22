import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, AlertTriangle, Activity, Award, TrendingUp, TrendingDown } from 'lucide-react';

export default function KPIWidget({ 
  title, 
  value, 
  targetValue,
  unit = '', 
  trend, 
  trendPositive = true, 
  iconType = 'users',
  theme = 'cyan', // cyan, red, purple, emerald
  subtitle
}) {
  const [displayValue, setDisplayValue] = useState(0);

  // Smooth numeric counter animation
  useEffect(() => {
    let start = 0;
    const end = targetValue !== undefined ? targetValue : parseInt(value) || 0;
    if (start === end) {
      setDisplayValue(end);
      return;
    }
    const duration = 1200; // ms
    const increment = end / (duration / 25);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setDisplayValue(end);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(start));
      }
    }, 25);
    return () => clearInterval(timer);
  }, [targetValue, value]);

  const getThemeStyles = () => {
    switch (theme) {
      case 'red':
        return {
          glow: 'glass-card-glow-red hover:border-rose-500/50',
          gradientIcon: 'from-rose-500 to-amber-500',
          textColor: 'text-rose-400',
          borderAccent: 'border-rose-500/30'
        };
      case 'emerald':
        return {
          glow: 'glass-card-glow-emerald hover:border-emerald-500/50',
          gradientIcon: 'from-emerald-400 to-cyan-500',
          textColor: 'text-emerald-400',
          borderAccent: 'border-emerald-500/30'
        };
      case 'purple':
        return {
          glow: 'glass-card-glow-purple hover:border-purple-500/50',
          gradientIcon: 'from-purple-500 to-pink-500',
          textColor: 'text-purple-400',
          borderAccent: 'border-purple-500/30'
        };
      default:
        return {
          glow: 'glass-card-glow-cyan hover:border-cyan-500/50',
          gradientIcon: 'from-cyan-400 to-blue-600',
          textColor: 'text-cyan-400',
          borderAccent: 'border-cyan-500/30'
        };
    }
  };

  const getIcon = () => {
    switch (iconType) {
      case 'risk':
        return <AlertTriangle className="w-5 h-5 text-white" />;
      case 'activity':
        return <Activity className="w-5 h-5 text-white" />;
      case 'productivity':
        return <Award className="w-5 h-5 text-white" />;
      default:
        return <Users className="w-5 h-5 text-white" />;
    }
  };

  const styles = getThemeStyles();

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ duration: 0.25 }}
      className={`glass-panel rounded-3xl p-5 relative overflow-hidden backdrop-blur-xl transition-all duration-300 ${styles.glow}`}
    >
      {/* Background corner glow */}
      <div className={`absolute -right-8 -bottom-8 w-28 h-28 rounded-full bg-gradient-to-br ${styles.gradientIcon} opacity-10 blur-xl pointer-events-none`} />

      <div className="flex items-start justify-between">
        <span className="text-xs font-mono font-bold tracking-wider text-slate-400 uppercase">
          {title}
        </span>
        <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${styles.gradientIcon} p-[1px] shadow-lg`}>
          <div className="w-full h-full bg-[#080d21]/80 rounded-[15px] flex items-center justify-center backdrop-blur-md">
            {getIcon()}
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-baseline gap-2">
        <span className="text-3xl md:text-4xl font-extrabold font-['Outfit'] text-white tracking-tight">
          {displayValue}
          {unit}
        </span>

        {trend && (
          <div className={`flex items-center text-xs font-mono font-bold px-2 py-0.5 rounded-full ${
            trendPositive 
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
              : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
          }`}>
            {trendPositive ? <TrendingUp className="w-3 h-3 mr-0.5 inline" /> : <TrendingDown className="w-3 h-3 mr-0.5 inline" />}
            {trend}
          </div>
        )}
      </div>

      {subtitle && (
        <p className="mt-2 text-xs text-slate-400 font-mono flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400/80" />
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
