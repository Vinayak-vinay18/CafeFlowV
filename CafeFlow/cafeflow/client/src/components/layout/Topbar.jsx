import { useState } from 'react';
import { MdMenu, MdSearch, MdDarkMode, MdLightMode, MdLogout, MdPerson } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCafe } from '../../context/CafeContext';

const Topbar = ({ onMenuClick }) => {
  const { admin, logout } = useAuth();
  const { darkMode, setDarkMode, settings } = useCafe();
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-20 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-orange-100 dark:border-gray-800 px-4 sm:px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button onClick={onMenuClick} className="lg:hidden text-gray-600 dark:text-gray-300">
          <MdMenu size={24} />
        </button>
        <div className="hidden sm:block">
          <h2 className="text-base font-semibold text-gray-800 dark:text-white">
            {settings?.cafeName || 'CafeFlow'}
          </h2>
          <p className="text-xs text-gray-400">Smart Cafe Billing & Management</p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="w-10 h-10 flex items-center justify-center rounded-xl border border-orange-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-gray-800 transition-colors"
          title="Toggle theme"
        >
          {darkMode ? <MdLightMode size={19} /> : <MdDarkMode size={19} />}
        </button>

        <div className="relative">
          <button
            onClick={() => setProfileOpen((p) => !p)}
            className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-orange-50 dark:hover:bg-gray-800 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-orange-gradient text-white flex items-center justify-center text-sm font-semibold">
              {admin?.name?.[0]?.toUpperCase() || 'A'}
            </div>
            <span className="hidden sm:block text-sm font-medium text-gray-700 dark:text-gray-200">
              {admin?.name || 'Admin'}
            </span>
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-card border border-orange-100 dark:border-gray-700 py-2 animate-fade-in">
              <div className="px-4 py-2 border-b border-orange-50 dark:border-gray-700">
                <p className="text-sm font-medium text-gray-800 dark:text-white truncate">{admin?.email}</p>
                <p className="text-xs text-gray-400 capitalize">{admin?.role}</p>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-gray-700 transition-colors"
              >
                <MdLogout size={17} /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Topbar;
