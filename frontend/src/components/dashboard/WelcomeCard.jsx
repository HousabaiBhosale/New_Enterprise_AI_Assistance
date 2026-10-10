import { ArrowUpRight } from 'lucide-react';

export default function WelcomeCard() {
  return (
    <div style={{ background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(139, 92, 246, 0.15))', border: '1px solid rgba(99, 102, 241, 0.3)', borderRadius: 'var(--radius-lg)', padding: '2.5rem', display: 'flex', flexWrap: 'wrap', gap: '2rem', justifyContent: 'space-between', alignItems: 'center', boxShadow: 'var(--panel-shadow)' }}>
      <div style={{ flex: '1 1 400px' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: '600', marginBottom: '0.75rem' }}>Good morning, Admin! 👋</h2>
        <p style={{ color: 'var(--text-main)', opacity: 0.8, lineHeight: '1.6', fontSize: '1.05rem' }}>
          Your AI agents have resolved <strong style={{ color: 'var(--primary-color)' }}>45 tickets</strong> and processed <strong style={{ color: 'var(--secondary-color)' }}>12 approvals</strong> since your last login.
          System efficiency is performing at optimal range today.
        </p>
      </div>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <div style={{ padding: '1.2rem', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-md)', backdropFilter: 'blur(10px)', minWidth: '140px', textAlign: 'center' }}>
          <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem', fontSize: '2.2rem', fontWeight: '700', color: 'var(--text-main)' }}>
            12% <ArrowUpRight size={24} color="#10b981" />
          </span>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Productivity Gain</span>
        </div>
      </div>
    </div>
  );
}
