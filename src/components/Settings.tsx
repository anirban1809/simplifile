import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../hooks/useTheme';
import { 
  User, Mail, Lock, Bell, Moon, Sun, Shield, 
  CreditCard, HardDrive, LogOut, ArrowLeft, Palette 
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

const colorOptions = [
  { name: 'Blue', value: 'blue', bgClass: 'bg-blue-600', borderClass: 'border-blue-600', hoverClass: 'hover:border-blue-600' },
  { name: 'Purple', value: 'purple', bgClass: 'bg-purple-600', borderClass: 'border-purple-600', hoverClass: 'hover:border-purple-600' },
  { name: 'Green', value: 'green', bgClass: 'bg-green-600', borderClass: 'border-green-600', hoverClass: 'hover:border-green-600' },
  { name: 'Red', value: 'red', bgClass: 'bg-red-600', borderClass: 'border-red-600', hoverClass: 'hover:border-red-600' },
  { name: 'Orange', value: 'orange', bgClass: 'bg-orange-600', borderClass: 'border-orange-600', hoverClass: 'hover:border-orange-600' },
  { name: 'Pink', value: 'pink', bgClass: 'bg-pink-600', borderClass: 'border-pink-600', hoverClass: 'hover:border-pink-600' },
  { name: 'Indigo', value: 'indigo', bgClass: 'bg-indigo-600', borderClass: 'border-indigo-600', hoverClass: 'hover:border-indigo-600' },
  { name: 'Teal', value: 'teal', bgClass: 'bg-teal-600', borderClass: 'border-teal-600', hoverClass: 'hover:border-teal-600' }
];

export default function Settings() {
  const { user, logout } = useAuth();
  const { isDark, toggle, accentColor, setAccentColor } = useTheme();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error('Failed to log out');
    }
  };

  const handleColorChange = (color: string) => {
    setAccentColor(color);
    toast.success(`Theme color updated to ${color}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate('/')}
            className="flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Dashboard
          </button>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Settings</h1>

        <div className="space-y-6">
          {/* Profile Section */}
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
              <User className="h-5 w-5 mr-2" />
              Profile Settings
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email Address
                </label>
                <div className="flex items-center">
                  <Mail className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-gray-900 dark:text-gray-100">
                    {user?.email}
                  </span>
                </div>
              </div>
              <button className="text-accent hover:text-accent-hover text-sm font-medium">
                Change Password
              </button>
            </div>
          </div>

          {/* Appearance Section */}
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
              <Palette className="h-5 w-5 mr-2" />
              Appearance
            </h2>
            
            {/* Dark Mode Toggle */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                {isDark ? (
                  <Moon className="h-5 w-5 mr-2 text-gray-700 dark:text-gray-300" />
                ) : (
                  <Sun className="h-5 w-5 mr-2 text-gray-700 dark:text-gray-300" />
                )}
                <span className="text-gray-700 dark:text-gray-300">Dark Mode</span>
              </div>
              <button
                onClick={toggle}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 ${
                  isDark ? 'bg-accent' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isDark ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Accent Color Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Accent Color
              </label>
              <div className="grid grid-cols-4 gap-3">
                {colorOptions.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => handleColorChange(color.value)}
                    className={`relative rounded-lg p-3 flex flex-col items-center border transition-all ${
                      accentColor === color.value
                        ? color.borderClass
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-full ${color.bgClass}`} />
                    <span className="text-sm text-gray-900 dark:text-gray-100 mt-1">
                      {color.name}
                    </span>
                    {accentColor === color.value && (
                      <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full ${color.bgClass} flex items-center justify-center`}>
                        <span className="text-white text-xs">✓</span>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}