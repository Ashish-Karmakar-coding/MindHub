import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../lib/authStore';

const NAV_ITEMS = [
  {
    label: 'Dashboard',
    path: '/',
    icon: 'grid_view',
  },
  {
    label: 'Notes',
    path: '/notes',
    icon: 'description',
  },
  {
    label: 'Links',
    path: '/links',
    icon: 'link',
  },
];

export const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { authUser, logout } = useAuthStore();
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

  return (
    <>
      {/* ── Mobile hamburger trigger ── */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden fixed top-3 left-3 z-50 p-2 rounded-lg bg-[#1a1c1f] text-[#e2e2e6] border border-white/10 shadow-md flex items-center justify-center cursor-pointer"
        aria-label="Open menu"
      >
        <span className="material-symbols-outlined text-[22px]">menu</span>
      </button>

      {/* ── Mobile backdrop ── */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/70 backdrop-blur-sm z-40 transition-opacity"
        />
      )}

      {/* ── Sidebar ── */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-[#0c0e11] border-r border-white/5 z-50 flex flex-col justify-between py-5 px-3 transition-transform duration-200 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col gap-6">
          {/* Logo Header */}
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#282a2d] border border-white/10 flex items-center justify-center text-[#c0c1ff] font-bold text-base shadow-sm">
                M
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-base text-[#e2e2e6] tracking-tight leading-none">
                  MINDHUB
                </span>
                <span className="text-[10px] text-[#94a3b8] font-mono mt-0.5">
                  v2.4.0 • Core
                </span>
              </div>
            </div>

            {/* Mobile close button */}
            {isMobileOpen && (
              <button
                onClick={() => setIsMobileOpen(false)}
                className="lg:hidden p-1 rounded text-[#94a3b8] hover:text-[#e2e2e6]"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            )}
          </div>

          {/* Nav Items */}
          <nav className="flex flex-col gap-1">
            {NAV_ITEMS.map((item) => {
              const active = isActive(item.path);
              return (
                <button
                  key={item.path}
                  onClick={() => {
                    navigate(item.path);
                    setIsMobileOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left cursor-pointer ${
                    active
                      ? 'bg-[#282a2d] text-[#e2e2e6] border border-white/10'
                      : 'text-[#94a3b8] hover:bg-[#1a1c1f] hover:text-[#e2e2e6]'
                  }`}
                >
                  <span
                    className={`material-symbols-outlined text-[19px] ${
                      active ? 'text-[#c0c1ff]' : 'text-[#94a3b8]'
                    }`}
                  >
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* User & Logout Section */}
        <div className="flex flex-col gap-3 pt-3 border-t border-white/5">
          {/* User profile card */}
          <div className="flex items-center justify-between px-2 py-1.5 rounded-lg bg-[#14171d]/60 border border-white/5">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="relative shrink-0">
                <div className="w-8 h-8 rounded-full bg-[#282a2d] border border-white/10 flex items-center justify-center text-xs font-bold text-[#c0c1ff]">
                  {authUser?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#4edea3] ring-2 ring-[#0c0e11]" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-medium text-[#e2e2e6] truncate">
                  {authUser?.name || 'User'}
                </span>
                <span className="text-[10px] text-[#94a3b8] font-mono truncate">
                  {authUser?.email || ''}
                </span>
              </div>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-[#94a3b8] hover:bg-[#ffb4ab]/10 hover:text-[#ffb4ab] transition-colors cursor-pointer w-full text-left"
          >
            <span className="material-symbols-outlined text-[18px]">logout</span>
            <span>Disconnect Session</span>
          </button>
        </div>
      </aside>
    </>
  );
};