import { Bell, Search, User, LogOut, Cpu, Activity, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Header() {
  const { user, logout } = useAuth();
  const role = (user?.role || 'admin').toLowerCase();

  const getRoleBadgeStyle = () => {
    switch (role) {
      case 'admin':
        return { bg: 'rgba(99, 102, 241, 0.15)', text: '#818cf8', border: 'rgba(99, 102, 241, 0.35)', label: 'Admin' };
      case 'hr':
        return { bg: 'rgba(168, 85, 247, 0.15)', text: '#c084fc', border: 'rgba(168, 85, 247, 0.35)', label: 'HR' };
      case 'sales':
        return { bg: 'rgba(16, 185, 129, 0.15)', text: '#34d399', border: 'rgba(16, 185, 129, 0.35)', label: 'Sales' };
      case 'support':
      case 'staff':
        return { bg: 'rgba(14, 165, 233, 0.15)', text: '#38bdf8', border: 'rgba(14, 165, 233, 0.35)', label: 'Support' };
      default:
        return { bg: 'rgba(59, 130, 246, 0.15)', text: '#60a5fa', border: 'rgba(59, 130, 246, 0.35)', label: 'Employee' };
    }
  };

  const badge = getRoleBadgeStyle();

  return (
    <header className="glass-header" style={{ height: '74px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 2rem', background: 'rgba(19, 29, 53, 0.75)', borderBottom: '1px solid var(--border-color)', backdropFilter: 'blur(20px)' }}>
      {/* Search Bar with Quick Key Chip */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', background: 'rgba(12, 18, 34, 0.75)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-full)', padding: '0.55rem 1.1rem', maxWidth: '360px', flex: 1, minWidth: '180px', transition: 'all var(--transition-normal)' }}>
        <Search size={16} color="var(--text-muted)" />
        <input
          type="text"
          placeholder="Search workspace, documents, agents..."
          style={{ background: 'transparent', border: 'none', color: 'var(--text-main)', width: '100%', outline: 'none', fontSize: '0.88rem' }}
        />
        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', background: 'rgba(255, 255, 255, 0.08)', padding: '0.15rem 0.45rem', borderRadius: '4px', border: '1px solid rgba(255, 255, 255, 0.1)', fontFamily: 'monospace' }}>
          ⌘K
        </span>
      </div>

      {/* Central Enterprise Multi-Agent System Fabric Status */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.4rem 1rem', background: 'linear-gradient(90deg, rgba(16, 185, 129, 0.1) 0%, rgba(14, 165, 233, 0.1) 100%)', border: '1px solid rgba(16, 185, 129, 0.25)', borderRadius: 'var(--radius-full)', boxShadow: '0 2px 14px rgba(16, 185, 129, 0.12)' }}>
        <span className="status-beacon" style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981' }}></span>
        <span style={{ fontSize: '0.78rem', color: '#34d399', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <Cpu size={13} color="#10b981" /> Fabric: Online
        </span>
        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>|</span>
        <span style={{ fontSize: '0.72rem', color: 'var(--text-sub)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          <Activity size={12} color="#38bdf8" /> 4 Agents Synced
        </span>
      </div>

      {/* User Controls & Profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        <button style={{ background: 'rgba(255, 255, 255, 0.04)', border: '1px solid var(--border-color)', color: 'var(--text-main)', cursor: 'pointer', position: 'relative', width: '38px', height: '38px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }} className="hover-lift" title="Notifications">
          <Bell size={17} />
          <span style={{ position: 'absolute', top: '1px', right: '1px', width: '9px', height: '9px', background: '#f43f5e', borderRadius: '50%', border: '2px solid #0c1222' }}></span>
        </button>

        <div style={{ height: '32px', width: '1px', background: 'var(--border-color)' }}></div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 15px rgba(99, 102, 241, 0.35)', border: '1.5px solid rgba(255, 255, 255, 0.25)' }}>
            <User size={19} color="#fff" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <span style={{ fontSize: '0.88rem', fontWeight: '700', color: '#fff' }}>{user?.name || 'Enterprise User'}</span>
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
            <span style={{ fontSize: '0.73rem', color: 'var(--text-muted)' }}>{user?.email || ''}</span>
          </div>
        </div>

        <button onClick={logout} title="Sign Out" style={{ background: 'transparent', border: '1px solid rgba(244, 63, 94, 0.35)', color: '#f43f5e', cursor: 'pointer', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s ease' }} className="hover-lift" onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(244, 63, 94, 0.12)'; e.currentTarget.style.borderColor = '#f43f5e' }} onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(244, 63, 94, 0.35)' }}>
          <LogOut size={15} />
        </button>
      </div>
    </header>
  );
}
