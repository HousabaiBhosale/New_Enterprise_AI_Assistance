import { Bot } from 'lucide-react';
import React from 'react';
import { useTheme } from '../../context/ThemeContext';

export default function ChatMessage({ message }) {
  const isUser = message.type === 'user';
  const { isLight } = useTheme();

  // Custom simple markdown-like renderer for mock responses
  const renderText = (text) => {
    return text.split('\n').map((line, i) => (
      <React.Fragment key={i}>
        <span dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>') }} />
        {i !== text.split('\n').length - 1 && <br />}
      </React.Fragment>
    ));
  };

  if (isUser) {
    return (
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.85rem' }}>
        <div style={{ 
          background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', 
          color: 'white', 
          padding: '1.15rem 1.4rem', 
          borderRadius: '1.25rem 1.25rem 0 1.25rem', 
          maxWidth: '75%', 
          boxShadow: '0 4px 16px rgba(37, 99, 235, 0.28)', 
          fontSize: '0.95rem', 
          lineHeight: '1.5' 
        }}>
          {message.text}
        </div>
        <img 
          src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&h=80&q=80" 
          alt="User Profile" 
          style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(37, 99, 235, 0.5)', flexShrink: 0 }}
          onError={(e) => { e.currentTarget.style.display = 'none'; }}
        />
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'flex-start', gap: '0.85rem' }} className="animate-fade-in">
      <div style={{ 
        width: '38px', 
        height: '38px', 
        borderRadius: '50%', 
        background: 'linear-gradient(135deg, #a855f7, #6366f1)', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        flexShrink: 0, 
        boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)', 
        border: '2px solid rgba(255,255,255,0.2)' 
      }}>
        <Bot size={20} color="white" />
      </div>
      <div style={{ 
        background: isLight ? '#f8fafc' : 'var(--bg-card)', 
        border: isLight ? '1px solid rgba(226, 232, 240, 0.95)' : '1px solid var(--glass-border)', 
        color: isLight ? '#0f172a' : 'var(--text-main)', 
        padding: '1.25rem 1.5rem', 
        borderRadius: '1.25rem 1.25rem 1.25rem 0', 
        maxWidth: '80%', 
        boxShadow: isLight ? '0 2px 8px rgba(15, 23, 42, 0.04)' : 'var(--panel-shadow)', 
        fontSize: '0.95rem', 
        lineHeight: '1.6' 
      }}>
        {renderText(message.text)}
      </div>
    </div>
  );
}
