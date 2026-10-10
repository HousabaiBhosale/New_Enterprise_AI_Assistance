import { useState } from 'react';
import { Send, Paperclip } from 'lucide-react';
import { useChat } from '../../context/ChatContext';

export default function ChatInput() {
  const [input, setInput] = useState('');
  const { sendMessage, isProcessing } = useChat();

  const handleSend = () => {
    if (input.trim() && !isProcessing) {
      sendMessage(input);
      setInput('');
    }
  };

  return (
    <div style={{ padding: '1.5rem', borderTop: '1px solid var(--border-color)', background: 'rgba(2, 6, 23, 0.4)' }}>
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', background: 'var(--bg-darker)', padding: '0.6rem', borderRadius: 'var(--radius-full)', border: '1px solid var(--glass-border)', boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.2)' }}>
        <button style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', padding: '0.6rem', cursor: 'pointer', borderRadius: '50%', outline: 'none' }} className="hover-lift">
          <Paperclip size={22} />
        </button>
        <input
          type="text"
          placeholder={isProcessing ? "Agent is processing..." : "Ask anything..."}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          disabled={isProcessing}
          style={{ flex: 1, background: 'transparent', border: 'none', color: 'var(--text-main)', outline: 'none', fontSize: '1.05rem', opacity: isProcessing ? 0.5 : 1 }}
        />
        <button onClick={handleSend} disabled={isProcessing || !input.trim()} style={{ background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))', color: 'white', border: 'none', width: '46px', height: '46px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: 'var(--accent-glow)', opacity: (isProcessing || !input.trim()) ? 0.5 : 1 }} className={(!isProcessing && input.trim()) ? "hover-lift" : ""}>
          <Send size={20} style={{ transform: 'translateX(2px)' }} />
        </button>
      </div>
    </div>
  );
}
