import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, ShieldAlert, Zap, Cpu } from 'lucide-react';

export default function HeroNetworkVisualization({ employees = [], onSelectEmployee }) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [hoveredNode, setHoveredNode] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  // Map employees to spatial node coordinates
  const nodesRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    let width = (canvas.width = canvas.parentElement.clientWidth);
    let height = (canvas.height = canvas.parentElement.clientHeight);

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
      initNodes();
    };
    window.addEventListener('resize', handleResize);

    const nodeData = [
      { id: 'E104', xRatio: 0.22, yRatio: 0.35, role: 'Sr. Software Engineer', load: 87, risk: 'HIGH', prod: 89 },
      { id: 'E102', xRatio: 0.48, yRatio: 0.22, role: 'Backend Architect', load: 52, risk: 'LOW', prod: 94 },
      { id: 'E117', xRatio: 0.76, yRatio: 0.32, role: 'Fullstack Engineer', load: 61, risk: 'LOW', prod: 86 },
      { id: 'E108', xRatio: 0.28, yRatio: 0.72, role: 'Lead Product Designer', load: 74, risk: 'MEDIUM', prod: 91 },
      { id: 'E112', xRatio: 0.52, yRatio: 0.58, role: 'Principal Product Mgr', load: 92, risk: 'HIGH', prod: 88 },
      { id: 'E115', xRatio: 0.78, yRatio: 0.70, role: 'DevOps & Cloud Lead', load: 68, risk: 'MEDIUM', prod: 92 },
      { id: 'E125', xRatio: 0.50, yRatio: 0.85, role: 'People Analytics Lead', load: 46, risk: 'LOW', prod: 90 },
      { id: 'E109', xRatio: 0.12, yRatio: 0.55, role: 'UI Motion Specialist', load: 38, risk: 'LOW', prod: 84 },
      { id: 'E123', xRatio: 0.88, yRatio: 0.50, role: 'SRE & Ops Analyst', load: 81, risk: 'HIGH', prod: 83 }
    ];

    const initNodes = () => {
      nodesRef.current = nodeData.map((item, idx) => ({
        ...item,
        x: item.xRatio * width,
        y: item.yRatio * height,
        baseX: item.xRatio * width,
        baseY: item.yRatio * height,
        radius: item.load > 80 ? 18 : item.load > 60 ? 15 : 13,
        color: item.load >= 80 ? '#f43f5e' : item.load >= 65 ? '#fbbf24' : '#10b981',
        pulseOffset: idx * 0.7,
        floatSpeed: 0.0015 + idx * 0.0003
      }));
    };

    initNodes();

    // Define edges between connected employee nodes
    const links = [
      [0, 1], [1, 2], [0, 3], [1, 4], [2, 5],
      [3, 4], [4, 5], [3, 6], [4, 6], [5, 6],
      [7, 0], [7, 3], [2, 8], [5, 8]
    ];

    // Data packets traveling on links
    const packets = links.map(([source, target], i) => ({
      source,
      target,
      progress: (i * 0.18) % 1,
      speed: 0.004 + (i % 3) * 0.002,
      color: i % 2 === 0 ? '#06b6d4' : '#a855f7'
    }));

    let frame = 0;

    const render = () => {
      frame++;
      ctx.clearRect(0, 0, width, height);

      const nodes = nodesRef.current;
      if (!nodes.length) return;

      // Update node floating movement
      nodes.forEach((node) => {
        node.y = node.baseY + Math.sin(frame * 0.03 + node.pulseOffset) * 6;
        node.x = node.baseX + Math.cos(frame * 0.02 + node.pulseOffset) * 4;
      });

      // 1. Draw glowing connecting lines
      links.forEach(([sIdx, tIdx]) => {
        const source = nodes[sIdx];
        const target = nodes[tIdx];
        if (!source || !target) return;

        ctx.beginPath();
        ctx.moveTo(source.x, source.y);
        ctx.lineTo(target.x, target.y);
        
        // Edge gradient based on connected node risk
        const grad = ctx.createLinearGradient(source.x, source.y, target.x, target.y);
        grad.addColorStop(0, source.color + '40');
        grad.addColorStop(1, target.color + '40');

        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.6;
        ctx.stroke();
      });

      // 2. Draw moving data packets
      packets.forEach((pkt) => {
        pkt.progress = (pkt.progress + pkt.speed) % 1;
        const source = nodes[pkt.source];
        const target = nodes[pkt.target];
        if (!source || !target) return;

        const px = source.x + (target.x - source.x) * pkt.progress;
        const py = source.y + (target.y - source.y) * pkt.progress;

        // Packet glow
        ctx.beginPath();
        ctx.arc(px, py, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = pkt.color;
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // 3. Draw employee nodes with radial pulses
      nodes.forEach((node) => {
        const isHovered = hoveredNode?.id === node.id;
        const pulse = Math.sin(frame * 0.05 + node.pulseOffset) * 4;

        // Outer glow ring
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius + pulse + 4, 0, Math.PI * 2);
        ctx.strokeStyle = node.color + (isHovered ? '90' : '30');
        ctx.lineWidth = 2;
        ctx.stroke();

        // Node circle background
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#0b1126';
        ctx.fill();
        ctx.strokeStyle = node.color;
        ctx.lineWidth = isHovered ? 3.5 : 2;
        ctx.shadowColor = node.color;
        ctx.shadowBlur = isHovered ? 20 : 10;
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Inner core
        ctx.beginPath();
        ctx.arc(node.x, node.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        ctx.fill();

        // Node ID label
        ctx.fillStyle = '#e2e8f0';
        ctx.font = '600 11px JetBrains Mono, monospace';
        ctx.textAlign = 'center';
        ctx.fillText(node.id, node.x, node.y + node.radius + 15);
      });

      animId = requestAnimationFrame(render);
    };

    render();

    // Mouse hover detection
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      let found = null;
      for (const node of nodesRef.current) {
        const dx = mouseX - node.x;
        const dy = mouseY - node.y;
        if (Math.sqrt(dx * dx + dy * dy) < node.radius + 12) {
          found = node;
          break;
        }
      }

      if (found) {
        setHoveredNode(found);
        setTooltipPos({ x: found.x, y: found.y - found.radius - 12 });
      } else {
        setHoveredNode(null);
      }
    };

    const handleCanvasClick = () => {
      if (hoveredNode && onSelectEmployee) {
        onSelectEmployee(hoveredNode.id);
      }
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('click', handleCanvasClick);

    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('click', handleCanvasClick);
      cancelAnimationFrame(animId);
    };
  }, [hoveredNode, onSelectEmployee]);

  return (
    <div ref={containerRef} className="relative w-full h-[460px] md:h-[540px] flex items-center justify-center">
      {/* Background radial highlight */}
      <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/10 via-purple-500/10 to-pink-500/10 rounded-3xl blur-2xl -z-10" />

      {/* Network Canvas */}
      <canvas ref={canvasRef} className="w-full h-full block cursor-pointer" />

      {/* Futuristic Floating Tooltip on Hover */}
      <AnimatePresence>
        {hoveredNode && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            style={{
              position: 'absolute',
              left: `${tooltipPos.x}px`,
              top: `${tooltipPos.y}px`,
              transform: 'translate(-50%, -100%)',
              pointerEvents: 'none'
            }}
            className="z-30 min-w-[210px] glass-panel rounded-2xl p-3.5 border border-white/20 shadow-2xl backdrop-blur-xl bg-[#090e24]/90"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-2">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: hoveredNode.color }} />
                <span className="font-mono font-bold text-xs text-white">Employee {hoveredNode.id}</span>
              </div>
              <span className={`text-[10px] font-mono font-extrabold px-1.5 py-0.5 rounded-full ${
                hoveredNode.risk === 'HIGH' ? 'bg-rose-500/30 text-rose-300 border border-rose-500/40' :
                hoveredNode.risk === 'MEDIUM' ? 'bg-amber-500/30 text-amber-300 border border-amber-500/40' :
                'bg-emerald-500/30 text-emerald-300 border border-emerald-500/40'
              }`}>
                {hoveredNode.risk} RISK
              </span>
            </div>

            <p className="text-xs text-slate-300 font-medium mb-3">{hoveredNode.role}</p>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-white/5 rounded-xl p-2 border border-white/5">
                <span className="text-[10px] text-slate-400 block font-mono">Workload</span>
                <span className="font-bold font-mono text-sm text-white">{hoveredNode.load}%</span>
              </div>
              <div className="bg-white/5 rounded-xl p-2 border border-white/5">
                <span className="text-[10px] text-slate-400 block font-mono">Productivity</span>
                <span className="font-bold font-mono text-sm text-cyan-300">{hoveredNode.prod}%</span>
              </div>
            </div>

            <div className="mt-2 text-[10px] text-center text-slate-400 font-mono">
              Click node to inspect telemetry
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Network Legend */}
      <div className="absolute bottom-3 left-4 right-4 md:left-auto md:right-4 glass-panel rounded-xl px-4 py-2 flex items-center justify-between md:justify-end gap-4 text-xs font-mono border border-white/10">
        <span className="text-slate-400 text-[11px] hidden md:inline">Live Workload Spectrum:</span>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#10b981]" />
          <span className="text-slate-300 text-[11px]">Low (&lt;65%)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_8px_#fbbf24]" />
          <span className="text-slate-300 text-[11px]">Moderate</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-[0_0_8px_#f43f5e]" />
          <span className="text-slate-300 text-[11px]">High (&gt;80%)</span>
        </div>
      </div>
    </div>
  );
}
