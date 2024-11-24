import React from 'react';
import { FileItem } from '../types';
import { X, Download, Share2, Star, StarOff } from 'lucide-react';

interface FilePreviewProps {
  file: FileItem;
  onClose: () => void;
  onDownload: () => void;
  onShare: () => void;
  onToggleFavorite: () => void;
}

export default function FilePreview({
  file,
  onClose,
  onDownload,
  onShare,
  onToggleFavorite
}: FilePreviewProps) {
  const renderPreview = () => {
    if (file.type.startsWith('image/')) {
      return (
        <img
          src={file.dataUrl}
          alt={file.name}
          className="max-h-[60vh] object-contain"
        />
      );
    }

    if (file.type === 'application/pdf') {
      return (
        <iframe
          src={file.dataUrl}
          className="w-full h-[60vh]"
          title={file.name}
        />
      );
    }

    return (
      <div className="flex items-center justify-center h-[60vh] bg-gray-50 dark:bg-gray-800">
        <p className="text-gray-500 dark:text-gray-400">Preview not available</p>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">{file.name}</h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={onDownload}
              className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
            >
              <Download className="h-5 w-5" />
            </button>
            <button
              onClick={onShare}
              className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
            >
              <Share2 className="h-5 w-5" />
            </button>
            <button
              onClick={onToggleFavorite}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
            >
              {file.favorite ? (
                <Star className="h-5 w-5 text-yellow-500" />
              ) : (
                <StarOff className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              )}
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Preview */}
        <div className="p-4 bg-gray-50 dark:bg-gray-900">
          {renderPreview()}
        </div>

        {/* File Info */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500 dark:text-gray-400">Size</p>
              <p className="font-medium text-gray-900 dark:text-white">{formatBytes(file.size)}</p>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400">Modified</p>
              <p className="font-medium text-gray-900 dark:text-white">
                {new Date(file.lastModified).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400">Type</p>
              <p className="font-medium text-gray-900 dark:text-white">{file.type || 'Unknown'}</p>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400">Shared with</p>
              <p className="font-medium text-gray-900 dark:text-white">
                {file.sharedWith.length} {file.sharedWith.length === 1 ? 'person' : 'people'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function formatBytes(bytes: number) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}