import { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, Clock, FileText, AlertCircle, RefreshCw, Check, Sparkles, ShieldCheck } from 'lucide-react';
import { approvalService } from '../services/approvalService';
import { useTheme } from '../context/ThemeContext';

export default function Approvals() {
  const { isLight } = useTheme();
  const [approvals, setApprovals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('Pending');
  const [actionNotice, setActionNotice] = useState(null);

  const fetchApprovals = async () => {
    setLoading(true);
    try {
      const data = await approvalService.getApprovals();
      setApprovals(data);
    } catch (err) {
      console.error("Failed to load approvals", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApprovals();
  }, []);

  const handleAction = async (id, action) => {
    try {
      await approvalService.takeAction(id, action);
      setActionNotice({ id, action, message: `Approval #${id} successfully marked as ${action}d.` });
      setApprovals(prev => prev.map(item => item.id === id ? { ...item, status: action === 'approve' ? 'Approved' : 'Rejected' } : item));
      setTimeout(() => setActionNotice(null), 4000);
    } catch (err) {
      console.error("Failed action:", err);
      alert(`Action error: ${err.message}`);
    }
  };

  const filteredItems = approvals.filter(item => {
    if (filter === 'All') return true;
    return item.status === filter;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Visual Header Banner */}
      <div style={{
        background: isLight 
          ? 'linear-gradient(135deg, rgba(254, 243, 199, 0.96) 0%, rgba(255, 251, 235, 0.94) 50%, rgba(238, 242, 255, 0.96) 100%), url("https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=1200&q=80") center/cover no-repeat'
          : 'linear-gradient(135deg, rgba(245, 158, 11, 0.25) 0%, rgba(217, 119, 6, 0.2) 50%, rgba(99, 102, 241, 0.15) 100%), url("https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=1200&q=80") center/cover no-repeat',
        borderRadius: 'var(--radius-lg)',
        border: isLight ? '1px solid rgba(245, 158, 11, 0.35)' : '1px solid rgba(245, 158, 11, 0.35)',
        padding: '2.2rem 2.5rem',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: isLight ? '0 16px 40px -10px rgba(15, 23, 42, 0.08)' : 'var(--panel-shadow)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1.5rem',
        transition: 'all 0.3s ease'
      }}>
        <div style={{ 
          position: 'absolute', 
          inset: 0, 
          background: isLight 
            ? 'linear-gradient(90deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.82) 60%, rgba(255, 255, 255, 0.45) 100%)' 
            : 'linear-gradient(90deg, rgba(2, 6, 23, 0.92) 0%, rgba(2, 6, 23, 0.78) 60%, rgba(2, 6, 23, 0.45) 100%)', 
          pointerEvents: 'none' 
        }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: '650px' }}>
          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '0.45rem', 
            padding: '0.3rem 0.8rem', 
            borderRadius: 'var(--radius-full)', 
            background: isLight ? 'rgba(245, 158, 11, 0.12)' : 'rgba(245, 158, 11, 0.2)', 
            border: isLight ? '1px solid rgba(245, 158, 11, 0.35)' : '1px solid rgba(245, 158, 11, 0.4)', 
            color: isLight ? '#d97706' : '#fbbf24', 
            fontSize: '0.8rem', 
            fontWeight: 700, 
            marginBottom: '0.75rem' 
          }}>
            <ShieldCheck size={14} color={isLight ? '#d97706' : '#fbbf24'} /> Human-in-the-Loop (HITL) Governance
          </div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: '800', marginBottom: '0.5rem', color: isLight ? '#0f172a' : '#fff', letterSpacing: '-0.5px' }}>
            Manager Authorization Queue
          </h1>
          <p style={{ color: isLight ? '#475569' : 'var(--text-sub)', fontSize: '0.98rem', lineHeight: 1.6, margin: 0 }}>
            Supervised authorization for high-impact actions: extended leave requests (&gt; 3 days), high-value commercial orders (&gt; $1,000), and helpdesk customer escalations.
          </p>
        </div>

        <div style={{ position: 'relative', zIndex: 1, display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <button 
            onClick={fetchApprovals} 
            style={{ 
              background: isLight ? '#ffffff' : 'rgba(2, 6, 23, 0.85)', 
              border: isLight ? '1px solid rgba(203, 213, 225, 0.9)' : '1px solid var(--border-color)', 
              color: isLight ? '#0f172a' : 'var(--text-main)', 
              padding: '0.65rem 1.1rem', 
              borderRadius: 'var(--radius-md)', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem', 
              cursor: 'pointer', 
              fontWeight: 600,
              boxShadow: isLight ? '0 1px 3px rgba(15, 23, 42, 0.05)' : 'none'
            }} 
            className="hover-lift"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} /> Refresh
          </button>
          {['Pending', 'Approved', 'Rejected', 'All'].map(tab => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              style={{
                background: filter === tab ? '#f59e0b' : (isLight ? '#ffffff' : 'rgba(2, 6, 23, 0.85)'),
                color: filter === tab ? 'white' : (isLight ? '#475569' : 'var(--text-muted)'),
                border: filter === tab ? '1px solid #f59e0b' : (isLight ? '1px solid rgba(203, 213, 225, 0.9)' : '1px solid var(--border-color)'),
                padding: '0.65rem 1.2rem',
                borderRadius: 'var(--radius-md)',
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: isLight && filter !== tab ? '0 1px 3px rgba(15, 23, 42, 0.05)' : 'none'
              }}
              className="hover-lift"
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {actionNotice && (
        <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10b981', color: '#10b981', padding: '1rem', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Check size={20} />
          <span>{actionNotice.message}</span>
        </div>
      )}

      {loading ? (
        <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          <RefreshCw className="animate-spin" size={32} style={{ margin: '0 auto 1rem' }} />
          <p>Loading enterprise approval queue...</p>
        </div>
      ) : filteredItems.length === 0 ? (
        <div style={{ padding: '4rem', textAlign: 'center', border: '1px dashed var(--border-color)', borderRadius: 'var(--radius-lg)' }}>
          <CheckCircle2 size={48} color="#10b981" style={{ margin: '0 auto 1rem', opacity: 0.6 }} />
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>No {filter} Approvals</h3>
          <p style={{ color: 'var(--text-muted)' }}>All agent-initiated tasks in this category have been processed.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem' }}>
          {filteredItems.map((item) => (
            <div key={item.id} style={{ background: 'var(--bg-dark)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', boxShadow: 'var(--panel-shadow)' }} className="hover-lift">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                  <div style={{ padding: '0.75rem', background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', borderRadius: '12px' }}>
                    <FileText size={20} />
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 600 }}>{item.title}</h3>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Requested by {item.agent} • {item.created_at}</span>
                  </div>
                </div>
                <span style={{
                  background: item.status === 'Approved' ? 'rgba(16, 185, 129, 0.15)' : (item.status === 'Rejected' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(245, 158, 11, 0.15)'),
                  color: item.status === 'Approved' ? '#10b981' : (item.status === 'Rejected' ? '#ef4444' : '#f59e0b'),
                  padding: '0.2rem 0.6rem',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.8rem',
                  fontWeight: 600
                }}>
                  {item.status}
                </span>
              </div>

              {item.description && (
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>
                  {item.description}
                </p>
              )}

              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)', border: '1px dashed var(--glass-border)', display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)' }}>Impact / Value</span>
                  <span style={{ fontWeight: 600, color: '#f59e0b', fontSize: '0.92rem' }}>{item.impact || 'Standard'}</span>
                </div>
                <div>
                  <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)' }}>AI Confidence</span>
                  <span style={{ fontWeight: 600, color: item.conf > 80 ? '#10b981' : '#f59e0b', fontSize: '0.92rem' }}>{item.conf}%</span>
                </div>
              </div>

              {item.status === 'Pending' ? (
                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                  <button onClick={() => handleAction(item.id, 'approve')} style={{ flex: 1, padding: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', background: '#10b981', color: 'white', border: 'none', borderRadius: 'var(--radius-md)', fontWeight: 600, cursor: 'pointer' }} className="hover-lift">
                    <CheckCircle2 size={18} /> Approve
                  </button>
                  <button onClick={() => handleAction(item.id, 'reject')} style={{ flex: 1, padding: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', background: 'transparent', color: '#ef4444', border: '1px solid #ef4444', borderRadius: 'var(--radius-md)', fontWeight: 600, cursor: 'pointer' }} className="hover-lift">
                    <XCircle size={18} /> Reject
                  </button>
                </div>
              ) : (
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', textAlign: 'right', fontStyle: 'italic' }}>
                  Reviewed: {item.reviewer || 'Authorized Manager'}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
