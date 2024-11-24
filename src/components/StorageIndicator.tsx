import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { FileItem } from '../types';
import { Infinity, Crown } from 'lucide-react';

ChartJS.register(ArcElement, Tooltip, Legend);

interface StorageIndicatorProps {
  files: FileItem[];
}

export default function StorageIndicator({ files }: StorageIndicatorProps) {
  const usedStorage = files.reduce((acc, file) => acc + file.size, 0);

  // Calculate storage by file type
  const storageByType = files.reduce((acc, file) => {
    const type = file.type.split('/')[0] || 'other';
    acc[type] = (acc[type] || 0) + file.size;
    return acc;
  }, {} as Record<string, number>);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Storage Usage</h3>
        <div className="flex items-center space-x-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-full">
          <Crown className="h-4 w-4" />
          <span className="text-sm font-medium">Pro Plan</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Storage Info */}
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4 text-white">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm opacity-90">Current Plan</span>
              <Crown className="h-5 w-5" />
            </div>
            <h4 className="text-xl font-bold mb-1">Pro Unlimited</h4>
            <p className="text-sm opacity-90">Unlimited storage space</p>
          </div>
          
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Used Storage</p>
            <p className="text-lg font-medium text-gray-900 dark:text-white">{formatBytes(usedStorage)}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Available Storage</p>
            <div className="flex items-center text-lg font-medium text-gray-900 dark:text-white">
              <Infinity className="h-5 w-5 mr-1" />
              <span>Unlimited</span>
            </div>
          </div>
        </div>

        {/* Storage Breakdown */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Storage Breakdown</h4>
          <div className="space-y-3">
            {Object.entries(storageByType).map(([type, size]) => (
              <div key={type}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-600 dark:text-gray-400 capitalize">{type}</span>
                  <span className="text-gray-900 dark:text-white font-medium">{formatBytes(size)}</span>
                </div>
                <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-1.5">
                  <div
                    className="bg-blue-600 h-1.5 rounded-full"
                    style={{
                      width: `${(size / usedStorage) * 100}%`
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">Pro Plan Features</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Unlimited storage, advanced sharing, and more</p>
          </div>
          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            View Plan Details
          </button>
        </div>
      </div>
    </div>
  );
}