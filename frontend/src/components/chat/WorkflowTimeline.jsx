import { Settings2, CheckCircle2, Clock, Bot, Activity } from 'lucide-react';
import { useChat } from '../../context/ChatContext';

export default function WorkflowTimeline() {
  const { isProcessing, activeAgent, workflowSteps } = useChat();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', overflowY: 'auto', height: '100%' }}>
      <div className="glass-panel" style={{ padding: '1.75rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
            <Settings2 size={18} color="var(--primary-color)" /> Multi-Agent Workflow
          </h3>
          <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.6rem', borderRadius: '12px', background: 'rgba(99,102,241,0.15)', color: 'var(--primary-color)', fontWeight: 600 }}>
            LangGraph
          </span>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '0.8rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Bot size={18} color="#10b981" />
          <div style={{ fontSize: '0.85rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Active Node: </span>
            <strong style={{ color: 'var(--text-main)' }}>{activeAgent}</strong>
          </div>
        </div>

        {isProcessing ? (
          <div style={{ padding: '2.5rem 1rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            <Activity className="animate-pulse" size={32} color="var(--primary-color)" style={{ margin: '0 auto 1rem' }} />
            <p style={{ fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.3rem' }}>Agent Reasoning in Progress...</p>
            <span style={{ fontSize: '0.8rem' }}>Querying Qdrant vector database & routing tools</span>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '0.5rem' }}>
            {workflowSteps.map((step, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', flexShrink: 0 }}>
                    <CheckCircle2 size={14} />
                  </div>
                  {idx < workflowSteps.length - 1 && (
                    <div style={{ width: '2px', height: '32px', background: 'rgba(16, 185, 129, 0.3)', marginTop: '4px' }}></div>
                  )}
                </div>
                <div>
                  <p style={{ fontWeight: '600', fontSize: '0.9rem', margin: 0 }}>{step.name}</p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0.2rem 0 0 0' }}>{step.detail}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
