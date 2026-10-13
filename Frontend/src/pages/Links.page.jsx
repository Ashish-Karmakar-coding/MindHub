import { useState, useEffect } from 'react';
import { useLinksStore } from '../lib/linksStore';
import { useLinkFoldersStore } from '../lib/linkFoldersStore';

/* ── Icons ── */
const PlusIcon = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>);
const ExternalLinkIcon = () => (<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15,3 21,3 21,9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>);
const TrashIcon = () => (<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square"><polyline points="3,6 5,6 21,6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" /></svg>);
const SearchIcon = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>);
const CloseIcon = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>);
const FolderIcon = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" /></svg>);
const BackIcon = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12,19 5,12 12,5" /></svg>);
const SpinnerStyle = () => (<style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>);

const Spinner = ({ color = 'var(--accent-cyan)', size = 16 }) => (
  <><SpinnerStyle /><div style={{ width: size, height: size, border: `2px solid transparent`, borderTop: `2px solid ${color}`, borderRadius: '50%', animation: 'spin 0.8s linear infinite', flexShrink: 0 }} /></>
);

const btnHover = (accent) => ({
  onMouseEnter: (e) => { e.currentTarget.style.transform = 'translate(-2px,-2px)'; e.currentTarget.style.boxShadow = `6px 6px 0px ${accent}`; },
  onMouseLeave: (e) => { e.currentTarget.style.transform = 'translate(0,0)'; e.currentTarget.style.boxShadow = `4px 4px 0px ${accent}`; },
});

const getDomain = (url) => {
  try { return new URL(url).hostname.replace('www.', ''); }
  catch { return url.replace(/^https?:\/\//, '').split('/')[0]; }
};

export const Links = () => {
  const { links, isLoading, isAdding, isDeleting, fetchLinks, addLink, deleteLink } = useLinksStore();
  const { linkFolders, isLoadingFolders, isCreatingFolder, fetchLinkFolders, createLinkFolder, deleteLinkFolder } = useLinkFoldersStore();

  const [view, setView] = useState('main');
  const [selectedFolder, setSelectedFolder] = useState(null);

  const [isAddingLink, setIsAddingLink] = useState(false);
  const [formData, setFormData] = useState({ title: '', url: '', description: '', folder_id: '' });

  const [showNewFolderInput, setShowNewFolderInput] = useState(false);
  const [inlineFolderName, setInlineFolderName] = useState('');

  const [isAddingFolder, setIsAddingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => { fetchLinks(); fetchLinkFolders(); }, [fetchLinks, fetchLinkFolders]);

  const folderId = (l) => l.folder_id?._id || l.folder_id || null;
  const ungroupedLinks = links.filter((l) => !folderId(l));
  const linksInFolder = (folder) => links.filter((l) => String(folderId(l)) === String(folder._id));

  const displayLinks = view === 'folder' && selectedFolder
    ? linksInFolder(selectedFolder).filter((l) => l.title.toLowerCase().includes(searchQuery.toLowerCase()) || l.url.toLowerCase().includes(searchQuery.toLowerCase()) || (l.description && l.description.toLowerCase().includes(searchQuery.toLowerCase())))
    : ungroupedLinks.filter((l) => l.title.toLowerCase().includes(searchQuery.toLowerCase()) || l.url.toLowerCase().includes(searchQuery.toLowerCase()) || (l.description && l.description.toLowerCase().includes(searchQuery.toLowerCase())));

  const openAddLink = () => {
    setFormData({ title: '', url: '', description: '', folder_id: selectedFolder?._id || '' });
    setShowNewFolderInput(false);
    setInlineFolderName('');
    setIsAddingLink(true);
  };

  const handleAdd = async () => {
    if (!formData.title.trim() || !formData.url.trim()) return;
    let url = formData.url.trim();
    if (!url.startsWith('http://') && !url.startsWith('https://')) url = 'https://' + url;
    const result = await addLink({ title: formData.title.trim(), url, description: formData.description.trim(), folder_id: formData.folder_id || null });
    if (result.success) { setFormData({ title: '', url: '', description: '', folder_id: '' }); setIsAddingLink(false); await fetchLinkFolders(); }
  };

  const handleCancel = () => { setIsAddingLink(false); setFormData({ title: '', url: '', description: '', folder_id: '' }); setShowNewFolderInput(false); setInlineFolderName(''); };

  const handleDeleteLink = async (linkId) => { await deleteLink(linkId); await fetchLinkFolders(); };

  const handleCreateInlineFolder = async () => {
    if (!inlineFolderName.trim()) return;
    const result = await createLinkFolder(inlineFolderName.trim());
    if (result.success) { setFormData((p) => ({ ...p, folder_id: result.folder._id })); setInlineFolderName(''); setShowNewFolderInput(false); }
  };

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;
    const result = await createLinkFolder(newFolderName.trim());
    if (result.success) { setNewFolderName(''); setIsAddingFolder(false); }
  };

  const handleDeleteFolder = async (fId) => {
    await deleteLinkFolder(fId);
    if (selectedFolder?._id === fId) { setSelectedFolder(null); setView('main'); }
    await fetchLinks();
  };

  const openFolder = (folder) => { setSelectedFolder(folder); setView('folder'); setSearchQuery(''); };
  const goBack = () => { setSelectedFolder(null); setView('main'); setSearchQuery(''); };
  const openLink = (url) => window.open(url, '_blank', 'noopener,noreferrer');
  const formatDate = (d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  /* ── Folder dropdown ── */
  const FolderSelect = () => (
    <div>
      <label className="nb-label">Save to Folder <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(optional)</span></label>
      {!showNewFolderInput ? (
        <select value={formData.folder_id} onChange={(e) => { if (e.target.value === '__new__') setShowNewFolderInput(true); else setFormData((p) => ({ ...p, folder_id: e.target.value })); }} className="nb-input" style={{ cursor: 'pointer' }}>
          <option value="">No folder (ungrouped)</option>
          {linkFolders.map((f) => <option key={f._id} value={f._id}>{f.name}</option>)}
          <option value="__new__">+ Create new folder...</option>
        </select>
      ) : (
        <div style={{ display: 'flex', gap: 8 }}>
          <input type="text" placeholder="New folder name..." value={inlineFolderName} onChange={(e) => setInlineFolderName(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') handleCreateInlineFolder(); if (e.key === 'Escape') { setShowNewFolderInput(false); setInlineFolderName(''); } }} className="nb-input" autoFocus />
          <button onClick={handleCreateInlineFolder} disabled={isCreatingFolder || !inlineFolderName.trim()} style={{ padding: '10px 14px', background: 'var(--accent-cyan)', color: '#000', border: '3px solid var(--border-primary)', fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', flexShrink: 0 }}>
            {isCreatingFolder ? <Spinner /> : '+ Create'}
          </button>
          <button onClick={() => { setShowNewFolderInput(false); setInlineFolderName(''); }} className="nb-btn nb-btn-secondary" style={{ padding: '10px 14px', flexShrink: 0 }}>Cancel</button>
        </div>
      )}
    </div>
  );

  /* ── Link Card ── */
  const LinkCard = ({ link }) => (
    <div style={{ background: 'var(--bg-surface)', border: '3px solid var(--border-primary)', boxShadow: '4px 4px 0px var(--accent-cyan)', padding: '20px', display: 'flex', flexDirection: 'column', gap: 10, transition: 'transform 0.1s ease, box-shadow 0.1s ease' }} {...btnHover('var(--accent-cyan)')}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
        <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', flex: 1, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', lineHeight: 1.4 }}>{link.title}</h3>
        <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
          <button onClick={() => openLink(link.url)} style={{ background: 'var(--accent-cyan)', border: '2px solid var(--border-primary)', color: '#000', padding: '5px', cursor: 'pointer', display: 'flex', alignItems: 'center', transition: 'transform 0.1s' }} onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.1)'; }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }} title="Open link"><ExternalLinkIcon /></button>
          <button onClick={() => handleDeleteLink(link._id)} disabled={isDeleting} style={{ background: 'transparent', border: '2px solid var(--border-dim)', color: 'var(--text-muted)', padding: '5px', cursor: 'pointer', display: 'flex', alignItems: 'center', transition: 'border-color 0.15s, color 0.15s, background 0.15s' }} onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,59,59,0.1)'; e.currentTarget.style.borderColor = 'var(--accent-coral)'; e.currentTarget.style.color = 'var(--accent-coral)'; }} onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'var(--border-dim)'; e.currentTarget.style.color = 'var(--text-muted)'; }} title="Delete link"><TrashIcon /></button>
        </div>
      </div>
      <button onClick={() => openLink(link.url)} style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-dim)', padding: '6px 10px', display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', textAlign: 'left', width: '100%' }}>
        <span style={{ color: 'var(--accent-cyan)', fontSize: '0.65rem', fontWeight: 700, flexShrink: 0 }}>⬡</span>
        <span style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', fontFamily: 'monospace', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{getDomain(link.url)}</span>
      </button>
      {link.description && (<p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{link.description}</p>)}
      <div style={{ borderTop: '1px solid var(--border-dim)', paddingTop: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.05em' }}>{formatDate(link.createdAt)}</span>
        <span className="nb-badge" style={{ color: 'var(--accent-cyan)', fontSize: '0.6rem', borderColor: 'var(--accent-cyan)' }}>LINK</span>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)', padding: 'clamp(20px, 4vw, 40px)', fontFamily: "'Space Grotesk', sans-serif" }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>

        {/* ── Header ── */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28 }}>
          <div>
            {view === 'folder' ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <button onClick={goBack} style={{ background: 'transparent', border: '2px solid var(--border-dim)', color: 'var(--text-muted)', padding: '6px 10px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: '0.8rem', transition: 'border-color 0.15s, color 0.15s' }} onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--border-primary)'; e.currentTarget.style.color = 'var(--text-primary)'; }} onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-dim)'; e.currentTarget.style.color = 'var(--text-muted)'; }}>
                  <BackIcon /> All Links
                </button>
                <span style={{ color: 'var(--text-muted)' }}>/</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 8, height: 28, background: 'var(--accent-cyan)', border: '2px solid var(--border-primary)' }} />
                  <h1 style={{ margin: 0, fontSize: 'clamp(1.4rem, 3vw, 2rem)', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', textTransform: 'uppercase' }}>{selectedFolder?.name}</h1>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 8, height: 32, background: 'var(--accent-cyan)', border: '2px solid var(--border-primary)' }} />
                <h1 style={{ margin: 0, fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>MY LINKS</h1>
              </div>
            )}
            <p style={{ margin: '4px 0 0 20px', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 500 }}>
              {displayLinks.length} {displayLinks.length === 1 ? 'link' : 'links'}{searchQuery && ' found'}
            </p>
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }}><SearchIcon /></span>
              <input type="text" placeholder="Search links..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="nb-input" style={{ paddingLeft: 36, width: 200, fontSize: '0.875rem' }} />
            </div>
            <button onClick={openAddLink} style={{ gap: 8, padding: '10px 18px', background: 'var(--accent-cyan)', color: '#000', border: '3px solid var(--border-primary)', boxShadow: '4px 4px 0px var(--border-primary)', fontWeight: 700, fontSize: '0.85rem', letterSpacing: '0.05em', cursor: 'pointer', transition: 'transform 0.1s, box-shadow 0.1s', fontFamily: "'Space Grotesk', sans-serif", display: 'flex', alignItems: 'center' }} {...btnHover('var(--border-primary)')}>
              <PlusIcon /> ADD LINK
            </button>
          </div>
        </div>

        {/* ── Loading ── */}
        {(isLoading || isLoadingFolders) ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
            <SpinnerStyle />
            <div style={{ width: 40, height: 40, border: '3px solid var(--border-dim)', borderTop: '3px solid var(--accent-cyan)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
          </div>
        ) : (
          <>
            {/* ── Folders section (main view only) ── */}
            {view === 'main' && (
              <div style={{ marginBottom: 36 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 4, height: 18, background: 'var(--accent-cyan)' }} />
                    <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Folders</span>
                  </div>
                  {!isAddingFolder ? (
                    <button onClick={() => setIsAddingFolder(true)} style={{ background: 'none', border: 'none', color: 'var(--accent-cyan)', fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <PlusIcon /> New Folder
                    </button>
                  ) : (
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <input type="text" placeholder="Folder name..." value={newFolderName} onChange={(e) => setNewFolderName(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') handleCreateFolder(); if (e.key === 'Escape') { setIsAddingFolder(false); setNewFolderName(''); } }} className="nb-input" style={{ padding: '7px 12px', fontSize: '0.85rem', width: 180 }} autoFocus />
                      <button onClick={handleCreateFolder} disabled={isCreatingFolder || !newFolderName.trim()} style={{ padding: '7px 12px', background: 'var(--accent-cyan)', color: '#000', border: '2px solid var(--border-primary)', fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer' }}>
                        {isCreatingFolder ? <Spinner size={14} /> : '+ Add'}
                      </button>
                      <button onClick={() => { setIsAddingFolder(false); setNewFolderName(''); }} className="nb-btn nb-btn-secondary" style={{ padding: '7px 10px', fontSize: '0.8rem' }}>✕</button>
                    </div>
                  )}
                </div>

                {linkFolders.length === 0 ? (
                  <div style={{ border: '2px dashed var(--border-dim)', padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 12, color: 'var(--text-muted)' }}>
                    <FolderIcon />
                    <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>No folders yet. Create one to organize your links.</span>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 14 }}>
                    {linkFolders.map((folder) => (
                      <div key={folder._id} style={{ position: 'relative' }}>
                        <button onClick={() => openFolder(folder)} style={{ width: '100%', background: 'var(--bg-surface)', border: '3px solid var(--border-primary)', boxShadow: '3px 3px 0px var(--accent-cyan)', padding: '16px', cursor: 'pointer', textAlign: 'left', transition: 'transform 0.1s, box-shadow 0.1s', display: 'flex', flexDirection: 'column', gap: 8 }} {...btnHover('var(--accent-cyan)')}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--accent-cyan)' }}><FolderIcon /></div>
                          <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{folder.name}</div>
                          <div style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.05em' }}>{folder.linkCount ?? 0} {folder.linkCount === 1 ? 'link' : 'links'}</div>
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); handleDeleteFolder(folder._id); }} style={{ position: 'absolute', top: 6, right: 6, background: 'var(--bg-elevated)', border: '1px solid var(--border-dim)', color: 'var(--text-muted)', width: 22, height: 22, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem', transition: 'background 0.15s, color 0.15s' }} onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,59,59,0.2)'; e.currentTarget.style.color = 'var(--accent-coral)'; }} onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--bg-elevated)'; e.currentTarget.style.color = 'var(--text-muted)'; }} title="Delete folder">✕</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── Section label ── */}
            {view === 'main' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <div style={{ width: 4, height: 18, background: 'var(--accent-cyan)' }} />
                <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Ungrouped Links</span>
              </div>
            )}

            {/* ── Links grid ── */}
            {displayLinks.length === 0 ? (
              <div style={{ border: '2px dashed var(--border-dim)', padding: '60px 24px', textAlign: 'center' }}>
                <div style={{ fontSize: '3rem', marginBottom: 16 }}>🔗</div>
                <p style={{ margin: '0 0 8px 0', color: 'var(--text-secondary)', fontWeight: 700, fontSize: '1.1rem' }}>
                  {searchQuery ? 'No links found' : view === 'folder' ? 'No links in this folder' : 'No ungrouped links'}
                </p>
                <p style={{ margin: '0 0 20px 0', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  {searchQuery ? `No results for "${searchQuery}"` : 'Save a link to get started'}
                </p>
                {!searchQuery && (
                  <button onClick={openAddLink} style={{ padding: '10px 20px', background: 'var(--accent-cyan)', color: '#000', border: '3px solid var(--border-primary)', boxShadow: '4px 4px 0px var(--border-primary)', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', fontFamily: "'Space Grotesk', sans-serif", display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                    <PlusIcon /> SAVE LINK
                  </button>
                )}
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
                {displayLinks.map((link) => <LinkCard key={link._id} link={link} />)}
              </div>
            )}
          </>
        )}
      </div>

      {/* ── Modal ── */}
      {isAddingLink && (
        <div className="nb-modal-overlay">
          <div className="nb-modal" style={{ boxShadow: '8px 8px 0px var(--accent-cyan)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <div>
                <div style={{ display: 'inline-block', background: 'var(--accent-cyan)', color: '#000', fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.12em', padding: '3px 8px', marginBottom: 6, border: '2px solid #000' }}>NEW</div>
                <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>Save Link</h2>
              </div>
              <button onClick={handleCancel} disabled={isAdding} style={{ background: 'transparent', border: '2px solid var(--border-dim)', color: 'var(--text-muted)', padding: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center' }} onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--border-primary)'; e.currentTarget.style.color = 'var(--text-primary)'; }} onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-dim)'; e.currentTarget.style.color = 'var(--text-muted)'; }}>
                <CloseIcon />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div>
                <label className="nb-label">Title *</label>
                <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="Give this link a name..." autoFocus disabled={isAdding} className="nb-input" />
              </div>
              <div>
                <label className="nb-label">URL *</label>
                <input type="text" value={formData.url} onChange={(e) => setFormData({ ...formData, url: e.target.value })} placeholder="https://example.com" disabled={isAdding} className="nb-input" />
                <p style={{ margin: '6px 0 0 0', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>You can enter with or without https://</p>
              </div>
              <div>
                <label className="nb-label">Description <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(optional)</span></label>
                <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="What is this link about?" rows={3} disabled={isAdding} className="nb-input nb-textarea" />
              </div>

              <FolderSelect />

              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', paddingTop: 4 }}>
                <button onClick={handleAdd} disabled={isAdding || !formData.title.trim() || !formData.url.trim()} style={{ flex: 1, minWidth: 120, padding: '12px 16px', background: 'var(--accent-cyan)', color: '#000', border: '3px solid var(--border-primary)', boxShadow: '4px 4px 0px var(--border-primary)', fontWeight: 700, letterSpacing: '0.06em', cursor: 'pointer', transition: 'transform 0.1s, box-shadow 0.1s', fontFamily: "'Space Grotesk', sans-serif", display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: (isAdding || !formData.title.trim() || !formData.url.trim()) ? 0.5 : 1 }}>
                  {isAdding ? (<><Spinner /><SpinnerStyle /> SAVING...</>) : '+ SAVE LINK'}
                </button>
                <button onClick={handleCancel} disabled={isAdding} className="nb-btn nb-btn-secondary" style={{ padding: '12px 20px', letterSpacing: '0.06em' }}>CANCEL</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};