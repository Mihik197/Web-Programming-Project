import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { 
  Calendar as CalendarIcon, 
  Image, 
  Settings as SettingsIcon, 
  Menu, 
  Album, 
  LogOut 
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      {isSidebarOpen && (
        <div className="w-64 bg-[#4169E1] min-h-screen shadow-lg flex flex-col justify-between fixed lg:relative">
          <div>
            <div className="p-4">
              <h1 className="text-white text-xl font-bold">Photo Album</h1>
            </div>
            <nav className="p-4 space-y-2">
              <NavLink
                to="/app" // Updated path
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
                to="/app/albums" // Ensure other links are under /app
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
                to="/app/gallery"
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
                to="/app/settings"
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
          
          {/* Logout Button */}
          <div className="p-4 mt-auto">
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors text-white hover:bg-[#6495ED]"
            >
              <LogOut size={20} />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1">
        <div className="p-8">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
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
