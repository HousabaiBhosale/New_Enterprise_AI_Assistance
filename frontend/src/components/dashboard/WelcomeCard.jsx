import { ArrowUpRight, Sparkles, ShieldCheck, Zap } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export default function WelcomeCard() {
  const { user } = useAuth();
  const { isLight } = useTheme();
  const userName = user?.name ? user.name.split(' ')[0] : 'Administrator';

  return (
    <div 
      style={{ 
        background: isLight 
          ? 'linear-gradient(135deg, rgba(238, 242, 255, 0.95) 0%, rgba(245, 243, 255, 0.95) 50%, rgba(240, 249, 255, 0.95) 100%)' 
          : 'linear-gradient(135deg, rgba(99, 102, 241, 0.18) 0%, rgba(168, 85, 247, 0.14) 40%, rgba(14, 165, 233, 0.12) 80%, rgba(244, 63, 94, 0.08) 100%)', 
        border: isLight ? '1px solid rgba(226, 232, 240, 0.95)' : '1px solid rgba(168, 85, 247, 0.35)', 
        borderRadius: 'var(--radius-lg)', 
        padding: '2.2rem 2.6rem', 
        display: 'flex', 
        flexWrap: 'wrap', 
        gap: '2rem', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        boxShadow: isLight ? '0 16px 40px -10px rgba(15, 23, 42, 0.08)' : '0 16px 40px -10px rgba(99, 102, 241, 0.25), 0 0 1px 1px rgba(255, 255, 255, 0.1)', 
        position: 'relative', 
        overflow: 'hidden',
        transition: 'all 0.3s ease'
      }}
    >
      {/* Decorative ambient color glow */}
      <div style={{ position: 'absolute', top: '-30px', right: '-20px', width: '220px', height: '220px', background: isLight ? 'radial-gradient(circle, rgba(168, 85, 247, 0.12) 0%, rgba(14, 165, 233, 0.08) 50%, transparent 75%)' : 'radial-gradient(circle, rgba(168, 85, 247, 0.3) 0%, rgba(14, 165, 233, 0.15) 50%, transparent 75%)', filter: 'blur(30px)', pointerEvents: 'none' }} />

      <div style={{ flex: '1 1 450px', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-full)', background: isLight ? 'rgba(99, 102, 241, 0.1)' : 'linear-gradient(90deg, rgba(99, 102, 241, 0.25) 0%, rgba(168, 85, 247, 0.25) 100%)', border: isLight ? '1px solid rgba(99, 102, 241, 0.3)' : '1px solid rgba(168, 85, 247, 0.45)', color: isLight ? '#4f46e5' : '#c084fc', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.85rem' }}>
          <Sparkles size={13} color={isLight ? '#4f46e5' : '#c084fc'} /> Real-time Autonomous Multi-Agent Fabric
        </div>
        <h2 style={{ fontSize: '2.1rem', fontWeight: '800', marginBottom: '0.5rem', color: isLight ? '#0f172a' : '#fff', letterSpacing: '-0.3px' }}>
          Welcome back, {userName}! 👋
        </h2>
        <p style={{ color: isLight ? '#475569' : 'var(--text-sub)', lineHeight: '1.65', fontSize: '0.98rem' }}>
          Your enterprise agents are actively synchronized across <strong style={{ color: isLight ? '#7c3aed' : '#c084fc' }}>HR Sentinel</strong>, <strong style={{ color: isLight ? '#059669' : '#34d399' }}>Sales Copilot</strong>, and <strong style={{ color: isLight ? '#0284c7' : '#38bdf8' }}>Support Triage</strong>. 
          Real-time LangGraph routing, autonomous tool execution, and Qdrant semantic indexes are performing at peak efficiency.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', position: 'relative', zIndex: 1 }}>
        <div style={{ padding: '1.1rem 1.5rem', background: isLight ? '#ffffff' : 'rgba(19, 29, 53, 0.8)', border: isLight ? '1px solid rgba(16, 185, 129, 0.35)' : '1px solid rgba(16, 185, 129, 0.3)', borderRadius: 'var(--radius-md)', backdropFilter: 'blur(16px)', minWidth: '140px', textAlign: 'center', boxShadow: isLight ? '0 4px 16px rgba(16, 185, 129, 0.12)' : '0 8px 25px rgba(16, 185, 129, 0.15)' }} className="hover-lift">
          <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem', fontSize: '2rem', fontWeight: '800', color: isLight ? '#059669' : '#10b981' }}>
            +28% <ArrowUpRight size={22} color={isLight ? '#059669' : '#10b981'} />
          </span>
          <span style={{ fontSize: '0.8rem', color: isLight ? '#475569' : 'var(--text-sub)', fontWeight: 600 }}>Productivity Gain</span>
        </div>

        <div style={{ padding: '1.1rem 1.5rem', background: isLight ? '#ffffff' : 'rgba(19, 29, 53, 0.8)', border: isLight ? '1px solid rgba(99, 102, 241, 0.35)' : '1px solid rgba(99, 102, 241, 0.3)', borderRadius: 'var(--radius-md)', backdropFilter: 'blur(16px)', minWidth: '140px', textAlign: 'center', boxShadow: isLight ? '0 4px 16px rgba(99, 102, 241, 0.12)' : '0 8px 25px rgba(99, 102, 241, 0.15)' }} className="hover-lift">
          <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', fontSize: '2rem', fontWeight: '800', color: isLight ? '#4f46e5' : '#818cf8' }}>
            <Zap size={22} color={isLight ? '#4f46e5' : '#818cf8'} /> 100%
          </span>
          <span style={{ fontSize: '0.8rem', color: isLight ? '#475569' : 'var(--text-sub)', fontWeight: 600 }}>Active SLA Uptime</span>
        </div>
      </div>
    </div>
  );
}
