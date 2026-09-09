import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../lib/authStore';

export const Login = () => {
  const navigate = useNavigate();
  const { Login, isLoggingIn } = useAuthStore();
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await Login(formData);
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
      {/* Background grid pattern */}
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
        {/* Header block */}
        <div
          style={{
            marginBottom: 32,
          }}
        >
          {/* Logo chip */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              background: 'var(--accent-yellow)',
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
            WELCOME
            <br />
            <span style={{ color: 'var(--accent-yellow)' }}>BACK.</span>
          </h1>
          <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.95rem', fontWeight: 500 }}>
            Sign in to your workspace
          </p>
        </div>

        {/* Form card */}
        <div
          style={{
            background: 'var(--bg-surface)',
            border: '3px solid var(--border-primary)',
            boxShadow: '6px 6px 0px var(--accent-yellow)',
            padding: '32px',
          }}
        >
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Email field */}
            <div>
              <label className="nb-label">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                disabled={isLoggingIn}
                className="nb-input"
              />
            </div>

            {/* Password field */}
            <div>
              <label className="nb-label">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                disabled={isLoggingIn}
                className="nb-input"
              />
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isLoggingIn || !formData.email || !formData.password}
              className="nb-btn nb-btn-primary"
              style={{
                width: '100%',
                padding: '14px 20px',
                fontSize: '1rem',
                letterSpacing: '0.08em',
                marginTop: '4px',
              }}
            >
              {isLoggingIn ? (
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
                  SIGNING IN...
                </>
              ) : (
                '→ LOG IN'
              )}
            </button>
          </form>

          {/* Divider */}
          <hr className="nb-divider" style={{ marginTop: 24 }} />

          <p style={{ textAlign: 'center', margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 500 }}>
            No account?{' '}
            <Link
              to="/signup"
              style={{
                color: 'var(--accent-yellow)',
                fontWeight: 700,
                textDecoration: 'none',
                borderBottom: '2px solid var(--accent-yellow)',
              }}
            >
              Sign up →
            </Link>
          </p>
        </div>

        {/* Decorative offset block */}
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