import { useState, useEffect } from 'react';
import { KeyRound, Check, X } from 'lucide-react';
import { adminService } from '../../services/adminService';

export default function Permissions() {
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminService.getPermissions().then(setPermissions).catch(console.error).finally(() => setLoading(false));
  }, []);

  const roles = ['admin', 'hr', 'sales', 'support', 'employee'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <header>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '0.5rem' }}>Permission Matrix</h1>
        <p style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <KeyRound size={16} color="var(--primary-color)" /> Actionable privilege controls mapping roles to tools and endpoints
        </p>
      </header>

      <div style={{ background: 'var(--bg-dark)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center', fontSize: '0.9rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.02)', color: 'var(--text-muted)' }}>
              <th style={{ padding: '1rem 1.25rem', textAlign: 'left' }}>Tool / Capability</th>
              {roles.map(r => (
                <th key={r} style={{ padding: '1rem', textTransform: 'uppercase' }}>{r}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {permissions.map(p => (
              <tr key={p.permission} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '1rem 1.25rem', textAlign: 'left', fontWeight: 600 }}>
                  <code>{p.permission}</code>
                </td>
                {roles.map(r => (
                  <td key={r} style={{ padding: '1rem' }}>
                    {p[r] ? (
                      <span style={{ color: '#10b981', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Check size={18} />
                      </span>
                    ) : (
                      <span style={{ color: 'var(--text-muted)', opacity: 0.3, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                        <X size={16} />
                      </span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
