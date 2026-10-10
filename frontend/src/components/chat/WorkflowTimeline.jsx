import { Settings2 } from 'lucide-react';
import { useChat } from '../../context/ChatContext';

export default function WorkflowTimeline() {
  const { isProcessing } = useChat();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', overflowY: 'auto', height: '100%' }}>
      <div className="glass-panel" style={{ padding: '1.75rem', flex: 1 }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: '600', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Settings2 size={18} color="var(--primary-color)" /> Agent Workflow
        </h3>

        {isProcessing ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            <div className="animate-pulse" style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary-color)', margin: '0 auto 1rem', opacity: 0.5 }}></div>
            Agent is currently executing tasks...
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            <div style={{ display: 'flex', gap: '1.2rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 12px rgba(16, 185, 129, 0.4)' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </div>
                <div style={{ width: '2px', height: '35px', background: '#10b981' }}></div>
              </div>
              <div style={{ paddingBottom: '0.5rem' }}>
                <p style={{ fontWeight: '600', fontSize: '0.95rem' }}>Database Query: Q3 Enterprise</p>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>Found 4,203 matching records in 142ms.</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1.2rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'transparent', border: '2px solid var(--primary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 10px rgba(99, 102, 241, 0.3)' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--primary-color)' }}></div>
                </div>
                <div style={{ width: '2px', height: '50px', background: 'var(--glass-border)' }}></div>
              </div>
              <div style={{ paddingBottom: '0.5rem', width: '100%' }}>
                <p style={{ fontWeight: '600', fontSize: '0.95rem' }}>Data Aggregation & NLP</p>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>Calculating YoY variations...</p>
                <div style={{ marginTop: '0.75rem', width: '100%', height: '6px', background: 'var(--bg-darker)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: '65%', height: '100%', background: 'linear-gradient(90deg, var(--primary-color), var(--secondary-color))', transition: 'width 0.3s' }}></div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1.2rem', opacity: 0.5 }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'transparent', border: '2px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                </div>
              </div>
              <div style={{ paddingBottom: '0.5rem' }}>
                <p style={{ fontWeight: '500', fontSize: '0.95rem' }}>PDF Report Generation</p>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>Pending user approval...</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
