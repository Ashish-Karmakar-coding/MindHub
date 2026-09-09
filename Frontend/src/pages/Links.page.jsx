import { useState, useEffect } from 'react';
import { useLinksStore } from '../lib/linksStore';

const PlusIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square">
    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);
const ExternalLinkIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15,3 21,3 21,9" /><line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);
const TrashIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square">
    <polyline points="3,6 5,6 21,6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
  </svg>
);
const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square">
    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);
const CloseIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

export const Links = () => {
  const {
    links, isLoading, isAdding, isDeleting,
    fetchLinks, addLink, deleteLink,
  } = useLinksStore();

  const [isAddingLink, setIsAddingLink] = useState(false);
  const [formData, setFormData] = useState({ title: '', url: '', description: '' });
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => { fetchLinks(); }, [fetchLinks]);

  const handleAdd = async () => {
    if (formData.title.trim() && formData.url.trim()) {
      let url = formData.url.trim();
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
      }
      const result = await addLink({
        title: formData.title.trim(),
        url,
        description: formData.description.trim(),
      });
      if (result.success) {
        setFormData({ title: '', url: '', description: '' });
        setIsAddingLink(false);
      }
    }
  };

  const handleCancel = () => {
    setIsAddingLink(false);
    setFormData({ title: '', url: '', description: '' });
  };

  const openLink = (url) => window.open(url, '_blank', 'noopener,noreferrer');

  const filteredLinks = links.filter((link) =>
    link.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    link.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (link.description && link.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  // Extract domain for display
  const getDomain = (url) => {
    try {
      return new URL(url).hostname.replace('www.', '');
    } catch {
      return url.replace(/^https?:\/\//, '').split('/')[0];
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--bg-base)',
        padding: 'clamp(20px, 4vw, 40px)',
        fontFamily: "'Space Grotesk', sans-serif",
      }}
    >
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>

        {/* ── Header ── */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 16,
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            marginBottom: 32,
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
              <div style={{ width: 8, height: 32, background: 'var(--accent-cyan)', border: '2px solid var(--border-primary)' }} />
              <h1
                style={{
                  margin: 0,
                  fontSize: 'clamp(1.6rem, 3vw, 2.4rem)',
                  fontWeight: 800,
                  color: 'var(--text-primary)',
                  letterSpacing: '-0.02em',
                }}
              >
                MY LINKS
              </h1>
            </div>
            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 500, paddingLeft: 20 }}>
              {filteredLinks.length} {filteredLinks.length === 1 ? 'link' : 'links'}
              {searchQuery && ' found'}
            </p>
          </div>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
            {/* Search */}
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }}>
                <SearchIcon />
              </span>
              <input
                type="text"
                placeholder="Search links..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="nb-input"
                style={{ paddingLeft: 36, width: 220, fontSize: '0.875rem' }}
              />
            </div>

            {/* Add button */}
            {!isAddingLink && (
              <button
                onClick={() => setIsAddingLink(true)}
                disabled={isLoading}
                className="nb-btn"
                style={{
                  gap: 8,
                  padding: '10px 18px',
                  background: 'var(--accent-cyan)',
                  color: '#000',
                  border: '3px solid var(--border-primary)',
                  boxShadow: '4px 4px 0px var(--border-primary)',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  letterSpacing: '0.05em',
                  cursor: 'pointer',
                  transition: 'transform 0.1s, box-shadow 0.1s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translate(-2px,-2px)';
                  e.currentTarget.style.boxShadow = '6px 6px 0px var(--border-primary)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translate(0,0)';
                  e.currentTarget.style.boxShadow = '4px 4px 0px var(--border-primary)';
                }}
              >
                <PlusIcon />
                ADD LINK
              </button>
            )}
          </div>
        </div>

        {/* ── Loading ── */}
        {isLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
            <div
              style={{
                width: 40,
                height: 40,
                border: '3px solid var(--border-dim)',
                borderTop: '3px solid var(--accent-cyan)',
                borderRadius: '50%',
                animation: 'spin 0.8s linear infinite',
              }}
            />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        ) : (
          <>
            {/* ── Links Grid ── */}
            {filteredLinks.length === 0 ? (
              <div style={{ border: '2px dashed var(--border-dim)', padding: '60px 24px', textAlign: 'center' }}>
                <div style={{ fontSize: '3rem', marginBottom: 16 }}>🔗</div>
                <p style={{ margin: '0 0 8px 0', color: 'var(--text-secondary)', fontWeight: 700, fontSize: '1.1rem' }}>
                  {searchQuery ? 'No links found' : 'No links saved'}
                </p>
                <p style={{ margin: '0 0 20px 0', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  {searchQuery ? `No results for "${searchQuery}"` : 'Save your first link to get started'}
                </p>
                {!searchQuery && (
                  <button
                    onClick={() => setIsAddingLink(true)}
                    className="nb-btn"
                    style={{
                      padding: '10px 20px',
                      background: 'var(--accent-cyan)',
                      color: '#000',
                      border: '3px solid var(--border-primary)',
                      boxShadow: '4px 4px 0px var(--border-primary)',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                    }}
                  >
                    <PlusIcon /> SAVE LINK
                  </button>
                )}
              </div>
            ) : (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                  gap: 20,
                }}
              >
                {filteredLinks.map((link) => (
                  <div
                    key={link._id}
                    style={{
                      background: 'var(--bg-surface)',
                      border: '3px solid var(--border-primary)',
                      boxShadow: '4px 4px 0px var(--accent-cyan)',
                      padding: '20px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 10,
                      transition: 'transform 0.1s ease, box-shadow 0.1s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translate(-2px,-2px)';
                      e.currentTarget.style.boxShadow = '6px 6px 0px var(--accent-cyan)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translate(0,0)';
                      e.currentTarget.style.boxShadow = '4px 4px 0px var(--accent-cyan)';
                    }}
                  >
                    {/* Card header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                      <h3
                        style={{
                          margin: 0,
                          fontSize: '1rem',
                          fontWeight: 700,
                          color: 'var(--text-primary)',
                          flex: 1,
                          overflow: 'hidden',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          lineHeight: 1.4,
                        }}
                      >
                        {link.title}
                      </h3>
                      <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                        <button
                          onClick={() => openLink(link.url)}
                          style={{
                            background: 'var(--accent-cyan)',
                            border: '2px solid var(--border-primary)',
                            color: '#000',
                            padding: '5px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'transform 0.1s',
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.1)'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
                          title="Open link"
                        >
                          <ExternalLinkIcon />
                        </button>
                        <button
                          onClick={() => deleteLink(link._id)}
                          disabled={isDeleting}
                          style={{
                            background: 'transparent',
                            border: '2px solid var(--border-dim)',
                            color: 'var(--text-muted)',
                            padding: '5px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'border-color 0.15s, color 0.15s, background 0.15s',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(255,59,59,0.1)';
                            e.currentTarget.style.borderColor = 'var(--accent-coral)';
                            e.currentTarget.style.color = 'var(--accent-coral)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'transparent';
                            e.currentTarget.style.borderColor = 'var(--border-dim)';
                            e.currentTarget.style.color = 'var(--text-muted)';
                          }}
                          title="Delete link"
                        >
                          <TrashIcon />
                        </button>
                      </div>
                    </div>

                    {/* URL display */}
                    <button
                      onClick={() => openLink(link.url)}
                      style={{
                        background: 'var(--bg-elevated)',
                        border: '1px solid var(--border-dim)',
                        padding: '6px 10px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        cursor: 'pointer',
                        textAlign: 'left',
                        width: '100%',
                      }}
                    >
                      <span style={{ color: 'var(--accent-cyan)', fontSize: '0.65rem', fontWeight: 700, flexShrink: 0 }}>⬡</span>
                      <span
                        style={{
                          fontSize: '0.75rem',
                          color: 'var(--accent-cyan)',
                          fontFamily: 'monospace',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {getDomain(link.url)}
                      </span>
                    </button>

                    {/* Description */}
                    {link.description && (
                      <p
                        style={{
                          margin: 0,
                          fontSize: '0.82rem',
                          color: 'var(--text-secondary)',
                          lineHeight: 1.5,
                          overflow: 'hidden',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                        }}
                      >
                        {link.description}
                      </p>
                    )}

                    {/* Footer */}
                    <div
                      style={{
                        borderTop: '1px solid var(--border-dim)',
                        paddingTop: 10,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginTop: 'auto',
                      }}
                    >
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.05em' }}>
                        {formatDate(link.createdAt)}
                      </span>
                      <span
                        className="nb-badge"
                        style={{ color: 'var(--accent-cyan)', fontSize: '0.6rem', borderColor: 'var(--accent-cyan)' }}
                      >
                        LINK
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* ── Modal (Add Link) ── */}
      {isAddingLink && (
        <div className="nb-modal-overlay">
          <div
            className="nb-modal"
            style={{ boxShadow: '8px 8px 0px var(--accent-cyan)' }}
          >
            {/* Modal header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <div>
                <div
                  style={{
                    display: 'inline-block',
                    background: 'var(--accent-cyan)',
                    color: '#000',
                    fontSize: '0.65rem',
                    fontWeight: 800,
                    letterSpacing: '0.12em',
                    padding: '3px 8px',
                    marginBottom: 6,
                    border: '2px solid #000',
                  }}
                >
                  NEW
                </div>
                <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
                  Save Link
                </h2>
              </div>
              <button
                onClick={handleCancel}
                disabled={isAdding}
                style={{
                  background: 'transparent',
                  border: '2px solid var(--border-dim)',
                  color: 'var(--text-muted)',
                  padding: '6px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-primary)';
                  e.currentTarget.style.color = 'var(--text-primary)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-dim)';
                  e.currentTarget.style.color = 'var(--text-muted)';
                }}
              >
                <CloseIcon />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div>
                <label className="nb-label">Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Give this link a name..."
                  autoFocus
                  disabled={isAdding}
                  className="nb-input"
                />
              </div>

              <div>
                <label className="nb-label">URL *</label>
                <input
                  type="text"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  placeholder="https://example.com"
                  disabled={isAdding}
                  className="nb-input"
                />
                <p style={{ margin: '6px 0 0 0', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                  You can enter with or without https://
                </p>
              </div>

              <div>
                <label className="nb-label">Description <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(optional)</span></label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="What is this link about?"
                  rows={3}
                  disabled={isAdding}
                  className="nb-input nb-textarea"
                />
              </div>

              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', paddingTop: 4 }}>
                <button
                  onClick={handleAdd}
                  disabled={isAdding || !formData.title.trim() || !formData.url.trim()}
                  className="nb-btn"
                  style={{
                    flex: 1,
                    minWidth: 120,
                    padding: '12px 16px',
                    background: 'var(--accent-cyan)',
                    color: '#000',
                    border: '3px solid var(--border-primary)',
                    boxShadow: '4px 4px 0px var(--border-primary)',
                    fontWeight: 700,
                    letterSpacing: '0.06em',
                    cursor: 'pointer',
                    transition: 'transform 0.1s, box-shadow 0.1s',
                    opacity: (isAdding || !formData.title.trim() || !formData.url.trim()) ? 0.5 : 1,
                  }}
                >
                  {isAdding ? (
                    <>
                      <div style={{ width: 16, height: 16, border: '2px solid #000', borderTop: '2px solid transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
                      SAVING...
                    </>
                  ) : '+ SAVE LINK'}
                </button>
                <button
                  onClick={handleCancel}
                  disabled={isAdding}
                  className="nb-btn nb-btn-secondary"
                  style={{ padding: '12px 20px', letterSpacing: '0.06em' }}
                >
                  CANCEL
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};