import { useState, useEffect } from 'react';
import { useNotesStore } from '../lib/notesStore';
import { useNoteFoldersStore } from '../lib/noteFoldersStore';

/* ── Icons ── */
const PlusIcon = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>);
const EditIcon = () => (<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>);
const TrashIcon = () => (<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square"><polyline points="3,6 5,6 21,6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" /></svg>);
const SearchIcon = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>);
const CloseIcon = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>);
const FolderIcon = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" /></svg>);
const FolderMoveIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square">
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
    <path d="M12 11l3 3m0 0l-3 3m3-3H9" />
  </svg>
);
const BackIcon = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12,19 5,12 12,5" /></svg>);
const SpinnerStyle = () => (<style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>);

const Spinner = ({ color = 'var(--accent-yellow)', size = 16 }) => (
  <>
    <SpinnerStyle />
    <div style={{ width: size, height: size, border: `2px solid transparent`, borderTop: `2px solid ${color}`, borderRadius: '50%', animation: 'spin 0.8s linear infinite', flexShrink: 0 }} />
  </>
);

const btnHover = (accent) => ({
  onMouseEnter: (e) => { e.currentTarget.style.transform = 'translate(-2px,-2px)'; e.currentTarget.style.boxShadow = `6px 6px 0px ${accent}`; },
  onMouseLeave: (e) => { e.currentTarget.style.transform = 'translate(0,0)'; e.currentTarget.style.boxShadow = `4px 4px 0px ${accent}`; },
});

const iconBtnHover = (borderColor, color) => ({
  onMouseEnter: (e) => { e.currentTarget.style.borderColor = borderColor; e.currentTarget.style.color = color; },
  onMouseLeave: (e) => { e.currentTarget.style.borderColor = 'var(--border-dim)'; e.currentTarget.style.color = 'var(--text-muted)'; },
});

export const Notes = () => {
  const { notes, isLoading, isAdding, isUpdating, isDeleting, fetchNotes, addNote, updateNote, deleteNote } = useNotesStore();
  const { noteFolders, isLoadingFolders, isCreatingFolder, fetchNoteFolders, createNoteFolder, deleteNoteFolder } = useNoteFoldersStore();

  // View state: 'main' = folders + ungrouped | 'folder' = inside a folder
  const [view, setView] = useState('main');
  const [selectedFolder, setSelectedFolder] = useState(null);

  // Modal state
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [movingNote, setMovingNote] = useState(null);
  const [formData, setFormData] = useState({ title: '', content: '', folder_id: '' });

  // Folder creation in modal
  const [showNewFolderInput, setShowNewFolderInput] = useState(false);
  const [inlineFolderName, setInlineFolderName] = useState('');

  // New folder from main view
  const [isAddingFolder, setIsAddingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchNotes();
    fetchNoteFolders();
  }, [fetchNotes, fetchNoteFolders]);

  /* ── Derived data ── */
  const folderId = (n) => n.folder_id?._id || n.folder_id || null;
  const ungroupedNotes = notes.filter((n) => !folderId(n));
  const notesInFolder = (folder) => notes.filter((n) => String(folderId(n)) === String(folder._id));

  const displayNotes = view === 'folder' && selectedFolder
    ? notesInFolder(selectedFolder).filter((n) =>
        n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (n.content && n.content.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : ungroupedNotes.filter((n) =>
        n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (n.content && n.content.toLowerCase().includes(searchQuery.toLowerCase()))
      );

  /* ── Handlers ── */
  const openAddNote = () => {
    setFormData({ title: '', content: '', folder_id: selectedFolder?._id || '' });
    setShowNewFolderInput(false);
    setInlineFolderName('');
    setIsAddingNote(true);
  };

  const handleAdd = async () => {
    if (!formData.title.trim()) return;
    const result = await addNote({ title: formData.title.trim(), content: formData.content.trim(), folder_id: formData.folder_id || null });
    if (result.success) {
      setFormData({ title: '', content: '', folder_id: '' });
      setIsAddingNote(false);
      await fetchNoteFolders(); // refresh counts
    }
  };

  const handleEdit = (note) => {
    setEditingNote(note);
    setFormData({ title: note.title, content: note.content || '', folder_id: folderId(note) || '' });
    setShowNewFolderInput(false);
    setInlineFolderName('');
  };

  const handleUpdate = async () => {
    if (!formData.title.trim()) return;
    const result = await updateNote(editingNote._id, { title: formData.title.trim(), content: formData.content.trim(), folder_id: formData.folder_id || null });
    if (result.success) { setEditingNote(null); setFormData({ title: '', content: '', folder_id: '' }); await fetchNoteFolders(); }
  };

  const handleCancel = () => { setIsAddingNote(false); setEditingNote(null); setFormData({ title: '', content: '', folder_id: '' }); setShowNewFolderInput(false); setInlineFolderName(''); };

  const handleDeleteNote = async (noteId) => {
    await deleteNote(noteId);
    await fetchNoteFolders();
  };

  const handleConfirmMove = async (targetFolderId) => {
    if (!movingNote) return;
    const currentFId = folderId(movingNote);
    if (String(currentFId || '') === String(targetFolderId || '')) {
      setMovingNote(null);
      return;
    }
    const result = await updateNote(movingNote._id, { folder_id: targetFolderId || null });
    if (result.success) {
      setMovingNote(null);
      await fetchNoteFolders();
    }
  };

  const handleCreateInlineFolder = async () => {
    if (!inlineFolderName.trim()) return;
    const result = await createNoteFolder(inlineFolderName.trim());
    if (result.success) {
      setFormData((prev) => ({ ...prev, folder_id: result.folder._id }));
      setInlineFolderName('');
      setShowNewFolderInput(false);
    }
  };

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;
    const result = await createNoteFolder(newFolderName.trim());
    if (result.success) { setNewFolderName(''); setIsAddingFolder(false); }
  };

  const handleDeleteFolder = async (fId) => {
    await deleteNoteFolder(fId);
    if (selectedFolder?._id === fId) { setSelectedFolder(null); setView('main'); }
    await fetchNotes();
  };

  const openFolder = (folder) => { setSelectedFolder(folder); setView('folder'); setSearchQuery(''); };
  const goBack = () => { setSelectedFolder(null); setView('main'); setSearchQuery(''); };

  const formatDate = (d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  const isModal = isAddingNote || !!editingNote;

  /* ── Card renderer ── */
  const NoteCard = ({ note }) => {
    const currentFId = folderId(note);
    const folderObj = currentFId ? noteFolders.find((f) => String(f._id) === String(currentFId)) : null;

    return (
      <div
        style={{ background: 'var(--bg-surface)', border: '3px solid var(--border-primary)', boxShadow: '4px 4px 0px var(--accent-yellow)', padding: '20px', display: 'flex', flexDirection: 'column', gap: 12, transition: 'transform 0.1s ease, box-shadow 0.1s ease' }}
        {...btnHover('var(--accent-yellow)')}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
          <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', flex: 1, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', lineHeight: 1.4 }}>{note.title}</h3>
          <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
            <button onClick={() => setMovingNote(note)} disabled={isUpdating || isDeleting} style={{ background: 'transparent', border: '2px solid var(--border-dim)', color: 'var(--text-muted)', padding: '5px', cursor: 'pointer', display: 'flex', alignItems: 'center', transition: 'border-color 0.15s, color 0.15s' }} {...iconBtnHover('var(--accent-yellow)', 'var(--accent-yellow)')} title="Move to folder"><FolderMoveIcon /></button>
            <button onClick={() => handleEdit(note)} disabled={isUpdating || isDeleting} style={{ background: 'transparent', border: '2px solid var(--border-dim)', color: 'var(--text-muted)', padding: '5px', cursor: 'pointer', display: 'flex', alignItems: 'center', transition: 'border-color 0.15s, color 0.15s' }} {...iconBtnHover('var(--accent-yellow)', 'var(--accent-yellow)')} title="Edit note"><EditIcon /></button>
            <button onClick={() => handleDeleteNote(note._id)} disabled={isDeleting} style={{ background: 'transparent', border: '2px solid var(--border-dim)', color: 'var(--text-muted)', padding: '5px', cursor: 'pointer', display: 'flex', alignItems: 'center', transition: 'border-color 0.15s, color 0.15s, background 0.15s' }} onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,59,59,0.1)'; e.currentTarget.style.borderColor = 'var(--accent-coral)'; e.currentTarget.style.color = 'var(--accent-coral)'; }} onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'var(--border-dim)'; e.currentTarget.style.color = 'var(--text-muted)'; }} title="Delete note"><TrashIcon /></button>
          </div>
        </div>
        {note.content && (<p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical', flex: 1 }}>{note.content}</p>)}
        <div style={{ borderTop: '1px solid var(--border-dim)', paddingTop: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.05em' }}>{formatDate(note.createdAt)}</span>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            {folderObj && (
              <span className="nb-badge" style={{ color: 'var(--accent-yellow)', fontSize: '0.6rem', borderColor: 'var(--accent-yellow)' }}>
                📁 {folderObj.name}
              </span>
            )}
            <span className="nb-badge" style={{ color: 'var(--text-primary)', fontSize: '0.6rem', borderColor: 'var(--border-dim)' }}>NOTE</span>
          </div>
        </div>
      </div>
    );
  };

  /* ── Folder select dropdown for modal ── */
  const FolderSelect = () => (
    <div>
      <label className="nb-label">Save to Folder <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(optional)</span></label>
      {!showNewFolderInput ? (
        <select
          value={formData.folder_id}
          onChange={(e) => { if (e.target.value === '__new__') { setShowNewFolderInput(true); } else { setFormData((p) => ({ ...p, folder_id: e.target.value })); } }}
          className="nb-input"
          style={{ cursor: 'pointer' }}
        >
          <option value="">No folder (ungrouped)</option>
          {noteFolders.map((f) => (<option key={f._id} value={f._id}>{f.name}</option>))}
          <option value="__new__">+ Create new folder...</option>
        </select>
      ) : (
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            type="text"
            placeholder="New folder name..."
            value={inlineFolderName}
            onChange={(e) => setInlineFolderName(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleCreateInlineFolder(); if (e.key === 'Escape') { setShowNewFolderInput(false); setInlineFolderName(''); } }}
            className="nb-input"
            autoFocus
          />
          <button onClick={handleCreateInlineFolder} disabled={isCreatingFolder || !inlineFolderName.trim()} className="nb-btn nb-btn-primary" style={{ padding: '10px 14px', whiteSpace: 'nowrap', flexShrink: 0 }}>
            {isCreatingFolder ? <Spinner color="#000" /> : '+ Create'}
          </button>
          <button onClick={() => { setShowNewFolderInput(false); setInlineFolderName(''); }} className="nb-btn nb-btn-secondary" style={{ padding: '10px 14px', flexShrink: 0 }}>Cancel</button>
        </div>
      )}
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
                  <BackIcon /> All Notes
                </button>
                <span style={{ color: 'var(--text-muted)' }}>/</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 8, height: 28, background: 'var(--accent-yellow)', border: '2px solid var(--border-primary)' }} />
                  <h1 style={{ margin: 0, fontSize: 'clamp(1.4rem, 3vw, 2rem)', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', textTransform: 'uppercase' }}>{selectedFolder?.name}</h1>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 8, height: 32, background: 'var(--accent-yellow)', border: '2px solid var(--border-primary)' }} />
                <h1 style={{ margin: 0, fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>MY NOTES</h1>
              </div>
            )}
            <p style={{ margin: '4px 0 0 20px', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 500 }}>
              {displayNotes.length} {displayNotes.length === 1 ? 'note' : 'notes'}{searchQuery && ' found'}
            </p>
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }}><SearchIcon /></span>
              <input type="text" placeholder="Search notes..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="nb-input" style={{ paddingLeft: 36, width: 200, fontSize: '0.875rem' }} />
            </div>
            <button onClick={openAddNote} className="nb-btn nb-btn-primary" style={{ gap: 8, padding: '10px 18px' }}>
              <PlusIcon /> NEW NOTE
            </button>
          </div>
        </div>

        {/* ── Loading ── */}
        {(isLoading || isLoadingFolders) ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
            <SpinnerStyle />
            <div style={{ width: 40, height: 40, border: '3px solid var(--border-dim)', borderTop: '3px solid var(--accent-yellow)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
          </div>
        ) : (
          <>
            {/* ── MAIN VIEW: Folders section ── */}
            {view === 'main' && (
              <div style={{ marginBottom: 36 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 4, height: 18, background: 'var(--accent-yellow)' }} />
                    <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Folders</span>
                  </div>
                  {!isAddingFolder ? (
                    <button onClick={() => setIsAddingFolder(true)} style={{ background: 'none', border: 'none', color: 'var(--accent-yellow)', fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <PlusIcon /> New Folder
                    </button>
                  ) : (
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <input type="text" placeholder="Folder name..." value={newFolderName} onChange={(e) => setNewFolderName(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') handleCreateFolder(); if (e.key === 'Escape') { setIsAddingFolder(false); setNewFolderName(''); } }} className="nb-input" style={{ padding: '7px 12px', fontSize: '0.85rem', width: 180 }} autoFocus />
                      <button onClick={handleCreateFolder} disabled={isCreatingFolder || !newFolderName.trim()} className="nb-btn nb-btn-primary" style={{ padding: '7px 12px', fontSize: '0.8rem' }}>
                        {isCreatingFolder ? <Spinner color="#000" size={14} /> : '+ Add'}
                      </button>
                      <button onClick={() => { setIsAddingFolder(false); setNewFolderName(''); }} className="nb-btn nb-btn-secondary" style={{ padding: '7px 10px', fontSize: '0.8rem' }}>✕</button>
                    </div>
                  )}
                </div>

                {noteFolders.length === 0 ? (
                  <div style={{ border: '2px dashed var(--border-dim)', padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 12, color: 'var(--text-muted)' }}>
                    <FolderIcon />
                    <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>No folders yet. Create one to organize your notes.</span>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 14 }}>
                    {noteFolders.map((folder) => (
                      <div key={folder._id} style={{ position: 'relative' }}>
                        <button
                          onClick={() => openFolder(folder)}
                          style={{ width: '100%', background: 'var(--bg-surface)', border: '3px solid var(--border-primary)', boxShadow: '3px 3px 0px var(--accent-yellow)', padding: '16px', cursor: 'pointer', textAlign: 'left', transition: 'transform 0.1s, box-shadow 0.1s', display: 'flex', flexDirection: 'column', gap: 8 }}
                          {...btnHover('var(--accent-yellow)')}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--accent-yellow)' }}><FolderIcon /></div>
                          <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{folder.name}</div>
                          <div style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.05em' }}>{folder.noteCount ?? 0} {folder.noteCount === 1 ? 'note' : 'notes'}</div>
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDeleteFolder(folder._id); }}
                          style={{ position: 'absolute', top: 6, right: 6, background: 'var(--bg-elevated)', border: '1px solid var(--border-dim)', color: 'var(--text-muted)', width: 22, height: 22, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem', transition: 'background 0.15s, color 0.15s' }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,59,59,0.2)'; e.currentTarget.style.color = 'var(--accent-coral)'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--bg-elevated)'; e.currentTarget.style.color = 'var(--text-muted)'; }}
                          title="Delete folder"
                        >✕</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── Section label ── */}
            {view === 'main' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <div style={{ width: 4, height: 18, background: 'var(--accent-yellow)' }} />
                <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Ungrouped Notes</span>
              </div>
            )}

            {/* ── Notes grid ── */}
            {displayNotes.length === 0 ? (
              <div style={{ border: '2px dashed var(--border-dim)', padding: '60px 24px', textAlign: 'center' }}>
                <div style={{ fontSize: '3rem', marginBottom: 16 }}>📝</div>
                <p style={{ margin: '0 0 8px 0', color: 'var(--text-secondary)', fontWeight: 700, fontSize: '1.1rem' }}>
                  {searchQuery ? 'No notes found' : view === 'folder' ? 'No notes in this folder' : 'No ungrouped notes'}
                </p>
                <p style={{ margin: '0 0 20px 0', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  {searchQuery ? `No results for "${searchQuery}"` : 'Create a note to get started'}
                </p>
                {!searchQuery && (
                  <button onClick={openAddNote} className="nb-btn nb-btn-primary" style={{ padding: '10px 20px' }}>
                    <PlusIcon /> CREATE NOTE
                  </button>
                )}
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
                {displayNotes.map((note) => <NoteCard key={note._id} note={note} />)}
              </div>
            )}
          </>
        )}
      </div>

      {/* ── Move to Folder Modal ── */}
      {movingNote && (
        <div className="nb-modal-overlay">
          <div className="nb-modal" style={{ maxWidth: 440 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div>
                <div style={{ display: 'inline-block', background: 'var(--accent-yellow)', color: '#000', fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.12em', padding: '3px 8px', marginBottom: 6, border: '2px solid #000' }}>
                  MOVE
                </div>
                <h2 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
                  Move to Folder
                </h2>
              </div>
              <button onClick={() => setMovingNote(null)} style={{ background: 'transparent', border: '2px solid var(--border-dim)', color: 'var(--text-muted)', padding: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center' }} onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--border-primary)'; e.currentTarget.style.color = 'var(--text-primary)'; }} onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-dim)'; e.currentTarget.style.color = 'var(--text-muted)'; }}>
                <CloseIcon />
              </button>
            </div>

            <p style={{ margin: '0 0 16px 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Select destination folder for <strong style={{ color: 'var(--text-primary)' }}>"{movingNote.title}"</strong>:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 280, overflowY: 'auto', marginBottom: 20, paddingRight: 4 }}>
              {/* Option for Ungrouped */}
              <button
                onClick={() => handleConfirmMove(null)}
                disabled={isUpdating}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 14px',
                  background: !folderId(movingNote) ? 'rgba(255, 229, 0, 0.12)' : 'var(--bg-surface)',
                  border: !folderId(movingNote) ? '2px solid var(--accent-yellow)' : '2px solid var(--border-dim)',
                  color: 'var(--text-primary)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 700,
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--accent-yellow)'; }}
                onMouseLeave={(e) => { if (folderId(movingNote)) e.currentTarget.style.borderColor = 'var(--border-dim)'; }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span>📄</span>
                  <span>None (Ungrouped)</span>
                </div>
                {!folderId(movingNote) && (
                  <span style={{ fontSize: '0.7rem', color: 'var(--accent-yellow)', fontWeight: 800 }}>CURRENT</span>
                )}
              </button>

              {/* Existing folders */}
              {noteFolders.map((folder) => {
                const isCurrent = String(folderId(movingNote)) === String(folder._id);
                return (
                  <button
                    key={folder._id}
                    onClick={() => handleConfirmMove(folder._id)}
                    disabled={isUpdating}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 14px',
                      background: isCurrent ? 'rgba(255, 229, 0, 0.12)' : 'var(--bg-surface)',
                      border: isCurrent ? '2px solid var(--accent-yellow)' : '2px solid var(--border-dim)',
                      color: 'var(--text-primary)',
                      cursor: 'pointer',
                      textAlign: 'left',
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontWeight: 700,
                      transition: 'all 0.15s ease',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--accent-yellow)'; }}
                    onMouseLeave={(e) => { if (!isCurrent) e.currentTarget.style.borderColor = 'var(--border-dim)'; }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ color: 'var(--accent-yellow)' }}><FolderIcon /></span>
                      <span>{folder.name}</span>
                    </div>
                    {isCurrent && (
                      <span style={{ fontSize: '0.7rem', color: 'var(--accent-yellow)', fontWeight: 800 }}>CURRENT</span>
                    )}
                  </button>
                );
              })}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button
                onClick={() => setMovingNote(null)}
                className="nb-btn nb-btn-secondary"
                style={{ padding: '10px 18px' }}
              >
                CANCEL
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Add / Edit Modal ── */}
      {isModal && (
        <div className="nb-modal-overlay">
          <div className="nb-modal">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <div>
                <div style={{ display: 'inline-block', background: 'var(--accent-yellow)', color: '#000', fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.12em', padding: '3px 8px', marginBottom: 6, border: '2px solid #000' }}>
                  {isAddingNote ? 'NEW' : 'EDIT'}
                </div>
                <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
                  {isAddingNote ? 'Add Note' : 'Edit Note'}
                </h2>
              </div>
              <button onClick={handleCancel} style={{ background: 'transparent', border: '2px solid var(--border-dim)', color: 'var(--text-muted)', padding: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center' }} onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--border-primary)'; e.currentTarget.style.color = 'var(--text-primary)'; }} onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-dim)'; e.currentTarget.style.color = 'var(--text-muted)'; }}>
                <CloseIcon />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div>
                <label className="nb-label">Title *</label>
                <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="Enter note title..." autoFocus disabled={isAdding || isUpdating} className="nb-input" />
              </div>
              <div>
                <label className="nb-label">Content</label>
                <textarea value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })} placeholder="Write your note here..." rows={5} disabled={isAdding || isUpdating} className="nb-input nb-textarea" />
              </div>

              <FolderSelect />

              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', paddingTop: 4 }}>
                <button
                  onClick={isAddingNote ? handleAdd : handleUpdate}
                  disabled={isAdding || isUpdating || !formData.title.trim()}
                  className="nb-btn nb-btn-primary"
                  style={{ flex: 1, minWidth: 120, padding: '12px 16px', letterSpacing: '0.06em' }}
                >
                  {isAdding || isUpdating ? (<><Spinner color="#000" /> SAVING...</>) : isAddingNote ? '+ ADD NOTE' : '✓ SAVE CHANGES'}
                </button>
                <button onClick={handleCancel} disabled={isAdding || isUpdating} className="nb-btn nb-btn-secondary" style={{ padding: '12px 20px', letterSpacing: '0.06em' }}>CANCEL</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};