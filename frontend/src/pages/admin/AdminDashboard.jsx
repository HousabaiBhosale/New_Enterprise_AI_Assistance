import { Shield, Settings, Server, Users } from 'lucide-react';
import React from 'react';

export default function AdminDashboard() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <header>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '0.5rem' }}>System Administration</h1>
        <p style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Shield size={16} /> Global platform settings and agent orchestration
        </p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
        {[
          { icon: Server, title: 'Server Health', stat: '99.98% Uptime', color: '#10b981' },
          { icon: Users, title: 'Total Seats', stat: '425 Active', color: '#3b82f6' },
          { icon: Settings, title: 'Agent Configs', stat: '14 Blueprints', color: '#8b5cf6' },
        ].map((mod, i) => (
          <div key={i} style={{ background: 'var(--bg-dark)', border: '1px solid var(--glass-border)', padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
            <mod.icon size={28} color={mod.color} style={{ marginBottom: '1rem' }} />
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.25rem' }}>{mod.title}</p>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 700 }}>{mod.stat}</h3>
          </div>
        ))}
      </div>

      <div style={{ background: 'var(--bg-dark)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Active Agent Services</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {['Core NLP Engine', 'Support Auto-Triage Router', 'Database ETL Worker'].map((agent, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>
              <div>
                <span style={{ fontWeight: 600, display: 'block', fontSize: '1.05rem' }}>{agent}</span>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Running on Node {i + 1} • RAM: {120 + i * 40}MB</span>
              </div>
              <button style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', border: '1px solid #10b981', padding: '0.4rem 1rem', borderRadius: 'var(--radius-full)', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}>
                Restart
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
