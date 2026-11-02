import { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function InteractiveCursor() {
  const location = useLocation();
  const { user } = useAuth();

  const isAuthRoute = location.pathname.startsWith('/login') || location.pathname === '/register';
  const shouldShow = !user && isAuthRoute;

  const [pos, setPos] = useState({ x: -500, y: -500 });
  const [isHovered, setIsHovered] = useState(false);
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
      if (!cursorVisible) setCursorVisible(true);

      const target = e.target;
      const interactive = target && target.closest('button, a, input, textarea, select, [role="button"], .hover-lift, [data-interactive]');
      setIsHovered(!!interactive);

      // Pass coordinates to CSS variables for specular reflections
      document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
      document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
    };

    const handleMouseLeave = () => setCursorVisible(false);

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    const animate = () => {
      const ease = 0.15;
      currentPosRef.current.x += (targetPosRef.current.x - currentPosRef.current.x) * ease;
      currentPosRef.current.y += (targetPosRef.current.y - currentPosRef.current.y) * ease;

      setPos({ x: currentPosRef.current.x, y: currentPosRef.current.y });
      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [shouldShow, cursorVisible]);

  if (!shouldShow || !cursorVisible) return null;

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
      {/* Subtle Specular Ambient Sheen (Realistic Glass Glare) */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '360px',
          height: '360px',
          transform: `translate(${pos.x - 180}px, ${pos.y - 180}px)`,
          background: isHovered
            ? 'radial-gradient(circle, rgba(255, 255, 255, 0.08) 0%, rgba(99, 102, 241, 0.04) 35%, transparent 70%)'
            : 'radial-gradient(circle, rgba(255, 255, 255, 0.04) 0%, transparent 65%)',
          borderRadius: '50%',
          filter: 'blur(30px)',
          transition: 'background 0.3s ease',
          willChange: 'transform',
        }}
      />
    </div>
  );
}
