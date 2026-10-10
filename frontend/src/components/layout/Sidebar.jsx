import { Link, useLocation } from 'react-router-dom';
import {
  Home, MessageSquare, Users, TrendingUp, HelpCircle,
  CheckSquare, BarChart2, FileText, Settings, Shield, Inbox
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const MENU_ITEMS = [
  { path: '/', label: 'Dashboard', icon: Home },
  { path: '/chat', label: 'AI Agents', icon: MessageSquare },
  { path: '/coordination', label: 'Coordination', icon: Inbox },
  { path: '/hr', label: 'HR', icon: Users },
  { path: '/sales', label: 'Sales', icon: TrendingUp },
  { path: '/support', label: 'Support', icon: HelpCircle },
  { path: '/approvals', label: 'Approvals', icon: CheckSquare },
  { path: '/reports', label: 'Reports', icon: BarChart2 },
  { path: '/documents', label: 'Documents', icon: FileText },
  { path: '/admin', label: 'Admin', icon: Shield },
  { path: '/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar() {
  const location = useLocation();
  const { user } = useAuth();
  const role = user?.role || 'admin';

  const visibleMenuItems = MENU_ITEMS.filter(item => {
    if (role === 'admin') return true;
    if (role === 'employee') return ['/', '/chat', '/coordination', '/documents', '/settings'].includes(item.path);
    if (role === 'hr') return ['/', '/chat', '/coordination', '/hr', '/documents', '/approvals', '/reports', '/settings'].includes(item.path);
    if (role === 'sales') return ['/', '/chat', '/coordination', '/sales', '/documents', '/approvals', '/reports', '/settings'].includes(item.path);
    if (role === 'staff') return ['/', '/chat', '/coordination', '/support', '/documents', '/approvals', '/settings'].includes(item.path);
    return true;
  });

  return (
    <aside className="glass-panel" style={{ width: '280px', margin: '1rem', display: 'flex', flexDirection: 'column', border: '1px solid var(--glass-border)', boxShadow: 'var(--panel-shadow)' }}>
      <div style={{ padding: '2rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--accent-glow)' }}>
          <div style={{ color: 'white', fontWeight: 'bold', fontSize: '1.4rem' }}>E</div>
        </div>
        <h1 style={{ fontSize: '1.4rem', fontWeight: '700', letterSpacing: '0.5px' }}>ResolveX</h1>
      </div>

      <nav style={{ flex: 1, padding: '0 1.2rem', overflowY: 'auto' }}>
        <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {visibleMenuItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
            const Icon = item.icon;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.85rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    color: isActive ? 'var(--text-main)' : 'var(--text-muted)',
                    background: isActive ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                    border: isActive ? '1px solid rgba(99, 102, 241, 0.3)' : '1px solid transparent',
                    transition: 'all var(--transition-fast)'
                  }}
                  className="hover-lift"
                >
                  <Icon size={20} style={{ color: isActive ? 'var(--primary-color)' : 'inherit' }} />
                  <span style={{ fontWeight: isActive ? '600' : '500' }}>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div style={{ padding: '1.5rem 1.2rem' }}>
        <div style={{ padding: '1rem', background: 'rgba(0,0,0,0.3)', borderRadius: 'var(--radius-md)', textAlign: 'center', border: '1px solid var(--border-color)' }}>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>System Status</p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: '#10b981', fontSize: '0.875rem', fontWeight: '600' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 10px #10b981' }}></span>
            All Systems Online
          </div>
        </div>
      </div>
    </aside>
  );
}
