import { useState, useEffect } from 'react';
import { useNotesStore } from '../lib/notesStore';

const PlusIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square">
    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);
const EditIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
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

export const Notes = () => {
  const {
    notes, isLoading, isAdding, isUpdating, isDeleting,
    fetchNotes, addNote, updateNote, deleteNote,
  } = useNotesStore();

  const [isAddingNote, setIsAddingNote] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ title: '', content: '' });
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => { fetchNotes(); }, [fetchNotes]);

  const handleAdd = async () => {
    if (formData.title.trim()) {
      const result = await addNote({ title: formData.title.trim(), content: formData.content.trim() });
      if (result.success) { setFormData({ title: '', content: '' }); setIsAddingNote(false); }
    }
  };

  const handleEdit = (note) => {
    setEditingId(note._id);
    setFormData({ title: note.title, content: note.content || '' });
  };

  const handleUpdate = async () => {
    if (formData.title.trim()) {
      const result = await updateNote(editingId, { title: formData.title.trim(), content: formData.content.trim() });
      if (result.success) { setEditingId(null); setFormData({ title: '', content: '' }); }
    }
  };

  const handleCancel = () => {
    setIsAddingNote(false);
    setEditingId(null);
    setFormData({ title: '', content: '' });
  };

  const filteredNotes = notes.filter((note) =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (note.content && note.content.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

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
              <div style={{ width: 8, height: 32, background: 'var(--accent-yellow)', border: '2px solid var(--border-primary)' }} />
              <h1
                style={{
                  margin: 0,
                  fontSize: 'clamp(1.6rem, 3vw, 2.4rem)',
                  fontWeight: 800,
                  color: 'var(--text-primary)',
                  letterSpacing: '-0.02em',
                }}
              >
                MY NOTES
              </h1>
            </div>
            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 500, paddingLeft: 20 }}>
              {filteredNotes.length} {filteredNotes.length === 1 ? 'note' : 'notes'}
              {searchQuery && ' found'}
            </p>
          </div>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
            {/* Search */}
            <div style={{ position: 'relative' }}>
              <span
                style={{
                  position: 'absolute',
                  left: 10,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)',
                  pointerEvents: 'none',
                }}
              >
                <SearchIcon />
              </span>
              <input
                type="text"
                placeholder="Search notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="nb-input"
                style={{ paddingLeft: 36, width: 220, fontSize: '0.875rem' }}
              />
            </div>

            {/* Add button */}
            {!isAddingNote && !editingId && (
              <button
                onClick={() => setIsAddingNote(true)}
                disabled={isLoading}
                className="nb-btn nb-btn-primary"
                style={{ gap: 8, padding: '10px 18px' }}
              >
                <PlusIcon />
                NEW NOTE
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
                borderTop: '3px solid var(--accent-yellow)',
                borderRadius: '50%',
                animation: 'spin 0.8s linear infinite',
              }}
            />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        ) : (
          <>
            {/* ── Notes Grid ── */}
            {filteredNotes.length === 0 ? (
              <div
                style={{
                  border: '2px dashed var(--border-dim)',
                  padding: '60px 24px',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '3rem', marginBottom: 16 }}>📝</div>
                <p style={{ margin: '0 0 8px 0', color: 'var(--text-secondary)', fontWeight: 700, fontSize: '1.1rem' }}>
                  {searchQuery ? 'No notes found' : 'No notes yet'}
                </p>
                <p style={{ margin: '0 0 20px 0', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  {searchQuery ? `No results for "${searchQuery}"` : 'Create your first note to get started'}
                </p>
                {!searchQuery && (
                  <button onClick={() => setIsAddingNote(true)} className="nb-btn nb-btn-primary" style={{ padding: '10px 20px' }}>
                    <PlusIcon /> CREATE NOTE
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
                {filteredNotes.map((note) => (
                  <div
                    key={note._id}
                    style={{
                      background: 'var(--bg-surface)',
                      border: '3px solid var(--border-primary)',
                      boxShadow: '4px 4px 0px var(--accent-yellow)',
                      padding: '20px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 12,
                      transition: 'transform 0.1s ease, box-shadow 0.1s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translate(-2px,-2px)';
                      e.currentTarget.style.boxShadow = '6px 6px 0px var(--accent-yellow)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translate(0,0)';
                      e.currentTarget.style.boxShadow = '4px 4px 0px var(--accent-yellow)';
                    }}
                  >
                    {/* Note header */}
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
                        {note.title}
                      </h3>
                      <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                        <button
                          onClick={() => handleEdit(note)}
                          disabled={isUpdating || isDeleting}
                          style={{
                            background: 'transparent',
                            border: '2px solid var(--border-dim)',
                            color: 'var(--text-muted)',
                            padding: '5px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'border-color 0.15s, color 0.15s',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = 'var(--accent-yellow)';
                            e.currentTarget.style.color = 'var(--accent-yellow)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = 'var(--border-dim)';
                            e.currentTarget.style.color = 'var(--text-muted)';
                          }}
                          title="Edit note"
                        >
                          <EditIcon />
                        </button>
                        <button
                          onClick={() => deleteNote(note._id)}
                          disabled={isUpdating || isDeleting}
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
                          title="Delete note"
                        >
                          <TrashIcon />
                        </button>
                      </div>
                    </div>

                    {/* Content preview */}
                    {note.content && (
                      <p
                        style={{
                          margin: 0,
                          fontSize: '0.85rem',
                          color: 'var(--text-secondary)',
                          lineHeight: 1.6,
                          overflow: 'hidden',
                          display: '-webkit-box',
                          WebkitLineClamp: 4,
                          WebkitBoxOrient: 'vertical',
                          flex: 1,
                        }}
                      >
                        {note.content}
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
                      }}
                    >
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.05em' }}>
                        {formatDate(note.createdAt)}
                      </span>
                      <span
                        className="nb-badge"
                        style={{ color: 'var(--accent-yellow)', fontSize: '0.6rem', borderColor: 'var(--accent-yellow)' }}
                      >
                        NOTE
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* ── Modal (Add / Edit) ── */}
      {(isAddingNote || editingId) && (
        <div className="nb-modal-overlay">
          <div className="nb-modal">
            {/* Modal header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <div>
                <div
                  style={{
                    display: 'inline-block',
                    background: 'var(--accent-yellow)',
                    color: '#000',
                    fontSize: '0.65rem',
                    fontWeight: 800,
                    letterSpacing: '0.12em',
                    padding: '3px 8px',
                    marginBottom: 6,
                    border: '2px solid #000',
                  }}
                >
                  {isAddingNote ? 'NEW' : 'EDIT'}
                </div>
                <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
                  {isAddingNote ? 'Add Note' : 'Edit Note'}
                </h2>
              </div>
              <button
                onClick={handleCancel}
                disabled={isAdding || isUpdating}
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
                  placeholder="Enter note title..."
                  autoFocus
                  disabled={isAdding || isUpdating}
                  className="nb-input"
                />
              </div>
              <div>
                <label className="nb-label">Content</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Write your note here..."
                  rows={6}
                  disabled={isAdding || isUpdating}
                  className="nb-input nb-textarea"
                />
              </div>

              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', paddingTop: 4 }}>
                <button
                  onClick={isAddingNote ? handleAdd : handleUpdate}
                  disabled={isAdding || isUpdating || !formData.title.trim()}
                  className="nb-btn nb-btn-primary"
                  style={{ flex: 1, minWidth: 120, padding: '12px 16px', letterSpacing: '0.06em' }}
                >
                  {isAdding || isUpdating ? (
                    <>
                      <div style={{ width: 16, height: 16, border: '2px solid #000', borderTop: '2px solid transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
                      SAVING...
                    </>
                  ) : (
                    isAddingNote ? '+ ADD NOTE' : '✓ SAVE CHANGES'
                  )}
                </button>
                <button
                  onClick={handleCancel}
                  disabled={isAdding || isUpdating}
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