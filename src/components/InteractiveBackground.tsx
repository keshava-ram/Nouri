'use client';

import React, { useEffect, useState } from 'react';

export const InteractiveBackground: React.FC = () => {
  const [mousePos, setMousePos] = useState({ x: -500, y: -500 });
  const [smoothPos, setSmoothPos] = useState({ x: -500, y: -500 });
  const [viewport, setViewport] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateViewport = () => setViewport({ width: window.innerWidth, height: window.innerHeight });
    updateViewport();
    window.addEventListener('resize', updateViewport, { passive: true });
    return () => window.removeEventListener('resize', updateViewport);
  }, []);

  useEffect(() => {
    let animationFrameId: number;

    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Smooth lerp loop for buttery-fluid cursor lag/glow effect
    const animate = () => {
      setSmoothPos((prev) => {
        const dx = mousePos.x - prev.x;
        const dy = mousePos.y - prev.y;
        // Ease factor
        return {
          x: prev.x + dx * 0.08,
          y: prev.y + dy * 0.08,
        };
      });
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [mousePos.x, mousePos.y]);

  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
      {/* 1. Subtle Dot Matrix Texture */}
      <div
        className="absolute inset-0 opacity-[0.045]"
        style={{
          backgroundImage: `radial-gradient(#0f766e 1.6px, transparent 1.6px)`,
          backgroundSize: '28px 28px',
          backgroundPosition: `${smoothPos.x * 0.035}px ${smoothPos.y * 0.035}px`,
          transition: 'background-position 0.12s ease-out',
        }}
      />

      {/* Small cursor-following particles */}
      {[0, 1, 2, 3].map((dot) => (
        <div
          key={dot}
          className="absolute rounded-full blur-[1px] will-change-transform"
          style={{
            width: dot % 2 === 0 ? 8 : 5,
            height: dot % 2 === 0 ? 8 : 5,
            left: 0,
            top: 0,
            opacity: smoothPos.x < 0 ? 0 : 0.55,
            background: dot % 2 === 0 ? '#14b8a6' : '#a3e635',
            transform: `translate3d(${smoothPos.x + Math.cos(dot * Math.PI / 2) * (24 + dot * 5)}px, ${smoothPos.y + Math.sin(dot * Math.PI / 2) * (24 + dot * 5)}px, 0)`,
            transition: `transform ${0.16 + dot * 0.06}s ease-out`,
          }}
        />
      ))}

      {/* 2. Interactive Cursor Spotlight (Tracks cursor smoothly) */}
      <div
        className="absolute rounded-full pointer-events-none will-change-transform blur-[90px] transition-opacity duration-500"
        style={{
          width: '580px',
          height: '580px',
          left: 0,
          top: 0,
          transform: `translate3d(${smoothPos.x - 290}px, ${smoothPos.y - 290}px, 0)`,
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.22) 0%, rgba(20, 184, 166, 0.16) 40%, rgba(6, 182, 212, 0.08) 70%, transparent 85%)',
          opacity: smoothPos.x < 0 ? 0 : 1,
        }}
      />

      {/* 3. Parallax Floating Aurora Blob 1 (Top-Left) */}
      <div
        className="absolute w-[600px] h-[600px] rounded-full blur-[110px] pointer-events-none will-change-transform animate-float-slow"
        style={{
          top: '-10%',
          left: '15%',
          background: 'radial-gradient(circle, rgba(52, 211, 153, 0.22) 0%, rgba(20, 184, 166, 0.12) 50%, transparent 75%)',
          transform: `translate3d(${(smoothPos.x - viewport.width / 2) * -0.025}px, ${(smoothPos.y - viewport.height / 2) * -0.025}px, 0)`,
          transition: 'transform 0.4s ease-out',
        }}
      />

      {/* 4. Parallax Floating Aurora Blob 2 (Middle-Right) */}
      <div
        className="absolute w-[500px] h-[500px] rounded-full blur-[120px] pointer-events-none will-change-transform animate-pulse-glow"
        style={{
          top: '35%',
          right: '-5%',
          background: 'radial-gradient(circle, rgba(6, 182, 212, 0.18) 0%, rgba(59, 130, 246, 0.10) 50%, transparent 75%)',
          transform: `translate3d(${(smoothPos.x - viewport.width / 2) * 0.02}px, ${(smoothPos.y - viewport.height / 2) * 0.02}px, 0)`,
          transition: 'transform 0.5s ease-out',
        }}
      />

      {/* 5. Parallax Floating Aurora Blob 3 (Bottom-Center Warm Glow) */}
      <div
        className="absolute w-[550px] h-[550px] rounded-full blur-[130px] pointer-events-none will-change-transform"
        style={{
          bottom: '-10%',
          left: '30%',
          background: 'radial-gradient(circle, rgba(251, 191, 36, 0.12) 0%, rgba(16, 185, 129, 0.08) 50%, transparent 75%)',
          transform: `translate3d(${(smoothPos.x - viewport.width / 2) * -0.015}px, ${(smoothPos.y - viewport.height / 2) * -0.015}px, 0)`,
          transition: 'transform 0.6s ease-out',
        }}
      />
    </div>
  );
};
