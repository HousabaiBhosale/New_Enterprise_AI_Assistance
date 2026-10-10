import { CheckCircle2, Clock, AlertCircle } from 'lucide-react';

const activities = [
  { id: 1, title: 'Server diagnostics completed', time: '10 mins ago', icon: CheckCircle2, color: '#10b981' },
  { id: 2, title: 'Pending Approval: Marketing Budget', time: '1 hour ago', icon: Clock, color: '#f59e0b' },
  { id: 3, title: 'Database optimization routine', time: '3 hours ago', icon: CheckCircle2, color: '#10b981' },
  { id: 4, title: 'High CPU usage detected on Node A', time: '5 hours ago', icon: AlertCircle, color: '#ef4444' },
];

export default function RecentActivity() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {activities.map(act => (
        <div key={act.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>
          <div style={{ marginTop: '0.2rem' }}><act.icon size={18} color={act.color} /></div>
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 500, margin: '0 0 0.25rem 0' }}>{act.title}</h4>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{act.time}</span>
          </div>
        </div>
      ))}
      <button style={{ background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-main)', padding: '0.5rem', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontSize: '0.9rem', marginTop: '0.5rem' }} className="hover-lift">
        View All Activity
      </button>
    </div>
  );
}
