import { Inbox, Send, MoreVertical, Users, TrendingUp } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCoordination } from '../context/CoordinationContext';

export default function Coordination() {
    const { user } = useAuth();
    const { threads } = useCoordination();
    const isEmployee = user?.role === 'employee';
    const roleDisplay = user?.role ? user.role.toUpperCase() : 'ADMIN';

    const filteredThreads = isEmployee ? threads : threads.filter(t => t.dept.toLowerCase() === user?.role);
    const [activeThread, setActiveThread] = useState(threads.length > 0 ? threads[0] : null);
    // Sync local state when global state updates
    useEffect(() => {
        if (filteredThreads.length > 0 && !filteredThreads.find(t => t.id === activeThread?.id)) {
            setActiveThread(filteredThreads[0]);
        } else if (filteredThreads.length === 0) {
            setActiveThread(null);
        }
    }, [threads, user]);

    const [input, setInput] = useState('');
    const [messages, setMessages] = useState({});

    const handleSendMessage = () => {
        if (!input.trim() || !activeThread) return;
        const newMsg = { id: Date.now(), text: input, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), sender: 'You', isYou: true };
        setMessages(prev => ({
            ...prev,
            [activeThread.id]: [...(prev[activeThread.id] || []), newMsg]
        }));
        setInput('');
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', height: '100%' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '0.5rem' }}>Coordination Hub</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Cross-departmental messaging and issue tracking. Acting as: <b style={{ color: 'var(--primary-color)' }}>{roleDisplay}</b></p>
                </div>
                {isEmployee && (
                    <button style={{ background: 'var(--primary-color)', color: 'white', border: 'none', padding: '0.8rem 1.5rem', borderRadius: 'var(--radius-md)', fontWeight: 600, cursor: 'pointer' }} className="hover-lift">
                        + New Request
                    </button>
                )}
            </header>

            <div style={{ display: 'flex', flex: 1, gap: '2rem', height: 'calc(100vh - 200px)', overflow: 'hidden' }}>
                {/* Inbox Sidebar */}
                <div style={{ width: '350px', background: 'var(--bg-dark)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '1rem', overflowY: 'auto' }}>
                    <h2 style={{ fontSize: '1.1rem', marginBottom: '1rem', fontWeight: 600 }}>Active Threads</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {filteredThreads.length > 0 ? filteredThreads.map(t => (
                            <div
                                key={t.id}
                                onClick={() => setActiveThread(t)}
                                style={{ padding: '1rem', border: `1px solid ${activeThread?.id === t.id ? 'var(--primary-color)' : 'var(--glass-border)'}`, background: activeThread?.id === t.id ? 'rgba(99, 102, 241, 0.1)' : 'var(--bg-card)', borderRadius: 'var(--radius-md)', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)' }}>{t.title}</span>
                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t.time}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '200px' }}>{t.preview}</span>
                                    <span style={{ background: t.status === 'Active' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255,255,255,0.05)', color: t.status === 'Active' ? '#10b981' : 'var(--text-muted)', padding: '0.1rem 0.5rem', borderRadius: '10px', fontSize: '0.7rem', textTransform: 'uppercase' }}>{t.dept}</span>
                                </div>
                            </div>
                        )) : (
                            <p style={{ color: 'var(--text-muted)', textAlign: 'center', marginTop: '2rem' }}>No active threads for your department.</p>
                        )}
                    </div>
                </div>

                {/* Messaging Area */}
                <div style={{ flex: 1, background: 'var(--bg-dark)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                    {activeThread ? (
                        <>
                            {/* Chat Header */}
                            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(2, 6, 23, 0.4)' }}>
                                <div>
                                    <h3 style={{ fontSize: '1.2rem', margin: '0 0 0.2rem 0' }}>{activeThread.title}</h3>
                                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Coordinating with: {activeThread.dept} Department</span>
                                </div>
                                <MoreVertical size={20} color="var(--text-muted)" style={{ cursor: 'pointer' }} />
                            </div>

                            {/* Chat Body */}
                            <div style={{ flex: 1, padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', padding: '1rem', borderRadius: 'var(--radius-md) var(--radius-md) var(--radius-md) 0', alignSelf: 'flex-start', maxWidth: '80%' }}>
                                    <span style={{ fontSize: '0.8rem', color: 'var(--primary-color)', display: 'block', marginBottom: '0.3rem', fontWeight: 600 }}>Employee</span>
                                    <p style={{ margin: 0, fontSize: '0.95rem', lineHeight: '1.5' }}>{activeThread.preview}</p>
                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginTop: '0.5rem' }}>{activeThread.time}</span>
                                </div>

                                {activeThread.status === 'Active' && (
                                    <div style={{ background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.2)', padding: '1rem', borderRadius: 'var(--radius-md) var(--radius-md) 0 var(--radius-md)', alignSelf: 'flex-start', maxWidth: '80%' }}>
                                        <span style={{ fontSize: '0.8rem', color: '#10b981', display: 'block', marginBottom: '0.3rem', fontWeight: 600 }}>{activeThread.dept} Agent</span>
                                        <p style={{ margin: 0, fontSize: '0.95rem', lineHeight: '1.5' }}>I am looking into this request for you right now. Please allow me a moment to fetch the related policies and data.</p>
                                    </div>
                                )}

                                {(messages[activeThread.id] || []).map((msg) => (
                                    <div key={msg.id} style={{ background: msg.isYou ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255,255,255,0.03)', border: `1px solid ${msg.isYou ? 'rgba(99, 102, 241, 0.3)' : 'var(--glass-border)'}`, padding: '1rem', borderRadius: msg.isYou ? 'var(--radius-md) var(--radius-md) 0 var(--radius-md)' : 'var(--radius-md) var(--radius-md) var(--radius-md) 0', alignSelf: msg.isYou ? 'flex-end' : 'flex-start', maxWidth: '80%' }}>
                                        <span style={{ fontSize: '0.8rem', color: msg.isYou ? 'var(--primary-color)' : 'var(--text-muted)', display: 'block', marginBottom: '0.3rem', fontWeight: 600 }}>{msg.sender}</span>
                                        <p style={{ margin: 0, fontSize: '0.95rem', lineHeight: '1.5' }}>{msg.text}</p>
                                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginTop: '0.5rem' }}>{msg.time}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Chat Input */}
                            <div style={{ padding: '1.25rem 1.5rem', borderTop: '1px solid var(--border-color)', background: 'var(--bg-card)' }}>
                                <div style={{ position: 'relative' }}>
                                    <input type="text" placeholder="Type a message to coordinate..." value={input} onChange={e => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') handleSendMessage(); }} style={{ width: '100%', padding: '1rem 4rem 1rem 1.25rem', background: 'var(--bg-dark)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-full)', color: 'white', fontSize: '0.95rem' }} />
                                    <button onClick={handleSendMessage} style={{ position: 'absolute', right: '0.5rem', top: '50%', transform: 'translateY(-50%)', background: 'var(--primary-color)', color: 'white', border: 'none', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} className="hover-lift">
                                        <Send size={16} />
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                            Select a thread to view coordination messages.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
