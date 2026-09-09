import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../lib/authStore';

export const Signup = () => {
  const navigate = useNavigate();
  const { signUp, isSigningUp } = useAuthStore();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    const result = await signUp({
      name: formData.name,
      email: formData.email,
      password: formData.password,
    });

    if (result.success) navigate('/');
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--bg-base)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 16px',
        fontFamily: "'Space Grotesk', sans-serif",
      }}
    >
      {/* Background grid */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          backgroundImage: 'linear-gradient(var(--border-dim) 1px, transparent 1px), linear-gradient(90deg, var(--border-dim) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          opacity: 0.3,
          pointerEvents: 'none',
        }}
      />

      <div style={{ width: '100%', maxWidth: 440, position: 'relative' }}>
        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              background: 'var(--accent-cyan)',
              border: '3px solid var(--border-primary)',
              padding: '6px 14px',
              marginBottom: 24,
              boxShadow: '4px 4px 0px var(--border-primary)',
            }}
          >
            <span style={{ fontWeight: 800, fontSize: '1rem', color: '#000', letterSpacing: '0.1em' }}>MINDHUB</span>
          </div>

          <h1
            style={{
              fontSize: 'clamp(2rem, 5vw, 3rem)',
              fontWeight: 800,
              color: 'var(--text-primary)',
              margin: '0 0 8px 0',
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
            }}
          >
            CREATE
            <br />
            <span style={{ color: 'var(--accent-cyan)' }}>ACCOUNT.</span>
          </h1>
          <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.95rem', fontWeight: 500 }}>
            Start organizing your knowledge
          </p>
        </div>

        {/* Form card */}
        <div
          style={{
            background: 'var(--bg-surface)',
            border: '3px solid var(--border-primary)',
            boxShadow: '6px 6px 0px var(--accent-cyan)',
            padding: '32px',
          }}
        >
          {/* Error banner */}
          {error && (
            <div
              style={{
                background: 'rgba(255,59,59,0.1)',
                border: '2px solid var(--accent-coral)',
                color: 'var(--accent-coral)',
                padding: '10px 14px',
                marginBottom: '20px',
                fontWeight: 600,
                fontSize: '0.85rem',
              }}
            >
              ⚠ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div>
              <label className="nb-label">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                required
                disabled={isSigningUp}
                className="nb-input"
              />
            </div>

            <div>
              <label className="nb-label">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                disabled={isSigningUp}
                className="nb-input"
              />
            </div>

            <div>
              <label className="nb-label">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Min. 6 characters"
                required
                disabled={isSigningUp}
                className="nb-input"
              />
            </div>

            <div>
              <label className="nb-label">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Repeat password"
                required
                disabled={isSigningUp}
                className="nb-input"
              />
            </div>

            <button
              type="submit"
              disabled={isSigningUp || !formData.name || !formData.email || !formData.password || !formData.confirmPassword}
              className="nb-btn nb-btn-primary"
              style={{
                width: '100%',
                padding: '14px 20px',
                fontSize: '1rem',
                letterSpacing: '0.08em',
                marginTop: '4px',
                background: 'var(--accent-cyan)',
              }}
            >
              {isSigningUp ? (
                <>
                  <div
                    style={{
                      width: 18,
                      height: 18,
                      border: '2px solid #000',
                      borderTop: '2px solid transparent',
                      borderRadius: '50%',
                      animation: 'spin 0.8s linear infinite',
                    }}
                  />
                  <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                  CREATING...
                </>
              ) : (
                '→ SIGN UP'
              )}
            </button>
          </form>

          <hr className="nb-divider" style={{ marginTop: 24 }} />

          <p style={{ textAlign: 'center', margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 500 }}>
            Already have an account?{' '}
            <Link
              to="/login"
              style={{
                color: 'var(--accent-cyan)',
                fontWeight: 700,
                textDecoration: 'none',
                borderBottom: '2px solid var(--accent-cyan)',
              }}
            >
              Log in →
            </Link>
          </p>
        </div>

        {/* Decorative offset */}
        <div
          style={{
            position: 'absolute',
            bottom: -12,
            right: -12,
            width: '100%',
            height: '100%',
            border: '3px solid var(--border-dim)',
            zIndex: -1,
            maxWidth: 440,
            pointerEvents: 'none',
          }}
        />
      </div>
    </div>
  );
};