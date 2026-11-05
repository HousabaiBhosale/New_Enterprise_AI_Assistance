import { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function AnimatedBackground() {
  const location = useLocation();
  const { user } = useAuth();
  const canvasRef = useRef(null);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const [theme, setTheme] = useState(() => {
    return (typeof document !== 'undefined' && document.documentElement.getAttribute('data-theme')) || 
      (typeof localStorage !== 'undefined' && localStorage.getItem('enterprise_theme')) || 
      'dark';
  });

  const isAuthRoute = location.pathname.startsWith('/login') || location.pathname === '/register';
  const isAuth = !user && isAuthRoute;

  // Reactively track theme attribute changes on document root
  useEffect(() => {
    const updateTheme = () => {
      const cur = document.documentElement.getAttribute('data-theme') || localStorage.getItem('enterprise_theme') || 'dark';
      setTheme(cur);
    };

    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    window.addEventListener('storage', updateTheme);

    return () => {
      observer.disconnect();
      window.removeEventListener('storage', updateTheme);
    };
  }, []);

  // Parallax tracking with smoother response
  useEffect(() => {
    if (!isAuth) return;

    let ticking = false;
    const handleMouseMove = (e) => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const x = (e.clientX / window.innerWidth - 0.5) * 18;
          const y = (e.clientY / window.innerHeight - 0.5) * 18;
          setMouseOffset({ x, y });
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isAuth]);

  const isLight = theme === 'light';

  // High-performance falling cyber data particles / filaments animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // High-performance Neural Synaptic Web & Cognitive Energy Plexus (Non-falling, organic floating)
    const darkColors = [
      { r: 56, g: 189, b: 248 },  // Electric Cyan
      { r: 96, g: 165, b: 250 },  // High-tech Sapphire Blue
      { r: 168, g: 85, b: 247 },  // Cyber Violet
      { r: 99, g: 102, b: 241 },  // Indigo Core
      { r: 52, g: 211, b: 153 },  // Emerald Signal
    ];

    const lightColors = [
      { r: 37, g: 99, b: 235 },   // Royal Blue
      { r: 2, g: 132, b: 199 },   // Sky Blue
      { r: 124, g: 58, b: 237 },  // Deep Purple
    ];

    const nodeCount = 55;
    const nodes = [];

    for (let i = 0; i < nodeCount; i++) {
      const palette = isLight ? lightColors : darkColors;
      const c = palette[Math.floor(Math.random() * palette.length)];
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.7, // Smooth horizontal floating
        vy: (Math.random() - 0.5) * 0.7, // Smooth vertical floating (NO falling!)
        radius: 1.8 + Math.random() * 2.2,
        baseOpacity: 0.35 + Math.random() * 0.45,
        opacity: 0.4,
        color: c,
        pulseSpeed: 0.02 + Math.random() * 0.03,
        pulseAngle: Math.random() * Math.PI * 2,
      });
    }

    // Floating neural signals/pulses traversing synaptic connections
    const pulses = [];
    const maxPulses = 14;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Update node positions with gentle floating boundaries
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        n.x += n.vx;
        n.y += n.vy;

        // Soft bounce off viewport bounds
        if (n.x < 20) { n.x = 20; n.vx *= -1; }
        if (n.x > width - 20) { n.x = width - 20; n.vx *= -1; }
        if (n.y < 20) { n.y = 20; n.vy *= -1; }
        if (n.y > height - 20) { n.y = height - 20; n.vy *= -1; }

        n.pulseAngle += n.pulseSpeed;
        n.opacity = n.baseOpacity * (0.7 + 0.3 * Math.sin(n.pulseAngle));
      }

      // 2. Draw synaptic links between nearby nodes (Cognitive Neural Mesh)
      const maxConnectDist = 130;
      ctx.lineWidth = 0.9;

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxConnectDist) {
            const linkAlpha = (1 - dist / maxConnectDist) * 0.22 * Math.min(nodes[i].opacity, nodes[j].opacity);
            ctx.strokeStyle = isLight 
              ? `rgba(37, 99, 235, ${linkAlpha})` 
              : `rgba(96, 165, 250, ${linkAlpha * 1.5})`;

            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();

            // Randomly spawn a synaptic data pulse along active links
            if (pulses.length < maxPulses && Math.random() < 0.003) {
              pulses.push({
                fromX: nodes[i].x,
                fromY: nodes[i].y,
                toX: nodes[j].x,
                toY: nodes[j].y,
                progress: 0,
                speed: 0.015 + Math.random() * 0.02,
                color: nodes[i].color
              });
            }
          }
        }
      }

      // 3. Render active synaptic pulses
      for (let pIdx = pulses.length - 1; pIdx >= 0; pIdx--) {
        const p = pulses[pIdx];
        p.progress += p.speed;
        if (p.progress >= 1) {
          pulses.splice(pIdx, 1);
          continue;
        }

        const px = p.fromX + (p.toX - p.fromX) * p.progress;
        const py = p.fromY + (p.toY - p.fromY) * p.progress;
        const { r, g, b } = p.color;

        ctx.beginPath();
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${0.8 * (1 - Math.abs(p.progress - 0.5) * 2)})`;
        ctx.arc(px, py, 2.2, 0, Math.PI * 2);
        ctx.fill();
      }

      // 4. Render glowing neural nodes
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        const { r, g, b } = n.color;

        // Soft outer radial aura
        const radGrad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.radius * 3.5);
        radGrad.addColorStop(0, `rgba(255, 255, 255, ${Math.min(1, n.opacity * 1.2)})`);
        radGrad.addColorStop(0.4, `rgba(${r}, ${g}, ${b}, ${n.opacity})`);
        radGrad.addColorStop(0.8, `rgba(${r}, ${g}, ${b}, ${n.opacity * 0.25})`);
        radGrad.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);

        ctx.beginPath();
        ctx.fillStyle = radGrad;
        ctx.arc(n.x, n.y, n.radius * 3.5, 0, Math.PI * 2);
        ctx.fill();

        // Pinpoint bright core
        ctx.beginPath();
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(1, n.opacity * 1.5)})`;
        ctx.arc(n.x, n.y, n.radius * 0.75, 0, Math.PI * 2);
        ctx.fill();
      }

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, [isLight]);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -1,
        overflow: 'hidden',
        pointerEvents: 'none',
        backgroundColor: isLight ? '#f8fafc' : '#060a14',
        transition: 'background-color 0.4s ease',
      }}
    >
      {/* 1. Realistic Enterprise Background Image (Daylight Atrium for Light, Night Skyscraper for Dark) */}
      <div
        style={{
          position: 'absolute',
          top: '-5%',
          left: '-5%',
          width: '110%',
          height: '110%',
          backgroundImage: isLight ? 'url(/enterprise-bg-light.jpg)' : 'url(/enterprise-bg-new.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: isLight ? 'center 45%' : 'center 35%',
          backgroundRepeat: 'no-repeat',
          transform: `translate3d(${mouseOffset.x}px, ${mouseOffset.y}px, 0)`,
          transition: 'transform 0.45s cubic-bezier(0.25, 0.46, 0.45, 0.94), filter 0.4s ease, background-image 0.4s ease',
          filter: isLight 
            ? 'contrast(1.05) brightness(1.02) saturate(1.05)' 
            : 'contrast(1.1) brightness(0.68) saturate(0.95)',
          animation: 'cinematicCamera 7.5s ease-in-out infinite alternate',
          willChange: 'transform',
        }}
      />

      {/* 2. Realistic Animated Light Reflection (Faster dynamic sweep) */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: isLight
            ? 'linear-gradient(115deg, transparent 20%, rgba(255, 255, 255, 0.6) 45%, rgba(59, 130, 246, 0.1) 50%, transparent 65%)'
            : 'linear-gradient(115deg, transparent 20%, rgba(255, 255, 255, 0.05) 45%, rgba(59, 130, 246, 0.08) 50%, transparent 65%)',
          backgroundSize: '250% 250%',
          animation: 'architecturalLightSweep 4.5s ease-in-out infinite',
          pointerEvents: 'none',
        }}
      />

      {/* 3. Executive Scrim: Clean Luminous Frosted Glass in Light Mode, Dark Navy in Dark Mode */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: isLight
            ? 'radial-gradient(ellipse at 50% 35%, rgba(255, 255, 255, 0.38) 0%, rgba(248, 250, 252, 0.62) 55%, rgba(226, 232, 240, 0.84) 100%)'
            : 'radial-gradient(ellipse at 50% 30%, rgba(9, 15, 30, 0.72) 0%, rgba(6, 10, 22, 0.88) 65%, rgba(4, 7, 16, 0.96) 100%)',
          backdropFilter: 'blur(1.5px)',
          WebkitBackdropFilter: 'blur(1.5px)',
          transition: 'background 0.4s ease',
        }}
      />

      {/* 4. Top Horizon Glow Accent (Faster high-tech pulse) */}
      <div
        style={{
          position: 'absolute',
          top: '-10%',
          left: '15%',
          width: '70%',
          height: '40%',
          background: isLight
            ? 'radial-gradient(ellipse at center, rgba(59, 130, 246, 0.12) 0%, rgba(147, 197, 253, 0.06) 50%, transparent 75%)'
            : 'radial-gradient(ellipse at center, rgba(59, 130, 246, 0.16) 0%, rgba(99, 102, 241, 0.08) 50%, transparent 75%)',
          pointerEvents: 'none',
          animation: 'horizonPulse 3.5s ease-in-out infinite alternate',
        }}
      />

      {/* 5. Minimal Precision Architectural Grid */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: isLight
            ? `
              linear-gradient(to right, rgba(15, 23, 42, 0.03) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(15, 23, 42, 0.03) 1px, transparent 1px)
            `
            : `
              linear-gradient(to right, rgba(255, 255, 255, 0.02) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255, 255, 255, 0.02) 1px, transparent 1px)
            `,
          backgroundSize: '72px 72px',
          maskImage: 'radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0.6) 20%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0.6) 20%, transparent 80%)',
          pointerEvents: 'none',
        }}
      />

      {/* 6. Dynamic Falling Cyber Data Particles Canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 2,
        }}
      />

      <style>{`
        @keyframes cinematicCamera {
          0% {
            transform: scale(1.02) translate3d(0, 0, 0);
          }
          50% {
            transform: scale(1.07) translate3d(-18px, -12px, 0);
          }
          100% {
            transform: scale(1.04) translate3d(14px, 10px, 0);
          }
        }

        @keyframes architecturalLightSweep {
          0% {
            background-position: 0% 0%;
            opacity: 0.35;
          }
          50% {
            background-position: 100% 100%;
            opacity: 0.9;
          }
          100% {
            background-position: 0% 0%;
            opacity: 0.35;
          }
        }

        @keyframes horizonPulse {
          0% {
            opacity: 0.5;
            transform: scale(0.97);
          }
          100% {
            opacity: 1;
            transform: scale(1.05);
          }
        }
      `}</style>
    </div>
  );
}
