import { useState } from 'react';
import { Send, Paperclip, Sparkles } from 'lucide-react';
import { useChat } from '../../context/ChatContext';

export default function ChatInput() {
  const [input, setInput] = useState('');
  const { sendMessage, isProcessing, inputPlaceholder, samplePrompts } = useChat();

  const handleSend = (textToSend) => {
    const query = (textToSend || input).trim();
    if (query && !isProcessing) {
      sendMessage(query);
      if (!textToSend) setInput('');
    }
  };

  return (
    <div style={{ padding: '1rem 1.5rem 1.25rem', borderTop: '1px solid var(--border-color)', background: 'rgba(2, 6, 23, 0.5)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      {/* Role-Specific Sample Prompt Chips */}
      {samplePrompts && samplePrompts.length > 0 && (
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem', marginRight: '0.25rem' }}>
            <Sparkles size={13} color="var(--primary-color)" /> Suggestions:
          </span>
          {samplePrompts.map((promptText, i) => (
            <button
              key={i}
              onClick={() => handleSend(promptText)}
              disabled={isProcessing}
              style={{
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-main)',
                borderRadius: '16px',
                padding: '0.3rem 0.75rem',
                fontSize: '0.78rem',
                cursor: isProcessing ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap',
                opacity: isProcessing ? 0.5 : 1
              }}
              className="hover-lift"
              onMouseEnter={(e) => {
                if (!isProcessing) {
                  e.currentTarget.style.background = 'rgba(99, 102, 241, 0.15)';
                  e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.4)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isProcessing) {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                  e.currentTarget.style.borderColor = 'var(--border-color)';
                }
              }}
            >
              💬 {promptText}
            </button>
          ))}
        </div>
      )}

      {/* Input Field Bar */}
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', background: 'var(--bg-darker)', padding: '0.6rem', borderRadius: 'var(--radius-full)', border: '1px solid var(--glass-border)', boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.2)' }}>
        <button style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', padding: '0.6rem', cursor: 'pointer', borderRadius: '50%', outline: 'none' }} className="hover-lift">
          <Paperclip size={22} />
        </button>
        <input
          type="text"
          placeholder={isProcessing ? "Agent is processing..." : (inputPlaceholder || "Ask anything...")}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          disabled={isProcessing}
          style={{ flex: 1, background: 'transparent', border: 'none', color: 'var(--text-main)', outline: 'none', fontSize: '1rem', opacity: isProcessing ? 0.5 : 1 }}
        />
        <button onClick={() => handleSend()} disabled={isProcessing || !input.trim()} style={{ background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))', color: 'white', border: 'none', width: '44px', height: '44px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: 'var(--accent-glow)', opacity: (isProcessing || !input.trim()) ? 0.5 : 1 }} className={(!isProcessing && input.trim()) ? "hover-lift" : ""}>
          <Send size={18} style={{ transform: 'translateX(2px)' }} />
        </button>
      </div>
    </div>
  );
}
