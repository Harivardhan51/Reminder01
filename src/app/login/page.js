'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import './login.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [particles, setParticles] = useState([]);
  const [rings, setRings] = useState([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const router = useRouter();
  const containerRef = useRef(null);

  // PERFECT MOUSE TRACKING
  useEffect(() => {
    const handleMouseMove = (e) => {
      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      setMousePos({ x: x * 2 - 1, y: y * 2 - 1 });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // COSMIC RING SYSTEM
  useEffect(() => {
    const newRings = Array.from({ length: 6 }, (_, i) => ({
      id: i,
      radius: 100 + i * 80,
      speed: 0.5 + i * 0.2,
      opacity: 0.3 + i * 0.1
    }));
    setRings(newRings);
  }, []);

  // SPECTACULAR PARTICLE SYSTEM
  useEffect(() => {
    const interval = setInterval(() => {
      setParticles(prev => {
        const newParticles = Array.from({ length: 8 }, (_, i) => ({
          id: Date.now() + i,
          x: Math.random() * 100,
          y: -10,
          vx: (Math.random() - 0.5) * 1,
          vy: Math.random() * 2 + 1,
          size: Math.random() * 5 + 2,
          hue: Math.random() * 360,
          life: 1
        }));
        return [...prev.filter(p => p.life > 0).map(p => ({
          ...p,
          x: p.x + p.vx,
          y: p.y + p.vy,
          life: p.life - 0.02
        })), ...newParticles];
      });
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const handleLogin = useCallback((e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (email === 'admin' && password === '12345') {
      sessionStorage.setItem('user', JSON.stringify({ 
        email: 'admin', 
        name: 'Administrator',
        role: 'admin'
      }));
      setTimeout(() => {
        router.push('/new-event');
      }, 2000);
    } else {
      setError('❌ Invalid credentials. Try: admin / 12345');
      setIsLoading(false);
    }
  }, [email, password, router]);

  return (
    <div className="ultimate-container" ref={containerRef}>
      {/* BACKGROUND COSMOS */}
      <div 
        className="cosmic-bg"
        style={{ 
          '--mouse-x': `${mousePos.x * 50}px`,
          '--mouse-y': `${mousePos.y * 50}px`
        }}
      />
      
      {/* SPECTRAL RINGS */}
      <div className="ring-container">
        {rings.map(ring => (
          <div 
            key={ring.id}
            className="cosmic-ring"
            style={{
              width: `${ring.radius * 2}px`,
              height: `${ring.radius * 2}px`,
              opacity: ring.opacity,
              animationDuration: `${ring.speed}s`
            }}
          />
        ))}
      </div>

      {/* PARTICLE GALAXY */}
      {particles.map(particle => (
        <div
          key={particle.id}
          className="cosmic-particle"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            background: `hsl(${particle.hue}, 80%, 60%)`,
            opacity: particle.life
          }}
        />
      ))}

      {/* MAIN CRYSTAL PORTAL */}
      <div className="crystal-portal">
        <div className="portal-glow" />
        <div className="portal-rim" />
        
        {/* PERFECTLY READABLE HEADER */}
        <div className="portal-header">
          <div className="login-orb">
            <span className="orb-glow">⚡</span>
          </div>
          <h1 className="portal-title">Access Granted</h1>
          <p className="portal-subtitle">Enter your credentials</p>
        </div>

        {/* ULTRA CLEAR ERROR */}
        {error && (
          <div className="error-display">
            <span>{error}</span>
          </div>
        )}

        {/* PERFECTLY VISIBLE FORM */}
        <form onSubmit={handleLogin} className="ultimate-form">
          <div className="form-field">
            <label className="field-label">Username</label>
            <div className="field-wrapper">
              <span className="field-icon">👤</span>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="ultra-input"
                placeholder="admin"
                autoComplete="username"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="form-field">
            <label className="field-label">Password</label>
            <div className="field-wrapper">
              <span className="field-icon">🔒</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="ultra-input"
                placeholder="12345"
                autoComplete="current-password"
                disabled={isLoading}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                <span className="toggle-icon">
                  {showPassword ? '🙈' : '👁️'}
                </span>
              </button>
            </div>
          </div>

          {/* PERFECT BUTTON */}
          <button
            type="submit"
            disabled={isLoading}
            className={`submit-button ${isLoading ? 'active' : ''}`}
          >
            <span className="button-content">
              {isLoading ? (
                <>
                  <div className="pulse-loader">
                    <div className="pulse-ring"></div>
                  </div>
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Enter Portal</span>
                  <div className="button-shine"></div>
                </>
              )}
            </span>
          </button>
        </form>

        {/* CLEAR DEMO INFO */}
        <div className="demo-info">
          <div className="demo-badge">
            <span>Demo:</span>
            <code>admin / 12345</code>
          </div>
        </div>
      </div>
    </div>
  );
}
