import { FileBarChart, Download, Calendar } from 'lucide-react';
import React from 'react';

export default function Reports() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '0.5rem' }}>Automated Reports</h1>
          <p style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FileBarChart size={16} /> AI-generated analytical summaries
          </p>
        </div>
        <button style={{ background: 'var(--primary-color)', color: 'white', border: 'none', padding: '0.8rem 1.5rem', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, cursor: 'pointer' }} className="hover-lift">
          <Calendar size={18} /> Schedule Report
        </button>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
        {[
          { title: 'Global Q3 Enterprise Performance', freq: 'Quarterly', date: 'Sept 30, 2026', size: '2.4 MB' },
          { title: 'Weekly Support Resolution Metrics', freq: 'Weekly', date: 'Sept 14, 2026', size: '1.1 MB' },
          { title: 'Automated Compliance Audit', freq: 'Monthly', date: 'Sept 1, 2026', size: '4.8 MB' }
        ].map((rep, i) => (
          <div key={i} style={{ background: 'var(--bg-dark)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              <div style={{ width: 48, height: 48, background: 'rgba(99, 102, 241, 0.1)', borderRadius: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <FileBarChart size={24} color="var(--primary-color)" />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600 }}>{rep.title}</h3>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{rep.freq} • Generated {rep.date} • {rep.size}</span>
              </div>
            </div>
            <button style={{ background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-main)', padding: '0.6rem 1.2rem', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }} className="hover-lift">
              <Download size={18} /> Download PDF
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
