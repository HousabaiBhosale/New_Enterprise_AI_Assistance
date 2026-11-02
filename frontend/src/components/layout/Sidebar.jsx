import { Link, useLocation } from 'react-router-dom';
import {
  Home, MessageSquare, Users, TrendingUp, HelpCircle,
  CheckSquare, BarChart2, FileText, Settings, Shield, Inbox,
  Zap, Lock, Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Sidebar() {
  const location = useLocation();
  const { user } = useAuth();
  const role = (user?.role || 'admin').toLowerCase();

  const getMenuItems = () => {
    if (role === 'admin') {
      return [
        { path: '/', label: 'Overview', icon: Home, color: '#6366f1' },
        { path: '/chat', label: 'AI Agents', icon: MessageSquare, color: '#a855f7' },
        { path: '/coordination', label: 'Coordination', icon: Inbox, color: '#8b5cf6' },
        { path: '/hr', label: 'HR & People', icon: Users, color: '#c084fc' },
        { path: '/sales', label: 'Sales & Revenue', icon: TrendingUp, color: '#10b981' },
        { path: '/support', label: 'Helpdesk & Support', icon: HelpCircle, color: '#0ea5e9' },
        { path: '/approvals', label: 'Approvals', icon: CheckSquare, color: '#f59e0b' },
        { path: '/reports', label: 'Reports', icon: BarChart2, color: '#f43f5e' },
        { path: '/documents', label: 'Documents (RAG)', icon: FileText, color: '#14b8a6' },
        { path: '/admin', label: 'System Admin', icon: Shield, color: '#ef4444' },
        { path: '/settings', label: 'Settings', icon: Settings, color: '#94a3b8' },
      ];
    }
    if (role === 'hr') {
      return [
        { path: '/hr', label: 'HR Dashboard', icon: Users, color: '#a855f7' },
        { path: '/chat', label: 'HR AI Agent', icon: MessageSquare, color: '#c084fc' },
        { path: '/approvals', label: 'Leave Approvals', icon: CheckSquare, color: '#f59e0b' },
        { path: '/reports', label: 'Workforce Reports', icon: BarChart2, color: '#f43f5e' },
        { path: '/documents', label: 'Policy Documents', icon: FileText, color: '#14b8a6' },
        { path: '/settings', label: 'Settings', icon: Settings, color: '#94a3b8' },
      ];
    }
    if (role === 'sales') {
      return [
        { path: '/sales', label: 'Sales Dashboard', icon: TrendingUp, color: '#10b981' },
        { path: '/chat', label: 'Sales AI Agent', icon: MessageSquare, color: '#34d399' },
        { path: '/approvals', label: 'Deal Approvals', icon: CheckSquare, color: '#f59e0b' },
        { path: '/reports', label: 'Revenue Reports', icon: BarChart2, color: '#f43f5e' },
        { path: '/documents', label: 'Sales Playbooks', icon: FileText, color: '#14b8a6' },
        { path: '/settings', label: 'Settings', icon: Settings, color: '#94a3b8' },
      ];
    }
    if (role === 'support' || role === 'staff') {
      return [
        { path: '/support', label: 'Helpdesk Dashboard', icon: HelpCircle, color: '#0ea5e9' },
        { path: '/chat', label: 'Helpdesk AI Agent', icon: MessageSquare, color: '#38bdf8' },
        { path: '/approvals', label: 'Escalations', icon: CheckSquare, color: '#f59e0b' },
        { path: '/documents', label: 'Helpdesk SOPs', icon: FileText, color: '#14b8a6' },
        { path: '/settings', label: 'Settings', icon: Settings, color: '#94a3b8' },
      ];
    }
    // Default employee view
    return [
      { path: '/chat', label: 'My AI Assistant', icon: MessageSquare, color: '#3b82f6' },
      { path: '/documents', label: 'Company Policies', icon: FileText, color: '#14b8a6' },
      { path: '/settings', label: 'My Settings', icon: Settings, color: '#94a3b8' },
    ];
  };

  const menuItems = getMenuItems();

  const getRoleTheme = () => {
    switch (role) {
      case 'admin': return { color: '#6366f1', label: 'System Admin', bg: 'rgba(99, 102, 241, 0.15)' };
      case 'hr': return { color: '#a855f7', label: 'HR Sentinel', bg: 'rgba(168, 85, 247, 0.15)' };
      case 'sales': return { color: '#10b981', label: 'Sales Copilot', bg: 'rgba(16, 185, 129, 0.15)' };
      case 'support': return { color: '#0ea5e9', label: 'Support Sentinel', bg: 'rgba(14, 165, 233, 0.15)' };
      default: return { color: '#3b82f6', label: 'Self-Service', bg: 'rgba(59, 130, 246, 0.15)' };
    }
  };

  const roleTheme = getRoleTheme();

  return (
    <aside 
      className="glass-panel" 
      style={{ 
        width: '280px', 
        margin: '1rem 0 1rem 1rem', 
        display: 'flex', 
        flexDirection: 'column', 
        background: 'rgba(19, 29, 53, 0.75)',
        border: '1px solid var(--border-color)', 
        boxShadow: '0 20px 45px -10px rgba(0, 0, 0, 0.4)', 
        zIndex: 10 
      }}
    >
      {/* Brand Header */}
      <div style={{ padding: '1.75rem 1.4rem', display: 'flex', alignItems: 'center', gap: '0.9rem', borderBottom: '1px solid var(--border-color)' }}>
        <div style={{ position: 'relative' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '13px', background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #06b6d4 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 20px rgba(99, 102, 241, 0.45)', border: '1.5px solid rgba(255, 255, 255, 0.25)' }}>
            <Zap size={23} color="#fff" />
          </div>
          <span className="status-beacon" style={{ position: 'absolute', bottom: '-2px', right: '-2px', width: '9px', height: '9px', borderRadius: '50%', background: '#10b981', border: '2px solid #0f172a' }}></span>
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <h1 style={{ fontSize: '1.3rem', fontWeight: '800', letterSpacing: '0.4px', color: '#fff', margin: 0 }}>ResolveX</h1>
            <span style={{ fontSize: '0.65rem', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.3) 0%, rgba(168, 85, 247, 0.3) 100%)', color: '#c084fc', padding: '0.12rem 0.45rem', borderRadius: '4px', fontWeight: 800, border: '1px solid rgba(168, 85, 247, 0.4)' }}>
              v2.5
            </span>
          </div>
          <span style={{ fontSize: '0.74rem', color: 'var(--text-sub)', textTransform: 'capitalize', display: 'block', marginTop: '0.15rem' }}>
            {role === 'admin' ? 'Enterprise Multi-Agent' : `${role} Workspace`}
          </span>
        </div>
      </div>

      {/* Navigation Menu with Colorful Icons */}
      <nav style={{ flex: 1, padding: '1.2rem 0.9rem', overflowY: 'auto' }}>
        <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
            const Icon = item.icon;
            const itemColor = item.color || '#6366f1';

            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  style={{
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.85rem', 
                    padding: '0.75rem 0.95rem',
                    borderRadius: 'var(--radius-md)',
                    color: isActive ? '#fff' : 'var(--text-sub)',
                    background: isActive ? `linear-gradient(90deg, ${itemColor}25 0%, ${itemColor}10 100%)` : 'transparent',
                    border: isActive ? `1px solid ${itemColor}50` : '1px solid transparent',
                    boxShadow: isActive ? `0 4px 15px ${itemColor}20` : 'none',
                    transition: 'all 0.2s cubic-bezier(0.2, 0.8, 0.2, 1)',
                    position: 'relative'
                  }}
                  className="hover-lift"
                >
                  {isActive && (
                    <span style={{ position: 'absolute', left: 0, top: '20%', bottom: '20%', width: '3.5px', background: itemColor, borderRadius: '0 4px 4px 0', boxShadow: `0 0 10px ${itemColor}` }}></span>
                  )}
                  <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: isActive ? `${itemColor}30` : `${itemColor}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${isActive ? itemColor : itemColor + '30'}` }}>
                    <Icon size={16} style={{ color: isActive ? '#fff' : itemColor }} />
                  </div>
                  <span style={{ fontWeight: isActive ? '700' : '500', fontSize: '0.9rem' }}>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Realistic Security & Role Footer */}
      <div style={{ padding: '1.25rem 1.2rem', borderTop: '1px solid var(--border-color)' }}>
        <div style={{ padding: '0.85rem 1rem', background: 'rgba(12, 18, 34, 0.7)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Lock size={12} color="#10b981" /> RBAC Verified
            </span>
            <span style={{ fontSize: '0.7rem', color: '#10b981', fontWeight: 700 }}>ONLINE</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: roleTheme.color, fontSize: '0.84rem', fontWeight: '800' }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: roleTheme.color, boxShadow: `0 0 8px ${roleTheme.color}` }}></span>
            {roleTheme.label.toUpperCase()}
          </div>
        </div>
      </div>
    </aside>
  );
}
