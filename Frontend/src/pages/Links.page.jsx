import { useState, useEffect } from 'react';
import { useLinksStore } from '../lib/linksStore';
import { useLinkFoldersStore } from '../lib/linkFoldersStore';

export const Links = () => {
  const { links, isLoading, isAdding, isUpdating, isDeleting, fetchLinks, addLink, updateLink, deleteLink } = useLinksStore();
  const { linkFolders, isLoadingFolders, isCreatingFolder, fetchLinkFolders, createLinkFolder, deleteLinkFolder } = useLinkFoldersStore();

  const [view, setView] = useState('main');
  const [selectedFolder, setSelectedFolder] = useState(null);

  // Modals state
  const [isAddingLink, setIsAddingLink] = useState(false);
  const [movingLink, setMovingLink] = useState(null);
  const [formData, setFormData] = useState({ title: '', url: '', description: '', folder_id: '' });

  // Folder creation state
  const [showNewFolderInput, setShowNewFolderInput] = useState(false);
  const [inlineFolderName, setInlineFolderName] = useState('');
  const [isAddingFolder, setIsAddingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchLinks();
    fetchLinkFolders();
  }, [fetchLinks, fetchLinkFolders]);

  const folderId = (l) => l.folder_id?._id || l.folder_id || null;
  const ungroupedLinks = links.filter((l) => !folderId(l));
  const linksInFolder = (folder) => links.filter((l) => String(folderId(l)) === String(folder._id));

  const displayLinks = view === 'folder' && selectedFolder
    ? linksInFolder(selectedFolder).filter((l) =>
        l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (l.description && l.description.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : ungroupedLinks.filter((l) =>
        l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (l.description && l.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );

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
    const result = await addLink({
      title: formData.title.trim(),
      url,
      description: formData.description.trim(),
      folder_id: formData.folder_id || null,
    });
    if (result.success) {
      setFormData({ title: '', url: '', description: '', folder_id: '' });
      setIsAddingLink(false);
      await fetchLinkFolders();
    }
  };

  const handleCancel = () => {
    setIsAddingLink(false);
    setFormData({ title: '', url: '', description: '', folder_id: '' });
    setShowNewFolderInput(false);
    setInlineFolderName('');
  };

  const handleDeleteLink = async (linkId) => {
    await deleteLink(linkId);
    await fetchLinkFolders();
  };

  const handleConfirmMove = async (targetFolderId) => {
    if (!movingLink) return;
    const currentFId = folderId(movingLink);
    if (String(currentFId || '') === String(targetFolderId || '')) {
      setMovingLink(null);
      return;
    }
    const result = await updateLink(movingLink._id, { folder_id: targetFolderId || null });
    if (result.success) {
      setMovingLink(null);
      await fetchLinkFolders();
    }
  };

  const handleCreateInlineFolder = async () => {
    if (!inlineFolderName.trim()) return;
    const result = await createLinkFolder(inlineFolderName.trim());
    if (result.success) {
      setFormData((p) => ({ ...p, folder_id: result.folder._id }));
      setInlineFolderName('');
      setShowNewFolderInput(false);
    }
  };

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;
    const result = await createLinkFolder(newFolderName.trim());
    if (result.success) {
      setNewFolderName('');
      setIsAddingFolder(false);
    }
  };

  const handleDeleteFolder = async (fId) => {
    await deleteLinkFolder(fId);
    if (selectedFolder?._id === fId) {
      setSelectedFolder(null);
      setView('main');
    }
    await fetchLinks();
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

  const openLink = (url) => window.open(url, '_blank', 'noopener,noreferrer');

  const getDomain = (url) => {
    try {
      return new URL(url).hostname.replace('www.', '');
    } catch {
      return url.replace(/^https?:\/\//, '').split('/')[0];
    }
  };

  const formatDate = (d) =>
    new Date(d).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

  /* ── Link Card ── */
  const LinkCard = ({ link }) => {
    const currentFId = folderId(link);
    const folderObj = currentFId ? linkFolders.find((f) => String(f._id) === String(currentFId)) : null;

    return (
      <article className="group flex flex-col justify-between rounded-xl bg-[#1a1c1f] hover:bg-[#1e2023] p-5 border border-white/5 hover:border-white/10 transition-all duration-200 shadow-md">
        <div className="flex flex-col gap-2.5">
          {/* Card Top: Domain Pill & Action Controls */}
          <div className="flex items-center justify-between gap-2">
            <button
              onClick={() => openLink(link.url)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#282a2d] hover:bg-[#333538] text-[#d0bcff] font-mono text-[11px] font-medium border border-white/5 transition-colors cursor-pointer text-left"
              title="Open website"
            >
              <span className="text-[11px] leading-none text-[#d0bcff]">⬡</span>
              <span className="truncate max-w-[150px]">{getDomain(link.url)}</span>
            </button>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setMovingLink(link)}
                disabled={isUpdating || isDeleting}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-[#94a3b8] hover:text-[#e2e2e6] hover:bg-[#282a2d] transition-colors cursor-pointer"
                title="Move to folder"
              >
                <span className="material-symbols-outlined text-[16px]">drive_file_move</span>
              </button>
              <button
                onClick={() => openLink(link.url)}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-[#94a3b8] hover:text-[#c0c1ff] hover:bg-[#282a2d] transition-colors cursor-pointer"
                title="Open link"
              >
                <span className="material-symbols-outlined text-[16px]">open_in_new</span>
              </button>
              <button
                onClick={() => handleDeleteLink(link._id)}
                disabled={isDeleting}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-[#94a3b8] hover:text-[#ffb4ab] hover:bg-[#282a2d] transition-colors cursor-pointer"
                title="Delete link"
              >
                <span className="material-symbols-outlined text-[16px]">delete</span>
              </button>
            </div>
          </div>

          {/* Title & Description */}
          <h3 className="text-base font-semibold text-[#e2e2e6] group-hover:text-[#c0c1ff] transition-colors line-clamp-2 leading-snug">
            {link.title}
          </h3>
          {link.description && (
            <p className="text-xs text-[#94a3b8] line-clamp-3 leading-relaxed">
              {link.description}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 mt-4 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-[#94a3b8]">
          <span>{formatDate(link.createdAt)}</span>
          {folderObj ? (
            <span className="inline-flex items-center gap-1 text-[#d0bcff]">
              <span className="material-symbols-outlined text-[13px]">folder</span>
              <span className="truncate max-w-[120px]">{folderObj.name}</span>
            </span>
          ) : (
            <span className="text-[#94a3b8]/60">LINK</span>
          )}
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
                <span>All Links</span>
              </button>
              <span className="text-[#94a3b8] font-mono">/</span>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#d0bcff] text-[20px]">folder_open</span>
                <h1 className="text-xl sm:text-2xl font-bold text-[#e2e2e6] uppercase tracking-tight truncate">
                  {selectedFolder?.name}
                </h1>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-[#d0bcff] text-[24px]">link</span>
              <h1 className="text-2xl font-bold text-[#e2e2e6] uppercase tracking-tight">
                My Links
              </h1>
            </div>
          )}

          <span className="px-2.5 py-0.5 rounded-full bg-[#1a1c1f] text-[11px] font-mono text-[#d0bcff] border border-white/5">
            {displayLinks.length} {displayLinks.length === 1 ? 'link' : 'links'}
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
              placeholder="Filter links... [⌘K]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0c0e11] text-[#e2e2e6] text-xs pl-9 pr-10 py-2 rounded-lg border border-white/10 focus:border-[#d0bcff] focus:outline-none transition-colors"
            />
            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded bg-[#1e2023] text-[10px] font-mono text-[#94a3b8]">
              ⌘K
            </span>
          </div>

          <button
            onClick={openAddLink}
            className="tac-btn-primary shrink-0"
          >
            <span className="material-symbols-outlined text-[17px]">add</span>
            <span>Add Link</span>
          </button>
        </div>
      </div>

      {isLoading || isLoadingFolders ? (
        <div className="flex items-center justify-center min-h-[50vh] flex-col gap-3">
          <div className="w-8 h-8 border-2 border-white/10 border-t-[#d0bcff] rounded-full animate-spin" />
          <span className="text-xs font-mono uppercase tracking-widest text-[#94a3b8]">
            Loading reference graph...
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
                    ({linkFolders.length})
                  </span>
                </div>

                {!isAddingFolder ? (
                  <button
                    onClick={() => setIsAddingFolder(true)}
                    className="inline-flex items-center gap-1 text-xs text-[#d0bcff] hover:text-[#e9ddff] font-medium transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[15px]">create_new_folder</span>
                    <span>New Folder</span>
                  </button>
                ) : null}
              </div>

              {/* Inline Folder Creation Bar */}
              {isAddingFolder && (
                <div className="bg-[#1a1c1f] p-2 rounded-xl border border-white/10 flex items-center gap-2 shadow-sm">
                  <span className="material-symbols-outlined text-[#d0bcff] text-[20px] pl-2">
                    folder_open
                  </span>
                  <input
                    type="text"
                    placeholder="Folder name (e.g., Design Systems & UI)..."
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
                    className="bg-[#0c0e11] text-[#e2e2e6] text-xs px-3 py-1.5 rounded-lg flex-1 border border-white/5 focus:outline-none focus:border-[#d0bcff]"
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
              {linkFolders.length === 0 ? (
                <div className="p-6 rounded-xl bg-[#14171d] border border-white/5 text-center flex items-center justify-center gap-2 text-xs text-[#94a3b8]">
                  <span className="material-symbols-outlined text-[18px]">folder_off</span>
                  <span>No folders created yet. Click "New Folder" to categorize your links.</span>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                  {linkFolders.map((folder) => (
                    <div
                      key={folder._id}
                      onClick={() => openFolder(folder)}
                      className="group relative bg-[#1a1c1f] hover:bg-[#1e2023] p-3.5 rounded-xl border border-white/5 hover:border-white/10 flex items-center justify-between transition-all cursor-pointer shadow-sm"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-lg bg-[#282a2d] group-hover:bg-[#d0bcff]/20 flex items-center justify-center text-[#d0bcff] transition-colors shrink-0">
                          <span className="material-symbols-outlined text-[20px]">folder</span>
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-sm font-medium text-[#e2e2e6] group-hover:text-[#d0bcff] transition-colors truncate">
                            {folder.name}
                          </span>
                          <span className="text-[11px] font-mono text-[#94a3b8]">
                            {folder.linkCount ?? 0} {folder.linkCount === 1 ? 'link' : 'links'}
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

          {/* ── Links Section ── */}
          <section className="flex flex-col gap-4">
            {view === 'main' && (
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#94a3b8]">
                  Ungrouped & All Links
                </span>
                <span className="text-xs font-mono text-[#94a3b8]">
                  {displayLinks.length} visible
                </span>
              </div>
            )}

            {displayLinks.length === 0 ? (
              <div className="p-12 rounded-xl bg-[#14171d] border border-white/5 text-center flex flex-col items-center gap-3">
                <span className="material-symbols-outlined text-4xl text-[#94a3b8]/40">
                  bookmark_border
                </span>
                <p className="text-sm font-medium text-[#e2e2e6]">
                  {searchQuery
                    ? 'No links match your search'
                    : view === 'folder'
                    ? 'No links in this folder yet'
                    : 'No links saved yet'}
                </p>
                <p className="text-xs text-[#94a3b8] max-w-sm">
                  {searchQuery
                    ? `No records found for "${searchQuery}"`
                    : 'Save links and articles to organize your external knowledge reference graph.'}
                </p>
                {!searchQuery && (
                  <button
                    onClick={openAddLink}
                    className="tac-btn-primary mt-2"
                  >
                    <span className="material-symbols-outlined text-[16px]">add</span>
                    <span>Save Link</span>
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {displayLinks.map((link) => (
                  <LinkCard key={link._id} link={link} />
                ))}
              </div>
            )}
          </section>
        </>
      )}

      {/* ── Move to Folder Modal ── */}
      {movingLink && (
        <div className="tac-modal-overlay">
          <div className="tac-modal">
            <div className="flex items-center justify-between pb-4 border-b border-white/5 mb-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#d0bcff] text-[20px]">
                  drive_file_move
                </span>
                <h2 className="text-base font-semibold text-[#e2e2e6]">
                  Move to Folder
                </h2>
              </div>
              <button
                onClick={() => setMovingLink(null)}
                className="p-1 rounded-lg text-[#94a3b8] hover:text-[#e2e2e6] hover:bg-[#282a2d] transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <p className="text-xs text-[#94a3b8] mb-4">
              Select destination folder for{' '}
              <strong className="text-[#e2e2e6]">"{movingLink.title}"</strong>:
            </p>

            <div className="flex flex-col gap-2 max-h-60 overflow-y-auto pr-1 mb-5">
              {/* Option: Ungrouped */}
              <button
                onClick={() => handleConfirmMove(null)}
                disabled={isUpdating}
                className={`flex items-center justify-between p-3 rounded-xl border text-xs font-medium transition-all text-left cursor-pointer ${
                  !folderId(movingLink)
                    ? 'bg-[#d0bcff]/10 border-[#d0bcff] text-[#e2e2e6]'
                    : 'bg-[#14171d] border-white/5 text-[#94a3b8] hover:border-white/10 hover:text-[#e2e2e6]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-[18px]">folder_off</span>
                  <span>None (Ungrouped)</span>
                </div>
                {!folderId(movingLink) && (
                  <span className="text-[10px] font-mono text-[#d0bcff] font-semibold">CURRENT</span>
                )}
              </button>

              {/* Option: Existing folders */}
              {linkFolders.map((folder) => {
                const isCurrent = String(folderId(movingLink)) === String(folder._id);
                return (
                  <button
                    key={folder._id}
                    onClick={() => handleConfirmMove(folder._id)}
                    disabled={isUpdating}
                    className={`flex items-center justify-between p-3 rounded-xl border text-xs font-medium transition-all text-left cursor-pointer ${
                      isCurrent
                        ? 'bg-[#d0bcff]/10 border-[#d0bcff] text-[#e2e2e6]'
                        : 'bg-[#14171d] border-white/5 text-[#94a3b8] hover:border-white/10 hover:text-[#e2e2e6]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="material-symbols-outlined text-[18px] text-[#d0bcff]">
                        folder
                      </span>
                      <span>{folder.name}</span>
                    </div>
                    {isCurrent && (
                      <span className="text-[10px] font-mono text-[#d0bcff] font-semibold">CURRENT</span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setMovingLink(null)}
                className="tac-btn-secondary text-xs"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Save Link Modal ── */}
      {isAddingLink && (
        <div className="tac-modal-overlay">
          <div className="tac-modal">
            <div className="flex items-center justify-between pb-4 border-b border-white/5 mb-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#d0bcff] text-[20px]">
                  bookmark_add
                </span>
                <h2 className="text-base font-semibold text-[#e2e2e6]">
                  Save Link
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
                  placeholder="Give this link a title..."
                  autoFocus
                  disabled={isAdding}
                  className="tac-input"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-[#94a3b8] mb-1.5">
                  URL *
                </label>
                <input
                  type="text"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  placeholder="https://example.com/article"
                  disabled={isAdding}
                  className="tac-input font-mono text-xs"
                />
                <p className="text-[11px] text-[#94a3b8] mt-1">
                  Prefix with https:// or type root domain directly.
                </p>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-[#94a3b8] mb-1.5">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Optional notes or summary about this resource..."
                  rows={3}
                  disabled={isAdding}
                  className="tac-input text-xs resize-y"
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
                    {linkFolders.map((f) => (
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
                  disabled={isAdding}
                  className="tac-btn-secondary text-xs"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAdd}
                  disabled={isAdding || !formData.title.trim() || !formData.url.trim()}
                  className="tac-btn-primary text-xs"
                >
                  {isAdding ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-[#1000a9] border-t-transparent rounded-full animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    'Save Link'
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