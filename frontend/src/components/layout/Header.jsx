import { Bell, Search, User, LogOut, Cpu, Activity, Sparkles, Sun, Moon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export default function Header() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme, isLight } = useTheme();
  const role = (user?.role || 'admin').toLowerCase();

  const getRoleBadgeStyle = () => {
    switch (role) {
      case 'admin':
        return { 
          bg: isLight ? 'rgba(99, 102, 241, 0.12)' : 'rgba(99, 102, 241, 0.15)', 
          text: isLight ? '#4f46e5' : '#818cf8', 
          border: isLight ? 'rgba(99, 102, 241, 0.35)' : 'rgba(99, 102, 241, 0.35)', 
          label: 'Admin' 
        };
      case 'hr':
        return { 
          bg: isLight ? 'rgba(168, 85, 247, 0.12)' : 'rgba(168, 85, 247, 0.15)', 
          text: isLight ? '#9333ea' : '#c084fc', 
          border: isLight ? 'rgba(168, 85, 247, 0.35)' : 'rgba(168, 85, 247, 0.35)', 
          label: 'HR' 
        };
      case 'sales':
        return { 
          bg: isLight ? 'rgba(16, 185, 129, 0.12)' : 'rgba(16, 185, 129, 0.15)', 
          text: isLight ? '#059669' : '#34d399', 
          border: isLight ? 'rgba(16, 185, 129, 0.35)' : 'rgba(16, 185, 129, 0.35)', 
          label: 'Sales' 
        };
      case 'support':
      case 'staff':
        return { 
          bg: isLight ? 'rgba(14, 165, 233, 0.12)' : 'rgba(14, 165, 233, 0.15)', 
          text: isLight ? '#0284c7' : '#38bdf8', 
          border: isLight ? 'rgba(14, 165, 233, 0.35)' : 'rgba(14, 165, 233, 0.35)', 
          label: 'Support' 
        };
      default:
        return { 
          bg: isLight ? 'rgba(37, 99, 235, 0.12)' : 'rgba(59, 130, 246, 0.15)', 
          text: isLight ? '#1d4ed8' : '#60a5fa', 
          border: isLight ? 'rgba(37, 99, 235, 0.35)' : 'rgba(59, 130, 246, 0.35)', 
          label: 'Employee' 
        };
    }
  };

  const badge = getRoleBadgeStyle();

  return (
    <header 
      className="glass-header" 
      style={{ 
        height: '74px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        padding: '0 2rem', 
        background: isLight ? 'rgba(255, 255, 255, 0.92)' : 'rgba(19, 29, 53, 0.75)', 
        borderBottom: isLight ? '1px solid rgba(226, 232, 240, 0.9)' : '1px solid var(--border-color)', 
        backdropFilter: 'blur(20px)',
        boxShadow: isLight ? '0 4px 20px rgba(15, 23, 42, 0.05)' : 'none',
        transition: 'all 0.3s ease'
      }}
    >
      {/* Search Bar with Quick Key Chip */}
      <div 
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.85rem', 
          background: isLight ? '#f1f5f9' : 'rgba(12, 18, 34, 0.75)', 
          border: isLight ? '1px solid rgba(203, 213, 225, 0.9)' : '1px solid var(--border-color)', 
          borderRadius: 'var(--radius-full)', 
          padding: '0.55rem 1.1rem', 
          maxWidth: '360px', 
          flex: 1, 
          minWidth: '180px', 
          transition: 'all var(--transition-normal)' 
        }}
      >
        <Search size={16} color={isLight ? '#64748b' : 'var(--text-muted)'} />
        <input
          type="text"
          placeholder="Search workspace, documents, agents..."
          style={{ 
            background: 'transparent', 
            border: 'none', 
            color: isLight ? '#0f172a' : 'var(--text-main)', 
            width: '100%', 
            outline: 'none', 
            fontSize: '0.88rem' 
          }}
        />
        <span style={{ 
          fontSize: '0.7rem', 
          color: isLight ? '#475569' : 'var(--text-muted)', 
          background: isLight ? '#e2e8f0' : 'rgba(255, 255, 255, 0.08)', 
          padding: '0.15rem 0.45rem', 
          borderRadius: '4px', 
          border: isLight ? '1px solid rgba(203, 213, 225, 0.8)' : '1px solid rgba(255, 255, 255, 0.1)', 
          fontFamily: 'monospace' 
        }}>
          ⌘K
        </span>
      </div>

      {/* Central Enterprise Multi-Agent System Fabric Status */}
      <div 
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.65rem', 
          padding: '0.4rem 1rem', 
          background: isLight ? 'rgba(16, 185, 129, 0.08)' : 'linear-gradient(90deg, rgba(16, 185, 129, 0.1) 0%, rgba(14, 165, 233, 0.1) 100%)', 
          border: isLight ? '1px solid rgba(16, 185, 129, 0.35)' : '1px solid rgba(16, 185, 129, 0.25)', 
          borderRadius: 'var(--radius-full)', 
          boxShadow: isLight ? '0 2px 10px rgba(16, 185, 129, 0.08)' : '0 2px 14px rgba(16, 185, 129, 0.12)' 
        }}
      >
        <span className="status-beacon" style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981' }}></span>
        <span style={{ fontSize: '0.78rem', color: isLight ? '#047857' : '#34d399', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <Cpu size={13} color="#10b981" /> Fabric: Online
        </span>
        <span style={{ fontSize: '0.72rem', color: isLight ? '#cbd5e1' : 'var(--text-muted)' }}>|</span>
        <span style={{ fontSize: '0.72rem', color: isLight ? '#334155' : 'var(--text-sub)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          <Activity size={12} color="#0ea5e9" /> 4 Agents Synced
        </span>
      </div>

      {/* User Controls, Theme Toggle & Profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {/* Interactive Theme Switcher Button */}
        <button
          onClick={toggleTheme}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            padding: '0.4rem 0.85rem',
            borderRadius: '999px',
            border: isLight ? '1px solid rgba(203, 213, 225, 0.95)' : '1px solid rgba(255, 255, 255, 0.15)',
            background: isLight ? '#ffffff' : 'rgba(15, 23, 42, 0.8)',
            color: isLight ? '#0f172a' : '#ffffff',
            fontSize: '0.78rem',
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: isLight ? '0 2px 8px rgba(15, 23, 42, 0.06)' : 'none',
            transition: 'all 0.2s ease',
          }}
          className="hover-lift"
          title={`Switch to ${isLight ? 'Dark' : 'Light'} Mode`}
        >
          {isLight ? <Sun size={14} color="#eab308" /> : <Moon size={14} color="#818cf8" />}
          <span>{isLight ? 'Light' : 'Dark'}</span>
        </button>

        {/* Notifications */}
        <button 
          style={{ 
            background: isLight ? '#ffffff' : 'rgba(255, 255, 255, 0.04)', 
            border: isLight ? '1px solid rgba(203, 213, 225, 0.95)' : '1px solid var(--border-color)', 
            color: isLight ? '#0f172a' : 'var(--text-main)', 
            cursor: 'pointer', 
            position: 'relative', 
            width: '38px', 
            height: '38px', 
            borderRadius: '50%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            boxShadow: isLight ? '0 2px 8px rgba(15, 23, 42, 0.05)' : 'none'
          }} 
          className="hover-lift" 
          title="Notifications"
        >
          <Bell size={17} />
          <span style={{ position: 'absolute', top: '1px', right: '1px', width: '9px', height: '9px', background: '#f43f5e', borderRadius: '50%', border: isLight ? '2px solid #ffffff' : '2px solid #0c1222' }}></span>
        </button>

        <div style={{ height: '32px', width: '1px', background: isLight ? 'rgba(226, 232, 240, 0.9)' : 'var(--border-color)' }}></div>

        {/* User Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 15px rgba(99, 102, 241, 0.35)', border: '1.5px solid rgba(255, 255, 255, 0.25)' }}>
            <User size={19} color="#fff" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <span style={{ fontSize: '0.88rem', fontWeight: '700', color: isLight ? '#0f172a' : '#fff' }}>{user?.name || 'Enterprise User'}</span>
              <span style={{
                fontSize: '0.66rem',
                fontWeight: '800',
                padding: '0.12rem 0.55rem',
                borderRadius: '10px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                background: badge.bg,
                color: badge.text,
                border: `1px solid ${badge.border}`
              }}>
                {badge.label}
              </span>
            </div>
            <span style={{ fontSize: '0.73rem', color: isLight ? '#475569' : 'var(--text-muted)' }}>{user?.email || ''}</span>
          </div>
        </div>

        {/* Sign Out Button */}
        <button 
          onClick={logout} 
          title="Sign Out" 
          style={{ 
            background: isLight ? '#ffffff' : 'transparent', 
            border: '1px solid rgba(244, 63, 94, 0.35)', 
            color: '#f43f5e', 
            cursor: 'pointer', 
            width: '36px', 
            height: '36px', 
            borderRadius: '50%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            transition: 'all 0.2s ease',
            boxShadow: isLight ? '0 2px 6px rgba(244, 63, 94, 0.08)' : 'none'
          }} 
          className="hover-lift" 
          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(244, 63, 94, 0.12)'; e.currentTarget.style.borderColor = '#f43f5e' }} 
          onMouseLeave={(e) => { e.currentTarget.style.background = isLight ? '#ffffff' : 'transparent'; e.currentTarget.style.borderColor = 'rgba(244, 63, 94, 0.35)' }}
        >
          <LogOut size={15} />
        </button>
      </div>
    </header>
  );
}
