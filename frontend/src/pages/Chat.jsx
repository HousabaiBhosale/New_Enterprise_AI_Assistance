import { Bot, Settings2, ShieldCheck, Sparkles } from 'lucide-react';
import { ChatProvider, useChat } from '../context/ChatContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import ChatMessage from '../components/chat/ChatMessage';
import ChatInput from '../components/chat/ChatInput';
import WorkflowTimeline from '../components/chat/WorkflowTimeline';
import { useRef, useEffect } from 'react';

function ChatInterface() {
  const { messages, sendMessage, isProcessing } = useChat();
  const { user } = useAuth();
  const { isLight } = useTheme();
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
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        background: isLight ? '#ffffff' : 'var(--bg-dark)', 
        borderRadius: 'var(--radius-lg)', 
        border: isLight ? '1px solid rgba(226, 232, 240, 0.95)' : '1px solid var(--border-color)', 
        overflow: 'hidden', 
        boxShadow: isLight ? '0 10px 30px -5px rgba(15, 23, 42, 0.06)' : 'var(--panel-shadow)',
        transition: 'all 0.3s ease'
      }}>
        {/* Chat Header */}
        <div style={{ 
          padding: '1.25rem 1.5rem', 
          borderBottom: isLight ? '1px solid rgba(226, 232, 240, 0.95)' : '1px solid var(--border-color)', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          background: isLight ? 'rgba(248, 250, 252, 0.95)' : 'rgba(2, 6, 23, 0.4)' 
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg, var(--secondary-color), var(--primary-color))', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 15px rgba(99, 102, 241, 0.3)' }}>
              <Bot size={22} color="white" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.15rem', fontWeight: '700', color: isLight ? '#0f172a' : 'var(--text-main)', margin: 0 }}>
                {role === 'admin' ? 'Enterprise Multi-Agent Coordinator' :
                 role === 'hr' ? 'HR Sentinel AI Assistant' :
                 role === 'sales' ? 'Sales & Revenue Copilot' :
                 role === 'support' || role === 'staff' ? 'Helpdesk & Support Assistant' :
                 'Employee Self-Service Assistant'}
              </h2>
              <span style={{ fontSize: '0.8rem', color: isLight ? '#059669' : '#10b981', display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 600 }}>
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
              background: role === 'admin' ? (isLight ? 'rgba(99, 102, 241, 0.12)' : 'rgba(99, 102, 241, 0.15)') :
                          role === 'hr' ? (isLight ? 'rgba(168, 85, 247, 0.12)' : 'rgba(139, 92, 246, 0.15)') :
                          role === 'sales' ? (isLight ? 'rgba(16, 185, 129, 0.12)' : 'rgba(16, 185, 129, 0.15)') :
                          role === 'support' || role === 'staff' ? (isLight ? 'rgba(245, 158, 11, 0.12)' : 'rgba(245, 158, 11, 0.15)') : (isLight ? 'rgba(37, 99, 235, 0.12)' : 'rgba(59, 130, 246, 0.15)'),
              color: role === 'admin' ? (isLight ? '#4f46e5' : '#818cf8') :
                     role === 'hr' ? (isLight ? '#9333ea' : '#a78bfa') :
                     role === 'sales' ? (isLight ? '#059669' : '#34d399') :
                     role === 'support' || role === 'staff' ? (isLight ? '#d97706' : '#fbbf24') : (isLight ? '#1d4ed8' : '#60a5fa'),
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
            <button style={{ 
              border: isLight ? '1px solid rgba(203, 213, 225, 0.9)' : '1px solid var(--border-color)', 
              borderRadius: 'var(--radius-md)', 
              padding: '0.6rem', 
              color: isLight ? '#0f172a' : 'var(--text-main)', 
              cursor: 'pointer', 
              background: isLight ? '#ffffff' : 'rgba(255,255,255,0.05)',
              boxShadow: isLight ? '0 2px 6px rgba(15, 23, 42, 0.05)' : 'none'
            }} className="hover-lift">
              <Settings2 size={18} />
            </button>
          </div>
        </div>

        {/* Message Thread Scroll Area */}
        <div style={{ flex: 1, padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.5rem', background: isLight ? '#ffffff' : 'transparent' }}>
          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}

          {/* Quick Suggested Prompt Cards when conversation starts */}
          {messages.length <= 1 && (
            <div style={{ marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: isLight ? '#475569' : 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>
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
                      background: isLight ? '#f8fafc' : 'rgba(255, 255, 255, 0.03)',
                      border: isLight ? '1px solid rgba(226, 232, 240, 0.95)' : '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-md)',
                      padding: '1rem',
                      color: isLight ? '#0f172a' : 'var(--text-main)',
                      cursor: isProcessing ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      gap: '0.5rem',
                      transition: 'all 0.2s ease',
                      boxShadow: isLight ? '0 2px 6px rgba(15, 23, 42, 0.03)' : 'none'
                    }}
                    className="hover-lift"
                    onMouseEnter={(e) => {
                      if (!isProcessing) {
                        e.currentTarget.style.background = isLight ? 'rgba(37, 99, 235, 0.06)' : 'rgba(99, 102, 241, 0.1)';
                        e.currentTarget.style.borderColor = isLight ? '#2563eb' : 'rgba(99, 102, 241, 0.4)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isProcessing) {
                        e.currentTarget.style.background = isLight ? '#f8fafc' : 'rgba(255, 255, 255, 0.03)';
                        e.currentTarget.style.borderColor = isLight ? 'rgba(226, 232, 240, 0.95)' : 'var(--border-color)';
                      }
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                        <span style={{ fontSize: '0.78rem', color: 'var(--primary-color)', fontWeight: 700 }}>{item.category}</span>
                        <span style={{ fontSize: '0.7rem', padding: '0.15rem 0.45rem', borderRadius: '10px', background: isLight ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.06)', color: isLight ? '#64748b' : 'var(--text-muted)', fontWeight: 600 }}>{item.badge}</span>
                      </div>
                      <p style={{ margin: 0, fontWeight: 700, fontSize: '0.9rem', color: isLight ? '#0f172a' : 'var(--text-main)' }}>"{item.prompt}"</p>
                    </div>
                    <span style={{ fontSize: '0.75rem', color: isLight ? '#475569' : 'var(--text-muted)', lineHeight: 1.35 }}>{item.desc}</span>
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
