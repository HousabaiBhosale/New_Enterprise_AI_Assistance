import { useState, useEffect } from 'react';
import { LifeBuoy, AlertTriangle, Clock, CheckCircle, Loader, Send, Sparkles } from 'lucide-react';
import { supportService } from '../../services/supportService';
import { useTheme } from '../../context/ThemeContext';

export default function SupportDashboard() {
  const { isLight } = useTheme();
  const [stats, setStats] = useState({
    unresolved: 0,
    high_priority: 0,
    sla_risk: 0,
    resolved: 0,
    recent_tickets: []
  });
  const [loading, setLoading] = useState(true);

  const [query, setQuery] = useState("");
  const [chatResponse, setChatResponse] = useState(null);
  const [chatLoading, setChatLoading] = useState(false);

  useEffect(() => {
    supportService.getStats()
      .then(data => setStats(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleAskSupportAI = async (customQuery) => {
    const q = customQuery || query;
    if (!q.trim()) return;
    setChatLoading(true);
    setChatResponse(null);
    try {
      const result = await supportService.askSupportQuestion(q);
      setChatResponse(result);
    } catch (error) {
      console.error("Failed to query Support AI", error);
      setChatResponse({ response: "Error: Unable to reach the Support AI backend." });
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Visual Header Banner */}
      <div style={{
        background: isLight 
          ? 'linear-gradient(135deg, rgba(240, 249, 255, 0.96) 0%, rgba(224, 242, 254, 0.94) 50%, rgba(238, 242, 255, 0.96) 100%), url("https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80") center/cover no-repeat'
          : 'linear-gradient(135deg, rgba(14, 165, 233, 0.28) 0%, rgba(2, 132, 199, 0.2) 50%, rgba(99, 102, 241, 0.15) 100%), url("https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80") center/cover no-repeat',
        borderRadius: 'var(--radius-lg)',
        border: isLight ? '1px solid rgba(14, 165, 233, 0.35)' : '1px solid rgba(14, 165, 233, 0.3)',
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
            : 'linear-gradient(90deg, rgba(2, 6, 23, 0.92) 0%, rgba(2, 6, 23, 0.75) 60%, rgba(2, 6, 23, 0.45) 100%)', 
          pointerEvents: 'none' 
        }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: '650px' }}>
          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '0.45rem', 
            padding: '0.3rem 0.8rem', 
            borderRadius: 'var(--radius-full)', 
            background: isLight ? 'rgba(14, 165, 233, 0.12)' : 'rgba(14, 165, 233, 0.2)', 
            border: isLight ? '1px solid rgba(14, 165, 233, 0.35)' : '1px solid rgba(14, 165, 233, 0.4)', 
            color: isLight ? '#0284c7' : '#38bdf8', 
            fontSize: '0.8rem', 
            fontWeight: 700, 
            marginBottom: '0.75rem' 
          }}>
            <Sparkles size={14} color={isLight ? '#0284c7' : '#38bdf8'} /> 24/7 Intelligent Helpdesk & Incident Triage
          </div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: '800', marginBottom: '0.5rem', color: isLight ? '#0f172a' : '#fff', letterSpacing: '-0.5px' }}>
            Helpdesk & Customer Support
          </h1>
          <p style={{ color: isLight ? '#475569' : 'var(--text-sub)', fontSize: '0.98rem', lineHeight: 1.6, margin: 0 }}>
            Automated ticket categorization, SLA response time compliance, standard operating procedures lookup, and seamless manager escalations.
          </p>
        </div>

        <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ 
            padding: '0.65rem 1.25rem', 
            background: isLight ? '#ffffff' : 'rgba(2, 6, 23, 0.85)', 
            border: '1px solid rgba(14, 165, 233, 0.4)', 
            borderRadius: 'var(--radius-full)', 
            fontSize: '0.88rem', 
            fontWeight: 700, 
            color: isLight ? '#0284c7' : '#38bdf8', 
            boxShadow: isLight ? '0 4px 15px rgba(14, 165, 233, 0.12)' : '0 4px 15px rgba(14, 165, 233, 0.15)' 
          }}>
            ⚡ Avg SLA Response: 4.2 mins
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
        {[
          { label: 'Unresolved', count: stats.unresolved, icon: LifeBuoy, color: 'var(--primary-color)', bg: 'rgba(99, 102, 241, 0.1)' },
          { label: 'High Priority', count: stats.high_priority, icon: AlertTriangle, color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)' },
          { label: 'SLA Escalations', count: stats.sla_risk, icon: Clock, color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)' },
          { label: 'Resolved', count: stats.resolved, icon: CheckCircle, color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' },
        ].map((item, i) => (
          <div key={i} style={{ background: 'var(--bg-dark)', border: '1px solid var(--glass-border)', padding: '1.25rem', borderRadius: 'var(--radius-lg)', display: 'flex', flexDirection: 'column', gap: '1rem', boxShadow: 'var(--panel-shadow)' }}>
            <div style={{ width: '40px', height: '40px', background: item.bg, color: item.color, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <item.icon size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.75rem', fontWeight: 700, margin: '0 0 0.2rem 0' }}>
                {loading ? <Loader size={20} className="animate-spin" /> : item.count}
              </h3>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{item.label}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Agentic Support Assistant Query Section */}
      <div style={{ background: 'var(--bg-dark)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
          <Sparkles size={20} color="#f59e0b" />
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Agentic Helpdesk Copilot</h2>
          <span style={{ fontSize: '0.78rem', background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', padding: '0.2rem 0.6rem', borderRadius: '12px', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
            Powered by Helpdesk Agent (ReAct)
          </span>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>
          Ask real-time questions about customer helpdesk requests, incident escalation, SLA response targets, or support SOPs.
        </p>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <input 
            type="text" 
            placeholder="e.g., What is the status of helpdesk ticket #1?" 
            style={{ flex: 1, padding: '0.85rem 1rem', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', color: 'var(--text-main)', fontSize: '0.95rem' }} 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAskSupportAI()}
          />
          <button 
            onClick={() => handleAskSupportAI()}
            disabled={chatLoading}
            style={{ background: '#f59e0b', color: 'white', border: 'none', padding: '0.85rem 1.5rem', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, cursor: chatLoading ? 'not-allowed' : 'pointer' }}
            className="hover-lift"
          >
            {chatLoading ? <Loader size={18} className="animate-spin" /> : <><Send size={18} /> Ask Helpdesk AI</>}
          </button>
        </div>

        {/* Quick Suggestion Chips */}
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.85rem', flexWrap: 'wrap' }}>
          {[
            "What is the status of helpdesk ticket #1?",
            "What is the status and priority of helpdesk ticket #2?",
            "What are our SLA response times for Critical helpdesk requests?",
            "What is our refund policy according to SOP?"
          ].map((promptText, i) => (
            <button
              key={i}
              onClick={() => { setQuery(promptText); handleAskSupportAI(promptText); }}
              style={{
                background: isLight ? '#ffffff' : 'rgba(255, 255, 255, 0.04)',
                border: isLight ? '1px solid rgba(203, 213, 225, 0.9)' : '1px solid var(--border-color)',
                color: isLight ? '#0f172a' : 'var(--text-muted)',
                borderRadius: '16px',
                padding: '0.35rem 0.8rem',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s',
                boxShadow: isLight ? '0 1px 3px rgba(15, 23, 42, 0.04)' : 'none'
              }}
              className="hover-lift"
              onMouseEnter={(e) => {
                if (isLight) {
                  e.currentTarget.style.background = 'rgba(245, 158, 11, 0.08)';
                  e.currentTarget.style.borderColor = '#f59e0b';
                  e.currentTarget.style.color = '#b45309';
                }
              }}
              onMouseLeave={(e) => {
                if (isLight) {
                  e.currentTarget.style.background = '#ffffff';
                  e.currentTarget.style.borderColor = 'rgba(203, 213, 225, 0.9)';
                  e.currentTarget.style.color = '#0f172a';
                }
              }}
            >
              💬 {promptText}
            </button>
          ))}
        </div>

        {chatResponse && (
          <div style={{ marginTop: '1.25rem', padding: '1.25rem', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#f59e0b' }}>Support Agent Answer:</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Live from PostgreSQL & Support SOP RAG</span>
            </div>
            <div style={{ fontSize: '0.95rem', lineHeight: '1.6', color: 'var(--text-main)', whiteSpace: 'pre-wrap' }}>
              {chatResponse.response}
            </div>
          </div>
        )}
      </div>

      <div style={{ background: 'var(--bg-dark)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '1.5rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>Live Helpdesk Queue</h2>
        <div style={{ width: '100%', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '1rem', fontWeight: 500 }}>Helpdesk ID</th>
                <th style={{ padding: '1rem', fontWeight: 500 }}>Subject</th>
                <th style={{ padding: '1rem', fontWeight: 500 }}>Priority</th>
                <th style={{ padding: '1rem', fontWeight: 500 }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="4" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading helpdesk tickets...</td></tr>
              ) : stats.recent_tickets?.length === 0 ? (
                <tr><td colSpan="4" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No helpdesk tickets in triage queue.</td></tr>
              ) : (
                stats.recent_tickets.map((ticket, i) => {
                  const avatars = [
                    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80",
                    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80",
                    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&h=120&q=80",
                    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&h=120&q=80",
                    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&h=120&q=80"
                  ];
                  return (
                    <tr key={i} style={{ borderBottom: '1px solid var(--border-color)', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)' }}>
                      <td style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-main)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                          <img 
                            src={avatars[i % avatars.length]} 
                            alt="User" 
                            style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }} 
                            onError={(e) => { e.currentTarget.style.display = 'none'; }}
                          />
                          <span>#{ticket.id}</span>
                        </div>
                      </td>
                      <td style={{ padding: '1rem', color: 'var(--text-main)' }}>{ticket.title}</td>
                      <td style={{ padding: '1rem' }}>
                        <span style={{
                          padding: '0.2rem 0.6rem',
                          borderRadius: 'var(--radius-full)',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          color: ticket.priority === 'Critical' || ticket.priority === 'High' ? '#ef4444' : '#10b981',
                          background: ticket.priority === 'Critical' || ticket.priority === 'High' ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.1)'
                        }}>
                          {ticket.priority}
                        </span>
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <span style={{
                          padding: '0.2rem 0.6rem',
                          borderRadius: 'var(--radius-full)',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          color: ticket.status === 'Open' ? '#3b82f6' : (ticket.status === 'Escalated' ? '#f59e0b' : '#10b981'),
                          background: ticket.status === 'Open' ? 'rgba(59,130,246,0.1)' : (ticket.status === 'Escalated' ? 'rgba(245,158,11,0.1)' : 'rgba(16,185,129,0.1)')
                        }}>
                          {ticket.status}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Helpdesk SLA & SOP Visual Spotlights */}
      <div style={{ marginTop: '0.5rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Sparkles size={18} color="#0ea5e9" /> Standard Operating Procedures (SOP) Reference
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {[
            {
              title: "Critical Priority SLA (1 Hour)",
              desc: "Complete service outage or severe security incident. Auto-escalates to Tier 3 human engineers.",
              tag: "< 1 Hour SLA",
              image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=600&q=80",
              category: "Incident Triage"
            },
            {
              title: "Refunds & Account Cancellations",
              desc: "Refund requests over $250 require Customer Success Director sign-off via HITL approval queue.",
              tag: "Financial SOP",
              image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80",
              category: "Billing Policies"
            },
            {
              title: "Customer Escalation Workflow",
              desc: "Unresolved tickets after 24 hours automatically routed to specialized supervisor review board.",
              tag: "Tier 2 Escalation",
              image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=600&q=80",
              category: "Helpdesk Protocol"
            }
          ].map((item, idx) => (
            <div 
              key={idx} 
              style={{ 
                background: 'var(--bg-dark)', 
                border: '1px solid var(--border-color)', 
                borderRadius: 'var(--radius-lg)', 
                overflow: 'hidden', 
                boxShadow: 'var(--panel-shadow)' 
              }}
              className="hover-lift"
            >
              <div style={{ height: '140px', overflow: 'hidden', position: 'relative' }}>
                <img 
                  src={item.image} 
                  alt={item.title} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{ position: 'absolute', inset: 0, background: isLight ? 'linear-gradient(180deg, transparent 40%, rgba(255, 255, 255, 0.92) 100%)' : 'linear-gradient(180deg, transparent 40%, rgba(2, 6, 23, 0.9) 100%)' }} />
                <span style={{ position: 'absolute', top: '12px', left: '12px', padding: '0.25rem 0.65rem', borderRadius: '12px', background: isLight ? '#ffffff' : 'rgba(2, 6, 23, 0.75)', border: isLight ? '1px solid rgba(226, 232, 240, 0.9)' : '1px solid rgba(255,255,255,0.15)', fontSize: '0.72rem', fontWeight: 600, color: isLight ? '#0f172a' : '#fff', backdropFilter: 'blur(8px)', boxShadow: isLight ? '0 2px 6px rgba(15, 23, 42, 0.06)' : 'none' }}>
                  {item.category}
                </span>
                <span style={{ position: 'absolute', bottom: '10px', right: '12px', padding: '0.2rem 0.55rem', borderRadius: '8px', background: 'rgba(14, 165, 233, 0.9)', fontSize: '0.72rem', fontWeight: 700, color: '#fff' }}>
                  {item.tag}
                </span>
              </div>
              <div style={{ padding: '1.25rem' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--text-main)' }}>{item.title}</h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
