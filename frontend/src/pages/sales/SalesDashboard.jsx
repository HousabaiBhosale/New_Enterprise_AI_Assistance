import { TrendingUp, Target, DollarSign, Activity } from 'lucide-react';
import React from 'react';

export default function SalesDashboard() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '0.5rem' }}>Sales & Revenue</h1>
          <p style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <TrendingUp size={16} /> Pipeline and predictive revenue modeling
          </p>
        </div>
      </header>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
        <div style={{ background: 'var(--bg-dark)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '-10px', right: '-10px', opacity: 0.05 }}><DollarSign size={100} /></div>
          <p style={{ color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: 500 }}>Quarterly Revenue</p>
          <h3 style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.5rem' }}>$4.2M</h3>
          <span style={{ color: '#10b981', fontSize: '0.85rem', fontWeight: 600 }}>+12% vs last quarter</span>
        </div>
        <div style={{ background: 'var(--bg-dark)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '-10px', right: '-10px', opacity: 0.05 }}><Target size={100} /></div>
          <p style={{ color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: 500 }}>Win Rate</p>
          <h3 style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.5rem' }}>68%</h3>
          <span style={{ color: '#10b981', fontSize: '0.85rem', fontWeight: 600 }}>+4% powered by AI Insights</span>
        </div>
        <div style={{ background: 'var(--bg-dark)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '-10px', right: '-10px', opacity: 0.05 }}><Activity size={100} /></div>
          <p style={{ color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: 500 }}>Active Opportunities</p>
          <h3 style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.5rem' }}>142</h3>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>Across 4 regions</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: '2rem' }}>
        <div style={{ background: 'var(--bg-dark)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Revenue Forecast</h2>
            <select style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-main)', padding: '0.5rem', borderRadius: 'var(--radius-md)' }}>
              <option>This Quarter</option>
              <option>Next Quarter</option>
            </select>
          </div>
          <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(2, 6, 23, 0.4)', borderRadius: 'var(--radius-md)', border: '1px solid var(--glass-border)' }}>
            <p style={{ color: 'var(--text-muted)' }}>Interactive Chart.js Model mapping will go here.</p>
          </div>
        </div>

        <div style={{ background: 'var(--bg-dark)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '1.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>AI Lead Scoring</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {['TechCorp Inc.', 'Global Networks', 'CyberNet'].map((corp, index) => (
              <div key={index} style={{ padding: '1rem', background: 'var(--bg-card)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontWeight: 600 }}>{corp}</span>
                  <span style={{ color: '#10b981', fontWeight: 700 }}>9{8 - index}%</span>
                </div>
                <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: 'full', overflow: 'hidden' }}>
                  <div style={{ width: `9${8 - index}%`, height: '100%', background: 'linear-gradient(90deg, var(--secondary-color), var(--primary-color))' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
