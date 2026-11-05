import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, Lock, ArrowRight, Loader2, Sparkles, Users, TrendingUp, 
  HelpCircle, Briefcase, KeyRound, Shield, CheckCircle2, 
  ChevronLeft, ChevronRight, Pause, Play, Zap, Cpu, Sun, Moon,
  AlertCircle, Eye, EyeOff, X
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

// All 5 cards in circular order: Employee, HR, System Admin (center initial), Sales, Support
const ALL_ROLES = [
    {
      id: 'employee',
      label: 'Employee Self-Service',
      sub: 'Leave Balances, Company Policies & Requests',
      department: 'Engineering & Staff',
      icon: Users,
      color: '#3b82f6',
      gradient: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
      accentBg: 'rgba(59, 130, 246, 0.14)',
      image: '/roles/employee.jpg',
      capabilities: ['Leave Balance Queries', 'Policy RAG Search', 'PTO Requests', 'Approval Tracking'],
      metric: '25 Active Staff • 18d Avg PTO',
      email: 'employee@enterprise.com',
      tagline: 'HR & Employee Intelligence',
      badge: 'Employee',
    },
    {
      id: 'hr',
      label: 'HR & People Operations',
      sub: 'Workforce Records, Attendance & Policy Audits',
      department: 'Human Resources',
      icon: Briefcase,
      color: '#a855f7',
      gradient: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
      accentBg: 'rgba(168, 85, 247, 0.14)',
      image: '/roles/hr.jpg',
      capabilities: ['Workforce Records', 'Leave Approvals', 'Compliance Audits', 'PDF Reports'],
      metric: '1 Pending Leave • 0 Compliance Flags',
      email: 'hr@enterprise.com',
      tagline: 'Workforce Compliance',
      badge: 'HR',
    },
    {
      id: 'admin',
      label: 'System Administrator',
      sub: 'Multi-Agent Supervisor, RBAC & Governance',
      department: 'Central Supervisor',
      icon: Shield,
      color: '#6366f1',
      gradient: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
      accentBg: 'rgba(99, 102, 241, 0.16)',
      image: '/roles/admin.jpg',
      capabilities: ['LangGraph Supervisor', 'Tamper-Evident Audit', 'RBAC Security Matrix', 'HITL Queue'],
      metric: 'Full Platform Access • 13 Live Endpoints',
      email: 'admin@enterprise.com',
      tagline: 'Multi-Agent Supervisor',
      badge: 'Supervisor',
      isSupervisor: true,
    },
    {
      id: 'sales',
      label: 'Sales & Commercial Copilot',
      sub: 'Revenue Analytics, Deals & Pricing Playbooks',
      department: 'Commercial & Sales',
      icon: TrendingUp,
      color: '#10b981',
      gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      accentBg: 'rgba(16, 185, 129, 0.14)',
      image: '/roles/sales.jpg',
      capabilities: ['Revenue Intelligence', 'Order Processing', 'Pricing Playbooks', 'Excel Exports'],
      metric: '$26,550 Q3 Revenue • 6 Active Deals',
      email: 'sales@enterprise.com',
      tagline: 'Pipeline Acceleration',
      badge: 'Sales',
    },
    {
      id: 'support',
      label: 'Customer Support & Triage',
      sub: 'Incident Management, SLA Resolution & SOPs',
      department: 'Customer Success',
      icon: HelpCircle,
      color: '#f59e0b',
      gradient: 'linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)',
      accentBg: 'rgba(245, 158, 11, 0.14)',
      image: '/roles/support.jpg',
      capabilities: ['Auto Ticket Triage', 'SLA Escalations', 'Resolution SOPs', 'Live Incident Queue'],
      metric: '4 Open Tickets • 98.4% SLA Compliance',
      email: 'support@enterprise.com',
      tagline: 'Zero-Latency Triage',
      badge: 'Support',
    },
  ];

export default function Login() {
  const { roleId } = useParams();
  const navigate = useNavigate();
  const allRoles = ALL_ROLES;

  const [selectedRole, setSelectedRole] = useState(() => {
    if (roleId) {
      return ALL_ROLES.find(r => r.id === roleId.toLowerCase()) || null;
    }
    return null;
  });

  const [email, setEmail] = useState(() => {
    if (roleId) {
      const r = ALL_ROLES.find(item => item.id === roleId.toLowerCase());
      return r ? r.email : '';
    }
    return '';
  });
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState('');
  const { login, isLoading } = useAuth();
  const { theme, setTheme, isLight } = useTheme();

  // Active Index: Starts at 0 (Employee Self-Service)
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );

  // Fast auto-rotation speed: smooth 1.8s interval
  const autoSlideInterval = 1800;
  const transitionDuration = 0.5;

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Auto-Slide: ALL cards round fast and automatically in continuous sequence
  useEffect(() => {
    if (isPaused || selectedRole) return;

    const timer = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % allRoles.length);
    }, autoSlideInterval);

    return () => clearInterval(timer);
  }, [isPaused, selectedRole, allRoles.length, autoSlideInterval]);

  // Clean URL and sanitize :roleId param into active modal state
  useEffect(() => {
    if (roleId) {
      const matched = ALL_ROLES.find(r => r.id === roleId.toLowerCase());
      if (matched) {
        setSelectedRole(matched);
        setEmail(matched.email);
        setPassword('');
        setFormError('');
      }
      // Instantly replace URL to /login so reloading or bookmarking never gets stuck on /login/:roleId
      navigate('/login', { replace: true });
    }
  }, [roleId, navigate]);

  const handleNext = () => {
    setActiveIndex(prev => (prev + 1) % allRoles.length);
  };

  const handlePrev = () => {
    setActiveIndex(prev => (prev - 1 + allRoles.length) % allRoles.length);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!password) {
      setFormError('Please enter your password.');
      return;
    }
    try {
      await login(email, password, selectedRole?.id || 'employee');
    } catch (err) {
      setFormError(err.message || 'Invalid email or password. Please check your credentials.');
    }
  };

  // Keyboard Navigation (Left / Right Arrow Keys, Escape to close modal)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (selectedRole) {
        if (e.key === 'Escape') setSelectedRole(null);
        return;
      }
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedRole]);

  // 3D Perspective Slot Calculations matching the user's reference image
  const getSlotStyle = (offset) => {
    const isMobile = windowWidth < 680;
    const isTablet = windowWidth >= 680 && windowWidth < 1024;

    const nearX = isMobile ? 140 : isTablet ? 210 : 275;
    const farX = isMobile ? 245 : isTablet ? 375 : 495;

    switch (offset) {
      case 0: // Center Card: Larger, brighter, sharp, blue glowing border
        return {
          x: 0,
          y: 0,
          z: 120,
          rotateY: 0,
          scale: isMobile ? 0.98 : 1.08,
          opacity: 1,
          filter: 'blur(0px) brightness(1.04)',
          zIndex: 10,
          boxShadow: isLight
            ? '0 0 28px rgba(37, 99, 235, 0.35), 0 22px 55px -12px rgba(15, 23, 42, 0.16), 0 0 0 1px #2563eb, inset 0 1px 0 #ffffff'
            : '0 0 35px rgba(59, 130, 246, 0.45), 0 25px 65px rgba(0, 0, 0, 0.85), inset 0 1px 0 rgba(255, 255, 255, 0.25)',
          border: isLight
            ? '2px solid #2563eb'
            : '2px solid rgba(59, 130, 246, 0.8)',
        };
      case -1: // Near Left Card: 3D rotation, reduced scale, subtle blur
        return {
          x: -nearX,
          y: 0,
          z: 0,
          rotateY: 42,
          scale: isMobile ? 0.76 : 0.84,
          opacity: isLight ? 0.90 : 0.65,
          filter: isLight ? 'blur(0.3px) brightness(0.97)' : 'blur(1px) brightness(0.72)',
          zIndex: 6,
          boxShadow: isLight ? '0 16px 36px -8px rgba(15, 23, 42, 0.12), 0 0 1px rgba(15, 23, 42, 0.08)' : '0 15px 35px rgba(0, 0, 0, 0.6)',
          border: isLight ? '1px solid rgba(203, 213, 225, 0.95)' : '1px solid rgba(255, 255, 255, 0.12)',
        };
      case 1: // Near Right Card: 3D rotation, reduced scale, subtle blur
        return {
          x: nearX,
          y: 0,
          z: 0,
          rotateY: -42,
          scale: isMobile ? 0.76 : 0.84,
          opacity: isLight ? 0.90 : 0.65,
          filter: isLight ? 'blur(0.3px) brightness(0.97)' : 'blur(1px) brightness(0.72)',
          zIndex: 6,
          boxShadow: isLight ? '0 16px 36px -8px rgba(15, 23, 42, 0.12), 0 0 1px rgba(15, 23, 42, 0.08)' : '0 15px 35px rgba(0, 0, 0, 0.6)',
          border: isLight ? '1px solid rgba(203, 213, 225, 0.95)' : '1px solid rgba(255, 255, 255, 0.12)',
        };
      case -2: // Far Left Card: Smaller, darker, steeper rotation (realistic depth effect)
        return {
          x: -farX,
          y: 0,
          z: -100,
          rotateY: 62,
          scale: isMobile ? 0.58 : 0.66,
          opacity: isLight ? 0.75 : 0.25,
          filter: isLight ? 'blur(1.2px) brightness(0.93)' : 'blur(2.5px) brightness(0.42)',
          zIndex: 2,
          boxShadow: isLight ? '0 10px 24px -6px rgba(15, 23, 42, 0.1), 0 0 1px rgba(15, 23, 42, 0.06)' : '0 10px 25px rgba(0, 0, 0, 0.5)',
          border: isLight ? '1px solid rgba(203, 213, 225, 0.85)' : '1px solid rgba(255, 255, 255, 0.08)',
        };
      case 2: // Far Right Card: Smaller, darker, steeper rotation (realistic depth effect)
        return {
          x: farX,
          y: 0,
          z: -100,
          rotateY: -62,
          scale: isMobile ? 0.58 : 0.66,
          opacity: isLight ? 0.75 : 0.25,
          filter: isLight ? 'blur(1.2px) brightness(0.93)' : 'blur(2.5px) brightness(0.42)',
          zIndex: 2,
          boxShadow: isLight ? '0 10px 24px -6px rgba(15, 23, 42, 0.1), 0 0 1px rgba(15, 23, 42, 0.06)' : '0 10px 25px rgba(0, 0, 0, 0.5)',
          border: isLight ? '1px solid rgba(203, 213, 225, 0.85)' : '1px solid rgba(255, 255, 255, 0.08)',
        };
      default:
        return { x: 0, y: 0, z: 0, rotateY: 0, scale: 1, opacity: 1, filter: 'none', zIndex: 1 };
    }
  };

  // Coverflow Card Renderer (Exactly matching user reference screenshot)
  const renderCoverflowCard = (role, index) => {
    // Calculate circular relative offset from activeIndex: -2, -1, 0, 1, 2
    let offset = (index - activeIndex) % allRoles.length;
    if (offset > 2) offset -= allRoles.length;
    if (offset < -2) offset += allRoles.length;

    const isCenter = offset === 0;
    const style = getSlotStyle(offset);
    const Icon = role.icon;

    return (
      <motion.div
        key={role.id}
        initial={false}
        animate={{
          x: style.x,
          y: style.y,
          rotateY: style.rotateY,
          scale: style.scale,
          opacity: style.opacity,
          filter: style.filter,
          zIndex: style.zIndex,
        }}
        transition={{
          duration: transitionDuration,
          ease: [0.2, 0.8, 0.2, 1], // Snappy fast easing
        }}
        style={{
          position: 'absolute',
          width: '320px',
          height: '460px',
          borderRadius: '24px',
          background: isCenter 
            ? (isLight ? 'rgba(255, 255, 255, 0.98)' : 'rgba(14, 22, 42, 0.94)')
            : (isLight ? 'rgba(255, 255, 255, 0.92)' : 'rgba(11, 18, 36, 0.88)'),
          backdropFilter: 'blur(28px)',
          WebkitBackdropFilter: 'blur(28px)',
          border: style.border,
          boxShadow: style.boxShadow,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          transformStyle: 'preserve-3d',
          cursor: isCenter ? 'default' : 'pointer',
          willChange: 'transform, opacity, filter',
        }}
        onClick={() => {
          if (!isCenter) {
            setActiveIndex(index);
          } else {
            setSelectedRole(role);
            setEmail(role.email);
            setPassword('');
            setFormError('');
          }
        }}
      >
        {/* Top Photographic Header matching reference image with inner padding */}
        <div style={{ padding: '12px 12px 0 12px', width: '100%' }}>
          <div style={{ position: 'relative', width: '100%', height: '185px', borderRadius: '18px', overflow: 'hidden' }}>
            <img 
              src={role.image} 
              alt={role.label} 
              style={{ width: '100%', height: '100%', objectFit: 'cover', filter: isLight ? 'brightness(0.96) contrast(1.04)' : 'brightness(0.92) contrast(1.08)' }} 
            />
            <div style={{ 
              position: 'absolute', 
              top: 0, 
              left: 0, 
              width: '100%', 
              height: '100%', 
              background: isLight 
                ? 'linear-gradient(to bottom, transparent 65%, rgba(255, 255, 255, 0.8) 100%)' 
                : 'linear-gradient(to bottom, rgba(14, 22, 42, 0.05) 0%, rgba(14, 22, 42, 0.4) 70%, rgba(14, 22, 42, 0.85) 100%)' 
            }} />

            {/* Over-image Pill Badge */}
            <div style={{ position: 'absolute', top: '0.8rem', right: '0.8rem' }}>
              <span style={{ 
                fontSize: '0.7rem', 
                color: isCenter ? '#ffffff' : (isLight ? role.color : '#ffffff'), 
                background: isCenter 
                  ? 'linear-gradient(135deg, #2563eb, #3b82f6)' 
                  : (isLight ? '#ffffff' : 'rgba(15, 23, 42, 0.85)'), 
                border: isCenter ? 'none' : (isLight ? '1px solid rgba(203, 213, 225, 0.95)' : `1px solid ${role.color}75`), 
                padding: '0.22rem 0.65rem', 
                borderRadius: '999px', 
                fontWeight: 700, 
                textTransform: 'uppercase', 
                letterSpacing: '0.5px',
                boxShadow: isLight ? '0 2px 8px rgba(15, 23, 42, 0.06)' : '0 4px 12px rgba(0,0,0,0.4)',
                backdropFilter: 'blur(10px)'
              }}>
                {role.badge}
              </span>
            </div>
          </div>
        </div>

        {/* Card Content (Matching reference screenshot centered layout) */}
        <div style={{ padding: '1.2rem 1.4rem 1.6rem 1.4rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', flex: 1 }}>
          <span style={{ fontSize: '0.72rem', color: role.color, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '0.25rem' }}>
            {role.tagline}
          </span>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: isLight ? '#0f172a' : '#ffffff', marginBottom: '0.35rem', letterSpacing: '-0.3px' }}>
            {role.label}
          </h3>
          <p style={{ fontSize: '0.84rem', color: isLight ? '#475569' : '#94a3b8', lineHeight: 1.45, marginBottom: '1.2rem', maxWidth: '260px' }}>
            {role.sub}
          </p>

          {/* Rounded Pill Login Button */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.6rem', width: '100%', marginTop: 'auto' }}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedRole(role);
                setEmail(role.email);
                setPassword('');
                setFormError('');
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                padding: '0.65rem 2.2rem',
                borderRadius: '999px',
                border: isCenter 
                  ? 'none' 
                  : (isLight ? '1px solid rgba(203, 213, 225, 0.95)' : '1px solid rgba(255, 255, 255, 0.2)'),
                background: isCenter 
                  ? 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)' 
                  : (isLight ? '#ffffff' : 'rgba(255, 255, 255, 0.05)'),
                color: isCenter ? '#ffffff' : (isLight ? '#0f172a' : '#ffffff'),
                fontSize: '0.9rem',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: isCenter 
                  ? '0 6px 20px rgba(37, 99, 235, 0.4)' 
                  : (isLight ? '0 2px 6px rgba(15, 23, 42, 0.05)' : 'none'),
                backdropFilter: 'blur(10px)',
                transition: 'all 0.2s ease',
              }}
              className="hover-lift"
              title={`Login to ${role.label}`}
            >
              <KeyRound size={15} color={isCenter ? '#ffffff' : (isLight ? role.color : '#ffffff')} />
              Login
            </button>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1.5rem 1rem', position: 'relative', zIndex: 1, overflow: 'hidden' }}>
      
      {/* Sleek Top-Right Theme Toggle */}
      <div style={{ 
        position: 'absolute', 
        top: '1.25rem', 
        right: '1.5rem', 
        zIndex: 50,
        display: 'inline-flex', 
        alignItems: 'center', 
        background: isLight ? 'rgba(255, 255, 255, 0.9)' : 'rgba(15, 23, 42, 0.85)', 
        border: isLight ? '1px solid rgba(226, 232, 240, 0.95)' : '1px solid rgba(255, 255, 255, 0.12)', 
        borderRadius: '999px', 
        padding: '0.2rem', 
        backdropFilter: 'blur(16px)', 
        boxShadow: isLight ? '0 4px 14px rgba(15, 23, 42, 0.06)' : '0 4px 14px rgba(0, 0, 0, 0.4)' 
      }}>
        <button
          onClick={() => setTheme('dark')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            padding: '0.32rem 0.75rem',
            borderRadius: '999px',
            border: 'none',
            background: !isLight ? 'linear-gradient(135deg, #4f46e5, #6366f1)' : 'transparent',
            color: !isLight ? '#ffffff' : '#64748b',
            fontSize: '0.76rem',
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: !isLight ? '0 2px 8px rgba(99, 102, 241, 0.4)' : 'none',
            transition: 'all 0.2s ease',
          }}
          title="Dark Theme"
        >
          <Moon size={12} color={!isLight ? '#ffffff' : '#94a3b8'} />
          Dark
        </button>
        <button
          onClick={() => setTheme('light')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            padding: '0.32rem 0.75rem',
            borderRadius: '999px',
            border: 'none',
            background: isLight ? 'linear-gradient(135deg, #2563eb, #1d4ed8)' : 'transparent',
            color: isLight ? '#ffffff' : '#64748b',
            fontSize: '0.76rem',
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: isLight ? '0 2px 8px rgba(37, 99, 235, 0.35)' : 'none',
            transition: 'all 0.2s ease',
          }}
          title="Light Theme"
        >
          <Sun size={12} color={isLight ? '#ffffff' : '#94a3b8'} />
          Light
        </button>
      </div>

      {/* Top Header Section */}
      <div style={{ textAlign: 'center', marginBottom: '1.5rem', maxWidth: '820px' }}>
        <h1 style={{ 
          fontSize: '2.85rem', 
          fontWeight: '800', 
          marginBottom: '0.45rem', 
          letterSpacing: '-0.8px', 
          color: isLight ? '#0f172a' : '#ffffff',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.75rem',
          flexWrap: 'wrap',
          textShadow: isLight ? 'none' : '0 2px 20px rgba(0, 0, 0, 0.5)'
        }}>
          <span>ResolveX</span>
          <span style={{ 
            color: '#2563eb',
            background: isLight ? 'rgba(37, 99, 235, 0.08)' : 'rgba(59, 130, 246, 0.15)',
            border: isLight ? '1px solid rgba(37, 99, 235, 0.25)' : '1px solid rgba(59, 130, 246, 0.35)',
            padding: '0.15rem 0.65rem',
            borderRadius: '10px',
            fontSize: '1.45rem',
            fontWeight: 700,
            letterSpacing: '0.8px'
          }}>
            ENTERPRISE
          </span>
        </h1>
        <p style={{ color: isLight ? '#475569' : '#94a3b8', fontSize: '1rem', margin: '0 auto', lineHeight: 1.5, maxWidth: '640px', fontWeight: 500 }}>
          Autonomous Multi-Agent Enterprise Intelligence • Select a department portal to launch
        </p>
      </div>

      {/* ========================================================================= */}
      {/* 3D COVERFLOW STAGE (Matching reference screenshot exactly)                */}
      {/* ========================================================================= */}
      <div 
        onMouseEnter={() => setIsPaused(true)} 
        onMouseLeave={() => setIsPaused(false)}
        style={{ 
          position: 'relative', 
          width: '100%', 
          maxWidth: '1280px', 
          height: '500px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          perspective: '1200px',
          perspectiveOrigin: 'center center',
          margin: '0.5rem 0',
        }}
      >
        {/* Left Circular Navigation Arrow (matching reference screenshot) */}
        <button
          onClick={handlePrev}
          style={{
            position: 'absolute',
            left: windowWidth < 768 ? '10px' : '30px',
            zIndex: 30,
            width: '46px',
            height: '46px',
            borderRadius: '50%',
            border: isLight ? '1px solid rgba(226, 232, 240, 0.95)' : '1px solid rgba(255, 255, 255, 0.2)',
            background: isLight ? '#ffffff' : 'rgba(15, 23, 42, 0.75)',
            color: isLight ? '#0f172a' : '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            backdropFilter: 'blur(16px)',
            boxShadow: isLight ? '0 10px 25px -5px rgba(15, 23, 42, 0.12), 0 2px 6px rgba(15, 23, 42, 0.05)' : '0 8px 24px rgba(0, 0, 0, 0.5)',
            transition: 'all 0.2s ease',
          }}
          className="hover-lift"
          title="Previous (Left Arrow)"
        >
          <ChevronLeft size={22} />
        </button>

        {/* 3D Cards Container (Preserving 3D space: ALL cards round fast in 3D) */}
        <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', transformStyle: 'preserve-3d' }}>
          {allRoles.map((role, idx) => renderCoverflowCard(role, idx))}
        </div>

        {/* Right Circular Navigation Arrow (matching reference screenshot) */}
        <button
          onClick={handleNext}
          style={{
            position: 'absolute',
            right: windowWidth < 768 ? '10px' : '30px',
            zIndex: 30,
            width: '46px',
            height: '46px',
            borderRadius: '50%',
            border: isLight ? '1px solid rgba(226, 232, 240, 0.95)' : '1px solid rgba(255, 255, 255, 0.2)',
            background: isLight ? '#ffffff' : 'rgba(15, 23, 42, 0.75)',
            color: isLight ? '#0f172a' : '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            backdropFilter: 'blur(16px)',
            boxShadow: isLight ? '0 10px 25px -5px rgba(15, 23, 42, 0.12), 0 2px 6px rgba(15, 23, 42, 0.05)' : '0 8px 24px rgba(0, 0, 0, 0.5)',
            transition: 'all 0.2s ease',
          }}
          className="hover-lift"
          title="Next (Right Arrow)"
        >
          <ChevronRight size={22} />
        </button>
      </div>

      {/* ========================================================================= */}
      {/* FIVE PAGINATION DOTS (Matching reference screenshot below the carousel)   */}
      {/* ========================================================================= */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginTop: '1.4rem', marginBottom: '0.4rem' }}>
        {allRoles.map((role, dotIdx) => {
          const isActive = dotIdx === activeIndex;

          return (
            <button
              key={role.id}
              onClick={() => setActiveIndex(dotIdx)}
              style={{
                width: isActive ? '10px' : '7px',
                height: isActive ? '10px' : '7px',
                borderRadius: '50%',
                border: 'none',
                background: isActive 
                  ? '#2563eb' 
                  : (isLight ? 'rgba(15, 23, 42, 0.22)' : 'rgba(255, 255, 255, 0.22)'),
                boxShadow: isActive 
                  ? (isLight ? '0 0 14px rgba(37, 99, 235, 0.7), 0 0 4px #2563eb' : '0 0 14px #38bdf8, 0 0 4px #38bdf8') 
                  : 'none',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                padding: 0,
              }}
              className="hover-lift"
              title={`Rotate to ${role.label}`}
            />
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* IN-PAGE CREDENTIALS MODAL (Smooth Overlay over 3D Coverflow)               */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {selectedRole && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedRole(null)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1.5rem',
              background: isLight ? 'rgba(15, 23, 42, 0.45)' : 'rgba(2, 6, 23, 0.78)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="glass-panel"
              style={{
                width: '100%',
                maxWidth: '460px',
                borderRadius: '24px',
                position: 'relative',
                background: isLight ? 'rgba(255, 255, 255, 0.97)' : 'rgba(12, 19, 35, 0.94)',
                backdropFilter: 'blur(32px)',
                WebkitBackdropFilter: 'blur(32px)',
                border: isLight ? '1px solid rgba(203, 213, 225, 0.9)' : `1px solid ${selectedRole.color}60`,
                boxShadow: isLight
                  ? '0 25px 60px -15px rgba(15, 23, 42, 0.25)'
                  : `0 24px 60px -15px ${selectedRole.color}45, 0 10px 40px rgba(0, 0, 0, 0.85)`,
                overflow: 'hidden',
              }}
            >
              {/* Card Top Banner with Real Photo */}
              <div style={{ position: 'relative', width: '100%', height: '140px', overflow: 'hidden' }}>
                <img
                  src={selectedRole.image}
                  alt={selectedRole.label}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.85) contrast(1.05)' }}
                />
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: isLight
                      ? 'linear-gradient(to bottom, transparent 35%, rgba(255, 255, 255, 0.95) 100%)'
                      : 'linear-gradient(to bottom, rgba(12, 19, 35, 0.2) 0%, rgba(12, 19, 35, 0.96) 100%)',
                  }}
                />

                {/* Back / Switch Agent Button */}
                <button
                  onClick={() => setSelectedRole(null)}
                  style={{
                    position: 'absolute',
                    top: '1rem',
                    left: '1rem',
                    background: isLight ? '#ffffff' : 'rgba(15, 23, 42, 0.85)',
                    border: isLight ? '1px solid rgba(203, 213, 225, 0.9)' : '1px solid rgba(255, 255, 255, 0.15)',
                    color: isLight ? '#0f172a' : '#fff',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    padding: '0.4rem 0.85rem',
                    borderRadius: '999px',
                    boxShadow: isLight ? '0 4px 12px rgba(0,0,0,0.06)' : 'none',
                    backdropFilter: 'blur(10px)',
                  }}
                  className="hover-lift"
                >
                  &larr; Switch Agent
                </button>

                {/* Close ✕ Button */}
                <button
                  onClick={() => setSelectedRole(null)}
                  style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: isLight ? '#ffffff' : 'rgba(15, 23, 42, 0.85)',
                    border: isLight ? '1px solid rgba(203, 213, 225, 0.9)' : '1px solid rgba(255, 255, 255, 0.15)',
                    color: isLight ? '#0f172a' : '#fff',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: isLight ? '0 4px 12px rgba(0,0,0,0.06)' : 'none',
                    backdropFilter: 'blur(10px)',
                  }}
                  className="hover-lift"
                  title="Close (Esc)"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Form Content */}
              <div style={{ padding: '1.2rem 2.2rem 2.4rem 2.2rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '1.8rem' }}>
                  <div
                    style={{
                      width: '62px',
                      height: '62px',
                      borderRadius: '16px',
                      background: selectedRole.gradient,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '1rem',
                      marginTop: '-32px',
                      boxShadow: `0 8px 26px ${selectedRole.color}50`,
                      border: '2px solid rgba(255, 255, 255, 0.4)',
                      position: 'relative',
                      zIndex: 2,
                    }}
                  >
                    {(() => {
                      const IconComp = selectedRole.icon;
                      return <IconComp size={32} color="#fff" />;
                    })()}
                  </div>
                  <h1 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '0.35rem', textAlign: 'center', color: isLight ? '#0f172a' : '#fff', letterSpacing: '-0.3px' }}>
                    {selectedRole.label}
                  </h1>
                  <p style={{ color: isLight ? '#475569' : '#94a3b8', textAlign: 'center', fontSize: '0.88rem' }}>
                    Authenticate to launch your specialized autonomous workspace
                  </p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                  {formError && (
                    <div style={{
                      padding: '0.75rem 1rem',
                      background: isLight ? 'rgba(239, 68, 68, 0.1)' : 'rgba(239, 68, 68, 0.18)',
                      border: isLight ? '1px solid rgba(239, 68, 68, 0.4)' : '1px solid rgba(239, 68, 68, 0.5)',
                      borderRadius: '12px',
                      color: isLight ? '#b91c1c' : '#fca5a5',
                      fontSize: '0.85rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.55rem',
                      fontWeight: 500,
                    }}>
                      <AlertCircle size={16} color={isLight ? '#b91c1c' : '#fca5a5'} />
                      <span>{formError}</span>
                    </div>
                  )}

                  <div>
                    <label style={{ display: 'block', fontSize: '0.86rem', marginBottom: '0.45rem', fontWeight: '600', color: isLight ? '#334155' : '#e2e8f0' }}>Enterprise Email</label>
                    <div style={{ position: 'relative' }}>
                      <Mail size={17} color={isLight ? '#94a3b8' : '#64748b'} style={{ pointerEvents: 'none', position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                      <input
                        type="email"
                        name="email"
                        autoComplete="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                        placeholder="e.g. admin@enterprise.com"
                        style={{ width: '100%', background: isLight ? '#ffffff' : 'rgba(8, 13, 26, 0.85)', border: isLight ? '1px solid rgba(203, 213, 225, 0.9)' : '1px solid rgba(255, 255, 255, 0.12)', color: isLight ? '#0f172a' : '#f8fafc', padding: '0.85rem 1rem 0.85rem 2.65rem', borderRadius: '12px', outline: 'none', fontSize: '0.94rem', boxShadow: isLight ? '0 1px 3px rgba(0,0,0,0.04)' : 'none' }}
                      />
                    </div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.45rem' }}>
                      <label style={{ fontSize: '0.86rem', fontWeight: '600', color: isLight ? '#334155' : '#e2e8f0' }}>Password</label>
                      <span style={{ fontSize: '0.78rem', color: selectedRole.color, fontWeight: 700 }}>Default: password123</span>
                    </div>
                    <div style={{ position: 'relative' }}>
                      <Lock size={17} color={isLight ? '#94a3b8' : '#64748b'} style={{ pointerEvents: 'none', position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                        placeholder="Enter password (e.g. password123)"
                        style={{ width: '100%', background: isLight ? '#ffffff' : 'rgba(8, 13, 26, 0.85)', border: isLight ? '1px solid rgba(203, 213, 225, 0.9)' : '1px solid rgba(255, 255, 255, 0.12)', color: isLight ? '#0f172a' : '#f8fafc', padding: '0.85rem 2.85rem 0.85rem 2.65rem', borderRadius: '12px', outline: 'none', fontSize: '0.94rem', boxShadow: isLight ? '0 1px 3px rgba(0,0,0,0.04)' : 'none' }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{
                          position: 'absolute',
                          right: '0.85rem',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          background: 'transparent',
                          border: 'none',
                          color: isLight ? '#94a3b8' : '#64748b',
                          cursor: 'pointer',
                          padding: '0.25rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                        title={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                      </button>
                    </div>
                  </div>

                  {/* Quick Demo Fill Helper */}
                  <div style={{ padding: '0.8rem 1rem', background: isLight ? 'rgba(241, 245, 249, 0.8)' : 'rgba(255, 255, 255, 0.03)', borderRadius: '12px', border: isLight ? '1px dashed rgba(203, 213, 225, 0.9)' : '1px dashed rgba(255, 255, 255, 0.12)', fontSize: '0.82rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: isLight ? '#475569' : '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                      <KeyRound size={15} color={selectedRole.color} /> Demo: <strong style={{ color: isLight ? '#0f172a' : '#fff' }}>{selectedRole.email}</strong>
                    </span>
                    <button
                      type="button"
                      onClick={() => { setEmail(selectedRole.email); setPassword('password123'); setFormError(''); }}
                      style={{ background: selectedRole.accentBg, border: `1px solid ${selectedRole.color}60`, color: selectedRole.color, borderRadius: '6px', padding: '0.25rem 0.65rem', fontSize: '0.78rem', cursor: 'pointer', fontWeight: 700 }}
                    >
                      Auto-fill
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    style={{
                      marginTop: '0.3rem',
                      background: selectedRole.gradient,
                      color: 'white',
                      border: 'none',
                      padding: '0.95rem',
                      borderRadius: '12px',
                      fontWeight: '700',
                      fontSize: '1rem',
                      cursor: isLoading ? 'default' : 'pointer',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      gap: '0.5rem',
                      boxShadow: `0 8px 26px ${selectedRole.color}45`,
                      opacity: isLoading ? 0.7 : 1,
                      transition: 'all 0.2s ease',
                    }}
                    className={!isLoading ? "hover-lift" : ""}
                  >
                    {isLoading ? <Loader2 size={20} className="animate-spin" /> : (
                      <>Sign In & Launch Agent <ArrowRight size={18} /></>
                    )}
                  </button>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
