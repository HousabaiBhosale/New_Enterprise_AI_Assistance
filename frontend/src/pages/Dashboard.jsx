import WelcomeCard from '../components/dashboard/WelcomeCard';
import StatsGrid from '../components/dashboard/StatsGrid';
import { Activity, Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

import ActivityChart from '../components/dashboard/ActivityChart';
import RecentActivity from '../components/dashboard/RecentActivity';

export default function Dashboard() {
  const { isLight } = useTheme();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '0.5rem' }}>Overview</h1>
          <p style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Activity size={16} />
            Real-time analytics and AI agent performance
          </p>
        </div>
        <Link to="/reports" className="hover-lift" style={{ textDecoration: 'none', background: 'var(--primary-color)', color: 'white', border: 'none', padding: '0.75rem 1.5rem', borderRadius: 'var(--radius-md)', fontWeight: '600', cursor: 'pointer', boxShadow: 'var(--accent-glow)' }}>
          Generate Report
        </Link>
      </header>

      <WelcomeCard />
      <StatsGrid />

      {/* Department Autonomous Hubs Visual Section */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sparkles size={18} color="var(--primary-color)" /> Specialized Autonomous Department Hubs
          </h2>
          <span style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 600 }}>● All 3 Agents Online</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {[
            {
              title: "HR & People Sentinel",
              desc: "Automated leave deductions, organizational compliance, and Qdrant employee policy retrieval.",
              path: "/hr",
              badge: "HR Agent Active",
              badgeColor: "#a855f7",
              image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80"
            },
            {
              title: "Sales & Commercial Copilot",
              desc: "Real-time transactional revenue calculations, discount playbooks, and high-value HITL order triggers.",
              path: "/sales",
              badge: "Sales Agent Active",
              badgeColor: "#10b981",
              image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=600&q=80"
            },
            {
              title: "Helpdesk & Support Sentinel",
              desc: "Incident categorization, 24/7 SLA escalation management, customer triage, and resolution SOP lookup.",
              path: "/support",
              badge: "Helpdesk Agent Active",
              badgeColor: "#0ea5e9",
              image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80"
            }
          ].map((hub, idx) => (
            <Link 
              key={idx} 
              to={hub.path} 
              style={{ 
                textDecoration: 'none', 
                color: 'inherit',
                background: 'var(--bg-dark)', 
                border: '1px solid var(--border-color)', 
                borderRadius: 'var(--radius-lg)', 
                overflow: 'hidden', 
                boxShadow: 'var(--panel-shadow)',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.3s ease'
              }}
              className="hover-lift"
            >
              <div style={{ height: '150px', position: 'relative', overflow: 'hidden' }}>
                <img 
                  src={hub.image} 
                  alt={hub.title} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
                <div style={{ position: 'absolute', inset: 0, background: isLight ? 'linear-gradient(180deg, transparent 40%, rgba(255, 255, 255, 0.92) 100%)' : 'linear-gradient(180deg, transparent 40%, rgba(2, 6, 23, 0.9) 100%)' }} />
                <span style={{ position: 'absolute', top: '12px', left: '12px', padding: '0.25rem 0.65rem', borderRadius: '12px', background: isLight ? '#ffffff' : `${hub.badgeColor}25`, border: isLight ? `1px solid ${hub.badgeColor}60` : `1px solid ${hub.badgeColor}60`, color: hub.badgeColor, fontSize: '0.72rem', fontWeight: 700, backdropFilter: 'blur(8px)', boxShadow: isLight ? '0 2px 6px rgba(15, 23, 42, 0.08)' : 'none' }}>
                  {hub.badge}
                </span>
              </div>
              <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '0.75rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.35rem' }}>{hub.title}</h3>
                  <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>{hub.desc}</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: hub.badgeColor, fontSize: '0.82rem', fontWeight: 600, marginTop: '0.5rem' }}>
                  Open Dashboard <ArrowRight size={15} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: '2rem', alignItems: 'start' }}>
        <div style={{ background: 'var(--bg-dark)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '1.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', fontWeight: 600 }}>Performance Trends</h2>
          <ActivityChart />
        </div>
        <div style={{ background: 'var(--bg-dark)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '1.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', fontWeight: 600 }}>Recent Agent Activity</h2>
          <RecentActivity />
        </div>
      </div>
    </div>
  );
}
