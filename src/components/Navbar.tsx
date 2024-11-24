import React, { useState } from 'react';
import { Search, Bell, Settings, User, Moon, Sun, LogOut, FileText } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import NotificationsModal from './NotificationsModal';

// Example notifications data
const exampleNotifications = [
  {
    id: '1',
    type: 'upload' as const,
    message: 'Successfully uploaded "Project Presentation.pdf"',
    timestamp: Date.now() - 300000, // 5 minutes ago
    read: false
  },
  {
    id: '2',
    type: 'share' as const,
    message: 'John Doe shared "Q4 Report.xlsx" with you',
    timestamp: Date.now() - 3600000, // 1 hour ago
    read: false
  },
  {
    id: '3',
    type: 'access' as const,
    message: 'New sign-in from Chrome on Windows',
    timestamp: Date.now() - 86400000, // 1 day ago
    read: true
  },
  {
    id: '4',
    type: 'download' as const,
    message: 'Downloaded "Company Logo.png"',
    timestamp: Date.now() - 172800000, // 2 days ago
    read: true
  },
  {
    id: '5',
    type: 'favorite' as const,
    message: 'Added "Marketing Strategy.docx" to favorites',
    timestamp: Date.now() - 259200000, // 3 days ago
    read: true
  }
];

export default function Navbar() {
  const { isDark, toggle } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState(exampleNotifications);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error('Failed to log out');
    }
  };

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <nav className="sticky top-0 z-50 bg-accent-light dark:bg-gray-800/95 backdrop-blur-sm border-b border-accent/10 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center h-16">
          {/* Logo - Left */}
          <div className="flex-shrink-0">
            <Link 
              to="/"
              className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
            >
              <FileText className="h-6 w-6 text-accent" />
              <span className="text-xl font-bold text-gray-900 dark:text-white">Simplifile</span>
            </Link>
          </div>

          {/* Search Bar - Center */}
          <div className="flex-1 flex justify-center px-8">
            <div className="w-full max-w-2xl">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                </div>
                <input
                  type="search"
                  placeholder="Search files..."
                  className="block w-full pl-10 pr-3 py-2 border border-accent/10 dark:border-gray-600 rounded-lg bg-white/50 dark:bg-gray-700/50 focus:bg-white dark:focus:bg-gray-700 focus:ring-2 focus:ring-accent focus:border-transparent dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400"
                />
              </div>
            </div>
          </div>

          {/* Right Side Navigation */}
          <div className="flex-shrink-0 flex items-center space-x-4">
            {/* Dark Mode Toggle */}
            <button 
              onClick={toggle}
              className="p-2 text-gray-600 dark:text-gray-300 hover:bg-accent-light-hover dark:hover:bg-gray-700 rounded-full"
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            {/* Notifications */}
            <button 
              onClick={() => setShowNotifications(true)}
              className="relative p-2 text-gray-600 dark:text-gray-300 hover:bg-accent-light-hover dark:hover:bg-gray-700 rounded-full"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
              )}
            </button>

            {/* Settings */}
            <button 
              onClick={() => navigate('/settings')}
              className="p-2 text-gray-600 dark:text-gray-300 hover:bg-accent-light-hover dark:hover:bg-gray-700 rounded-full"
            >
              <Settings className="h-5 w-5" />
            </button>

            {/* User Profile */}
            <div className="flex items-center space-x-2 pl-4 border-l border-accent/10 dark:border-gray-700">
              <div className="h-8 w-8 bg-accent rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
              <button
                onClick={handleLogout}
                className="p-2 text-gray-600 dark:text-gray-300 hover:bg-accent-light-hover dark:hover:bg-gray-700 rounded-full"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Notifications Modal */}
      {showNotifications && (
        <NotificationsModal
          notifications={notifications}
          onClose={() => setShowNotifications(false)}
          onMarkAsRead={handleMarkAsRead}
          onMarkAllAsRead={handleMarkAllAsRead}
        />
      )}
    </nav>
  );
}