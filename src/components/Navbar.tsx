import React, { useState } from 'react';
import { Search, Bell, Settings, User, Moon, Sun, LogOut, FileText } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
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
    <nav className="sticky top-0 z-50 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo and App Name */}
          <div className="flex items-center">
            <div className="flex items-center space-x-2">
              <FileText className="h-6 w-6 text-blue-600" />
              <span className="text-xl font-bold text-gray-900 dark:text-white">Simplifile</span>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-lg mx-8">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400 dark:text-gray-500" />
              </div>
              <input
                type="search"
                placeholder="Search files..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:bg-white dark:focus:bg-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-gray-200"
              />
            </div>
          </div>

          {/* Right Side Navigation */}
          <div className="flex items-center space-x-4">
            {/* Dark Mode Toggle */}
            <button 
              onClick={toggle}
              className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            {/* Notifications */}
            <button 
              onClick={() => setShowNotifications(true)}
              className="relative p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
              )}
            </button>

            {/* Settings */}
            <button 
              onClick={() => navigate('/settings')}
              className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
            >
              <Settings className="h-5 w-5" />
            </button>

            {/* User Profile */}
            <div className="flex items-center space-x-2 pl-4 border-l border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  {user?.email === 'admin' ? 'Admin User' : user?.email}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
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