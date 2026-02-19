import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Search, Bell, User, PlusCircle, Sun, Moon, Image, Share2, Eye } from 'lucide-react';
import { APP_NAME } from '../constants';
import { useTheme } from '../contexts/ThemeContext';
import { useShare, buildPreviewUrl } from '../contexts/ShareContext';

const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { isViewOnly } = useShare();

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-700 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-teal-500 p-2 rounded-lg group-hover:bg-teal-600 transition-colors">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <span className="font-bold text-xl text-gray-800 dark:text-slate-100 tracking-tight">{APP_NAME}</span>
          </Link>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400 dark:text-slate-500" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-200 dark:border-slate-600 rounded-full leading-5 bg-gray-50 dark:bg-slate-800 placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 dark:text-slate-200 sm:text-sm transition-all"
                placeholder="搜尋課程..."
              />
            </div>
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-gray-500 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-teal-50 dark:hover:bg-slate-800 transition-colors"
              title={theme === 'light' ? '切換為深色模式' : '切換為淺色模式'}
            >
              {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </button>
            {!isViewOnly && (
              <>
                <Link 
                  to="/edit-cover" 
                  className="hidden sm:flex items-center gap-1 text-sm font-medium text-gray-600 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 px-3 py-2 rounded-lg transition-colors"
                >
                  <Image className="h-4 w-4" />
                  封面編輯
                </Link>
                <a
                  href={buildPreviewUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden sm:flex items-center gap-1 text-sm font-medium text-gray-600 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 px-3 py-2 rounded-lg transition-colors"
                >
                  <Eye className="h-4 w-4" />
                  預覽
                </a>
                <Link 
                  to="/share-settings" 
                  className="hidden sm:flex items-center gap-1 text-sm font-medium text-gray-600 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 px-3 py-2 rounded-lg transition-colors"
                >
                  <Share2 className="h-4 w-4" />
                  分享
                </Link>
                <Link 
                  to="/create-course" 
                  className="hidden sm:flex items-center gap-1 text-sm font-medium text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 bg-teal-50 dark:bg-teal-900/30 hover:bg-teal-100 dark:hover:bg-teal-900/50 px-3 py-2 rounded-lg transition-colors"
                >
                  <PlusCircle className="h-4 w-4" />
                  我要開課
                </Link>
              </>
            )}
            <button className="text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200 transition-colors">
              <Bell className="h-5 w-5" />
            </button>
            <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-slate-600 flex items-center justify-center border border-gray-300 dark:border-slate-500 overflow-hidden cursor-pointer hover:ring-2 hover:ring-teal-500 transition-all">
              <User className="h-5 w-5 text-gray-500 dark:text-slate-300" />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;