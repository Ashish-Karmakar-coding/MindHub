import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotesStore } from '../lib/notesStore';
import { useLinksStore } from '../lib/linksStore';
import { useNoteFoldersStore } from '../lib/noteFoldersStore';

export const Dashboard = () => {
  const navigate = useNavigate();
  const { notes, isLoading: isLoadingNotes, fetchNotes } = useNotesStore();
  const { links, isLoading: isLoadingLinks, fetchLinks } = useLinksStore();
  const { noteFolders, fetchNoteFolders } = useNoteFoldersStore();

  useEffect(() => {
    fetchNotes();
    fetchLinks();
    fetchNoteFolders();
  }, [fetchNotes, fetchLinks, fetchNoteFolders]);

  const totalNotes = notes.length;
  const totalLinks = links.length;
  const totalFolders = noteFolders.length;

  const recentNotes = [...notes]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 4);

  const recentLinks = [...links]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 4);

  const isLoading = isLoadingNotes || isLoadingLinks;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh] flex-col gap-3">
        <div className="w-8 h-8 border-2 border-white/10 border-t-[#c0c1ff] rounded-full animate-spin" />
        <span className="text-xs font-mono uppercase tracking-widest text-[#94a3b8]">
          Streaming workspace telemetry...
        </span>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto flex flex-col gap-8">
      {/* ── Top Command Matrix Header ── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-white/5">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#1a1c1f] text-[#4edea3] text-[11px] font-mono border border-white/5 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3] animate-ping" />
              Workspace Active • {totalNotes + totalLinks} Items Indexed
            </span>
            <span className="text-[11px] font-mono text-[#94a3b8]/60 hidden sm:inline">
              SYS_REF: #MH-CORE
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#e2e2e6] uppercase flex items-baseline gap-2">
            DASHBOARD
            <span className="text-sm font-normal text-[#c0c1ff] font-mono lowercase tracking-normal">
              / telemetry
            </span>
          </h1>
          <p className="text-sm text-[#94a3b8] max-w-xl">
            Your personal knowledge operating hub. Neural synchronization and local index telemetry are operational.
          </p>
        </div>

        {/* Quick Utilities */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => navigate('/notes')}
            className="tac-btn-primary"
          >
            <span className="material-symbols-outlined text-[17px]">add</span>
            <span>New Note</span>
          </button>
          <button
            onClick={() => navigate('/links')}
            className="tac-btn-secondary"
          >
            <span className="material-symbols-outlined text-[17px]">link</span>
            <span>Save Link</span>
          </button>
        </div>
      </div>

      {/* ── Metric Instrumentation Cards (2-Card Row) ── */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Card 1: Total Notes */}
        <div
          onClick={() => navigate('/notes')}
          className="group relative overflow-hidden rounded-xl bg-[#1a1c1f] hover:bg-[#1e2023] p-6 border border-white/5 hover:border-white/10 transition-all duration-300 flex flex-col justify-between cursor-pointer shadow-lg"
        >
          <div className="absolute -right-8 -top-8 w-32 h-32 bg-[#c0c1ff]/5 rounded-full blur-2xl group-hover:bg-[#c0c1ff]/10 transition-all pointer-events-none" />
          
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-lg bg-[#282a2d] border border-white/10 flex items-center justify-center text-[#c0c1ff] shadow-sm group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-[22px]">description</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#94a3b8]">
                  Cognitive Registry
                </span>
                <span className="text-lg font-semibold text-[#e2e2e6]">Total Notes</span>
              </div>
            </div>
            <span className="text-[10px] font-mono font-semibold text-[#4edea3] px-2 py-0.5 rounded bg-[#00885d]/20 border border-[#4edea3]/20">
              LIVE
            </span>
          </div>

          <div className="my-5 flex items-baseline justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-[#e2e2e6] leading-none">
                {totalNotes}
              </span>
              <span className="text-xs font-mono text-[#94a3b8]">entries</span>
            </div>
            {/* Sparkline Visual */}
            <div className="w-24 h-6 opacity-70 group-hover:opacity-100 transition-opacity">
              <svg className="w-full h-full text-[#c0c1ff]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 100 28">
                <path d="M0,22 L15,18 L30,24 L45,10 L60,15 L75,4 L90,12 L100,2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M0,22 L15,18 L30,24 L45,10 L60,15 L75,4 L90,12 L100,2 L100,28 L0,28 Z" fill="currentColor" fillOpacity="0.1" stroke="none" />
              </svg>
            </div>
          </div>

          <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs text-[#94a3b8]">
            <span className="flex items-center gap-1.5 font-mono text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#c0c1ff]" />
              Across {totalFolders} active {totalFolders === 1 ? 'folder' : 'folders'}
            </span>
            <span className="inline-flex items-center gap-1 text-[#c0c1ff] font-medium group-hover:translate-x-0.5 transition-transform">
              Open Notes →
            </span>
          </div>
        </div>

        {/* Card 2: Saved Links */}
        <div
          onClick={() => navigate('/links')}
          className="group relative overflow-hidden rounded-xl bg-[#1a1c1f] hover:bg-[#1e2023] p-6 border border-white/5 hover:border-white/10 transition-all duration-300 flex flex-col justify-between cursor-pointer shadow-lg"
        >
          <div className="absolute -right-8 -top-8 w-32 h-32 bg-[#d0bcff]/5 rounded-full blur-2xl group-hover:bg-[#d0bcff]/10 transition-all pointer-events-none" />
          
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-lg bg-[#282a2d] border border-white/10 flex items-center justify-center text-[#d0bcff] shadow-sm group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-[22px]">link</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#94a3b8]">
                  Reference Graph
                </span>
                <span className="text-lg font-semibold text-[#e2e2e6]">Saved Links</span>
              </div>
            </div>
            <span className="text-[10px] font-mono font-semibold text-[#d0bcff] px-2 py-0.5 rounded bg-[#571bc1]/20 border border-[#d0bcff]/20">
              EXTERNAL
            </span>
          </div>

          <div className="my-5 flex items-baseline justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-[#e2e2e6] leading-none">
                {totalLinks}
              </span>
              <span className="text-xs font-mono text-[#94a3b8]">nodes</span>
            </div>
            {/* Visual Bar Indicator */}
            <div className="flex gap-1 items-end h-5">
              <span className="w-1.5 h-3 rounded-xs bg-[#d0bcff]/40" />
              <span className="w-1.5 h-4 rounded-xs bg-[#d0bcff]/70" />
              <span className="w-1.5 h-5 rounded-xs bg-[#d0bcff]" />
              <span className="w-1.5 h-3.5 rounded-xs bg-[#d0bcff]/60" />
            </div>
          </div>

          <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs text-[#94a3b8]">
            <span className="flex items-center gap-1.5 font-mono text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#d0bcff]" />
              External Knowledge Nodes
            </span>
            <span className="inline-flex items-center gap-1 text-[#d0bcff] font-medium group-hover:translate-x-0.5 transition-transform">
              Open Links →
            </span>
          </div>
        </div>
      </section>

      {/* ── Recent Activity Section ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Notes */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-[#c0c1ff]">
                sticky_note_2
              </span>
              <h2 className="text-sm font-semibold tracking-wide uppercase text-[#e2e2e6]">
                Recent Notes
              </h2>
            </div>
            <button
              onClick={() => navigate('/notes')}
              className="text-xs text-[#c0c1ff] hover:text-[#e1e0ff] font-medium transition-colors cursor-pointer"
            >
              View all →
            </button>
          </div>

          <div className="flex flex-col gap-2.5">
            {recentNotes.length === 0 ? (
              <div className="p-8 rounded-xl bg-[#14171d] border border-white/5 text-center flex flex-col items-center gap-2">
                <span className="material-symbols-outlined text-3xl text-[#94a3b8]/40">
                  note_add
                </span>
                <p className="text-xs text-[#94a3b8]">No notes captured yet</p>
                <button
                  onClick={() => navigate('/notes')}
                  className="mt-1 text-xs text-[#c0c1ff] hover:underline"
                >
                  Create your first note →
                </button>
              </div>
            ) : (
              recentNotes.map((note) => (
                <div
                  key={note._id}
                  onClick={() => navigate('/notes')}
                  className="p-3.5 rounded-xl bg-[#1a1c1f] hover:bg-[#1e2023] border border-white/5 hover:border-white/10 transition-colors cursor-pointer flex flex-col gap-1"
                >
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-sm font-medium text-[#e2e2e6] truncate">
                      {note.title}
                    </h3>
                    <span className="text-[10px] font-mono text-[#94a3b8] shrink-0">
                      {new Date(note.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                  {note.content && (
                    <p className="text-xs text-[#94a3b8] line-clamp-1">
                      {note.content}
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Links */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-[#d0bcff]">
                link
              </span>
              <h2 className="text-sm font-semibold tracking-wide uppercase text-[#e2e2e6]">
                Recent Links
              </h2>
            </div>
            <button
              onClick={() => navigate('/links')}
              className="text-xs text-[#d0bcff] hover:text-[#e9ddff] font-medium transition-colors cursor-pointer"
            >
              View all →
            </button>
          </div>

          <div className="flex flex-col gap-2.5">
            {recentLinks.length === 0 ? (
              <div className="p-8 rounded-xl bg-[#14171d] border border-white/5 text-center flex flex-col items-center gap-2">
                <span className="material-symbols-outlined text-3xl text-[#94a3b8]/40">
                  bookmark_add
                </span>
                <p className="text-xs text-[#94a3b8]">No links saved yet</p>
                <button
                  onClick={() => navigate('/links')}
                  className="mt-1 text-xs text-[#d0bcff] hover:underline"
                >
                  Save your first link →
                </button>
              </div>
            ) : (
              recentLinks.map((link) => {
                let domain = '';
                try {
                  domain = new URL(link.url).hostname.replace('www.', '');
                } catch {
                  domain = link.url;
                }
                return (
                  <div
                    key={link._id}
                    onClick={() => window.open(link.url, '_blank', 'noopener,noreferrer')}
                    className="p-3.5 rounded-xl bg-[#1a1c1f] hover:bg-[#1e2023] border border-white/5 hover:border-white/10 transition-colors cursor-pointer flex flex-col gap-1.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-sm font-medium text-[#e2e2e6] truncate">
                        {link.title}
                      </h3>
                      <span className="material-symbols-outlined text-[15px] text-[#94a3b8]">
                        open_in_new
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#282a2d] text-[#c0c1ff] text-[10px] font-mono">
                        <span>⬡</span>
                        <span className="truncate max-w-[200px]">{domain}</span>
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};