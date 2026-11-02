import { Shield, Settings, Server, Users, ShieldAlert, KeyRound, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

export default function AdminDashboard() {
  const { isLight } = useTheme();
  const adminModules = [
    {
      title: 'Audit Trail & Logs',
      desc: 'Inspect tamper-evident records of agent actions, tool calls, and user queries',
      icon: ShieldAlert,
      link: '/admin/audit-logs',
      color: '#ef4444'
    },
    {
      title: 'Enterprise Users',
      desc: 'Manage active user credentials, assigned departments, and roles',
      icon: Users,
      link: '/admin/users',
      color: '#3b82f6'
    },
    {
      title: 'Role-Based Access (RBAC)',
      desc: 'Define security scope for Executive, HR, Sales, Support, and Employees',
      icon: ShieldCheck,
      link: '/admin/roles',
      color: '#10b981'
    },
    {
      title: 'Permission Matrix',
      desc: 'Configure tool-level and endpoint authorization controls across roles',
      icon: KeyRound,
      link: '/admin/permissions',
      color: '#8b5cf6'
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Visual Header Banner */}
      <div style={{
        background: isLight 
          ? 'linear-gradient(135deg, rgba(254, 242, 242, 0.96) 0%, rgba(238, 242, 255, 0.94) 50%, rgba(240, 253, 250, 0.96) 100%), url("https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80") center/cover no-repeat'
          : 'linear-gradient(135deg, rgba(239, 68, 68, 0.25) 0%, rgba(99, 102, 241, 0.22) 50%, rgba(13, 148, 136, 0.18) 100%), url("https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80") center/cover no-repeat',
        borderRadius: 'var(--radius-lg)',
        border: isLight ? '1px solid rgba(239, 68, 68, 0.35)' : '1px solid rgba(239, 68, 68, 0.35)',
        padding: '2.2rem 2.5rem',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: isLight ? '0 16px 40px -10px rgba(15, 23, 42, 0.08)' : 'var(--panel-shadow)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1.5rem',
        transition: 'all 0.3s ease'
      }}>
        <div style={{ 
          position: 'absolute', 
          inset: 0, 
          background: isLight 
            ? 'linear-gradient(90deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.82) 60%, rgba(255, 255, 255, 0.45) 100%)' 
            : 'linear-gradient(90deg, rgba(2, 6, 23, 0.94) 0%, rgba(2, 6, 23, 0.82) 60%, rgba(2, 6, 23, 0.5) 100%)', 
          pointerEvents: 'none' 
        }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: '680px' }}>
          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '0.45rem', 
            padding: '0.35rem 0.85rem', 
            borderRadius: 'var(--radius-full)', 
            background: isLight ? 'rgba(239, 68, 68, 0.12)' : 'rgba(239, 68, 68, 0.2)', 
            border: isLight ? '1px solid rgba(239, 68, 68, 0.35)' : '1px solid rgba(239, 68, 68, 0.4)', 
            color: isLight ? '#dc2626' : '#f87171', 
            fontSize: '0.8rem', 
            fontWeight: 700, 
            marginBottom: '0.75rem' 
          }}>
            <Sparkles size={14} color={isLight ? '#dc2626' : '#f87171'} /> Platform Governance & Zero Trust Security
          </div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: '800', marginBottom: '0.5rem', color: isLight ? '#0f172a' : '#fff', letterSpacing: '-0.5px' }}>
            System Administration
          </h1>
          <p style={{ color: isLight ? '#475569' : 'var(--text-sub)', fontSize: '0.96rem', lineHeight: 1.6, margin: 0 }}>
            Global platform governance, tamper-evident audit trails, role-based access control (RBAC), and agent microservice orchestration.
          </p>
        </div>

        <div style={{ position: 'relative', zIndex: 1, display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <div style={{ 
            background: isLight ? '#ffffff' : 'rgba(2, 6, 23, 0.85)', 
            border: isLight ? '1px solid rgba(16, 185, 129, 0.35)' : '1px solid rgba(16, 185, 129, 0.4)', 
            padding: '0.6rem 1.1rem', 
            borderRadius: 'var(--radius-md)', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem', 
            color: isLight ? '#047857' : '#34d399', 
            fontSize: '0.85rem', 
            fontWeight: 700,
            boxShadow: isLight ? '0 4px 15px rgba(16, 185, 129, 0.12)' : 'none'
          }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981' }}></span>
            Cluster: 4 Agents Healthy
          </div>
        </div>
      </div>

      {/* Admin Modules Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
        {adminModules.map((mod, i) => (
          <Link
            key={i}
            to={mod.link}
            style={{
              textDecoration: 'none',
              background: 'var(--bg-dark)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-lg)',
              padding: '1.75rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '1.25rem',
              color: 'var(--text-main)',
              transition: 'all 0.2s',
              boxShadow: 'var(--panel-shadow)'
            }}
            className="hover-lift"
          >
            <div>
              <div style={{ width: 48, height: 48, borderRadius: '12px', background: `${mod.color}20`, border: `1px solid ${mod.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                <mod.icon size={24} color={mod.color} />
              </div>
              <h3 style={{ margin: '0 0 0.4rem 0', fontSize: '1.2rem', fontWeight: 700 }}>{mod.title}</h3>
              <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>{mod.desc}</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary-color)', fontSize: '0.88rem', fontWeight: 600 }}>
              Access Module <ArrowRight size={16} />
            </div>
          </Link>
        ))}
      </div>

      <div style={{ background: 'var(--bg-dark)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '2rem', boxShadow: 'var(--panel-shadow)' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', fontWeight: 700 }}>Active Agent Microservices</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {[
            { name: 'Coordinator Agent (Supervisor)', role: 'Intent Parsing & Dynamic Routing', framework: 'LangGraph' },
            { name: 'HR Agent Worker', role: 'Leave Management & Policy Ingestion', framework: 'LangChain ReAct' },
            { name: 'Sales Agent Worker', role: 'Revenue Queries & Transaction Execution', framework: 'LangChain ReAct' },
            { name: 'Customer Support Agent', role: 'Ticket Triage & Human Escalations', framework: 'LangChain ReAct' },
            { name: 'Qdrant Vector Engine', role: 'BGE Semantic Embeddings (Cosine 384-d)', framework: 'FastEmbed / Qdrant' },
          ].map((agent, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>
              <div>
                <span style={{ fontWeight: 700, display: 'block', fontSize: '1rem', color: '#fff' }}>{agent.name}</span>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{agent.role}</span>
              </div>
              <span style={{ background: 'rgba(16, 185, 129, 0.12)', color: '#34d399', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '0.25rem 0.85rem', borderRadius: 'var(--radius-full)', fontSize: '0.8rem', fontWeight: 700 }}>
                {agent.framework}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
