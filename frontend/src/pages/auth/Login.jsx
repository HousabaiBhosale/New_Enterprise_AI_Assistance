import { useState } from 'react';
import { Mail, Lock, ArrowRight, Loader2, Bot, Users, TrendingUp, HelpCircle, Briefcase } from 'lucide-react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
  const { roleId } = useParams();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading } = useAuth();

  const validRoles = {
    'employee': { label: 'Employee', icon: Users, color: '#3b82f6' },
    'hr': { label: 'HR Representative', icon: Briefcase, color: '#8b5cf6' },
    'sales': { label: 'Sales Executive', icon: TrendingUp, color: '#10b981' },
    'support': { label: 'Support Staff', icon: HelpCircle, color: '#f59e0b' },
    'admin': { label: 'System Admin', icon: Lock, color: '#ef4444' }
  };

  const currentRole = roleId ? validRoles[roleId.toLowerCase()] : null;

  const handleSubmit = (e) => {
    e.preventDefault();
    login(email, password, roleId || 'employee');
  };

  if (!currentRole) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{ width: '64px', height: '64px', margin: '0 auto 1.5rem', borderRadius: '16px', background: 'linear-gradient(135deg, var(--secondary-color), var(--primary-color))', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--accent-glow)' }}>
            <Bot size={36} color="white" />
          </div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>ResolveX Portal</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Select your department to sign in</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', width: '100%', maxWidth: '800px' }}>
          {Object.entries(validRoles).map(([id, info]) => {
            const Icon = info.icon;
            return (
              <div key={id} onClick={() => navigate(`/login/${id}`)} className="glass-panel hover-lift" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)', display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', border: '1px solid var(--glass-border)', transition: 'all 0.3s ease' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: `${info.color}20`, color: info.color, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                  <Icon size={28} />
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '600' }}>{info.label}</h3>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  const Icon = currentRole.icon;
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '420px', padding: '3rem 2.5rem', borderRadius: 'var(--radius-lg)', position: 'relative' }}>
        <button onClick={() => navigate('/login')} style={{ position: 'absolute', top: '1.5rem', left: '1.5rem', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }} className="hover-lift">
          &larr; Back
        </button>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '2.5rem', marginTop: '1rem' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: `${currentRole.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
            <Icon size={32} color={currentRole.color} />
          </div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '700', marginBottom: '0.5rem', textAlign: 'center' }}>{currentRole.label} Login</h1>
          <p style={{ color: 'var(--text-muted)', textAlign: 'center' }}>Enter your credentials to access your agents</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.5rem', fontWeight: '500' }}>Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder={`${roleId}@enterprise.ai`}
                style={{ width: '100%', background: 'rgba(2, 6, 23, 0.5)', border: '1px solid var(--border-color)', color: 'var(--text-main)', padding: '0.8rem 1rem 0.8rem 2.75rem', borderRadius: 'var(--radius-md)', outline: 'none', fontSize: '0.95rem' }}
              />
            </div>
          </div>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <label style={{ fontSize: '0.9rem', fontWeight: '500' }}>Password</label>
              <Link to="/forgot-password" style={{ fontSize: '0.8rem', color: currentRole.color, textDecoration: 'none' }}>Forgot password?</Link>
            </div>
            <div style={{ position: 'relative' }}>
              <Lock size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                style={{ width: '100%', background: 'rgba(2, 6, 23, 0.5)', border: '1px solid var(--border-color)', color: 'var(--text-main)', padding: '0.8rem 1rem 0.8rem 2.75rem', borderRadius: 'var(--radius-md)', outline: 'none', fontSize: '0.95rem' }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{ marginTop: '1rem', background: currentRole.color, color: 'white', border: 'none', padding: '0.9rem', borderRadius: 'var(--radius-md)', fontWeight: '600', fontSize: '1rem', cursor: isLoading ? 'default' : 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', boxShadow: `0 4px 14px ${currentRole.color}40`, opacity: isLoading ? 0.7 : 1 }}
            className={!isLoading ? "hover-lift" : ""}
          >
            {isLoading ? <Loader2 size={20} className="animate-spin" /> : (
              <>Sign In <ArrowRight size={18} /></>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
