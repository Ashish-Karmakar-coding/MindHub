import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, FileText, Link as LinkIcon, LogOut, Menu } from 'lucide-react';
import { useAuthStore } from '../lib/authStore';

export const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { authUser, logout } = useAuthStore();
  const [isExpanded, setIsExpanded] = useState(false);

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: FileText, label: 'Notes', path: '/notes' },
    { icon: LinkIcon, label: 'Links', path: '/links' },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex ">
      {/* Sidebar */}
      <div
        className={`bg-gray-800 h-screen fixed left-0 top-0 transition-all duration-300 ease-in-out ${
          isExpanded ? 'w-64' : 'w-20'
        } border-r border-gray-700 z-50`}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      >
        <div className="flex flex-col h-full">
          {/* Logo/Header */}
          <div className="p-5 border-b border-gray-700">
            <div className="flex items-center">
              <Menu className="text-blue-500 w-6 h-6 min-w-6" />
              <span
                className={`ml-4 text-white font-semibold text-lg whitespace-nowrap transition-opacity duration-300 ${
                  isExpanded ? 'opacity-100' : 'opacity-0'
                }`}
              >
                My App
              </span>
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
                    isExpanded ? 'opacity-100' : 'opacity-0'
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
                  isExpanded ? 'opacity-100' : 'opacity-0'
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
                  isExpanded ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <p className="text-white text-sm font-medium whitespace-nowrap">
                  {authUser?.name || 'User Name'}
                </p>
                <p className="text-gray-400 text-xs whitespace-nowrap">
                  {authUser?.email || 'user@example.com'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}