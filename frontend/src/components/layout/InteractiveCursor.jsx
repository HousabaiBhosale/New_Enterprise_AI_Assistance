import { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export default function InteractiveCursor() {
  const location = useLocation();
  const { user } = useAuth();
  const { isLight } = useTheme();

  const isAuthRoute = location.pathname.startsWith('/login') || location.pathname === '/register';
  const shouldShow = !user && isAuthRoute;

  const [pos, setPos] = useState({ x: -500, y: -500 });
  const [exactPos, setExactPos] = useState({ x: -500, y: -500 });
  const [isHovered, setIsHovered] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [cursorVisible, setCursorVisible] = useState(false);

  const requestRef = useRef(null);
  const currentPosRef = useRef({ x: -500, y: -500 });
  const targetPosRef = useRef({ x: -500, y: -500 });

  useEffect(() => {
    if (!shouldShow) {
      setCursorVisible(false);
      return;
    }

    const handleMouseMove = (e) => {
      targetPosRef.current = { x: e.clientX, y: e.clientY };
      setExactPos({ x: e.clientX, y: e.clientY });
      if (!cursorVisible) setCursorVisible(true);

      const target = e.target;
      const interactive = target && target.closest('button, a, input, textarea, select, [role="button"], .hover-lift, [data-interactive]');
      setIsHovered(!!interactive);

      // Pass coordinates to CSS variables for dynamic lighting
      document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
      document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);
    const handleMouseLeave = () => setCursorVisible(false);

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);

    const animate = () => {
      const ease = 0.22;
      currentPosRef.current.x += (targetPosRef.current.x - currentPosRef.current.x) * ease;
      currentPosRef.current.y += (targetPosRef.current.y - currentPosRef.current.y) * ease;

      setPos({ x: currentPosRef.current.x, y: currentPosRef.current.y });
      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [shouldShow, cursorVisible]);

  if (!shouldShow || !cursorVisible) return null;

  const ringSize = isHovered ? (isClicking ? 46 : 54) : (isClicking ? 28 : 36);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 9999,
        overflow: 'hidden',
      }}
    >
      {/* 1. Deep Dark Ambient Cosmic Well (Dark moody vignette following cursor) */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '260px',
          height: '260px',
          transform: `translate(${pos.x - 130}px, ${pos.y - 130}px)`,
          background: isLight
            ? 'radial-gradient(circle, rgba(15, 23, 42, 0.12) 0%, rgba(30, 41, 59, 0.05) 45%, transparent 70%)'
            : isHovered
            ? 'radial-gradient(circle, rgba(2, 6, 23, 0.95) 0%, rgba(10, 18, 38, 0.6) 35%, rgba(30, 58, 138, 0.15) 55%, transparent 75%)'
            : 'radial-gradient(circle, rgba(2, 6, 23, 0.85) 0%, rgba(8, 14, 30, 0.45) 40%, rgba(30, 58, 138, 0.08) 60%, transparent 75%)',
          borderRadius: '50%',
          filter: 'blur(20px)',
          transition: 'background 0.3s ease',
          willChange: 'transform',
        }}
      />

      {/* 2. Trailing Magnetic Dark Cyber Ring */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: `${ringSize}px`,
          height: `${ringSize}px`,
          transform: `translate(${pos.x - ringSize / 2}px, ${pos.y - ringSize / 2}px)`,
          borderRadius: '50%',
          background: isLight 
            ? 'rgba(15, 23, 42, 0.08)' 
            : (isHovered ? 'rgba(4, 9, 24, 0.75)' : 'rgba(6, 11, 26, 0.55)'),
          border: isLight
            ? (isHovered ? '2px solid #2563eb' : '1.5px solid rgba(15, 23, 42, 0.4)')
            : (isHovered ? '2px solid rgba(96, 165, 250, 0.95)' : '1.5px solid rgba(59, 130, 246, 0.55)'),
          boxShadow: isLight
            ? (isHovered ? '0 0 14px rgba(37, 99, 235, 0.35)' : '0 2px 8px rgba(0,0,0,0.15)')
            : isHovered
            ? '0 0 28px rgba(0, 0, 0, 0.95), inset 0 0 12px rgba(0, 0, 0, 0.9), 0 0 18px rgba(96, 165, 250, 0.45)'
            : '0 0 20px rgba(0, 0, 0, 0.9), inset 0 0 8px rgba(0, 0, 0, 0.8), 0 0 10px rgba(59, 130, 246, 0.25)',
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
          transition: 'width 0.2s cubic-bezier(0.16, 1, 0.3, 1), height 0.2s cubic-bezier(0.16, 1, 0.3, 1), border 0.2s ease, background 0.2s ease, box-shadow 0.2s ease',
          willChange: 'transform',
        }}
      />

      {/* 3. Precision Dark Tech Center Dot */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: isHovered ? '8px' : '6px',
          height: isHovered ? '8px' : '6px',
          transform: `translate(${exactPos.x - (isHovered ? 4 : 3)}px, ${exactPos.y - (isHovered ? 4 : 3)}px)`,
          borderRadius: '50%',
          background: isLight ? '#0f172a' : '#020617',
          border: isLight 
            ? '1.5px solid #2563eb' 
            : (isHovered ? '2px solid #38bdf8' : '1.5px solid #60a5fa'),
          boxShadow: isLight
            ? '0 0 6px rgba(37, 99, 235, 0.5)'
            : (isHovered ? '0 0 12px #38bdf8, 0 0 20px rgba(56, 189, 248, 0.8)' : '0 0 8px #60a5fa'),
          transition: 'width 0.15s ease, height 0.15s ease, border 0.15s ease, box-shadow 0.15s ease',
          willChange: 'transform',
        }}
      />
    </div>
  );
}
