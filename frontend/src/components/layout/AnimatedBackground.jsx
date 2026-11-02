import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function AnimatedBackground() {
  const location = useLocation();
  const { user } = useAuth();
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

  const isAuthRoute = location.pathname.startsWith('/login') || location.pathname === '/register';
  const isAuth = !user && isAuthRoute;

  useEffect(() => {
    if (!isAuth) return;

    let ticking = false;
    const handleMouseMove = (e) => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const x = (e.clientX / window.innerWidth - 0.5) * 14;
          const y = (e.clientY / window.innerHeight - 0.5) * 14;
          setMouseOffset({ x, y });
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isAuth]);

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
        backgroundColor: '#060a14',
      }}
    >
      {/* 1. Realistic Enterprise Architectural Glass Building with Smooth Cinematic Pan & Zoom */}
      <div
        style={{
          position: 'absolute',
          top: '-5%',
          left: '-5%',
          width: '110%',
          height: '110%',
          backgroundImage: 'url(/enterprise-bg-new.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center 35%',
          backgroundRepeat: 'no-repeat',
          transform: `translate3d(${mouseOffset.x}px, ${mouseOffset.y}px, 0)`,
          transition: 'transform 0.45s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          filter: 'contrast(1.1) brightness(0.68) saturate(0.95)',
          animation: 'cinematicCamera 28s ease-in-out infinite alternate',
          willChange: 'transform',
        }}
      />

      {/* 2. Realistic Animated Architectural Light Reflection (Soft glass sheen) */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'linear-gradient(115deg, transparent 20%, rgba(255, 255, 255, 0.04) 45%, rgba(59, 130, 246, 0.06) 50%, transparent 65%)',
          backgroundSize: '250% 250%',
          animation: 'architecturalLightSweep 18s ease-in-out infinite',
          pointerEvents: 'none',
        }}
      />

      {/* 3. Deep Executive Slate & Glassmorphic Scrim */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'radial-gradient(ellipse at 50% 30%, rgba(9, 15, 30, 0.72) 0%, rgba(6, 10, 22, 0.88) 65%, rgba(4, 7, 16, 0.96) 100%)',
          backdropFilter: 'blur(2px)',
          WebkitBackdropFilter: 'blur(2px)',
        }}
      />

      {/* 4. Subtle Top Horizon Glow */}
      <div
        style={{
          position: 'absolute',
          top: '-10%',
          left: '15%',
          width: '70%',
          height: '40%',
          background: 'radial-gradient(ellipse at center, rgba(59, 130, 246, 0.14) 0%, rgba(99, 102, 241, 0.06) 50%, transparent 75%)',
          pointerEvents: 'none',
          animation: 'horizonPulse 12s ease-in-out infinite alternate',
        }}
      />

      {/* 5. Precision Engineering Architectural Grid */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.02) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.02) 1px, transparent 1px)
          `,
          backgroundSize: '72px 72px',
          maskImage: 'radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0.6) 20%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0.6) 20%, transparent 80%)',
          pointerEvents: 'none',
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
            opacity: 0.3;
          }
          50% {
            background-position: 100% 100%;
            opacity: 0.8;
          }
          100% {
            background-position: 0% 0%;
            opacity: 0.3;
          }
        }

        @keyframes horizonPulse {
          0% {
            opacity: 0.6;
            transform: scale(0.98);
          }
          100% {
            opacity: 1;
            transform: scale(1.04);
          }
        }
      `}</style>
    </div>
  );
}
