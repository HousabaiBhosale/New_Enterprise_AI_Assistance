import { Bot } from 'lucide-react';
import React from 'react';

export default function ChatMessage({ message }) {
  const isUser = message.type === 'user';

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
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
        <div style={{ background: 'var(--primary-color)', color: 'white', padding: '1.15rem 1.4rem', borderRadius: '1.25rem 1.25rem 0 1.25rem', maxWidth: '75%', boxShadow: '0 8px 20px rgba(99, 102, 241, 0.25)', fontSize: '0.95rem', lineHeight: '1.5' }}>
          {message.text}
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'flex-start', gap: '1rem' }} className="animate-fade-in">
      <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--secondary-color), var(--primary-color))', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: 'var(--accent-glow)' }}>
        <Bot size={18} color="white" />
      </div>
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--glass-border)', color: 'var(--text-main)', padding: '1.25rem 1.5rem', borderRadius: '1.25rem 1.25rem 1.25rem 0', maxWidth: '80%', boxShadow: 'var(--panel-shadow)', fontSize: '0.95rem', lineHeight: '1.6' }}>
        {renderText(message.text)}
      </div>
    </div>
  );
}
