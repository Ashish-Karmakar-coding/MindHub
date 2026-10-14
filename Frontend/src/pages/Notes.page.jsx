import { useState, useEffect } from 'react';
import { useNotesStore } from '../lib/notesStore';
import { useNoteFoldersStore } from '../lib/noteFoldersStore';

export const Notes = () => {
  const { notes, isLoading, isAdding, isUpdating, isDeleting, fetchNotes, addNote, updateNote, deleteNote } = useNotesStore();
  const { noteFolders, isLoadingFolders, isCreatingFolder, fetchNoteFolders, createNoteFolder, deleteNoteFolder } = useNoteFoldersStore();

  const [view, setView] = useState('main');
  const [selectedFolder, setSelectedFolder] = useState(null);

  // Modals state
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [movingNote, setMovingNote] = useState(null);
  const [formData, setFormData] = useState({ title: '', content: '', folder_id: '' });

  // Folder creation state
  const [showNewFolderInput, setShowNewFolderInput] = useState(false);
  const [inlineFolderName, setInlineFolderName] = useState('');
  const [isAddingFolder, setIsAddingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchNotes();
    fetchNoteFolders();
  }, [fetchNotes, fetchNoteFolders]);

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

  const openAddNote = () => {
    setFormData({ title: '', content: '', folder_id: selectedFolder?._id || '' });
    setShowNewFolderInput(false);
    setInlineFolderName('');
    setIsAddingNote(true);
  };

  const handleAdd = async () => {
    if (!formData.title.trim()) return;
    const result = await addNote({
      title: formData.title.trim(),
      content: formData.content.trim(),
      folder_id: formData.folder_id || null,
    });
    if (result.success) {
      setFormData({ title: '', content: '', folder_id: '' });
      setIsAddingNote(false);
      await fetchNoteFolders();
    }
  };

  const handleEdit = (note) => {
    setEditingNote(note);
    setFormData({
      title: note.title,
      content: note.content || '',
      folder_id: folderId(note) || '',
    });
    setShowNewFolderInput(false);
    setInlineFolderName('');
  };

  const handleUpdate = async () => {
    if (!formData.title.trim()) return;
    const result = await updateNote(editingNote._id, {
      title: formData.title.trim(),
      content: formData.content.trim(),
      folder_id: formData.folder_id || null,
    });
    if (result.success) {
      setEditingNote(null);
      setFormData({ title: '', content: '', folder_id: '' });
      await fetchNoteFolders();
    }
  };

  const handleCancel = () => {
    setIsAddingNote(false);
    setEditingNote(null);
    setFormData({ title: '', content: '', folder_id: '' });
    setShowNewFolderInput(false);
    setInlineFolderName('');
  };

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
    if (result.success) {
      setNewFolderName('');
      setIsAddingFolder(false);
    }
  };

  const handleDeleteFolder = async (fId) => {
    await deleteNoteFolder(fId);
    if (selectedFolder?._id === fId) {
      setSelectedFolder(null);
      setView('main');
    }
    await fetchNotes();
  };

  const openFolder = (folder) => {
    setSelectedFolder(folder);
    setView('folder');
    setSearchQuery('');
  };

  const goBack = () => {
    setSelectedFolder(null);
    setView('main');
    setSearchQuery('');
  };

  const formatDate = (d) =>
    new Date(d).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

  const isModal = isAddingNote || !!editingNote;

  /* ── Note Card ── */
  const NoteCard = ({ note }) => {
    const currentFId = folderId(note);
    const folderObj = currentFId ? noteFolders.find((f) => String(f._id) === String(currentFId)) : null;

    return (
      <article className="group flex flex-col justify-between rounded-xl bg-[#1a1c1f] hover:bg-[#1e2023] p-5 border border-white/5 hover:border-white/10 transition-all duration-200 shadow-md">
        <div className="flex flex-col gap-2.5">
          {/* Card Top: Folder Tag & Actions */}
          <div className="flex items-center justify-between gap-2">
            {folderObj ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#282a2d] text-[#c0c1ff] font-mono text-[11px] font-medium border border-white/5">
                <span className="material-symbols-outlined text-[13px]">folder</span>
                <span className="truncate max-w-[140px]">{folderObj.name}</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#14171d] text-[#94a3b8] font-mono text-[10px] border border-white/5">
                UNGROUPED
              </span>
            )}

            <div className="flex items-center gap-1">
              <button
                onClick={() => setMovingNote(note)}
                disabled={isUpdating || isDeleting}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-[#94a3b8] hover:text-[#e2e2e6] hover:bg-[#282a2d] transition-colors cursor-pointer"
                title="Move to folder"
              >
                <span className="material-symbols-outlined text-[16px]">drive_file_move</span>
              </button>
              <button
                onClick={() => handleEdit(note)}
                disabled={isUpdating || isDeleting}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-[#94a3b8] hover:text-[#c0c1ff] hover:bg-[#282a2d] transition-colors cursor-pointer"
                title="Edit note"
              >
                <span className="material-symbols-outlined text-[16px]">edit</span>
              </button>
              <button
                onClick={() => handleDeleteNote(note._id)}
                disabled={isDeleting}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-[#94a3b8] hover:text-[#ffb4ab] hover:bg-[#282a2d] transition-colors cursor-pointer"
                title="Delete note"
              >
                <span className="material-symbols-outlined text-[16px]">delete</span>
              </button>
            </div>
          </div>

          {/* Title & Content */}
          <h3 className="text-base font-semibold text-[#e2e2e6] group-hover:text-[#c0c1ff] transition-colors line-clamp-2">
            {note.title}
          </h3>
          {note.content && (
            <p className="text-xs text-[#94a3b8] line-clamp-4 leading-relaxed whitespace-pre-wrap">
              {note.content}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 mt-4 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-[#94a3b8]">
          <span>{formatDate(note.createdAt)}</span>
          <span className="text-[#94a3b8]/60">NOTE</span>
        </div>
      </article>
    );
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto flex flex-col gap-8">
      {/* ── Top Header Toolbar ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/5">
        <div className="flex items-center gap-3 min-w-0">
          {view === 'folder' ? (
            <div className="flex items-center gap-2">
              <button
                onClick={goBack}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#1a1c1f] text-xs text-[#94a3b8] hover:text-[#e2e2e6] border border-white/5 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                <span>All Notes</span>
              </button>
              <span className="text-[#94a3b8] font-mono">/</span>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#c0c1ff] text-[20px]">folder_open</span>
                <h1 className="text-xl sm:text-2xl font-bold text-[#e2e2e6] uppercase tracking-tight truncate">
                  {selectedFolder?.name}
                </h1>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-[#c0c1ff] text-[24px]">folder_special</span>
              <h1 className="text-2xl font-bold text-[#e2e2e6] uppercase tracking-tight">
                My Notes
              </h1>
            </div>
          )}

          <span className="px-2.5 py-0.5 rounded-full bg-[#1a1c1f] text-[11px] font-mono text-[#c0c1ff] border border-white/5">
            {displayNotes.length} {displayNotes.length === 1 ? 'note' : 'notes'}
          </span>
        </div>

        {/* Search & Actions */}
        <div className="flex items-center gap-2.5 flex-1 md:flex-initial justify-end">
          <div className="relative flex-1 sm:w-72">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8] text-[18px]">
              search
            </span>
            <input
              type="text"
              placeholder="Search notes... [⌘K]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0c0e11] text-[#e2e2e6] text-xs pl-9 pr-10 py-2 rounded-lg border border-white/10 focus:border-[#c0c1ff] focus:outline-none transition-colors"
            />
            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded bg-[#1e2023] text-[10px] font-mono text-[#94a3b8]">
              ⌘K
            </span>
          </div>

          <button
            onClick={openAddNote}
            className="tac-btn-primary shrink-0"
          >
            <span className="material-symbols-outlined text-[17px]">add</span>
            <span>New Note</span>
          </button>
        </div>
      </div>

      {isLoading || isLoadingFolders ? (
        <div className="flex items-center justify-center min-h-[50vh] flex-col gap-3">
          <div className="w-8 h-8 border-2 border-white/10 border-t-[#c0c1ff] rounded-full animate-spin" />
          <span className="text-xs font-mono uppercase tracking-widest text-[#94a3b8]">
            Loading notes registry...
          </span>
        </div>
      ) : (
        <>
          {/* ── Folders Section (Main view only) ── */}
          {view === 'main' && (
            <section className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#94a3b8]">
                    FOLDERS
                  </span>
                  <span className="text-xs font-mono text-[#94a3b8]">
                    ({noteFolders.length})
                  </span>
                </div>

                {!isAddingFolder ? (
                  <button
                    onClick={() => setIsAddingFolder(true)}
                    className="inline-flex items-center gap-1 text-xs text-[#c0c1ff] hover:text-[#e1e0ff] font-medium transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[15px]">create_new_folder</span>
                    <span>New Folder</span>
                  </button>
                ) : null}
              </div>

              {/* Inline Folder Input Bar */}
              {isAddingFolder && (
                <div className="bg-[#1a1c1f] p-2 rounded-xl border border-white/10 flex items-center gap-2 shadow-sm">
                  <span className="material-symbols-outlined text-[#c0c1ff] text-[20px] pl-2">
                    folder_open
                  </span>
                  <input
                    type="text"
                    placeholder="Folder name (e.g., Cryptography & State)..."
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleCreateFolder();
                      if (e.key === 'Escape') {
                        setIsAddingFolder(false);
                        setNewFolderName('');
                      }
                    }}
                    autoFocus
                    className="bg-[#0c0e11] text-[#e2e2e6] text-xs px-3 py-1.5 rounded-lg flex-1 border border-white/5 focus:outline-none focus:border-[#c0c1ff]"
                  />
                  <button
                    onClick={handleCreateFolder}
                    disabled={isCreatingFolder || !newFolderName.trim()}
                    className="tac-btn-primary text-xs py-1.5 px-3"
                  >
                    Add
                  </button>
                  <button
                    onClick={() => {
                      setIsAddingFolder(false);
                      setNewFolderName('');
                    }}
                    className="p-1.5 rounded-lg text-[#94a3b8] hover:text-[#e2e2e6] hover:bg-[#282a2d] transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">close</span>
                  </button>
                </div>
              )}

              {/* Folder Cards Grid */}
              {noteFolders.length === 0 ? (
                <div className="p-6 rounded-xl bg-[#14171d] border border-white/5 text-center flex items-center justify-center gap-2 text-xs text-[#94a3b8]">
                  <span className="material-symbols-outlined text-[18px]">folder_off</span>
                  <span>No folders created yet. Click "New Folder" to organize your notes.</span>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                  {noteFolders.map((folder) => (
                    <div
                      key={folder._id}
                      onClick={() => openFolder(folder)}
                      className="group relative bg-[#1a1c1f] hover:bg-[#1e2023] p-3.5 rounded-xl border border-white/5 hover:border-white/10 flex items-center justify-between transition-all cursor-pointer shadow-sm"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-lg bg-[#282a2d] group-hover:bg-[#c0c1ff]/20 flex items-center justify-center text-[#c0c1ff] transition-colors shrink-0">
                          <span className="material-symbols-outlined text-[20px]">folder</span>
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-sm font-medium text-[#e2e2e6] group-hover:text-[#c0c1ff] transition-colors truncate">
                            {folder.name}
                          </span>
                          <span className="text-[11px] font-mono text-[#94a3b8]">
                            {folder.noteCount ?? 0} {folder.noteCount === 1 ? 'note' : 'notes'}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteFolder(folder._id);
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:bg-[#ffb4ab]/10 text-[#94a3b8] hover:text-[#ffb4ab] transition-all cursor-pointer"
                        title="Delete folder"
                      >
                        <span className="material-symbols-outlined text-[16px]">close</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          {/* ── Notes Section ── */}
          <section className="flex flex-col gap-4">
            {view === 'main' && (
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#94a3b8]">
                  Ungrouped & All Notes
                </span>
                <span className="text-xs font-mono text-[#94a3b8]">
                  {displayNotes.length} visible
                </span>
              </div>
            )}

            {displayNotes.length === 0 ? (
              <div className="p-12 rounded-xl bg-[#14171d] border border-white/5 text-center flex flex-col items-center gap-3">
                <span className="material-symbols-outlined text-4xl text-[#94a3b8]/40">
                  edit_note
                </span>
                <p className="text-sm font-medium text-[#e2e2e6]">
                  {searchQuery
                    ? 'No notes match your search'
                    : view === 'folder'
                    ? 'No notes in this folder yet'
                    : 'No notes created yet'}
                </p>
                <p className="text-xs text-[#94a3b8] max-w-sm">
                  {searchQuery
                    ? `No records found for "${searchQuery}"`
                    : 'Create your first note to start building your tactical knowledge base.'}
                </p>
                {!searchQuery && (
                  <button
                    onClick={openAddNote}
                    className="tac-btn-primary mt-2"
                  >
                    <span className="material-symbols-outlined text-[16px]">add</span>
                    <span>Create Note</span>
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {displayNotes.map((note) => (
                  <NoteCard key={note._id} note={note} />
                ))}
              </div>
            )}
          </section>
        </>
      )}

      {/* ── Move to Folder Modal ── */}
      {movingNote && (
        <div className="tac-modal-overlay">
          <div className="tac-modal">
            <div className="flex items-center justify-between pb-4 border-b border-white/5 mb-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#c0c1ff] text-[20px]">
                  drive_file_move
                </span>
                <h2 className="text-base font-semibold text-[#e2e2e6]">
                  Move to Folder
                </h2>
              </div>
              <button
                onClick={() => setMovingNote(null)}
                className="p-1 rounded-lg text-[#94a3b8] hover:text-[#e2e2e6] hover:bg-[#282a2d] transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <p className="text-xs text-[#94a3b8] mb-4">
              Select destination folder for{' '}
              <strong className="text-[#e2e2e6]">"{movingNote.title}"</strong>:
            </p>

            <div className="flex flex-col gap-2 max-h-60 overflow-y-auto pr-1 mb-5">
              {/* Option: Ungrouped */}
              <button
                onClick={() => handleConfirmMove(null)}
                disabled={isUpdating}
                className={`flex items-center justify-between p-3 rounded-xl border text-xs font-medium transition-all text-left cursor-pointer ${
                  !folderId(movingNote)
                    ? 'bg-[#c0c1ff]/10 border-[#c0c1ff] text-[#e2e2e6]'
                    : 'bg-[#14171d] border-white/5 text-[#94a3b8] hover:border-white/10 hover:text-[#e2e2e6]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-[18px]">folder_off</span>
                  <span>None (Ungrouped)</span>
                </div>
                {!folderId(movingNote) && (
                  <span className="text-[10px] font-mono text-[#c0c1ff] font-semibold">CURRENT</span>
                )}
              </button>

              {/* Option: Existing folders */}
              {noteFolders.map((folder) => {
                const isCurrent = String(folderId(movingNote)) === String(folder._id);
                return (
                  <button
                    key={folder._id}
                    onClick={() => handleConfirmMove(folder._id)}
                    disabled={isUpdating}
                    className={`flex items-center justify-between p-3 rounded-xl border text-xs font-medium transition-all text-left cursor-pointer ${
                      isCurrent
                        ? 'bg-[#c0c1ff]/10 border-[#c0c1ff] text-[#e2e2e6]'
                        : 'bg-[#14171d] border-white/5 text-[#94a3b8] hover:border-white/10 hover:text-[#e2e2e6]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="material-symbols-outlined text-[18px] text-[#c0c1ff]">
                        folder
                      </span>
                      <span>{folder.name}</span>
                    </div>
                    {isCurrent && (
                      <span className="text-[10px] font-mono text-[#c0c1ff] font-semibold">CURRENT</span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setMovingNote(null)}
                className="tac-btn-secondary text-xs"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Add / Edit Note Modal ── */}
      {isModal && (
        <div className="tac-modal-overlay">
          <div className="tac-modal">
            <div className="flex items-center justify-between pb-4 border-b border-white/5 mb-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#c0c1ff] text-[20px]">
                  {isAddingNote ? 'post_add' : 'edit_document'}
                </span>
                <h2 className="text-base font-semibold text-[#e2e2e6]">
                  {isAddingNote ? 'Create Note' : 'Edit Note'}
                </h2>
              </div>
              <button
                onClick={handleCancel}
                className="p-1 rounded-lg text-[#94a3b8] hover:text-[#e2e2e6] hover:bg-[#282a2d] transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-mono uppercase text-[#94a3b8] mb-1.5">
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Note title..."
                  autoFocus
                  disabled={isAdding || isUpdating}
                  className="tac-input"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-[#94a3b8] mb-1.5">
                  Content
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Write knowledge note here..."
                  rows={6}
                  disabled={isAdding || isUpdating}
                  className="tac-input font-mono text-xs resize-y"
                />
              </div>

              {/* Folder Selector */}
              <div>
                <label className="block text-xs font-mono uppercase text-[#94a3b8] mb-1.5">
                  Folder Assignment
                </label>
                {!showNewFolderInput ? (
                  <select
                    value={formData.folder_id}
                    onChange={(e) => {
                      if (e.target.value === '__new__') setShowNewFolderInput(true);
                      else setFormData((p) => ({ ...p, folder_id: e.target.value }));
                    }}
                    className="tac-input cursor-pointer"
                  >
                    <option value="">No folder (Ungrouped)</option>
                    {noteFolders.map((f) => (
                      <option key={f._id} value={f._id}>
                        {f.name}
                      </option>
                    ))}
                    <option value="__new__">+ Create new folder...</option>
                  </select>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="New folder name..."
                      value={inlineFolderName}
                      onChange={(e) => setInlineFolderName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleCreateInlineFolder();
                        if (e.key === 'Escape') {
                          setShowNewFolderInput(false);
                          setInlineFolderName('');
                        }
                      }}
                      className="tac-input text-xs"
                      autoFocus
                    />
                    <button
                      onClick={handleCreateInlineFolder}
                      disabled={isCreatingFolder || !inlineFolderName.trim()}
                      className="tac-btn-primary text-xs shrink-0 py-1 px-3"
                    >
                      + Add
                    </button>
                    <button
                      onClick={() => {
                        setShowNewFolderInput(false);
                        setInlineFolderName('');
                      }}
                      className="tac-btn-secondary text-xs shrink-0 py-1 px-2.5"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  onClick={handleCancel}
                  disabled={isAdding || isUpdating}
                  className="tac-btn-secondary text-xs"
                >
                  Cancel
                </button>
                <button
                  onClick={isAddingNote ? handleAdd : handleUpdate}
                  disabled={isAdding || isUpdating || !formData.title.trim()}
                  className="tac-btn-primary text-xs"
                >
                  {isAdding || isUpdating ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-[#1000a9] border-t-transparent rounded-full animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : isAddingNote ? (
                    'Add Note'
                  ) : (
                    'Save Changes'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};