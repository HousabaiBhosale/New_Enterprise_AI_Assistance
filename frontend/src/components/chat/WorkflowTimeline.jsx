import { Settings2, CheckCircle2, Clock, Bot, Activity } from 'lucide-react';
import { useChat } from '../../context/ChatContext';
import { useTheme } from '../../context/ThemeContext';

export default function WorkflowTimeline() {
  const { isProcessing, activeAgent, workflowSteps } = useChat();
  const { isLight } = useTheme();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', overflowY: 'auto', height: '100%' }}>
      <div className="glass-panel" style={{ 
        padding: '1.75rem', 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '1rem',
        background: isLight ? '#ffffff' : 'var(--bg-card)',
        border: isLight ? '1px solid rgba(226, 232, 240, 0.95)' : '1px solid var(--border-color)',
        boxShadow: isLight ? '0 10px 30px -5px rgba(15, 23, 42, 0.06)' : 'var(--panel-shadow)',
        transition: 'all 0.3s ease'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: isLight ? '1px solid rgba(226, 232, 240, 0.9)' : '1px solid var(--border-color)', paddingBottom: '1rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: isLight ? '#0f172a' : 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
            <Settings2 size={18} color="var(--primary-color)" /> Multi-Agent Workflow
          </h3>
          <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.6rem', borderRadius: '12px', background: isLight ? 'rgba(37, 99, 235, 0.1)' : 'rgba(99,102,241,0.15)', color: isLight ? '#1d4ed8' : 'var(--primary-color)', fontWeight: 700 }}>
            LangGraph
          </span>
        </div>

        <div style={{ 
          background: isLight ? '#f8fafc' : 'rgba(255,255,255,0.02)', 
          padding: '0.85rem 1.1rem', 
          borderRadius: 'var(--radius-md)', 
          border: isLight ? '1px solid rgba(226, 232, 240, 0.95)' : '1px solid var(--glass-border)', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.75rem',
          boxShadow: isLight ? '0 1px 3px rgba(15, 23, 42, 0.04)' : 'none'
        }}>
          <Bot size={18} color="#10b981" />
          <div style={{ fontSize: '0.85rem' }}>
            <span style={{ color: isLight ? '#64748b' : 'var(--text-muted)' }}>Active Node: </span>
            <strong style={{ color: isLight ? '#0f172a' : 'var(--text-main)', fontWeight: 700 }}>{activeAgent}</strong>
          </div>
        </div>

        {isProcessing ? (
          <div style={{ padding: '2.5rem 1rem', textAlign: 'center', color: isLight ? '#64748b' : 'var(--text-muted)' }}>
            <Activity className="animate-pulse" size={32} color="var(--primary-color)" style={{ margin: '0 auto 1rem' }} />
            <p style={{ fontWeight: 700, color: isLight ? '#0f172a' : 'var(--text-main)', marginBottom: '0.3rem' }}>Agent Reasoning in Progress...</p>
            <span style={{ fontSize: '0.8rem' }}>Querying Qdrant vector database & routing tools</span>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '0.5rem' }}>
            {workflowSteps.map((step, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', flexShrink: 0, boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)' }}>
                    <CheckCircle2 size={14} />
                  </div>
                  {idx < workflowSteps.length - 1 && (
                    <div style={{ width: '2px', height: '32px', background: isLight ? 'rgba(16, 185, 129, 0.25)' : 'rgba(16, 185, 129, 0.3)', marginTop: '4px' }}></div>
                  )}
                </div>
                <div>
                  <p style={{ fontWeight: '700', fontSize: '0.9rem', color: isLight ? '#0f172a' : 'var(--text-main)', margin: 0 }}>{step.name}</p>
                  <p style={{ fontSize: '0.8rem', color: isLight ? '#475569' : 'var(--text-muted)', margin: '0.2rem 0 0 0', lineHeight: 1.4 }}>{step.detail}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
