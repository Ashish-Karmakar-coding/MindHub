import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, FileText, Link as LinkIcon, LogOut, Menu, X } from 'lucide-react';
import { useAuthStore } from '../lib/authStore';

export const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { authUser, logout } = useAuthStore();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: FileText, label: 'Notes', path: '/notes' },
    { icon: LinkIcon, label: 'Links', path: '/links' },
  ];

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  // Close mobile menu on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isMobileOpen) {
        setIsMobileOpen(false);
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isMobileOpen]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
    setIsMobileOpen(false);
  };

  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  return (
    <>
      {/* Mobile Hamburger Button */}
      <button
        onClick={toggleMobileMenu}
        className="lg:hidden fixed top-4 left-4 z-50 bg-gray-800 p-2 rounded-lg text-white hover:bg-gray-700 transition-colors border border-gray-700"
        aria-label="Toggle menu"
      >
        {isMobileOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <Menu className="w-6 h-6" />
        )}
      </button>

      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
          onClick={() => setIsMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <div
        className={`bg-gray-800 h-screen fixed left-0 top-0 transition-all duration-300 ease-in-out border-r border-gray-700 z-50
          ${isMobileOpen ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0 w-64 lg:w-20'}
          ${isExpanded && !isMobileOpen ? 'lg:w-64' : ''}
          lg:block`}
        onMouseEnter={() => !isMobileOpen && setIsExpanded(true)}
        onMouseLeave={() => !isMobileOpen && setIsExpanded(false)}
      >
        <div className="flex flex-col h-full">
          {/* Logo/Header */}
          <div className="p-5 border-b border-gray-700">
            <div className="flex items-center justify-between lg:justify-start">
              <div className="flex items-center">
                <Menu className="text-blue-500 w-6 h-6 min-w-6" />
                <span
                  className={`ml-4 text-white font-semibold text-lg whitespace-nowrap transition-opacity duration-300 ${
                    isExpanded || isMobileOpen ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  MindHub
                </span>
              </div>
              {/* Mobile Close Button */}
              <button
                onClick={() => setIsMobileOpen(false)}
                className="lg:hidden text-gray-400 hover:text-white transition-colors"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 py-6">
            {menuItems.map((item, index) => (
              <button
                key={index}
                onClick={() => handleNavigation(item.path)}
                className={`w-full flex items-center px-5 py-4 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200 ${
                  location.pathname === item.path ? 'bg-gray-700 text-white' : ''
                }`}
              >
                <item.icon className="w-6 h-6 min-w-6" />
                <span
                  className={`ml-4 whitespace-nowrap transition-opacity duration-300 ${
                    isExpanded || isMobileOpen ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  {item.label}
                </span>
              </button>
            ))}
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-5 py-4 text-gray-300 hover:bg-gray-700 hover:text-red-400 transition-colors duration-200 mt-auto"
            >
              <LogOut className="w-6 h-6 min-w-6" />
              <span
                className={`ml-4 whitespace-nowrap transition-opacity duration-300 ${
                  isExpanded || isMobileOpen ? 'opacity-100' : 'opacity-0'
                }`}
              >
                Logout
              </span>
            </button>
          </nav>

          {/* Footer */}
          <div className="p-5 border-t border-gray-700">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold min-w-10">
                {authUser?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div
                className={`ml-3 transition-opacity duration-300 ${
                  isExpanded || isMobileOpen ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <p className="text-white text-sm font-medium whitespace-nowrap">
                  {authUser?.name || 'User Name'}
                </p>
                <p className="text-gray-400 text-xs whitespace-nowrap truncate max-w-[180px]">
                  {authUser?.email || 'user@example.com'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}