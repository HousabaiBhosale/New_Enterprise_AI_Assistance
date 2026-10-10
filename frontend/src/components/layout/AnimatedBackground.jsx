export default function AnimatedBackground() {
    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            zIndex: -1,
            overflow: 'hidden',
            pointerEvents: 'none',
            background: 'var(--bg-darker)',
        }}>
            <div className="moving-grid"></div>

            <div className="floating-particle" style={{ left: '15%', animationDuration: '15s', animationDelay: '0s' }}></div>
            <div className="floating-particle" style={{ left: '35%', animationDuration: '12s', animationDelay: '-4s', width: '3px', height: '3px' }}></div>
            <div className="floating-particle" style={{ left: '60%', animationDuration: '18s', animationDelay: '-8s' }}></div>
            <div className="floating-particle" style={{ left: '80%', animationDuration: '14s', animationDelay: '-2s', width: '3px', height: '3px' }}></div>
            <div className="floating-particle" style={{ left: '90%', animationDuration: '20s', animationDelay: '-6s' }}></div>
        </div>
    );
}
