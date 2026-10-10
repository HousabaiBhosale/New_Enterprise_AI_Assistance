import { User, Bell, Shield, Palette, Save } from 'lucide-react';
import React from 'react';

export default function Settings() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '0.5rem' }}>Account Settings</h1>
          <p style={{ color: 'var(--text-muted)' }}>Manage your profile, notifications, and application preferences.</p>
        </div>
        <button style={{ background: 'var(--primary-color)', color: 'white', border: 'none', padding: '0.8rem 1.5rem', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, cursor: 'pointer' }} className="hover-lift">
          <Save size={18} /> Save Changes
        </button>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
        {/* Navigation Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {[
            { id: 'profile', icon: User, label: 'Profile Settings', active: true },
            { id: 'notifications', icon: Bell, label: 'Notifications', active: false },
            { id: 'security', icon: Shield, label: 'Security & Access', active: false },
            { id: 'appearance', icon: Palette, label: 'Appearance', active: false }
          ].map(item => (
            <button key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: item.active ? 'rgba(99, 102, 241, 0.1)' : 'transparent', border: item.active ? '1px solid var(--primary-color)' : '1px solid transparent', color: item.active ? 'var(--primary-color)' : 'var(--text-main)', borderRadius: 'var(--radius-md)', cursor: 'pointer', textAlign: 'left', fontWeight: item.active ? 600 : 400 }}>
              <item.icon size={20} /> {item.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div style={{ background: 'var(--bg-dark)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>Personal Information</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Full Name</label>
                <input type="text" defaultValue="Admin User" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', padding: '0.8rem', borderRadius: 'var(--radius-md)', color: 'white' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Email Address</label>
                <input type="email" defaultValue="admin@resolvex.ai" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', padding: '0.8rem', borderRadius: 'var(--radius-md)', color: 'white' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Role</label>
                <input type="text" defaultValue="Super Administrator" disabled style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)', padding: '0.8rem', borderRadius: 'var(--radius-md)', color: 'var(--text-muted)' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Department</label>
                <input type="text" defaultValue="Executive" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', padding: '0.8rem', borderRadius: 'var(--radius-md)', color: 'white' }} />
              </div>
            </div>
          </div>

          <div>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>Preferences</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ margin: '0 0 0.2rem 0' }}>AI Assistant Auto-suggest</h4>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Automatically suggest responses in chat based on context.</span>
                </div>
                <div style={{ width: '40px', height: '24px', background: 'var(--primary-color)', borderRadius: '24px', position: 'relative', cursor: 'pointer' }}>
                  <div style={{ width: '20px', height: '20px', background: 'white', borderRadius: '50%', position: 'absolute', top: '2px', right: '2px' }} />
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ margin: '0 0 0.2rem 0' }}>Email Notifications</h4>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Receive daily digests of Human-in-the-loop approvals.</span>
                </div>
                <div style={{ width: '40px', height: '24px', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '24px', position: 'relative', cursor: 'pointer' }}>
                  <div style={{ width: '20px', height: '20px', background: 'var(--text-muted)', borderRadius: '50%', position: 'absolute', top: '1px', left: '2px' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
