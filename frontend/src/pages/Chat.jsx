import { Bot, Settings2 } from 'lucide-react';
import { ChatProvider, useChat } from '../context/ChatContext';
import ChatMessage from '../components/chat/ChatMessage';
import ChatInput from '../components/chat/ChatInput';
import WorkflowTimeline from '../components/chat/WorkflowTimeline';
import { useRef, useEffect } from 'react';

function ChatInterface() {
  const { messages } = useChat();
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
              <h2 style={{ fontSize: '1.15rem', fontWeight: '600' }}>Enterprise AI Assistant</h2>
              <span style={{ fontSize: '0.8rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981' }}></span> Online and ready
              </span>
            </div>
          </div>
          <button style={{ border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '0.6rem', color: 'var(--text-main)', cursor: 'pointer', background: 'rgba(255,255,255,0.05)' }} className="hover-lift">
            <Settings2 size={18} />
          </button>
        </div>

        <div style={{ flex: 1, padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}
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
