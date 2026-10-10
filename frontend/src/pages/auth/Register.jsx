import { useState } from 'react';
import { Mail, Lock, User, ArrowRight, Loader2, Bot } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { register, isLoading } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    register(name, email, password);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '420px', padding: '3rem 2.5rem', borderRadius: 'var(--radius-lg)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '2.5rem' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'transparent', border: '2px solid var(--primary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--accent-glow)', marginBottom: '1.5rem' }}>
            <Bot size={28} color="var(--primary-color)" />
          </div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '700', marginBottom: '0.5rem', textAlign: 'center' }}>Join Platform</h1>
          <p style={{ color: 'var(--text-muted)', textAlign: 'center' }}>Create an account to deploy AI agents</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.5rem', fontWeight: '500' }}>Full Name</label>
            <div style={{ position: 'relative' }}>
              <User size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                placeholder="Jane Doe"
                style={{ width: '100%', background: 'rgba(2, 6, 23, 0.5)', border: '1px solid var(--border-color)', color: 'var(--text-main)', padding: '0.8rem 1rem 0.8rem 2.75rem', borderRadius: 'var(--radius-md)', outline: 'none', fontSize: '0.95rem' }}
              />
            </div>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.5rem', fontWeight: '500' }}>Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="jane@company.com"
                style={{ width: '100%', background: 'rgba(2, 6, 23, 0.5)', border: '1px solid var(--border-color)', color: 'var(--text-main)', padding: '0.8rem 1rem 0.8rem 2.75rem', borderRadius: 'var(--radius-md)', outline: 'none', fontSize: '0.95rem' }}
              />
            </div>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.5rem', fontWeight: '500' }}>Password</label>
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
            style={{ marginTop: '1rem', background: 'var(--text-main)', color: 'var(--bg-dark)', border: 'none', padding: '0.9rem', borderRadius: 'var(--radius-md)', fontWeight: '600', fontSize: '1rem', cursor: isLoading ? 'default' : 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', opacity: isLoading ? 0.7 : 1 }}
            className={!isLoading ? "hover-lift" : ""}
          >
            {isLoading ? <Loader2 size={20} className="animate-spin" /> : (
              <>Sign Up <ArrowRight size={18} /></>
            )}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Already have an account? <Link to="/login" style={{ color: 'white', textDecoration: 'none', fontWeight: '500' }}>Sign In</Link>
        </p>
      </div>
    </div>
  );
}
