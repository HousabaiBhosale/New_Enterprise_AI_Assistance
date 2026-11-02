import { useState, useEffect } from 'react';
import { ShieldCheck, RefreshCw } from 'lucide-react';
import { adminService } from '../../services/adminService';

export default function Roles() {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminService.getRoles().then(setRoles).catch(console.error).finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <header>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '0.5rem' }}>Role-Based Access Control (RBAC)</h1>
        <p style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ShieldCheck size={16} color="var(--primary-color)" /> Enterprise security boundaries for autonomous agent capabilities
        </p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {roles.map(r => (
          <div key={r.role} style={{ background: 'var(--bg-dark)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ textTransform: 'uppercase', fontSize: '1.1rem', fontWeight: 700, margin: 0, color: 'var(--primary-color)' }}>{r.role}</h3>
              <span style={{ fontSize: '0.8rem', background: 'rgba(255,255,255,0.05)', padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-full)' }}>{r.user_count} Users</span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.5, margin: 0 }}>{r.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
