import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../lib/authStore';

const NAV_ITEMS = [
  {
    label: 'Dashboard',
    path: '/',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square">
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" />
      </svg>
    ),
  },
  {
    label: 'Notes',
    path: '/notes',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square">
        <rect x="3" y="3" width="18" height="18" />
        <line x1="7" y1="8" x2="17" y2="8" />
        <line x1="7" y1="12" x2="17" y2="12" />
        <line x1="7" y1="16" x2="13" y2="16" />
      </svg>
    ),
  },
  {
    label: 'Links',
    path: '/links',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square">
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
      </svg>
    ),
  },
];

export const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { authUser, logout } = useAuthStore();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') setIsMobileOpen(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const sidebarWidth = (isExpanded && !isMobileOpen) ? 260 : 72;

  return (
    <>
      {/* ── Mobile hamburger button ── */}
      <button
        onClick={() => setIsMobileOpen(true)}
        style={{
          display: 'none',
          position: 'fixed',
          top: '12px',
          left: '12px',
          zIndex: 60,
          background: 'var(--bg-surface)',
          border: '2px solid var(--border-primary)',
          color: 'var(--text-primary)',
          padding: '8px',
          cursor: 'pointer',
          boxShadow: '3px 3px 0px var(--accent-yellow)',
        }}
        className="mobile-hamburger"
        aria-label="Open menu"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square">
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>

      <style>{`
        @media (max-width: 1023px) {
          .mobile-hamburger { display: flex !important; }
          .desktop-sidebar { transform: translateX(-100%) !important; width: 260px !important; }
          .desktop-sidebar.mobile-open { transform: translateX(0) !important; }
        }
      `}</style>

      {/* ── Mobile backdrop ── */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.75)',
            zIndex: 49,
          }}
        />
      )}

      {/* ── Sidebar ── */}
      <div
        className={`desktop-sidebar ${isMobileOpen ? 'mobile-open' : ''}`}
        onMouseEnter={() => !isMobileOpen && setIsExpanded(true)}
        onMouseLeave={() => !isMobileOpen && setIsExpanded(false)}
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          height: '100vh',
          width: isMobileOpen ? 260 : sidebarWidth,
          background: 'var(--bg-surface)',
          borderRight: '3px solid var(--border-primary)',
          boxShadow: '4px 0px 0px var(--accent-yellow)',
          zIndex: 50,
          display: 'flex',
          flexDirection: 'column',
          transition: 'width 0.25s ease',
          overflow: 'hidden',
        }}
      >
        {/* Logo header */}
        <div
          style={{
            padding: '20px 18px',
            borderBottom: '2px solid var(--border-dim)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Logo mark */}
            <div
              style={{
                minWidth: 36,
                width: 36,
                height: 36,
                background: 'var(--accent-yellow)',
                border: '2px solid var(--border-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <span style={{ fontWeight: 800, fontSize: '1rem', color: '#000', fontFamily: "'Space Grotesk', sans-serif" }}>M</span>
            </div>
            {/* Title — shown when expanded */}
            <span
              style={{
                fontWeight: 800,
                fontSize: '1.1rem',
                color: 'var(--text-primary)',
                fontFamily: "'Space Grotesk', sans-serif",
                whiteSpace: 'nowrap',
                opacity: (isExpanded || isMobileOpen) ? 1 : 0,
                transition: 'opacity 0.2s ease',
                letterSpacing: '0.05em',
              }}
            >
              MINDHUB
            </span>
          </div>
          {/* Mobile close */}
          {isMobileOpen && (
            <button
              onClick={() => setIsMobileOpen(false)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                padding: '4px',
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
        </div>

        {/* Nav items */}
        <nav style={{ flex: 1, padding: '12px 0', overflowY: 'auto' }}>
          {NAV_ITEMS.map((item) => (
            <button
              key={item.path}
              onClick={() => { navigate(item.path); setIsMobileOpen(false); }}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                padding: '12px 18px',
                background: isActive(item.path) ? 'var(--accent-yellow)' : 'transparent',
                border: 'none',
                borderLeft: isActive(item.path) ? '4px solid #000' : '4px solid transparent',
                borderRight: 'none',
                cursor: 'pointer',
                color: isActive(item.path) ? '#000000' : 'var(--text-secondary)',
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: isActive(item.path) ? 700 : 500,
                fontSize: '0.9rem',
                letterSpacing: '0.03em',
                textAlign: 'left',
                transition: 'background 0.15s, color 0.15s',
              }}
              onMouseEnter={(e) => {
                if (!isActive(item.path)) {
                  e.currentTarget.style.background = 'var(--bg-elevated)';
                  e.currentTarget.style.color = 'var(--text-primary)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive(item.path)) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'var(--text-secondary)';
                }
              }}
            >
              <span style={{ flexShrink: 0, minWidth: 20 }}>{item.icon}</span>
              <span
                style={{
                  whiteSpace: 'nowrap',
                  opacity: (isExpanded || isMobileOpen) ? 1 : 0,
                  transition: 'opacity 0.2s ease',
                }}
              >
                {item.label}
              </span>
            </button>
          ))}
        </nav>

        {/* User footer */}
        <div style={{ borderTop: '2px solid var(--border-dim)' }}>
          {/* Logout button */}
          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              padding: '12px 18px',
              background: 'transparent',
              border: 'none',
              borderLeft: '4px solid transparent',
              cursor: 'pointer',
              color: 'var(--text-muted)',
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 600,
              fontSize: '0.85rem',
              letterSpacing: '0.03em',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255,59,59,0.1)';
              e.currentTarget.style.color = 'var(--accent-coral)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = 'var(--text-muted)';
            }}
          >
            <span style={{ flexShrink: 0, minWidth: 20 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16,17 21,12 16,7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </span>
            <span style={{ whiteSpace: 'nowrap', opacity: (isExpanded || isMobileOpen) ? 1 : 0, transition: 'opacity 0.2s ease' }}>
              Logout
            </span>
          </button>

          {/* User avatar */}
          <div
            style={{
              padding: '12px 18px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              borderTop: '2px solid var(--border-dim)',
            }}
          >
            <div
              style={{
                minWidth: 36,
                width: 36,
                height: 36,
                background: 'var(--accent-cyan)',
                border: '2px solid var(--border-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                fontWeight: 800,
                fontSize: '0.95rem',
                color: '#000',
                fontFamily: "'Space Grotesk', sans-serif",
              }}
            >
              {authUser?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div
              style={{
                opacity: (isExpanded || isMobileOpen) ? 1 : 0,
                transition: 'opacity 0.2s ease',
                overflow: 'hidden',
              }}
            >
              <p style={{ margin: 0, fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-primary)', whiteSpace: 'nowrap', fontFamily: "'Space Grotesk', sans-serif" }}>
                {authUser?.name || 'User'}
              </p>
              <p style={{ margin: 0, fontSize: '0.7rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 160, fontFamily: "'Space Grotesk', sans-serif" }}>
                {authUser?.email || ''}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};