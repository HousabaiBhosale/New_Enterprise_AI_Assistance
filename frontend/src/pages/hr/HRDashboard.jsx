import { useState, useEffect } from 'react';
import { Users, FileText, Heart, ShieldAlert, ChevronRight, Loader } from 'lucide-react';
import { hrService } from '../../services/hrService';

export default function HRDashboard() {
  const [stats, setStats] = useState({
    active_employees: 0,
    pending_leaves: 0,
    compliance_issues: 0
  });
  const [loadingStats, setLoadingStats] = useState(true);
  
  const [query, setQuery] = useState("");
  const [chatResponse, setChatResponse] = useState(null);
  const [chatLoading, setChatLoading] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await hrService.getStats();
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch HR stats", error);
      } finally {
        setLoadingStats(false);
      }
    };
    fetchStats();
  }, []);

  const handleAskAI = async () => {
    if (!query.trim()) return;
    setChatLoading(true);
    setChatResponse(null);
    try {
      const result = await hrService.askPolicyQuestion(query);
      setChatResponse(result);
    } catch (error) {
      console.error("Failed to ask AI", error);
      setChatResponse({ response: "Error: Unable to reach the AI backend." });
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '0.5rem' }}>HR & People</h1>
          <p style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Users size={16} /> Employee Sentinel and Policy Management
          </p>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
        <div style={{ background: 'var(--bg-dark)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', display: 'flex', gap: '1rem' }}>
          <div style={{ padding: '1rem', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.15)', color: 'var(--primary-color)' }}><Users size={24} /></div>
          <div>
            <p style={{ color: 'var(--text-muted)', marginBottom: '0.2rem' }}>Active Employees</p>
            {loadingStats ? <Loader size={24} style={{ animation: 'spin 1s linear infinite' }} /> : 
              <h3 style={{ fontSize: '1.5rem', fontWeight: 700 }}>{stats.active_employees}</h3>
            }
          </div>
        </div>
        <div style={{ background: 'var(--bg-dark)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', display: 'flex', gap: '1rem' }}>
          <div style={{ padding: '1rem', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}><Heart size={24} /></div>
          <div>
            <p style={{ color: 'var(--text-muted)', marginBottom: '0.2rem' }}>Leave Requests</p>
            {loadingStats ? <Loader size={24} style={{ animation: 'spin 1s linear infinite' }} /> : 
              <h3 style={{ fontSize: '1.5rem', fontWeight: 700 }}>{stats.pending_leaves} Pending</h3>
            }
          </div>
        </div>
        <div style={{ background: 'var(--bg-dark)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', display: 'flex', gap: '1rem' }}>
          <div style={{ padding: '1rem', borderRadius: '12px', background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444' }}><ShieldAlert size={24} /></div>
          <div>
            <p style={{ color: 'var(--text-muted)', marginBottom: '0.2rem' }}>Compliance Alerts</p>
            {loadingStats ? <Loader size={24} style={{ animation: 'spin 1s linear infinite' }} /> : 
              <h3 style={{ fontSize: '1.5rem', fontWeight: 700 }}>{stats.compliance_issues} Issues</h3>
            }
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: '2rem' }}>
        <div style={{ background: 'var(--bg-dark)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '1.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', fontWeight: 600 }}>Agentic Policy Assistant</h2>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <input 
              type="text" 
              placeholder="e.g., What is the remote work allowance policy?" 
              style={{ flex: 1, padding: '1rem', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', color: 'var(--text-main)', fontSize: '1rem' }} 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAskAI()}
            />
            <button 
              onClick={handleAskAI}
              disabled={chatLoading}
              style={{ padding: '1rem 1.5rem', background: 'var(--primary-color)', color: 'white', border: 'none', borderRadius: 'var(--radius-md)', fontWeight: 600, cursor: 'pointer', opacity: chatLoading ? 0.7 : 1 }}
            >
              {chatLoading ? "Asking Agent..." : "Ask AI"}
            </button>
          </div>
          <div style={{ marginTop: '2rem', padding: '1.5rem', border: '1px dashed var(--border-color)', borderRadius: 'var(--radius-md)', color: 'var(--text-muted)' }}>
            {chatResponse ? (
              <div>
                <p style={{ color: 'var(--text-main)', marginBottom: '1rem', lineHeight: 1.5 }}>{chatResponse.response}</p>
                {chatResponse.agent_used && (
                  <span style={{ fontSize: '0.8rem', background: 'var(--primary-color)', color: 'white', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                    Routed by: {chatResponse.agent_used}
                  </span>
                )}
              </div>
            ) : (
              <div style={{ textAlign: 'center' }}>
                <FileText size={32} style={{ opacity: 0.5, marginBottom: '0.5rem' }} />
                <p>AI response will appear here based on company policies.</p>
              </div>
            )}
          </div>
        </div>

        <div style={{ background: 'var(--bg-dark)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '1.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', fontWeight: 600 }}>Recent Hires</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[1, 2, 3].map(i => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'var(--bg-card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--primary-color)', opacity: 0.8 }} />
                  <div>
                    <h4 style={{ margin: 0, fontSize: '0.95rem' }}>New Talent {i}</h4>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Joined {i} days ago</span>
                  </div>
                </div>
                <ChevronRight size={18} color="var(--text-muted)" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
