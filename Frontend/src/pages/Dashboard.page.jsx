import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotesStore } from '../lib/notesStore';
import { useLinksStore } from '../lib/linksStore';

export const Dashboard = () => {
  const navigate = useNavigate();
  const { notes, isLoading: isLoadingNotes, fetchNotes } = useNotesStore();
  const { links, isLoading: isLoadingLinks, fetchLinks } = useLinksStore();

  useEffect(() => {
    fetchNotes();
    fetchLinks();
  }, [fetchNotes, fetchLinks]);

  const totalNotes = notes.length;
  const totalLinks = links.length;

  const recentNotes = [...notes]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3);

  const recentLinks = [...links]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3);

  const isLoading = isLoadingNotes || isLoadingLinks;

  if (isLoading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: 'var(--bg-base)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: "'Space Grotesk', sans-serif",
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              width: 48,
              height: 48,
              border: '3px solid var(--border-dim)',
              borderTop: '3px solid var(--accent-yellow)',
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite',
              margin: '0 auto 16px',
            }}
          />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            Loading workspace...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--bg-base)',
        padding: 'clamp(20px, 4vw, 40px)',
        fontFamily: "'Space Grotesk', sans-serif",
      }}
    >
      <div style={{ maxWidth: 960, margin: '0 auto' }}>

        {/* ── Page Header ── */}
        <div style={{ marginBottom: 36 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <div
              style={{
                width: 8,
                height: 32,
                background: 'var(--accent-yellow)',
                border: '2px solid var(--border-primary)',
              }}
            />
            <h1
              style={{
                margin: 0,
                fontSize: 'clamp(1.6rem, 3vw, 2.4rem)',
                fontWeight: 800,
                color: 'var(--text-primary)',
                letterSpacing: '-0.02em',
              }}
            >
              DASHBOARD
            </h1>
          </div>
          <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 500, paddingLeft: 20 }}>
            Your personal knowledge hub
          </p>
        </div>

        {/* ── Stat Cards ── */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 20,
            marginBottom: 40,
          }}
        >
          {/* Notes stat */}
          <div
            className="nb-card nb-card-yellow"
            style={{
              padding: '24px',
              cursor: 'pointer',
              position: 'relative',
              overflow: 'hidden',
            }}
            onClick={() => navigate('/notes')}
          >
            <div
              style={{
                position: 'absolute',
                top: -20,
                right: -20,
                fontSize: '5rem',
                fontWeight: 900,
                color: 'var(--accent-yellow)',
                opacity: 0.08,
                lineHeight: 1,
                userSelect: 'none',
              }}
            >
              N
            </div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 40,
                height: 40,
                background: 'var(--accent-yellow)',
                border: '2px solid var(--border-primary)',
                marginBottom: 16,
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.5" strokeLinecap="square">
                <rect x="3" y="3" width="18" height="18" />
                <line x1="7" y1="8" x2="17" y2="8" />
                <line x1="7" y1="12" x2="17" y2="12" />
                <line x1="7" y1="16" x2="13" y2="16" />
              </svg>
            </div>
            <div
              style={{
                fontSize: 'clamp(2rem, 4vw, 3rem)',
                fontWeight: 900,
                color: 'var(--text-primary)',
                lineHeight: 1,
                marginBottom: 6,
              }}
            >
              {totalNotes}
            </div>
            <div
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                color: 'var(--text-muted)',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
              }}
            >
              Total Notes
            </div>
          </div>

          {/* Links stat */}
          <div
            className="nb-card nb-card-cyan"
            style={{
              padding: '24px',
              cursor: 'pointer',
              position: 'relative',
              overflow: 'hidden',
            }}
            onClick={() => navigate('/links')}
          >
            <div
              style={{
                position: 'absolute',
                top: -20,
                right: -20,
                fontSize: '5rem',
                fontWeight: 900,
                color: 'var(--accent-cyan)',
                opacity: 0.08,
                lineHeight: 1,
                userSelect: 'none',
              }}
            >
              L
            </div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 40,
                height: 40,
                background: 'var(--accent-cyan)',
                border: '2px solid var(--border-primary)',
                marginBottom: 16,
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.5" strokeLinecap="square">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
              </svg>
            </div>
            <div
              style={{
                fontSize: 'clamp(2rem, 4vw, 3rem)',
                fontWeight: 900,
                color: 'var(--text-primary)',
                lineHeight: 1,
                marginBottom: 6,
              }}
            >
              {totalLinks}
            </div>
            <div
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                color: 'var(--text-muted)',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
              }}
            >
              Saved Links
            </div>
          </div>
        </div>

        {/* ── Recent Items ── */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 24,
          }}
        >
          {/* Recent Notes */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <h2
                style={{
                  margin: 0,
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  color: 'var(--text-muted)',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                }}
              >
                Recent Notes
              </h2>
              <button
                onClick={() => navigate('/notes')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--accent-yellow)',
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  letterSpacing: '0.05em',
                  textDecoration: 'underline',
                }}
              >
                View all →
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {recentNotes.length === 0 ? (
                <div
                  style={{
                    background: 'var(--bg-surface)',
                    border: '2px dashed var(--border-dim)',
                    padding: '24px',
                    textAlign: 'center',
                  }}
                >
                  <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 500 }}>
                    No notes yet
                  </p>
                  <button
                    onClick={() => navigate('/notes')}
                    style={{
                      marginTop: 12,
                      background: 'none',
                      border: 'none',
                      color: 'var(--accent-yellow)',
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontWeight: 700,
                      fontSize: '0.8rem',
                      cursor: 'pointer',
                    }}
                  >
                    Create first note →
                  </button>
                </div>
              ) : (
                recentNotes.map((note) => (
                  <div
                    key={note._id}
                    style={{
                      background: 'var(--bg-surface)',
                      border: '2px solid var(--border-primary)',
                      borderLeft: '4px solid var(--accent-yellow)',
                      padding: '14px 16px',
                      cursor: 'pointer',
                      transition: 'transform 0.1s ease',
                    }}
                    onClick={() => navigate('/notes')}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateX(2px)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateX(0)'; }}
                  >
                    <h3
                      style={{
                        margin: '0 0 6px 0',
                        fontSize: '0.9rem',
                        fontWeight: 700,
                        color: 'var(--text-primary)',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {note.title}
                    </h3>
                    <p
                      style={{
                        margin: 0,
                        fontSize: '0.8rem',
                        color: 'var(--text-muted)',
                        overflow: 'hidden',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        lineHeight: 1.5,
                      }}
                    >
                      {note.content || '—'}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Recent Links */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <h2
                style={{
                  margin: 0,
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  color: 'var(--text-muted)',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                }}
              >
                Recent Links
              </h2>
              <button
                onClick={() => navigate('/links')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--accent-cyan)',
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  letterSpacing: '0.05em',
                  textDecoration: 'underline',
                }}
              >
                View all →
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {recentLinks.length === 0 ? (
                <div
                  style={{
                    background: 'var(--bg-surface)',
                    border: '2px dashed var(--border-dim)',
                    padding: '24px',
                    textAlign: 'center',
                  }}
                >
                  <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 500 }}>
                    No links saved
                  </p>
                  <button
                    onClick={() => navigate('/links')}
                    style={{
                      marginTop: 12,
                      background: 'none',
                      border: 'none',
                      color: 'var(--accent-cyan)',
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontWeight: 700,
                      fontSize: '0.8rem',
                      cursor: 'pointer',
                    }}
                  >
                    Save first link →
                  </button>
                </div>
              ) : (
                recentLinks.map((link) => (
                  <div
                    key={link._id}
                    style={{
                      background: 'var(--bg-surface)',
                      border: '2px solid var(--border-primary)',
                      borderLeft: '4px solid var(--accent-cyan)',
                      padding: '14px 16px',
                      cursor: 'pointer',
                      transition: 'transform 0.1s ease',
                    }}
                    onClick={() => window.open(link.url, '_blank', 'noopener,noreferrer')}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateX(2px)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateX(0)'; }}
                  >
                    <h3
                      style={{
                        margin: '0 0 4px 0',
                        fontSize: '0.9rem',
                        fontWeight: 700,
                        color: 'var(--text-primary)',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {link.title}
                    </h3>
                    <p
                      style={{
                        margin: 0,
                        fontSize: '0.75rem',
                        color: 'var(--accent-cyan)',
                        fontFamily: 'monospace',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {link.url.replace(/^https?:\/\//, '')}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};