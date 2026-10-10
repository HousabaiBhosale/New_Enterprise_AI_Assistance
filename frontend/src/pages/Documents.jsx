import { FolderOpen, Search, Upload } from 'lucide-react';
import React from 'react';

export default function Documents() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', height: '100%' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '0.5rem' }}>Knowledge Base</h1>
          <p style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FolderOpen size={16} /> Reference documents for Agent training
          </p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div style={{ position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input type="text" placeholder="Search documents..." style={{ background: 'var(--bg-dark)', border: '1px solid var(--border-color)', padding: '0.8rem 1rem 0.8rem 2.8rem', borderRadius: 'var(--radius-md)', color: 'white', width: '250px' }} />
          </div>
          <button style={{ background: 'var(--primary-color)', color: 'white', border: 'none', padding: '0.8rem 1.5rem', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, cursor: 'pointer' }} className="hover-lift">
            <Upload size={18} /> Upload Data
          </button>
        </div>
      </header>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px dashed var(--border-color)', borderRadius: 'var(--radius-lg)', background: 'rgba(2, 6, 23, 0.2)' }}>
        <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
          <FolderOpen size={48} style={{ margin: '0 auto 1rem auto', opacity: 0.5 }} />
          <h2 style={{ fontSize: '1.25rem', color: 'var(--text-main)', marginBottom: '0.5rem' }}>No documents uploaded</h2>
          <p>Drag and drop training PDFs or CSVs here so AI agents can reference them.</p>
        </div>
      </div>
    </div>
  );
}
