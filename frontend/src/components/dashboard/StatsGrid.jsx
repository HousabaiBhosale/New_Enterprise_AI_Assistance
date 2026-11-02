import { Users, CreditCard, MessageSquare, Briefcase, TrendingUp } from 'lucide-react';

export default function StatsGrid() {
  const stats = [
    { 
      label: 'Completed Sales Revenue', 
      value: '$84,235.00', 
      trend: '+14.2%', 
      positive: true, 
      icon: CreditCard, 
      color: '#10b981',
      gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      accentBg: 'rgba(16, 185, 129, 0.12)',
      cardBg: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(19, 29, 53, 0.75) 100%)'
    },
    { 
      label: 'Active Workforce Roster', 
      value: '25 Employees', 
      trend: '100% Synced', 
      positive: true, 
      icon: Users, 
      color: '#a855f7',
      gradient: 'linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)',
      accentBg: 'rgba(168, 85, 247, 0.12)',
      cardBg: 'linear-gradient(135deg, rgba(168, 85, 247, 0.12) 0%, rgba(19, 29, 53, 0.75) 100%)'
    },
    { 
      label: 'Resolved Helpdesk Requests', 
      value: '14 Requests', 
      trend: '98.5% SLA', 
      positive: true, 
      icon: Briefcase, 
      color: '#0ea5e9',
      gradient: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
      accentBg: 'rgba(14, 165, 233, 0.12)',
      cardBg: 'linear-gradient(135deg, rgba(14, 165, 233, 0.12) 0%, rgba(19, 29, 53, 0.75) 100%)'
    },
    { 
      label: 'Autonomous Agent Tasks', 
      value: '1,420 Runs', 
      trend: '+24.8%', 
      positive: true, 
      icon: MessageSquare, 
      color: '#f59e0b',
      gradient: 'linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)',
      accentBg: 'rgba(245, 158, 11, 0.12)',
      cardBg: 'linear-gradient(135deg, rgba(245, 158, 11, 0.12) 0%, rgba(19, 29, 53, 0.75) 100%)'
    },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
      {stats.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <div 
            key={i} 
            className="glass-panel hover-lift" 
            style={{ 
              background: stat.cardBg, 
              border: `1px solid ${stat.color}35`, 
              borderRadius: 'var(--radius-lg)', 
              padding: '1.5rem', 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '1.1rem',
              boxShadow: `0 12px 28px -5px ${stat.color}20`,
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = `${stat.color}80`;
              e.currentTarget.style.boxShadow = `0 18px 36px -8px ${stat.color}35`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = `${stat.color}35`;
              e.currentTarget.style.boxShadow = `0 12px 28px -5px ${stat.color}20`;
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '13px', background: stat.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 6px 18px ${stat.color}45`, border: '1px solid rgba(255, 255, 255, 0.2)' }}>
                <Icon size={23} color="#fff" />
              </div>
              <span style={{ fontWeight: '700', fontSize: '0.8rem', color: stat.color, background: stat.accentBg, border: `1px solid ${stat.color}40`, padding: '0.22rem 0.65rem', borderRadius: 'var(--radius-full)' }}>
                {stat.trend}
              </span>
            </div>
            <div>
              <p style={{ color: 'var(--text-sub)', fontSize: '0.88rem', marginBottom: '0.25rem', fontWeight: 600 }}>{stat.label}</p>
              <h3 style={{ fontSize: '1.85rem', fontWeight: '800', color: '#fff' }}>{stat.value}</h3>
            </div>
          </div>
        );
      })}
    </div>
  );
}
