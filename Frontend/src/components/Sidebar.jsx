import { useState } from 'react';
import { LayoutDashboard, FileText, Link, LogOut, Menu } from 'lucide-react';

export const Sidebar = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '#dashboard' },
    { icon: FileText, label: 'Notes', href: '#notes' },
    { icon: Link, label: 'Links', href: '#links' },
    { icon: LogOut, label: 'Logout', href: '#logout' },
  ];

  return (
    <div className="min-h-screen bg-gray-900 flex">
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
              <a
                key={index}
                href={item.href}
                className="flex items-center px-5 py-4 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200"
              >
                <item.icon className="w-6 h-6 min-w-6" />
                <span
                  className={`ml-4 whitespace-nowrap transition-opacity duration-300 ${
                    isExpanded ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  {item.label}
                </span>
              </a>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-5 border-t border-gray-700">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold min-w-10">
                U
              </div>
              <div
                className={`ml-3 transition-opacity duration-300 ${
                  isExpanded ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <p className="text-white text-sm font-medium whitespace-nowrap">User Name</p>
                <p className="text-gray-400 text-xs whitespace-nowrap">user@example.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}