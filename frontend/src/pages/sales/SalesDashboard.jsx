import { useState, useEffect } from 'react';
import { TrendingUp, Target, DollarSign, Activity, ShoppingCart, Loader, Send, Sparkles } from 'lucide-react';
import { salesService } from '../../services/salesService';

export default function SalesDashboard() {
  const [stats, setStats] = useState({
    quarterly_revenue: 0,
    win_rate: 68,
    active_opportunities: 0,
    recent_orders: []
  });
  const [loading, setLoading] = useState(true);

  const [query, setQuery] = useState("");
  const [chatResponse, setChatResponse] = useState(null);
  const [chatLoading, setChatLoading] = useState(false);

  useEffect(() => {
    salesService.getStats()
      .then(data => setStats(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleAskSalesAI = async (customQuery) => {
    const q = customQuery || query;
    if (!q.trim()) return;
    setChatLoading(true);
    setChatResponse(null);
    try {
      const result = await salesService.askSalesQuestion(q);
      setChatResponse(result);
    } catch (error) {
      console.error("Failed to query Sales AI", error);
      setChatResponse({ response: "Error: Unable to reach the Sales AI backend." });
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Visual Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.28) 0%, rgba(5, 150, 105, 0.22) 50%, rgba(14, 165, 233, 0.15) 100%), url("https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80") center/cover no-repeat',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid rgba(16, 185, 129, 0.3)',
        padding: '2.2rem 2.5rem',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: 'var(--panel-shadow)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1.5rem'
      }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(2, 6, 23, 0.92) 0%, rgba(2, 6, 23, 0.75) 60%, rgba(2, 6, 23, 0.45) 100%)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: '650px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', padding: '0.3rem 0.8rem', borderRadius: 'var(--radius-full)', background: 'rgba(16, 185, 129, 0.2)', border: '1px solid rgba(16, 185, 129, 0.4)', color: '#34d399', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.75rem' }}>
            <Sparkles size={14} color="#34d399" /> Enterprise Revenue Intelligence & Playbook
          </div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: '800', marginBottom: '0.5rem', color: '#fff', letterSpacing: '-0.5px' }}>
            Sales & Commercial Operations
          </h1>
          <p style={{ color: 'var(--text-sub)', fontSize: '0.98rem', lineHeight: 1.6, margin: 0 }}>
            Real-time pipeline modeling, deal win rates, discount playbook compliance, and automated high-impact transaction processing.
          </p>
        </div>

        <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ padding: '0.65rem 1.25rem', background: 'rgba(2, 6, 23, 0.85)', border: '1px solid rgba(16, 185, 129, 0.4)', borderRadius: 'var(--radius-full)', fontSize: '0.88rem', fontWeight: 700, color: '#34d399', boxShadow: '0 4px 15px rgba(16, 185, 129, 0.15)' }}>
            💰 Total Revenue: ${Number(stats.quarterly_revenue || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
        <div style={{ background: 'var(--bg-dark)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '-10px', right: '-10px', opacity: 0.05 }}><DollarSign size={100} /></div>
          <p style={{ color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: 500 }}>Total Completed Revenue</p>
          <h3 style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
            {loading ? <Loader size={24} className="animate-spin" /> : `$${Number(stats.quarterly_revenue || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
          </h3>
          <span style={{ color: '#10b981', fontSize: '0.85rem', fontWeight: 600 }}>+12% vs last quarter</span>
        </div>
        <div style={{ background: 'var(--bg-dark)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '-10px', right: '-10px', opacity: 0.05 }}><Target size={100} /></div>
          <p style={{ color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: 500 }}>Win Rate</p>
          <h3 style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.5rem' }}>{stats.win_rate}%</h3>
          <span style={{ color: '#10b981', fontSize: '0.85rem', fontWeight: 600 }}>+4% powered by Sales AI</span>
        </div>
        <div style={{ background: 'var(--bg-dark)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '-10px', right: '-10px', opacity: 0.05 }}><Activity size={100} /></div>
          <p style={{ color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: 500 }}>Active Orders & Opps</p>
          <h3 style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
            {loading ? <Loader size={24} className="animate-spin" /> : stats.active_opportunities}
          </h3>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>Enterprise Accounts</span>
        </div>
      </div>

      {/* Interactive Agentic Sales Assistant Query Section */}
      <div style={{ background: 'var(--bg-dark)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
          <Sparkles size={20} color="#10b981" />
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Agentic Sales Copilot</h2>
          <span style={{ fontSize: '0.78rem', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', padding: '0.2rem 0.6rem', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
            Powered by Sales Agent (ReAct)
          </span>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>
          Ask real-time questions about sales revenue, customer orders, lead qualification, or company discount playbooks.
        </p>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <input 
            type="text" 
            placeholder="e.g., What is our total sales revenue and average deal size?" 
            style={{ flex: 1, padding: '0.85rem 1rem', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', color: 'var(--text-main)', fontSize: '0.95rem' }} 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAskSalesAI()}
          />
          <button 
            onClick={() => handleAskSalesAI()}
            disabled={chatLoading}
            style={{ background: '#10b981', color: 'white', border: 'none', padding: '0.85rem 1.5rem', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, cursor: chatLoading ? 'not-allowed' : 'pointer' }}
            className="hover-lift"
          >
            {chatLoading ? <Loader size={18} className="animate-spin" /> : <><Send size={18} /> Ask Sales AI</>}
          </button>
        </div>

        {/* Quick Suggestion Chips */}
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.85rem', flexWrap: 'wrap' }}>
          {[
            "What is our total sales revenue?",
            "What discount can we offer for orders over 100 units?",
            "Show summary of completed orders"
          ].map((promptText, i) => (
            <button
              key={i}
              onClick={() => { setQuery(promptText); handleAskSalesAI(promptText); }}
              style={{
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-muted)',
                borderRadius: '16px',
                padding: '0.35rem 0.8rem',
                fontSize: '0.8rem',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              className="hover-lift"
            >
              💬 {promptText}
            </button>
          ))}
        </div>

        {chatResponse && (
          <div style={{ marginTop: '1.25rem', padding: '1.25rem', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#10b981' }}>Sales Agent Answer:</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Live from PostgreSQL & Playbook RAG</span>
            </div>
            <div style={{ fontSize: '0.95rem', lineHeight: '1.6', color: 'var(--text-main)', whiteSpace: 'pre-wrap' }}>
              {chatResponse.response}
            </div>
          </div>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: '2rem' }}>
        <div style={{ background: 'var(--bg-dark)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Recent Executed Transactions</h2>
            <ShoppingCart size={18} color="var(--primary-color)" />
          </div>
          {loading ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading transactions...</div>
          ) : stats.recent_orders?.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No recent orders.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {stats.recent_orders.map((order) => (
                <div key={order.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.8rem 1rem', background: 'var(--bg-card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--glass-border)' }}>
                  <div>
                    <span style={{ fontWeight: 600 }}>Order #{order.id}</span>
                    <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)' }}>Customer #{order.customer_id}</span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontWeight: 700, color: '#10b981' }}>${order.amount?.toFixed(2)}</span>
                    <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)' }}>{order.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ background: 'var(--bg-dark)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '1.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>AI Lead Scoring</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
            {[
              { name: 'TechCorp Inc.', score: 98, sector: 'Cloud SaaS', logo: 'TC', color: '#6366f1' },
              { name: 'Global Networks', score: 96, sector: 'Telco Infra', logo: 'GN', color: '#10b981' },
              { name: 'CyberNet Defense', score: 94, sector: 'Cybersecurity', logo: 'CN', color: '#f59e0b' },
              { name: 'OmniSystems Global', score: 91, sector: 'FinTech', logo: 'OS', color: '#ec4899' },
            ].map((corp, index) => (
              <div key={index} style={{ padding: '0.9rem 1rem', background: 'var(--bg-card)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-md)' }} className="hover-lift">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: `${corp.color}25`, border: `1px solid ${corp.color}50`, color: corp.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.75rem' }}>
                      {corp.logo}
                    </div>
                    <div>
                      <span style={{ fontWeight: 600, fontSize: '0.92rem', display: 'block' }}>{corp.name}</span>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{corp.sector}</span>
                    </div>
                  </div>
                  <span style={{ color: '#10b981', fontWeight: 700, fontSize: '0.95rem' }}>{corp.score}%</span>
                </div>
                <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${corp.score}%`, height: '100%', background: 'linear-gradient(90deg, #10b981, #34d399)' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Enterprise Solutions & Product Spotlights */}
      <div style={{ marginTop: '0.5rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Sparkles size={18} color="#10b981" /> Featured Commercial Enterprise Solutions
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {[
            {
              title: "ResolveX AI Enterprise Cluster",
              desc: "Dedicated GPU multi-agent node orchestrating real-time LangGraph workflows and custom vector stores.",
              tag: "$4,500 / node",
              image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
              category: "Cloud Infrastructure"
            },
            {
              title: "Autonomous Agent Accelerator",
              desc: "High-throughput semantic reasoning module with integrated HITL manager review circuits.",
              tag: "$1,800 / seat",
              image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80",
              category: "Enterprise AI"
            },
            {
              title: "Quantum Defense Security Key",
              desc: "Zero-trust encrypted gateway ensuring RBAC boundary compliance and tamper-proof audit trails.",
              tag: "$950 / gateway",
              image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=600&q=80",
              category: "Zero Trust Security"
            }
          ].map((item, idx) => (
            <div 
              key={idx} 
              style={{ 
                background: 'var(--bg-dark)', 
                border: '1px solid var(--border-color)', 
                borderRadius: 'var(--radius-lg)', 
                overflow: 'hidden', 
                boxShadow: 'var(--panel-shadow)' 
              }}
              className="hover-lift"
            >
              <div style={{ height: '140px', overflow: 'hidden', position: 'relative' }}>
                <img 
                  src={item.image} 
                  alt={item.title} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 40%, rgba(2, 6, 23, 0.9) 100%)' }} />
                <span style={{ position: 'absolute', top: '12px', left: '12px', padding: '0.25rem 0.65rem', borderRadius: '12px', background: 'rgba(2, 6, 23, 0.75)', border: '1px solid rgba(255,255,255,0.15)', fontSize: '0.72rem', fontWeight: 600, color: '#fff', backdropFilter: 'blur(8px)' }}>
                  {item.category}
                </span>
                <span style={{ position: 'absolute', bottom: '10px', right: '12px', padding: '0.2rem 0.55rem', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.9)', fontSize: '0.72rem', fontWeight: 700, color: '#fff' }}>
                  {item.tag}
                </span>
              </div>
              <div style={{ padding: '1.25rem' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--text-main)' }}>{item.title}</h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
