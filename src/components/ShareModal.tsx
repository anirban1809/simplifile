import React, { useState } from 'react';
import { FileItem } from '../types';
import { X, Copy, Check } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface ShareModalProps {
  files: FileItem[];
  onClose: () => void;
  onShare: (email: string) => void;
}

export default function ShareModal({ files, onClose, onShare }: ShareModalProps) {
  const [email, setEmail] = useState('');
  const [copied, setCopied] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      onShare(email);
      setEmail('');
    }
  };

  const isMultiple = files.length > 1;
  const shareLink = isMultiple
    ? `https://simplifile.app/shared/batch/${files.map(f => f.id).join(',')}`
    : `https://simplifile.app/shared/${files[0].id}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      setCopied(true);
      toast.success('Link copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy link');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            {isMultiple
              ? `Share ${files.length} items`
              : `Share "${files[0].name}"`}
          </h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full text-gray-500 dark:text-gray-400"
          >
            <X size={20} />
          </button>
        </div>

        {/* Share Link Section */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Share Link
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={shareLink}
              readOnly
              className="flex-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              onClick={handleCopyLink}
              className={`p-2 rounded-md ${
                copied
                  ? 'bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {copied ? <Check size={20} /> : <Copy size={20} />}
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Share with email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Enter email address"
            />
          </div>

          {files.some(file => file.sharedWith.length > 0) && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Shared with:</h4>
              <div className="space-y-1">
                {Array.from(new Set(files.flatMap(file => file.sharedWith))).map((email, index) => (
                  <div key={index} className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-md">
                    {email}
                  </div>
                ))}
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white rounded-md py-2 px-4 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
          >
            Share
          </button>
        </form>
      </div>
    </div>
  );
}