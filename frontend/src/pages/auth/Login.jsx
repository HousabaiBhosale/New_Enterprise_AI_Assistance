import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, Lock, ArrowRight, Loader2, Sparkles, Users, TrendingUp, 
  HelpCircle, Briefcase, KeyRound, Shield, CheckCircle2, 
  ChevronLeft, ChevronRight, Pause, Play, Zap, Cpu
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
  const { roleId } = useParams();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading } = useAuth();

  // All 5 cards in order: Employee, HR, System Admin (center initial), Sales, Support
  const allRoles = [
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

  // Active Index: Starts at 2 (System Administrator initially in the center)
  const [activeIndex, setActiveIndex] = useState(2);
  const [isPaused, setIsPaused] = useState(false);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );

  // Auto-slide interval: 3 seconds (as requested)
  const AUTO_SLIDE_INTERVAL = 3000;

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const currentRole = roleId ? allRoles.find(r => r.id === roleId.toLowerCase()) : null;

  // Auto-Slide: ALL cards round (rotate) automatically in circular order every 3 seconds
  useEffect(() => {
    if (isPaused || currentRole) return;

    const timer = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % allRoles.length);
    }, AUTO_SLIDE_INTERVAL);

    return () => clearInterval(timer);
  }, [isPaused, currentRole, allRoles.length]);

  // Sync credentials on roleId changes
  useEffect(() => {
    if (roleId && currentRole) {
      setEmail(currentRole.email);
      setPassword('password123');
    }
  }, [roleId, currentRole]);

  const handleNext = () => {
    setActiveIndex(prev => (prev + 1) % allRoles.length);
  };

  const handlePrev = () => {
    setActiveIndex(prev => (prev - 1 + allRoles.length) % allRoles.length);
  };

  const handleQuickLogin = (roleItem) => {
    login(roleItem.email, 'password123', roleItem.id);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    login(email, password, roleId || 'employee');
  };

  // Keyboard Navigation (Left / Right Arrow Keys)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (currentRole) return;
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentRole]);

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
          filter: 'blur(0px) brightness(1.06)',
          zIndex: 10,
          boxShadow: '0 0 35px rgba(59, 130, 246, 0.45), 0 25px 65px rgba(0, 0, 0, 0.85), inset 0 1px 0 rgba(255, 255, 255, 0.25)',
          border: '2px solid rgba(59, 130, 246, 0.8)',
        };
      case -1: // Near Left Card: 3D rotation, reduced scale, subtle blur
        return {
          x: -nearX,
          y: 0,
          z: 0,
          rotateY: 42,
          scale: isMobile ? 0.76 : 0.84,
          opacity: 0.65,
          filter: 'blur(1px) brightness(0.72)',
          zIndex: 6,
          boxShadow: '0 15px 35px rgba(0, 0, 0, 0.6)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
        };
      case 1: // Near Right Card: 3D rotation, reduced scale, subtle blur
        return {
          x: nearX,
          y: 0,
          z: 0,
          rotateY: -42,
          scale: isMobile ? 0.76 : 0.84,
          opacity: 0.65,
          filter: 'blur(1px) brightness(0.72)',
          zIndex: 6,
          boxShadow: '0 15px 35px rgba(0, 0, 0, 0.6)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
        };
      case -2: // Far Left Card: Smaller, darker, steeper rotation (realistic depth effect)
        return {
          x: -farX,
          y: 0,
          z: -100,
          rotateY: 62,
          scale: isMobile ? 0.58 : 0.66,
          opacity: 0.25,
          filter: 'blur(2.5px) brightness(0.42)',
          zIndex: 2,
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.5)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
        };
      case 2: // Far Right Card: Smaller, darker, steeper rotation (realistic depth effect)
        return {
          x: farX,
          y: 0,
          z: -100,
          rotateY: -62,
          scale: isMobile ? 0.58 : 0.66,
          opacity: 0.25,
          filter: 'blur(2.5px) brightness(0.42)',
          zIndex: 2,
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.5)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
        };
      default:
        return { x: 0, y: 0, z: 0, rotateY: 0, scale: 1, opacity: 1, filter: 'none', zIndex: 1 };
    }
  };

  // Dedicated Login Form view when a department is selected
  if (currentRole) {
    const Icon = currentRole.icon;
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', position: 'relative', zIndex: 1 }}>
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="glass-panel" 
          style={{ 
            width: '100%', 
            maxWidth: '460px', 
            borderRadius: '24px', 
            position: 'relative', 
            background: 'rgba(12, 19, 35, 0.92)',
            backdropFilter: 'blur(32px)',
            WebkitBackdropFilter: 'blur(32px)',
            border: `1px solid ${currentRole.color}50`, 
            boxShadow: `0 24px 60px -15px ${currentRole.color}40, 0 10px 40px rgba(0, 0, 0, 0.7)`,
            overflow: 'hidden'
          }}
        >
          {/* Card Top Banner with Real Photo */}
          <div style={{ position: 'relative', width: '100%', height: '140px', overflow: 'hidden' }}>
            <img 
              src={currentRole.image} 
              alt={currentRole.label}
              style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.75) contrast(1.1)' }}
            />
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(to bottom, rgba(12, 19, 35, 0.2) 0%, rgba(12, 19, 35, 0.95) 100%)' }} />
            
            <button 
              onClick={() => navigate('/login')} 
              style={{ position: 'absolute', top: '1rem', left: '1rem', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255, 255, 255, 0.15)', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', fontWeight: 600, padding: '0.4rem 0.85rem', borderRadius: '999px', backdropFilter: 'blur(12px)' }} 
              className="hover-lift"
            >
              &larr; Switch Department
            </button>
          </div>

          <div style={{ padding: '1.2rem 2.2rem 2.4rem 2.2rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '1.8rem' }}>
              <div style={{ width: '62px', height: '62px', borderRadius: '16px', background: currentRole.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', marginTop: '-32px', boxShadow: `0 8px 26px ${currentRole.color}50`, border: '2px solid rgba(255, 255, 255, 0.3)', position: 'relative', zIndex: 2 }}>
                <Icon size={32} color="#fff" />
              </div>
              <h1 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '0.35rem', textAlign: 'center', color: '#fff', letterSpacing: '-0.3px' }}>{currentRole.label}</h1>
              <p style={{ color: '#94a3b8', textAlign: 'center', fontSize: '0.88rem' }}>Authenticate to launch your specialized autonomous workspace</p>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.86rem', marginBottom: '0.45rem', fontWeight: '600', color: '#e2e8f0' }}>Enterprise Email</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={17} color="#64748b" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    placeholder={currentRole.email}
                    style={{ width: '100%', background: 'rgba(8, 13, 26, 0.85)', border: '1px solid rgba(255, 255, 255, 0.12)', color: '#f8fafc', padding: '0.85rem 1rem 0.85rem 2.65rem', borderRadius: '12px', outline: 'none', fontSize: '0.94rem' }}
                  />
                </div>
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.45rem' }}>
                  <label style={{ fontSize: '0.86rem', fontWeight: '600', color: '#e2e8f0' }}>Password</label>
                  <span style={{ fontSize: '0.78rem', color: currentRole.color, fontWeight: 600 }}>Default: password123</span>
                </div>
                <div style={{ position: 'relative' }}>
                  <Lock size={17} color="#64748b" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    style={{ width: '100%', background: 'rgba(8, 13, 26, 0.85)', border: '1px solid rgba(255, 255, 255, 0.12)', color: '#f8fafc', padding: '0.85rem 1rem 0.85rem 2.65rem', borderRadius: '12px', outline: 'none', fontSize: '0.94rem' }}
                  />
                </div>
              </div>

              {/* Quick Demo Fill Helper */}
              <div style={{ padding: '0.8rem 1rem', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '12px', border: '1px dashed rgba(255, 255, 255, 0.12)', fontSize: '0.82rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <KeyRound size={15} color={currentRole.color} /> Demo: <strong style={{ color: '#fff' }}>{currentRole.email}</strong>
                </span>
                <button
                  type="button"
                  onClick={() => { setEmail(currentRole.email); setPassword('password123'); }}
                  style={{ background: currentRole.accentBg, border: `1px solid ${currentRole.color}60`, color: currentRole.color, borderRadius: '6px', padding: '0.25rem 0.65rem', fontSize: '0.78rem', cursor: 'pointer', fontWeight: 700 }}
                >
                  Auto-fill
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                style={{ 
                  marginTop: '0.3rem', 
                  background: currentRole.gradient, 
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
                  boxShadow: `0 8px 26px ${currentRole.color}45`, 
                  opacity: isLoading ? 0.7 : 1,
                  transition: 'all 0.2s ease'
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
      </div>
    );
  }

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
          duration: 0.75,
          ease: [0.16, 1, 0.3, 1], // Fluid cubic-bezier interpolation
        }}
        style={{
          position: 'absolute',
          width: '320px',
          height: '460px',
          borderRadius: '24px',
          background: isCenter ? 'rgba(14, 22, 42, 0.94)' : 'rgba(11, 18, 36, 0.88)',
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
            // Clicking any side card immediately rotates it to the center!
            setActiveIndex(index);
          }
        }}
      >
        {/* Top Photographic Header matching reference image with inner padding */}
        <div style={{ padding: '12px 12px 0 12px', width: '100%' }}>
          <div style={{ position: 'relative', width: '100%', height: '185px', borderRadius: '18px', overflow: 'hidden' }}>
            <img 
              src={role.image} 
              alt={role.label} 
              style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.85) contrast(1.1)' }} 
            />
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(to bottom, rgba(14, 22, 42, 0.05) 0%, rgba(14, 22, 42, 0.4) 70%, rgba(14, 22, 42, 0.85) 100%)' }} />

            {/* Over-image Pill Badge */}
            <div style={{ position: 'absolute', top: '0.8rem', right: '0.8rem' }}>
              <span style={{ 
                fontSize: '0.7rem', 
                color: '#ffffff', 
                background: isCenter ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.95), rgba(99, 102, 241, 0.95))' : 'rgba(15, 23, 42, 0.85)', 
                border: `1px solid ${role.color}75`, 
                padding: '0.2rem 0.6rem', 
                borderRadius: '999px', 
                fontWeight: 700, 
                textTransform: 'uppercase', 
                letterSpacing: '0.5px',
                backdropFilter: 'blur(10px)'
              }}>
                {role.badge}
              </span>
            </div>
          </div>
        </div>

        {/* Card Content (Matching reference screenshot centered layout) */}
        <div style={{ padding: '1.2rem 1.4rem 1.6rem 1.4rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', flex: 1 }}>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.35rem', letterSpacing: '-0.3px' }}>
            {role.label}
          </h3>
          <p style={{ fontSize: '0.84rem', color: '#94a3b8', lineHeight: 1.45, marginBottom: '1.2rem', maxWidth: '260px' }}>
            {role.sub}
          </p>

          {/* Rounded Pill Button matching the reference screenshot "Explore" */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.6rem', width: '100%', marginTop: 'auto' }}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleQuickLogin(role);
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                padding: '0.65rem 2.2rem',
                borderRadius: '999px', // Pill button exactly like reference screenshot
                border: isCenter 
                  ? '1.5px solid rgba(59, 130, 246, 0.8)' 
                  : '1px solid rgba(255, 255, 255, 0.2)',
                background: isCenter 
                  ? 'rgba(59, 130, 246, 0.2)' 
                  : 'rgba(255, 255, 255, 0.05)',
                color: '#ffffff',
                fontSize: '0.9rem',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: isCenter ? '0 0 25px rgba(59, 130, 246, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)' : 'none',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.2s ease',
              }}
              className="hover-lift"
              title="Launch Workspace"
            >
              <Sparkles size={14} color={isCenter ? '#60a5fa' : role.color} />
              Explore
            </button>

            {/* Subtle Custom Auth link */}
            <span 
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/login/${role.id}`);
              }}
              style={{ fontSize: '0.74rem', color: '#64748b', cursor: 'pointer', textDecoration: 'underline', transition: 'color 0.2s ease' }}
              onMouseEnter={(e) => e.target.style.color = '#94a3b8'}
              onMouseLeave={(e) => e.target.style.color = '#64748b'}
            >
              Custom Auth Login
            </span>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1.5rem 1rem', position: 'relative', zIndex: 1, overflow: 'hidden' }}>
      
      {/* Top Header Section */}
      <div style={{ textAlign: 'center', marginBottom: '1.2rem', maxWidth: '820px' }}>
        {/* Subtle Enterprise Badge */}
        <div style={{ 
          display: 'inline-flex', 
          alignItems: 'center', 
          gap: '0.5rem', 
          padding: '0.35rem 1.1rem', 
          borderRadius: '999px', 
          background: 'rgba(15, 23, 42, 0.8)', 
          border: '1px solid rgba(59, 130, 246, 0.35)', 
          color: '#e2e8f0', 
          fontSize: '0.8rem', 
          fontWeight: 600, 
          letterSpacing: '0.3px', 
          marginBottom: '0.8rem', 
          boxShadow: '0 6px 20px rgba(59, 130, 246, 0.2)',
          backdropFilter: 'blur(16px)'
        }}>
          <Cpu size={14} color="#60a5fa" />
          3D Coverflow Multi-Agent Architecture
          <span style={{ opacity: 0.35, margin: '0 2px' }}>•</span>
          <span style={{ color: '#93c5fd', fontWeight: 700 }}>Auto-Rotating 3D Carousel</span>
        </div>

        <h1 style={{ 
          fontSize: '2.7rem', 
          fontWeight: '800', 
          marginBottom: '0.35rem', 
          letterSpacing: '-0.7px', 
          background: 'linear-gradient(135deg, #ffffff 40%, #e2e8f0 75%, #94a3b8 100%)', 
          WebkitBackgroundClip: 'text', 
          WebkitTextFillColor: 'transparent',
          textShadow: '0 4px 24px rgba(0, 0, 0, 0.4)'
        }}>
          ResolveX Enterprise
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '1rem', margin: '0 auto', lineHeight: 1.4, maxWidth: '600px' }}>
          Select your department portal below to access your specialized autonomous AI agents
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
            border: '1px solid rgba(255, 255, 255, 0.2)',
            background: 'rgba(15, 23, 42, 0.75)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            backdropFilter: 'blur(16px)',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5)',
            transition: 'all 0.2s ease',
          }}
          className="hover-lift"
          title="Previous (Left Arrow)"
        >
          <ChevronLeft size={22} />
        </button>

        {/* 3D Cards Container (Preserving 3D space: ALL cards round in 3D) */}
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
            border: '1px solid rgba(255, 255, 255, 0.2)',
            background: 'rgba(15, 23, 42, 0.75)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            backdropFilter: 'blur(16px)',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5)',
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
                  ? '#38bdf8' 
                  : 'rgba(255, 255, 255, 0.22)',
                boxShadow: isActive 
                  ? '0 0 14px #38bdf8, 0 0 4px #38bdf8' 
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

      {/* Auto-Slide Status Indicator */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.3rem' }}>
        <button
          onClick={() => setIsPaused(!isPaused)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            padding: '0.2rem 0.65rem',
            borderRadius: '999px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            background: 'rgba(15, 23, 42, 0.65)',
            color: isPaused ? '#f59e0b' : '#34d399',
            fontSize: '0.72rem',
            fontWeight: 600,
            cursor: 'pointer',
            backdropFilter: 'blur(12px)',
          }}
        >
          {isPaused ? <Play size={10} color="#f59e0b" /> : <Pause size={10} color="#34d399" />}
          {isPaused ? 'Auto-Slide Paused' : 'Auto-Rotating (3s)'}
        </button>
      </div>

    </div>
  );
}
