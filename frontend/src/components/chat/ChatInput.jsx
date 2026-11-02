import { useState } from 'react';
import { Send, Paperclip, Sparkles } from 'lucide-react';
import { useChat } from '../../context/ChatContext';
import { useTheme } from '../../context/ThemeContext';

export default function ChatInput() {
  const [input, setInput] = useState('');
  const { sendMessage, isProcessing, inputPlaceholder, samplePrompts } = useChat();
  const { isLight } = useTheme();

  const handleSend = (textToSend) => {
    const query = (textToSend || input).trim();
    if (query && !isProcessing) {
      sendMessage(query);
      if (!textToSend) setInput('');
    }
  };

  return (
    <div style={{ 
      padding: '1rem 1.5rem 1.25rem', 
      borderTop: isLight ? '1px solid rgba(226, 232, 240, 0.95)' : '1px solid var(--border-color)', 
      background: isLight ? 'rgba(248, 250, 252, 0.95)' : 'rgba(2, 6, 23, 0.5)', 
      display: 'flex', 
      flexDirection: 'column', 
      gap: '0.75rem',
      transition: 'all 0.3s ease'
    }}>
      {/* Role-Specific Sample Prompt Chips */}
      {samplePrompts && samplePrompts.length > 0 && (
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: '0.75rem', color: isLight ? '#475569' : 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem', marginRight: '0.25rem', fontWeight: 600 }}>
            <Sparkles size={13} color="var(--primary-color)" /> Suggestions:
          </span>
          {samplePrompts.map((promptText, i) => (
            <button
              key={i}
              onClick={() => handleSend(promptText)}
              disabled={isProcessing}
              style={{
                background: isLight ? '#ffffff' : 'rgba(255, 255, 255, 0.04)',
                border: isLight ? '1px solid rgba(203, 213, 225, 0.95)' : '1px solid var(--border-color)',
                color: isLight ? '#0f172a' : 'var(--text-main)',
                borderRadius: '16px',
                padding: '0.35rem 0.8rem',
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: isProcessing ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap',
                opacity: isProcessing ? 0.5 : 1,
                boxShadow: isLight ? '0 1px 3px rgba(15, 23, 42, 0.05)' : 'none'
              }}
              className="hover-lift"
              onMouseEnter={(e) => {
                if (!isProcessing) {
                  e.currentTarget.style.background = isLight ? 'rgba(37, 99, 235, 0.08)' : 'rgba(99, 102, 241, 0.15)';
                  e.currentTarget.style.borderColor = isLight ? '#2563eb' : 'rgba(99, 102, 241, 0.4)';
                  if (isLight) e.currentTarget.style.color = '#1d4ed8';
                }
              }}
              onMouseLeave={(e) => {
                if (!isProcessing) {
                  e.currentTarget.style.background = isLight ? '#ffffff' : 'rgba(255, 255, 255, 0.04)';
                  e.currentTarget.style.borderColor = isLight ? 'rgba(203, 213, 225, 0.95)' : 'var(--border-color)';
                  if (isLight) e.currentTarget.style.color = '#0f172a';
                }
              }}
            >
              💬 {promptText}
            </button>
          ))}
        </div>
      )}

      {/* Input Field Bar */}
      <div style={{ 
        display: 'flex', 
        gap: '1rem', 
        alignItems: 'center', 
        background: isLight ? '#ffffff' : 'var(--bg-darker)', 
        padding: '0.6rem 0.85rem', 
        borderRadius: 'var(--radius-full)', 
        border: isLight ? '1.5px solid rgba(203, 213, 225, 0.95)' : '1px solid var(--glass-border)', 
        boxShadow: isLight ? '0 2px 10px rgba(15, 23, 42, 0.04)' : 'inset 0 2px 10px rgba(0,0,0,0.2)',
        transition: 'all 0.2s ease'
      }}>
        <button style={{ background: 'transparent', border: 'none', color: isLight ? '#64748b' : 'var(--text-muted)', padding: '0.5rem', cursor: 'pointer', borderRadius: '50%', outline: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }} className="hover-lift">
          <Paperclip size={20} />
        </button>
        <input
          type="text"
          placeholder={isProcessing ? "Agent is processing..." : (inputPlaceholder || "Ask about your leave balance, company policies, or submit a request...")}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          disabled={isProcessing}
          style={{ 
            flex: 1, 
            background: 'transparent', 
            border: 'none', 
            color: isLight ? '#0f172a' : 'var(--text-main)', 
            outline: 'none', 
            fontSize: '0.94rem', 
            opacity: isProcessing ? 0.5 : 1 
          }}
        />
        <button 
          onClick={() => handleSend()} 
          disabled={isProcessing || !input.trim()} 
          style={{ 
            background: isLight ? 'linear-gradient(135deg, #2563eb, #1d4ed8)' : 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))', 
            color: 'white', 
            border: 'none', 
            width: '42px', 
            height: '42px', 
            borderRadius: '50%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            cursor: (isProcessing || !input.trim()) ? 'default' : 'pointer', 
            boxShadow: isLight ? '0 4px 14px rgba(37, 99, 235, 0.35)' : 'var(--accent-glow)', 
            opacity: (isProcessing || !input.trim()) ? 0.45 : 1,
            transition: 'all 0.2s ease'
          }} 
          className={(!isProcessing && input.trim()) ? "hover-lift" : ""}
        >
          <Send size={17} style={{ transform: 'translateX(1px)' }} />
        </button>
      </div>
    </div>
  );
}
