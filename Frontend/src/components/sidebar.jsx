import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  FolderOpen, 
  Link, 
  ChevronRight,
  Menu,
  X
} from 'lucide-react';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState('dashboard');

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'notes', label: 'Notes', icon: FileText },
    { id: 'files', label: 'Files', icon: FolderOpen },
    { id: 'links', label: 'Links', icon: Link },
  ];

  const handleItemClick = (itemId) => {
    setActiveItem(itemId);
    console.log(`${itemId} clicked`);
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className={`fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white/10 backdrop-blur-xl border-r border-white/20 transition-all duration-300 z-40 ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      {/* Sidebar Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/20">
        {!isCollapsed && (
          <h2 className="text-white font-semibold text-lg">Menu</h2>
        )}
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-200 text-white"
        >
          {isCollapsed ? <Menu className="w-4 h-4" /> : <X className="w-4 h-4" />}
        </button>
      </div>

      {/* Menu Items */}
      <nav className="mt-4 px-2">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeItem === item.id;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => handleItemClick(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group ${
                    isActive 
                      ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-white border border-white/20' 
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-white/70 group-hover:text-white'}`} />
                  
                  {!isCollapsed && (
                    <>
                      <span className="font-medium text-sm flex-1 text-left">
                        {item.label}
                      </span>
                      {isActive && (
                        <ChevronRight className="w-4 h-4 text-white/60" />
                      )}
                    </>
                  )}
                </button>

                {/* Tooltip for collapsed state */}
                {isCollapsed && (
                  <div className="absolute left-16 ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50">
                    {item.label}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom Section */}
      {!isCollapsed && (
        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl p-4 border border-white/20">
            <p className="text-white/80 text-xs text-center">
              Welcome to MindHub
            </p>
            <p className="text-white/60 text-xs text-center mt-1">
              Organize your digital life
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;