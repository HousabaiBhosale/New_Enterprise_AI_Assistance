import { Bot, Settings2, ShieldCheck, Sparkles } from 'lucide-react';
import { ChatProvider, useChat } from '../context/ChatContext';
import { useAuth } from '../context/AuthContext';
import ChatMessage from '../components/chat/ChatMessage';
import ChatInput from '../components/chat/ChatInput';
import WorkflowTimeline from '../components/chat/WorkflowTimeline';
import { useRef, useEffect } from 'react';

function ChatInterface() {
  const { messages, sendMessage, isProcessing } = useChat();
  const { user } = useAuth();
  const role = (user?.role || 'admin').toLowerCase();
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) 380px', gap: '1.5rem', flex: 1, minHeight: 0, height: '100%' }}>
      {/* Main Chat Area */}
      <div style={{ display: 'flex', flexDirection: 'column', background: 'var(--bg-dark)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', overflow: 'hidden', boxShadow: 'var(--panel-shadow)' }}>
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(2, 6, 23, 0.4)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg, var(--secondary-color), var(--primary-color))', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--accent-glow)' }}>
              <Bot size={22} color="white" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.15rem', fontWeight: '600' }}>
                {role === 'admin' ? 'Enterprise Multi-Agent Coordinator' :
                 role === 'hr' ? 'HR Sentinel AI Assistant' :
                 role === 'sales' ? 'Sales & Revenue Copilot' :
                 role === 'support' || role === 'staff' ? 'Helpdesk & Support Assistant' :
                 'Employee Self-Service Assistant'}
              </h2>
              <span style={{ fontSize: '0.8rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981' }}></span> Online and ready
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              fontSize: '0.8rem',
              fontWeight: '600',
              padding: '0.4rem 0.85rem',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              background: role === 'admin' ? 'rgba(99, 102, 241, 0.15)' :
                          role === 'hr' ? 'rgba(139, 92, 246, 0.15)' :
                          role === 'sales' ? 'rgba(16, 185, 129, 0.15)' :
                          role === 'support' || role === 'staff' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(59, 130, 246, 0.15)',
              color: role === 'admin' ? '#818cf8' :
                     role === 'hr' ? '#a78bfa' :
                     role === 'sales' ? '#34d399' :
                     role === 'support' || role === 'staff' ? '#fbbf24' : '#60a5fa',
              border: `1px solid ${
                role === 'admin' ? 'rgba(99, 102, 241, 0.3)' :
                role === 'hr' ? 'rgba(139, 92, 246, 0.3)' :
                role === 'sales' ? 'rgba(16, 185, 129, 0.3)' :
                role === 'support' || role === 'staff' ? 'rgba(245, 158, 11, 0.3)' : 'rgba(59, 130, 246, 0.3)'
              }`
            }}>
              <ShieldCheck size={14} />
              <span>
                {role === 'admin' ? '👑 Admin: All Agents Authorized' :
                 role === 'hr' ? '👥 HR: HR Agent Only' :
                 role === 'sales' ? '📈 Sales: Sales Agent Only' :
                 role === 'support' || role === 'staff' ? '🎧 Helpdesk: Support Agent Only' :
                 '👤 Employee: Self-Service Scope'}
              </span>
            </div>
            <button style={{ border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '0.6rem', color: 'var(--text-main)', cursor: 'pointer', background: 'rgba(255,255,255,0.05)' }} className="hover-lift">
              <Settings2 size={18} />
            </button>
          </div>
        </div>

        <div style={{ flex: 1, padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}

          {/* Quick Suggested Prompt Cards when conversation starts */}
          {messages.length <= 1 && (
            <div style={{ marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>
                <Sparkles size={16} color="var(--primary-color)" /> Try asking the assistant:
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '0.85rem' }}>
                {[
                  {
                    category: '🌴 Leave & Time Off',
                    prompt: 'I want to apply for leave',
                    desc: 'Interactive step-by-step leave application (asks ID, days & reason one-by-one)',
                    badge: 'Step-by-Step'
                  },
                  {
                    category: '⚡ Quick Leave Request',
                    prompt: 'Apply leave for 2 days',
                    desc: 'Apply for short leave with guided slot-filling validation',
                    badge: 'Auto-Approve'
                  },
                  {
                    category: '👥 Check Leave Balance',
                    prompt: 'Check leave balance for employee 1',
                    desc: 'Inspect current paid leave entitlement from enterprise database',
                    badge: 'Database Tool'
                  },
                  {
                    category: '📜 Company Policy Q&A',
                    prompt: 'What is our company remote work policy and annual leave rules?',
                    desc: 'Grounded semantic RAG search over enterprise policy documents',
                    badge: 'Qdrant RAG'
                  },
                  {
                    category: '💰 Sales & Revenue',
                    prompt: 'What is our total completed sales revenue?',
                    desc: 'Query real-time sales transactions, average deal size, and win rate',
                    badge: 'Sales Analytics'
                  },
                  {
                    category: '🎧 Customer Helpdesk',
                    prompt: 'What is the status and priority of helpdesk ticket #1?',
                    desc: 'Inspect active helpdesk triage incidents and customer SLA status',
                    badge: 'Helpdesk Triage'
                  }
                ].map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => sendMessage(item.prompt)}
                    disabled={isProcessing}
                    style={{
                      textAlign: 'left',
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-md)',
                      padding: '1rem',
                      color: 'var(--text-main)',
                      cursor: isProcessing ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      gap: '0.5rem',
                      transition: 'all 0.2s ease'
                    }}
                    className="hover-lift"
                    onMouseEnter={(e) => {
                      if (!isProcessing) {
                        e.currentTarget.style.background = 'rgba(99, 102, 241, 0.1)';
                        e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.4)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isProcessing) {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                        e.currentTarget.style.borderColor = 'var(--border-color)';
                      }
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                        <span style={{ fontSize: '0.78rem', color: 'var(--primary-color)', fontWeight: 600 }}>{item.category}</span>
                        <span style={{ fontSize: '0.7rem', padding: '0.15rem 0.45rem', borderRadius: '10px', background: 'rgba(255,255,255,0.06)', color: 'var(--text-muted)' }}>{item.badge}</span>
                      </div>
                      <p style={{ margin: 0, fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-main)' }}>"{item.prompt}"</p>
                    </div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.3 }}>{item.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <ChatInput />
      </div>

      <WorkflowTimeline />
    </div>
  );
}

export default function Chat() {
  return (
    <ChatProvider>
      <ChatInterface />
    </ChatProvider>
  );
}
