import { useState, useEffect } from 'react';
import { ShieldAlert, Search, RefreshCw, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { adminService } from '../../services/adminService';

export default function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const data = await adminService.getAuditLogs();
      setLogs(data);
    } catch (err) {
      console.error("Failed to fetch audit logs", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      log.user?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.resource?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'ALL' || log.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '0.5rem' }}>Enterprise Audit Trail</h1>
          <p style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldAlert size={16} color="var(--primary-color)" /> Tamper-evident activity log of AI decisions, tool executions, and user operations
          </p>
        </div>
        <button onClick={fetchLogs} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-main)', padding: '0.6rem 1.2rem', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} /> Refresh Logs
        </button>
      </header>

      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search by user, action, resource, or details..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%', background: 'var(--bg-dark)', border: '1px solid var(--border-color)', padding: '0.8rem 1rem 0.8rem 2.8rem', borderRadius: 'var(--radius-md)', color: 'white' }}
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{ background: 'var(--bg-dark)', border: '1px solid var(--border-color)', color: 'var(--text-main)', padding: '0.8rem 1rem', borderRadius: 'var(--radius-md)' }}
        >
          <option value="ALL">All Statuses</option>
          <option value="SUCCESS">SUCCESS</option>
          <option value="WARNING">WARNING</option>
          <option value="FAILED">FAILED</option>
        </select>
      </div>

      <div style={{ background: 'var(--bg-dark)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.02)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '1rem 1.25rem', fontWeight: 600 }}>Timestamp</th>
                <th style={{ padding: '1rem 1.25rem', fontWeight: 600 }}>Initiator</th>
                <th style={{ padding: '1rem 1.25rem', fontWeight: 600 }}>Action</th>
                <th style={{ padding: '1rem 1.25rem', fontWeight: 600 }}>Resource / Agent</th>
                <th style={{ padding: '1rem 1.25rem', fontWeight: 600 }}>Details</th>
                <th style={{ padding: '1rem 1.25rem', fontWeight: 600 }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    Loading audit trail from database...
                  </td>
                </tr>
              ) : filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No audit records match the selected criteria.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '1rem 1.25rem', whiteSpace: 'nowrap', color: 'var(--text-muted)' }}>{log.timestamp}</td>
                    <td style={{ padding: '1rem 1.25rem', fontWeight: 600 }}>{log.user}</td>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <code style={{ background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary-color)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                        {log.action}
                      </code>
                    </td>
                    <td style={{ padding: '1rem 1.25rem' }}>{log.resource}</td>
                    <td style={{ padding: '1rem 1.25rem', color: 'var(--text-muted)', maxWidth: '350px', wordBreak: 'break-word' }}>{log.details || '-'}</td>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        color: log.status === 'SUCCESS' ? '#10b981' : (log.status === 'WARNING' ? '#f59e0b' : '#ef4444'),
                        background: log.status === 'SUCCESS' ? 'rgba(16, 185, 129, 0.1)' : (log.status === 'WARNING' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(239, 68, 68, 0.1)'),
                        padding: '0.2rem 0.6rem',
                        borderRadius: 'var(--radius-full)'
                      }}>
                        {log.status === 'SUCCESS' ? <CheckCircle size={12} /> : (log.status === 'WARNING' ? <AlertTriangle size={12} /> : <XCircle size={12} />)}
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
