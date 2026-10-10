import { LifeBuoy, AlertTriangle, Clock, CheckCircle } from 'lucide-react';
import React from 'react';

export default function SupportDashboard() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '0.5rem' }}>Support & Triage</h1>
          <p style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <LifeBuoy size={16} /> Automated ticket routing and resolution
          </p>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
        {[
          { label: 'Unresolved', count: '142', icon: LifeBuoy, color: 'var(--primary-color)', bg: 'rgba(99, 102, 241, 0.1)' },
          { label: 'High Priority', count: '12', icon: AlertTriangle, color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)' },
          { label: 'SLA Risk', count: '5', icon: Clock, color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)' },
          { label: 'Resolved (Auto)', count: '840', icon: CheckCircle, color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' },
        ].map((stat, i) => (
          <div key={i} style={{ background: 'var(--bg-dark)', border: '1px solid var(--glass-border)', padding: '1.25rem', borderRadius: 'var(--radius-lg)', display: 'flex', flexDirection: 'column', gap: '1rem', boxShadow: 'var(--panel-shadow)' }}>
            <div style={{ width: '40px', height: '40px', background: stat.bg, color: stat.color, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <stat.icon size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.75rem', fontWeight: 700, margin: '0 0 0.2rem 0' }}>{stat.count}</h3>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{stat.label}</span>
            </div>
          </div>
        ))}
      </div>

      <div style={{ background: 'var(--bg-dark)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '1.5rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>Live Triage Queue</h2>
        <div style={{ width: '100%', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '1rem', fontWeight: 500 }}>Ticket ID</th>
                <th style={{ padding: '1rem', fontWeight: 500 }}>Subject</th>
                <th style={{ padding: '1rem', fontWeight: 500 }}>AI Confidence</th>
                <th style={{ padding: '1rem', fontWeight: 500 }}>Status</th>
                <th style={{ padding: '1rem', fontWeight: 500 }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {[
                { id: 'TCK-2041', title: 'Login failure on mobile app', conf: 98, status: 'Auto-Routing' },
                { id: 'TCK-2040', title: 'Billing integration issue', conf: 45, status: 'Needs Human' },
                { id: 'TCK-2039', title: 'Request for server upgrade', conf: 92, status: 'Resolving' },
              ].map((ticket, i) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--border-color)', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)' }}>
                  <td style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-main)' }}>{ticket.id}</td>
                  <td style={{ padding: '1rem', color: 'var(--text-main)' }}>{ticket.title}</td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{ width: '50px', height: '6px', background: 'var(--bg-darker)', borderRadius: '3px' }}>
                        <div style={{ width: `${ticket.conf}%`, height: '100%', background: ticket.conf > 80 ? '#10b981' : '#f59e0b', borderRadius: '3px' }} />
                      </div>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{ticket.conf}%</span>
                    </div>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ background: 'var(--bg-card)', padding: '0.3rem 0.6rem', borderRadius: 'var(--radius-full)', fontSize: '0.8rem', color: 'var(--text-muted)', border: '1px solid var(--glass-border)' }}>
                      {ticket.status}
                    </span>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <button style={{ background: 'transparent', border: '1px solid var(--primary-color)', color: 'var(--primary-color)', padding: '0.4rem 0.8rem', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontSize: '0.85rem' }} className="hover-lift">
                      View details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
