import { Users, CreditCard, MessageSquare, Briefcase } from 'lucide-react';

export default function StatsGrid() {
  const stats = [
    { label: 'Total Revenue', value: '$84,235.00', trend: '+4.75%', positive: true, icon: CreditCard, color: '#3b82f6' },
    { label: 'Active Users', value: '12,450', trend: '+1.2%', positive: true, icon: Users, color: '#10b981' },
    { label: 'Agent Tasks', value: '450', trend: '-2.5%', positive: false, icon: Briefcase, color: '#f59e0b' },
    { label: 'AI Interactions', value: '1.2M', trend: '+18.2%', positive: true, icon: MessageSquare, color: '#8b5cf6' },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
      {stats.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <div key={i} className="hover-lift" style={{ background: 'var(--bg-dark)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: `${stat.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={24} color={stat.color} />
              </div>
              <span style={{ fontWeight: '600', fontSize: '0.875rem', color: stat.positive ? '#10b981' : '#ef4444', background: stat.positive ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', padding: '0.25rem 0.5rem', borderRadius: 'var(--radius-full)' }}>
                {stat.trend}
              </span>
            </div>
            <div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.25rem' }}>{stat.label}</p>
              <h3 style={{ fontSize: '1.8rem', fontWeight: '700' }}>{stat.value}</h3>
            </div>
          </div>
        );
      })}
    </div>
  );
}
