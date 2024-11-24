import React from 'react';
import { Clock, RotateCcw } from 'lucide-react';

export interface Version {
  id: string;
  timestamp: number;
  size: number;
  userId: string;
  userEmail: string;
}

interface VersionHistoryProps {
  versions: Version[];
  onRevert: (versionId: string) => void;
  currentVersion: string;
}

export default function VersionHistory({
  versions,
  onRevert,
  currentVersion
}: VersionHistoryProps) {
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">Version History</h3>
      <div className="space-y-2">
        {versions.map((version) => (
          <div
            key={version.id}
            className={`flex items-center justify-between p-3 rounded-lg border ${
              version.id === currentVersion
                ? 'bg-blue-50 border-blue-200'
                : 'bg-white border-gray-200'
            }`}
          >
            <div className="flex items-center space-x-3">
              <Clock className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {new Date(version.timestamp).toLocaleString()}
                </p>
                <p className="text-sm text-gray-500">
                  {version.userEmail} • {formatBytes(version.size)}
                </p>
              </div>
            </div>
            {version.id !== currentVersion && (
              <button
                onClick={() => onRevert(version.id)}
                className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <RotateCcw className="h-4 w-4 mr-1" />
                Revert
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}