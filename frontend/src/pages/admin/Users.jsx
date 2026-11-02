import { useState, useEffect } from 'react';
import { Users as UsersIcon, UserCheck, Shield, Mail, RefreshCw } from 'lucide-react';
import { adminService } from '../../services/adminService';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await adminService.getUsers();
      setUsers(data);
    } catch (err) {
      console.error("Failed to load users", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '0.5rem' }}>Enterprise Users & Access</h1>
          <p style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <UsersIcon size={16} color="var(--primary-color)" /> User accounts and role mapping
          </p>
        </div>
        <button onClick={fetchUsers} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-main)', padding: '0.6rem 1.2rem', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} /> Refresh
        </button>
      </header>

      <div style={{ background: 'var(--bg-dark)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.02)', color: 'var(--text-muted)' }}>
              <th style={{ padding: '1rem 1.25rem' }}>User</th>
              <th style={{ padding: '1rem 1.25rem' }}>Email</th>
              <th style={{ padding: '1rem 1.25rem' }}>Assigned Role</th>
              <th style={{ padding: '1rem 1.25rem' }}>Department</th>
              <th style={{ padding: '1rem 1.25rem' }}>Status</th>
              <th style={{ padding: '1rem 1.25rem' }}>Joined</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading user roster...</td></tr>
            ) : users.map(u => (
              <tr key={u.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '1rem 1.25rem', fontWeight: 600 }}>{u.name}</td>
                <td style={{ padding: '1rem 1.25rem', color: 'var(--text-muted)' }}>{u.email}</td>
                <td style={{ padding: '1rem 1.25rem' }}>
                  <span style={{ textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: 700, background: 'rgba(99,102,241,0.15)', color: 'var(--primary-color)', padding: '0.2rem 0.6rem', borderRadius: '4px' }}>
                    {u.role}
                  </span>
                </td>
                <td style={{ padding: '1rem 1.25rem' }}>{u.department}</td>
                <td style={{ padding: '1rem 1.25rem' }}>
                  <span style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.85rem' }}>
                    <UserCheck size={14} /> Active
                  </span>
                </td>
                <td style={{ padding: '1rem 1.25rem', color: 'var(--text-muted)' }}>{u.joined}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
