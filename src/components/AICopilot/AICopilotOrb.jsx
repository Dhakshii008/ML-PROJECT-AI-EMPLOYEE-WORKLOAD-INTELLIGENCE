import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bot, 
  Sparkles, 
  Send, 
  X, 
  Minimize2, 
  Maximize2, 
  CheckCircle, 
  AlertTriangle, 
  Cpu, 
  Zap,
  ArrowRight
} from 'lucide-react';

export default function AICopilotOrb({ employees = [], departments = [], onSelectEmployee }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: "Greetings. I am your AI Workforce Copilot. I have analyzed live telemetry across your workforce. How may I assist your resource allocation today?",
      chips: ["Who is currently overloaded?", "Who can take an 8h Python task?", "Why is E104 high risk?", "Which dept has highest workload?"]
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  // Dynamic context-aware query responder
  const handleQuery = (queryText) => {
    const query = queryText.toLowerCase();
    setMessages(prev => [...prev, { sender: 'user', text: queryText }]);
    setInputValue('');
    setIsThinking(true);

    setTimeout(() => {
      let reply = "";
      let relatedIds = [];

      if (query.includes('overload') || query.includes('highest risk') || query.includes('at risk')) {
        const overloaded = employees.filter(e => e.risk === 'HIGH' || e.currentWorkload >= 80);
        reply = `Identified ${overloaded.length} personnel operating at critical risk thresholds:\n\n` +
          overloaded.map(e => `• ${e.name} (${e.id}) - Workload: ${e.currentWorkload}%, Overtime: ${e.overtime}h, Deadlines: ${e.deadlineCount}`).join('\n') +
          `\n\nRecommendation: Freeze new task dispatches to these engineers and trigger capacity rebalance.`;
        relatedIds = overloaded.map(e => e.id);
      } 
      else if (query.includes('python') || query.includes('8-hour') || query.includes('8 hour')) {
        const pythonDevs = employees.filter(e => 
          e.skills.some(s => s.toLowerCase().includes('python')) && e.availableCapacity >= 25
        );
        if (pythonDevs.length > 0) {
          const best = pythonDevs[0];
          reply = `Top recommendation for a new 8-hour Python task is ${best.name} (${best.id}) in ${best.department}.\n\n` +
            `• Current Workload: ${best.currentWorkload}%\n` +
            `• Available Capacity: ${best.availableCapacity}%\n` +
            `• Risk Status: ${best.risk}\n` +
            `• Relevant Skills: ${best.skills.join(', ')}\n\n` +
            `They possess sufficient capacity to complete this within 1.5 work days safely.`;
          relatedIds = [best.id];
        } else {
          reply = "All primary Python specialists are currently above 75% workload. Consider delegating to Marcus Vance (E117) or Kavita Patel (E115).";
        }
      }
      else if (query.includes('e104') || query.includes('alex rivera')) {
        const e104 = employees.find(e => e.id === 'E104') || employees[0];
        reply = `Employee E104 (${e104.name}, Senior Software Engineer) is flagged as HIGH RISK due to:\n\n` +
          `1. Current Workload: ${e104.currentWorkload}% (Safe limit < 75%)\n` +
          `2. Weekly Overtime: ${e104.overtime} hours\n` +
          `3. Critical Deadlines: ${e104.deadlineCount} items due within 7 days\n` +
          `4. Pending Tasks: ${e104.pendingTasks} complex deliverables\n\n` +
          `ML model predicts a burnout event within 7 days if workload is not adjusted.`;
        relatedIds = ['E104'];
      }
      else if (query.includes('department') || query.includes('highest workload')) {
        const highestDept = [...departments].sort((a, b) => b.avgWorkload - a.avgWorkload)[0];
        reply = `The highest workload department is ${highestDept.name} at an average of ${highestDept.avgWorkload}% capacity utilization.\n\n` +
          `• Total Headcount: ${highestDept.headcount}\n` +
          `• High Risk Staff: ${highestDept.riskCount}\n` +
          `• Primary Handover Pressure: Directed toward Product & Infra teams.`;
      }
      else if (query.includes('capacity') || query.includes('available') || query.includes('free')) {
        const available = employees.filter(e => e.availableCapacity >= 40);
        reply = `Detected ${available.length} employees with >40% buffer capacity ready for immediate task intake:\n\n` +
          available.map(e => `• ${e.name} (${e.id}) - Capacity: ${e.availableCapacity}% (${e.department})`).join('\n');
        relatedIds = available.map(e => e.id);
      }
      else {
        reply = `Understood. Analyzing query against neural graph...\n\n` +
          `Overall workforce health index is at 68% average workload. 3 individuals are in high risk territory, and 12 team members have available capacity over 35%. You can dispatch new tasks through the Smart Task Allocator.`;
      }

      setMessages(prev => [
        ...prev, 
        { 
          sender: 'ai', 
          text: reply,
          relatedIds,
          chips: ["Who can take an 8h Python task?", "Show employees with available capacity", "Why is E104 high risk?"]
        }
      ]);
      setIsThinking(false);
    }, 700);
  };

  return (
    <>
      {/* Floating Glowing AI Orb Trigger */}
      <div className="fixed bottom-6 right-6 z-40">
        <motion.div
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          className="relative cursor-pointer group"
        >
          {/* Cyber Rotating Ring */}
          <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-cyan-500 via-indigo-500 to-pink-500 opacity-75 blur-md group-hover:opacity-100 transition-opacity animate-pulse" />
          
          <div className="relative w-14 h-14 rounded-full bg-[#080d24] border-2 border-cyan-400/80 shadow-2xl flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-purple-500/20" />
            <Bot className="w-7 h-7 text-cyan-300 group-hover:rotate-6 transition-transform" />
            
            {/* Live pulsing online dot */}
            <span className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#080d24]" />
          </div>

          {/* Floating Pill Label */}
          <span className="hidden md:inline-block absolute right-16 top-1/2 -translate-y-1/2 px-3 py-1 rounded-full glass-panel border border-cyan-500/30 text-[11px] font-mono text-cyan-300 font-bold whitespace-nowrap shadow-xl">
            AI WORKFORCE COPILOT
          </span>
        </motion.div>
      </div>

      {/* Slide-Up Interactive Conversation Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-4 md:right-8 z-50 w-[92vw] max-w-md h-[550px] glass-panel rounded-3xl border border-cyan-500/40 bg-[#090e29]/95 shadow-2xl backdrop-blur-2xl flex flex-col overflow-hidden"
          >
            {/* Copilot Header */}
            <div className="p-4 border-b border-white/10 bg-gradient-to-r from-cyan-950/40 via-indigo-950/40 to-purple-950/40 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-cyan-300 animate-spin" style={{ animationDuration: '6s' }} />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-white font-['Outfit']">
                    AI WORKFORCE COPILOT
                  </h3>
                  <span className="text-[10px] text-emerald-400 font-mono block">
                    ● Connected to Live Enterprise Telemetry
                  </span>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Chat Messages Feed */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs font-mono">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-3.5 whitespace-pre-wrap leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white rounded-tr-none font-medium'
                        : 'glass-panel border border-white/10 text-slate-200 rounded-tl-none bg-white/[0.04]'
                    }`}
                  >
                    {msg.text}

                    {/* Clickable Related Employee Badges */}
                    {msg.relatedIds && msg.relatedIds.length > 0 && (
                      <div className="mt-3 pt-2.5 border-t border-white/10 flex flex-wrap gap-1.5">
                        <span className="text-[10px] text-slate-400 block w-full">Inspect Telemetry:</span>
                        {msg.relatedIds.map(id => (
                          <button
                            key={id}
                            onClick={() => {
                              if (onSelectEmployee) onSelectEmployee(id);
                            }}
                            className="px-2 py-0.5 rounded-md bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/40 text-cyan-300 text-[10px] font-bold flex items-center gap-1 transition-colors"
                          >
                            <span>Open {id}</span>
                            <ArrowRight className="w-2.5 h-2.5" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Suggestion prompt chips */}
                  {msg.chips && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {msg.chips.map((chip, i) => (
                        <button
                          key={i}
                          onClick={() => handleQuery(chip)}
                          className="px-2.5 py-1 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-cyan-300 text-[10px] transition-colors"
                        >
                          {chip}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {isThinking && (
                <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono p-2">
                  <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                  <span>Synthesizing data model...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <div className="p-3 border-t border-white/10 bg-[#060a1c]/90">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (inputValue.trim()) handleQuery(inputValue.trim());
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  placeholder="Ask copilot about workload, risks, skills..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-3.5 py-2 text-xs text-white placeholder-slate-500 font-mono focus:outline-none focus:border-cyan-400"
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim()}
                  className="p-2.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-600 disabled:opacity-40 text-white shadow-lg transition-transform active:scale-95"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
