import { useState, useEffect } from 'react';
import { Users, FileText, Heart, ShieldAlert, ChevronRight, Loader, Sparkles, Send } from 'lucide-react';
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
  const [chatHistory, setChatHistory] = useState([]);

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

  const handleAskAI = async (customQuery) => {
    const q = customQuery || query;
    if (!q.trim()) return;
    setChatLoading(true);
    setChatResponse(null);
    try {
      const userMsg = { role: 'user', content: q };
      const currentHistory = [...chatHistory, userMsg];
      const result = await hrService.askPolicyQuestion(q, 1, currentHistory);
      setChatResponse(result);
      if (result && result.response) {
        setChatHistory([...currentHistory, { role: 'assistant', content: result.response }]);
      }
    } catch (error) {
      console.error("Failed to ask HR AI", error);
      setChatResponse({ response: "Error: Unable to reach the HR AI backend." });
    } finally {
      setChatLoading(false);
    }
  };

  const recentHires = [
    {
      name: "Sarah Jenkins",
      role: "Lead Frontend Engineer",
      dept: "Engineering",
      deptColor: "#818cf8",
      joined: "Joined 1 day ago",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&h=120&q=80"
    },
    {
      name: "Marcus Vance",
      role: "Senior Cloud Architect",
      dept: "Infrastructure",
      deptColor: "#34d399",
      joined: "Joined 2 days ago",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80"
    },
    {
      name: "Elena Rostova",
      role: "Talent Operations Partner",
      dept: "People & HR",
      deptColor: "#c084fc",
      joined: "Joined 3 days ago",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80"
    },
    {
      name: "David Kim",
      role: "Customer Success Lead",
      dept: "Helpdesk",
      deptColor: "#38bdf8",
      joined: "Joined 5 days ago",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&h=120&q=80"
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Visual Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.25) 0%, rgba(168, 85, 247, 0.2) 50%, rgba(14, 165, 233, 0.15) 100%), url("https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80") center/cover no-repeat',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid rgba(168, 85, 247, 0.3)',
        padding: '2.2rem 2.5rem',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: 'var(--panel-shadow)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1.5rem'
      }}>
        {/* Dark gradient overlay for text readability */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(2, 6, 23, 0.92) 0%, rgba(2, 6, 23, 0.75) 60%, rgba(2, 6, 23, 0.45) 100%)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: '650px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', padding: '0.3rem 0.8rem', borderRadius: 'var(--radius-full)', background: 'rgba(168, 85, 247, 0.2)', border: '1px solid rgba(168, 85, 247, 0.4)', color: '#c084fc', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.75rem' }}>
            <Sparkles size={14} color="#c084fc" /> Enterprise Workforce Hub & Sentinel
          </div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: '800', marginBottom: '0.5rem', color: '#fff', letterSpacing: '-0.5px' }}>
            HR & People Operations
          </h1>
          <p style={{ color: 'var(--text-sub)', fontSize: '0.98rem', lineHeight: 1.6, margin: 0 }}>
            Automated leave processing, policy compliance verification, workforce census statements, and AI-guided employee assistance.
          </p>
        </div>

        <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ display: 'flex', marginLeft: '-8px' }}>
            {recentHires.map((h, i) => (
              <img
                key={i}
                src={h.avatar}
                alt={h.name}
                style={{ width: '42px', height: '42px', borderRadius: '50%', border: '2px solid var(--bg-dark)', marginLeft: i > 0 ? '-12px' : '0', objectFit: 'cover' }}
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
            ))}
          </div>
          <div style={{ padding: '0.5rem 1rem', background: 'rgba(2, 6, 23, 0.8)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-full)', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-main)' }}>
            +25 Active Team Members
          </div>
        </div>
      </div>

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
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
            <Sparkles size={20} color="var(--primary-color)" />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Agentic HR Copilot</h2>
            <span style={{ fontSize: '0.78rem', background: 'rgba(99, 102, 241, 0.15)', color: 'var(--primary-color)', padding: '0.2rem 0.6rem', borderRadius: '12px', border: '1px solid rgba(99, 102, 241, 0.3)' }}>
              Powered by HR Sentinel (ReAct)
            </span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
            Query enterprise leave balances, remote work guidelines, compliance policies, or generate official HR executive PDF reports.
          </p>

          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <input 
              type="text" 
              placeholder="e.g., What is the remote work allowance policy?" 
              style={{ flex: 1, padding: '0.85rem 1rem', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', color: 'var(--text-main)', fontSize: '0.95rem' }} 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAskAI()}
            />
            <button 
              onClick={() => handleAskAI()}
              disabled={chatLoading}
              style={{ padding: '0.85rem 1.5rem', background: 'var(--primary-color)', color: 'white', border: 'none', borderRadius: 'var(--radius-md)', fontWeight: 600, cursor: chatLoading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              className="hover-lift"
            >
              {chatLoading ? <Loader size={18} className="animate-spin" /> : <><Send size={18} /> Ask HR AI</>}
            </button>
          </div>

          {/* Quick Suggestion Chips */}
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.85rem', flexWrap: 'wrap' }}>
            {[
              "Give me the reports of the applied leave for employee id 1",
              "Apply for 5 days of medical leave for employee 1",
              "Check leave balance for employee 1",
              "What is the remote work allowance policy?",
              "What are our official maternity and paternity leave policies?",
              "Generate an executive PDF summary of all HR policies"
            ].map((promptText, i) => (
              <button
                key={i}
                onClick={() => { setQuery(promptText); handleAskAI(promptText); }}
                style={{
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-muted)',
                  borderRadius: '16px',
                  padding: '0.35rem 0.8rem',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                className="hover-lift"
              >
                💬 {promptText}
              </button>
            ))}
          </div>

          <div style={{ marginTop: '1.5rem', padding: '1.25rem', border: '1px dashed var(--border-color)', borderRadius: 'var(--radius-md)', background: 'var(--bg-card)' }}>
            {chatResponse ? (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary-color)' }}>HR Agent Answer:</span>
                  {chatResponse.agent_used && (
                    <span style={{ fontSize: '0.75rem', background: 'rgba(99, 102, 241, 0.15)', color: 'var(--primary-color)', padding: '0.2rem 0.6rem', borderRadius: '12px', border: '1px solid rgba(99, 102, 241, 0.3)' }}>
                      Routed: {chatResponse.agent_used}
                    </span>
                  )}
                </div>
                <p style={{ color: 'var(--text-main)', marginBottom: '0.5rem', lineHeight: 1.6, whiteSpace: 'pre-line' }}>{chatResponse.response}</p>
                
                {/* Download Leave Report Action Button if report link is present */}
                {chatResponse.response && (chatResponse.response.includes('/api/reports/download/') || chatResponse.response.includes('.pdf')) && (
                  <div style={{ marginTop: '0.85rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)' }}>
                    {(() => {
                      const match = chatResponse.response.match(/(https?:\/\/[^\s\)]+\/api\/reports\/download\/[^\s\)]+)/i) || 
                                    chatResponse.response.match(/(\/api\/reports\/download\/[^\s\)]+)/i);
                      const url = match ? match[0] : null;
                      if (!url) return null;
                      const fullUrl = url.startsWith('http') ? url : `http://localhost:8000${url}`;
                      return (
                        <a
                          href={fullUrl}
                          target="_blank"
                          rel="noreferrer"
                          download
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            background: 'linear-gradient(135deg, #0d9488 0%, #14b8a6 100%)',
                            color: '#fff',
                            padding: '0.55rem 1.1rem',
                            borderRadius: 'var(--radius-md)',
                            fontWeight: 700,
                            fontSize: '0.84rem',
                            textDecoration: 'none',
                            boxShadow: '0 4px 12px rgba(20, 184, 166, 0.35)'
                          }}
                          className="hover-lift"
                        >
                          <FileText size={15} /> Download Generated Official Leave Report (PDF)
                        </a>
                      );
                    })()}
                  </div>
                )}

                {chatResponse.steps && chatResponse.steps.length > 0 && (
                  <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Workflow Execution: {chatResponse.steps.map(s => typeof s === 'string' ? s : s.name).join(' → ')}
                  </div>
                )}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '1rem' }}>
                <FileText size={32} style={{ opacity: 0.5, marginBottom: '0.5rem' }} />
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>HR Agent response and policy verification will appear here.</p>
              </div>
            )}
          </div>
        </div>

        <div style={{ background: 'var(--bg-dark)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, margin: 0 }}>Recent Hires</h2>
            <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.6rem', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.15)', color: 'var(--primary-color)', fontWeight: 600 }}>New Onboarding</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
            {recentHires.map((employee, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.9rem 1rem', background: 'var(--bg-card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }} className="hover-lift">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                  <div style={{ position: 'relative' }}>
                    <img 
                      src={employee.avatar} 
                      alt={employee.name} 
                      style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(255,255,255,0.1)' }}
                      onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&h=120&q=80"; }}
                    />
                    <span style={{ position: 'absolute', bottom: '0px', right: '0px', width: '10px', height: '10px', borderRadius: '50%', background: '#10b981', border: '2px solid var(--bg-card)' }} />
                  </div>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '0.92rem', fontWeight: 600, color: 'var(--text-main)' }}>{employee.name}</h4>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginTop: '0.1rem' }}>{employee.role}</span>
                    <span style={{ fontSize: '0.7rem', padding: '0.1rem 0.45rem', borderRadius: '8px', background: `${employee.deptColor}20`, color: employee.deptColor, fontWeight: 600, marginTop: '0.25rem', display: 'inline-block' }}>
                      {employee.dept}
                    </span>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{employee.joined}</span>
                  <ChevronRight size={16} color="var(--text-muted)" style={{ display: 'block', marginLeft: 'auto', marginTop: '0.25rem' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Enterprise Benefits & Policy Spotlights Cards */}
      <div style={{ marginTop: '0.5rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Sparkles size={18} color="var(--primary-color)" /> Official Workplace Policy Spotlights
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {[
            {
              title: "Annual Paid Leave",
              desc: "Full-time personnel receive 20 days paid leave annually. Auto-approved for 1-3 days.",
              tag: "20 Days / Year",
              image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80",
              category: "Leave Policy"
            },
            {
              title: "Hybrid & Remote Work",
              desc: "Employees may work remotely up to 2 days per week with manager approval. Core hours 10 AM - 3 PM.",
              tag: "2 Days / Week WFH",
              image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=600&q=80",
              category: "Workplace Flex"
            },
            {
              title: "Health & Medical Leave",
              desc: "10 paid sick days per year. Extended medical leave (> 3 days) routes directly to HITL Manager review.",
              tag: "10 Paid Days",
              image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=600&q=80",
              category: "Health & Wellness"
            }
          ].map((item, idx) => (
            <div 
              key={idx} 
              style={{ 
                background: 'var(--bg-dark)', 
                border: '1px solid var(--border-color)', 
                borderRadius: 'var(--radius-lg)', 
                overflow: 'hidden', 
                boxShadow: 'var(--panel-shadow)',
                transition: 'all 0.3s ease'
              }}
              className="hover-lift"
            >
              <div style={{ height: '140px', overflow: 'hidden', position: 'relative' }}>
                <img 
                  src={item.image} 
                  alt={item.title} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 40%, rgba(2, 6, 23, 0.9) 100%)' }} />
                <span style={{ position: 'absolute', top: '12px', left: '12px', padding: '0.25rem 0.65rem', borderRadius: '12px', background: 'rgba(2, 6, 23, 0.75)', border: '1px solid rgba(255,255,255,0.15)', fontSize: '0.72rem', fontWeight: 600, color: '#fff', backdropFilter: 'blur(8px)' }}>
                  {item.category}
                </span>
                <span style={{ position: 'absolute', bottom: '10px', right: '12px', padding: '0.2rem 0.55rem', borderRadius: '8px', background: 'rgba(99, 102, 241, 0.9)', fontSize: '0.72rem', fontWeight: 700, color: '#fff' }}>
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
