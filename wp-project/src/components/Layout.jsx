import React, { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { Calendar as CalendarIcon, Image, Settings as SettingsIcon, Menu, Album } from 'lucide-react';

function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar - full height, better blue */}
      <div className="w-64 bg-[#4169E1] min-h-screen shadow-lg">
        <div className="p-4">
          <button className="w-full flex items-center justify-between px-4 py-2 text-white">
            <span className="font-semibold text-lg">Photo Album</span>
          </button>
        </div>
        <nav className="p-4 space-y-2">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${
                isActive
                  ? 'bg-[#6495ED] text-white'
                  : 'text-white hover:bg-[#6495ED]'
              }`
            }
          >
            <CalendarIcon size={20} />
            <span className="font-medium">Calendar</span>
          </NavLink>
          <NavLink
            to="/albums"
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${
                isActive
                  ? 'bg-[#6495ED] text-white'
                  : 'text-white hover:bg-[#6495ED]'
              }`
            }
          >
            <Album size={20} />
            <span className="font-medium">Albums</span>
          </NavLink>
          <NavLink
            to="/gallery"
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${
                isActive
                  ? 'bg-[#6495ED] text-white'
                  : 'text-white hover:bg-[#6495ED]'
              }`
            }
          >
            <Image size={20} />
            <span className="font-medium">Gallery</span>
          </NavLink>
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${
                isActive
                  ? 'bg-[#6495ED] text-white'
                  : 'text-white hover:bg-[#6495ED]'
              }`
            }
          >
            <SettingsIcon size={20} />
            <span className="font-medium">Settings</span>
          </NavLink>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 min-h-screen ml-0 lg:ml-55">
        <div className="p-8">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="lg:hidden fixed top-4 left-4 z-30 p-2 bg-white rounded-xl shadow-lg"
          >
            <Menu size={20} className="text-blue-600" />
          </button>
          
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Layout;
