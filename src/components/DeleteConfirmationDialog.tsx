import React from 'react';
import { AlertTriangle, Trash2 } from 'lucide-react';
import { FileItem } from '../types';

interface DeleteConfirmationDialogProps {
  item: FileItem;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DeleteConfirmationDialog({
  item,
  onConfirm,
  onCancel
}: DeleteConfirmationDialogProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
        <div className="flex items-center justify-center mb-4">
          <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
            <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-500" />
          </div>
        </div>
        
        <h3 className="text-lg font-medium text-center text-gray-900 dark:text-white mb-2">
          Delete {item.isFolder ? 'Folder' : 'File'}
        </h3>
        
        <p className="text-sm text-center text-gray-500 dark:text-gray-400 mb-6">
          Are you sure you want to delete "{item.name}"? 
          {item.isFolder && " This will also delete all files inside this folder."}
          This action cannot be undone.
        </p>

        <div className="flex items-center justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}