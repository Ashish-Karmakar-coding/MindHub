import React, { useState, useRef } from 'react';
import { LogOut, User } from 'lucide-react';

const Navbar = () => {
  const [isHovered, setIsHovered] = useState(false);
  const timeoutRef = useRef(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsHovered(false);
    }, 500); // 500ms delay before hiding
  };

  const handleLogout = () => {
    console.log('Logout clicked');
    // Add your logout logic here
    alert('Logout functionality would be implemented here');
  };

  return (
    <div className="w-full">
      <nav className="bg-gray-900 border-b border-gray-700 px-6 py-1.5 flex justify-between items-center sticky top-0 z-50">
        {/* Logo */}
        <div className="flex items-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent hover:scale-105 transition-transform duration-300 cursor-pointer">
            MindHub
          </h1>
        </div>

        {/* Profile Section */}
        <div 
          className="relative"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="flex items-center space-x-3 px-4 py-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-all duration-300 cursor-pointer hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/20">
            {/* Profile Picture */}
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center border-2 border-gray-600 hover:border-gray-500 transition-all duration-300 hover:scale-105">
              <User className="w-5 h-5 text-white" />
            </div>
            
            {/* Username */}
            <span className="text-white font-medium text-m">
              John Doe
            </span>
          </div>

          {/* Logout Dropdown */}
          <div className={`absolute right-0 top-full mt-2 transition-all duration-300 ${
            isHovered 
              ? 'opacity-100 translate-y-0 pointer-events-auto' 
              : 'opacity-0 -translate-y-2 pointer-events-none'
          }`}>
            <div className="bg-gray-800 rounded-xl shadow-xl border border-gray-700 overflow-hidden min-w-[140px]">
              <button
                onClick={handleLogout}
                className="w-full px-4 py-3 flex items-center space-x-3 text-gray-300 hover:bg-red-600 hover:text-white transition-all duration-200 text-sm font-medium"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;