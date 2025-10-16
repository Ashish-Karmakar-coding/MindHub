import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  StickyNote, 
  FileText, 
  Link2,
  ChevronLeft,
  ChevronRight,
  Plus
} from 'lucide-react';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      path: '/',
      count: null
    },
    {
      id: 'notes',
      label: 'Notes',
      icon: StickyNote,
      path: '/notes',
      count: 12
    },
    {
      id: 'files',
      label: 'Files',
      icon: FileText,
      path: '/files',
      count: 8
    },
    {
      id: 'links',
      label: 'Links',
      icon: Link2,
      path: '/links',
      count: 5
    }
  ];

  const handleMouseEnter = () => {
    setIsCollapsed(false);
  };

  const handleMouseLeave = () => {
    setIsCollapsed(true);
  };

  const handleItemClick = (path) => {
    navigate(path);
  };

  // Check if current path matches the menu item
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div 
      className={`bg-slate-900 text-white h-screen flex flex-col transition-all duration-300 ${
        isCollapsed ? 'w-16' : 'w-64'
      } fixed left-0 top-0 z-50`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-700">
        {!isCollapsed && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg"></div>
            <span className="font-bold text-lg">NoteFlow</span>
          </div>
        )}
        
        {!isCollapsed && (
          <button
            onClick={() => setIsCollapsed(true)}
            className="p-2 rounded-lg hover:bg-slate-700 transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
        )}
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            const active = isActive(item.path);
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => handleItemClick(item.path)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200 group ${
                    active 
                      ? 'bg-blue-600 text-white shadow-lg' 
                      : 'hover:bg-slate-700 text-slate-300 hover:text-white'
                  }`}
                >
                  <IconComponent 
                    size={20} 
                    className={`${active ? 'text-white' : 'text-slate-400 group-hover:text-white'}`}
                  />
                  
                  {!isCollapsed && (
                    <>
                      <span className="font-medium flex-1 text-left">
                        {item.label}
                      </span>
                      {item.count && (
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          active 
                            ? 'bg-blue-500 text-white' 
                            : 'bg-slate-600 text-slate-300 group-hover:bg-slate-500'
                        }`}>
                          {item.count}
                        </span>
                      )}
                    </>
                  )}
                </button>
              </li>
            );
          })}
        </ul>

        {/* Quick Actions */}
        {!isCollapsed && (
          <div className="mt-8">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              Quick Actions
            </h3>
            <button 
              onClick={() => navigate('/notes')}
              className="w-full flex items-center gap-3 p-3 rounded-lg border-2 border-dashed border-slate-600 hover:border-blue-500 hover:bg-slate-800 transition-all duration-200 group"
            >
              <Plus size={18} className="text-slate-400 group-hover:text-blue-400" />
              <span className="text-slate-400 group-hover:text-white font-medium">
                Add New Note
              </span>
            </button>
          </div>
        )}
      </nav>

      {/* User Profile Section */}
      {!isCollapsed && (
        <div className="p-4 border-t border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">A</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium truncate">Ashish Karmakar</p>
              <p className="text-slate-400 text-xs truncate">kenshin@gmail.com</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;