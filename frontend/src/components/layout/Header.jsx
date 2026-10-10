import { Bell, Search, User, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="glass-header" style={{ height: '76px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'var(--bg-dark)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-full)', padding: '0.6rem 1.2rem', maxWidth: '350px', flex: 1, minWidth: '150px', transition: 'all var(--transition-normal)' }}>
        <Search size={18} color="var(--text-muted)" />
        <input
          type="text"
          placeholder="Search entire workspace..."
          style={{ background: 'transparent', border: 'none', color: 'var(--text-main)', width: '100%', outline: 'none', fontSize: '0.9rem' }}
        />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <button style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-main)', cursor: 'pointer', position: 'relative', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }} className="hover-lift">
          <Bell size={18} />
          <span style={{ position: 'absolute', top: '0', right: '0', width: '10px', height: '10px', background: '#ef4444', borderRadius: '50%', border: '2px solid var(--bg-dark)' }}></span>
        </button>

        <div style={{ height: '36px', width: '1px', background: 'var(--border-color)' }}></div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--secondary-color), var(--primary-color))', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 10px rgba(139, 92, 246, 0.3)' }}>
            <User size={20} color="white" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>{user?.name || 'Admin User'}</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user?.email || 'admin@resolvex.ai'}</span>
          </div>
        </div>

        <button onClick={logout} title="Log Out" style={{ marginLeft: '0.5rem', background: 'transparent', border: '1px solid rgba(239, 68, 68, 0.4)', color: '#ef4444', cursor: 'pointer', width: '38px', height: '38px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s ease' }} className="hover-lift" onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'; e.currentTarget.style.borderColor = '#ef4444' }} onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.4)' }}>
          <LogOut size={16} />
        </button>
      </div>
    </header>
  );
}
