import { CheckCircle2, XCircle, Clock, FileText } from 'lucide-react';
import React from 'react';

export default function Approvals() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <header>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '0.5rem' }}>Pending Approvals</h1>
        <p style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Clock size={16} /> Human-in-the-loop interventions required by Agents
        </p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem' }}>
        {[
          { title: 'Marketing Budget Q4 Increase', agent: 'FinanceAgent-12', conf: 92, amount: '$240,000' },
          { title: 'Database Scalability Trigger', agent: 'DevOps-Sentinel', conf: 85, amount: 'Auto-Scaling' },
          { title: 'Sales Contract Exception', agent: 'LegalBot-Alpha', conf: 64, amount: 'Clause 4B' }
        ].map((item, i) => (
          <div key={i} style={{ background: 'var(--bg-dark)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <div style={{ padding: '0.75rem', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '12px' }}>
                  <FileText size={20} color="var(--primary-color)" />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600 }}>{item.title}</h3>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Requested by {item.agent}</span>
                </div>
              </div>
              <span style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-full)', fontSize: '0.8rem', fontWeight: 600 }}>Action Required</span>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px dashed var(--glass-border)', display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)' }}>Impact / Value</span>
                <span style={{ fontWeight: 600 }}>{item.amount}</span>
              </div>
              <div>
                <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)' }}>AI Confidence</span>
                <span style={{ fontWeight: 600, color: item.conf > 80 ? '#10b981' : '#f59e0b' }}>{item.conf}%</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
              <button style={{ flex: 1, padding: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', background: '#10b981', color: 'white', border: 'none', borderRadius: 'var(--radius-md)', fontWeight: 600, cursor: 'pointer' }} className="hover-lift">
                <CheckCircle2 size={18} /> Approve
              </button>
              <button style={{ flex: 1, padding: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', background: 'transparent', color: '#ef4444', border: '1px solid #ef4444', borderRadius: 'var(--radius-md)', fontWeight: 600, cursor: 'pointer' }} className="hover-lift">
                <XCircle size={18} /> Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
