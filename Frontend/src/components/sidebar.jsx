import React, { useState } from 'react';
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
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      count: null
    },
    {
      id: 'notes',
      label: 'Notes',
      icon: StickyNote,
      count: 12
    },
    {
      id: 'files',
      label: 'Files',
      icon: FileText,
      count: 8
    },
    {
      id: 'links',
      label: 'Links',
      icon: Link2,
      count: 5
    }
  ];

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleItemClick = (itemId) => {
    setActiveSection(itemId);
  };

  return (
    <div className={`bg-slate-900 text-white h-screen flex flex-col transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-700">
        
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg hover:bg-slate-700 transition-colors"
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = activeSection === item.id;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => handleItemClick(item.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200 group ${
                    isActive 
                      ? 'bg-blue-600 text-white shadow-lg' 
                      : 'hover:bg-slate-700 text-slate-300 hover:text-white'
                  }`}
                >
                  <IconComponent 
                    size={20} 
                    className={`${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'}`}
                  />
                  
                  {!isCollapsed && (
                    <>
                      <span className="font-medium flex-1 text-left">
                        {item.label}
                      </span>
                      {item.count && (
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          isActive 
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
            <button className="w-full flex items-center gap-3 p-3 rounded-lg border-2 border-dashed border-slate-600 hover:border-blue-500 hover:bg-slate-800 transition-all duration-200 group">
              <Plus size={18} className="text-slate-400 group-hover:text-blue-400" />
              <span className="text-slate-400 group-hover:text-white font-medium">
                Add New Item
              </span>
            </button>
          </div>
        )}
      </nav>

    </div>
  );
};

export default Sidebar;