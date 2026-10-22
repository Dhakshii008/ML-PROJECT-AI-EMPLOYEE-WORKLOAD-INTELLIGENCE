import React, { useEffect, useRef } from 'react';

export default function FuturisticBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Particles system with varying depths & speeds
    const particleCount = Math.min(Math.floor((width * height) / 18000), 75);
    const particles = [];
    const colors = [
      'rgba(6, 182, 212, ',   // Cyan
      'rgba(168, 85, 247, ', // Purple
      'rgba(236, 72, 153, ', // Pink
      'rgba(16, 185, 129, ', // Emerald
      'rgba(99, 102, 241, '  // Indigo
    ];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2.2 + 0.6,
        colorBase: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.6 + 0.15,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        pulseSpeed: Math.random() * 0.02 + 0.005,
        pulseOffset: Math.random() * Math.PI * 2
      });
    }

    // Data stream packets traveling along smooth curves
    const streams = [
      { startX: 0.1, startY: 0.3, cp1X: 0.3, cp1Y: 0.1, cp2X: 0.7, cp2Y: 0.8, endX: 0.95, endY: 0.4, speed: 0.0018, progress: 0, color: '#06b6d4' },
      { startX: 0.05, startY: 0.75, cp1X: 0.4, cp1Y: 0.9, cp2X: 0.6, cp2Y: 0.2, endX: 0.9, endY: 0.85, speed: 0.0014, progress: 0.5, color: '#a855f7' },
      { startX: 0.2, startY: 0.1, cp1X: 0.5, cp1Y: 0.5, cp2X: 0.8, cp2Y: 0.2, endX: 0.98, endY: 0.6, speed: 0.0012, progress: 0.25, color: '#ec4899' }
    ];

    function getBezierPoint(p0, p1, p2, p3, t) {
      const cX = 3 * (p1.x - p0.x);
      const bX = 3 * (p2.x - p1.x) - cX;
      const aX = p3.x - p0.x - cX - bX;

      const cY = 3 * (p1.y - p0.y);
      const bY = 3 * (p2.y - p1.y) - cY;
      const aY = p3.y - p0.y - cY - bY;

      const x = aX * Math.pow(t, 3) + bX * Math.pow(t, 2) + cX * t + p0.x;
      const y = aY * Math.pow(t, 3) + bY * Math.pow(t, 2) + cY * t + p0.y;
      return { x, y };
    }

    let frame = 0;
    const render = () => {
      frame++;
      ctx.clearRect(0, 0, width, height);

      // 1. Draw subtle curved stream paths
      streams.forEach((stream) => {
        stream.progress = (stream.progress + stream.speed) % 1;

        const p0 = { x: stream.startX * width, y: stream.startY * height };
        const p1 = { x: stream.cp1X * width, y: stream.cp1Y * height };
        const p2 = { x: stream.cp2X * width, y: stream.cp2Y * height };
        const p3 = { x: stream.endX * width, y: stream.endY * height };

        // Curve line
        ctx.beginPath();
        ctx.moveTo(p0.x, p0.y);
        ctx.bezierCurveTo(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.035)';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Glowing packet moving along stream
        const head = getBezierPoint(p0, p1, p2, p3, stream.progress);
        const grad = ctx.createRadialGradient(head.x, head.y, 0, head.x, head.y, 16);
        grad.addColorStop(0, stream.color);
        grad.addColorStop(0.3, stream.color + '44');
        grad.addColorStop(1, 'transparent');

        ctx.beginPath();
        ctx.arc(head.x, head.y, 16, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(head.x, head.y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = stream.color;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // 2. Draw floating particles and subtle dynamic interconnects
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        const dynamicAlpha = p.alpha + Math.sin(frame * p.pulseSpeed + p.pulseOffset) * 0.2;
        const currentAlpha = Math.max(0.1, Math.min(dynamicAlpha, 0.85));

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${p.colorBase}${currentAlpha})`;
        ctx.fill();

        // Connect nearby particles lightly
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 110) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.05 * (1 - dist / 110)})`;
            ctx.lineWidth = 0.75;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {/* Aurora Ambient Glow Blobs */}
      <div className="absolute -top-[20%] -left-[10%] w-[55vw] h-[55vw] rounded-full bg-cyan-600/12 blur-[130px] animate-pulse-slow" />
      <div className="absolute top-[25%] -right-[15%] w-[50vw] h-[50vw] rounded-full bg-purple-600/14 blur-[140px] animate-pulse-slow" style={{ animationDelay: '2s' }} />
      <div className="absolute -bottom-[15%] left-[20%] w-[60vw] h-[60vw] rounded-full bg-pink-600/10 blur-[150px] animate-pulse-slow" style={{ animationDelay: '4s' }} />
      
      {/* Cyber Grid Pattern */}
      <div className="absolute inset-0 cyber-grid opacity-60" />

      {/* HTML5 Canvas with glowing particles and streams */}
      <canvas ref={canvasRef} className="absolute inset-0 block w-full h-full" />
    </div>
  );
}
