import React, { useState } from 'react';
import { FileItem } from '../types';
import FileList from './FileList';
import StorageIndicator from './StorageIndicator';
import CreateFolderModal from './CreateFolderModal';
import ShareModal from './ShareModal';
import FilePreview from './FilePreview';
import Navbar from './Navbar';
import { toast } from 'react-hot-toast';
import { v4 as uuidv4 } from 'uuid';

// Generate 20 example files and folders
const generateExampleFiles = () => {
  const files: FileItem[] = [];
  const fileTypes = [
    { type: 'image/jpeg', ext: 'jpg' },
    { type: 'image/png', ext: 'png' },
    { type: 'application/pdf', ext: 'pdf' },
    { type: 'application/msword', ext: 'doc' },
    { type: 'text/plain', ext: 'txt' }
  ];

  // Add folders
  ['Documents', 'Images', 'Projects', 'Downloads', 'Archive'].forEach((name, index) => {
    files.push({
      id: uuidv4(),
      name,
      size: 0,
      type: 'folder',
      lastModified: Date.now() - index * 86400000,
      shared: false,
      sharedWith: [],
      favorite: index < 2,
      dataUrl: '',
      parentId: null,
      isFolder: true
    });
  });

  // Add files
  for (let i = 1; i <= 15; i++) {
    const fileType = fileTypes[Math.floor(Math.random() * fileTypes.length)];
    const size = Math.floor(Math.random() * 10000000); // Random size up to 10MB
    const daysAgo = Math.floor(Math.random() * 30);
    
    files.push({
      id: uuidv4(),
      name: `Example File ${i}.${fileType.ext}`,
      size,
      type: fileType.type,
      lastModified: Date.now() - daysAgo * 86400000,
      shared: Math.random() > 0.8,
      sharedWith: Math.random() > 0.8 ? ['user@example.com'] : [],
      favorite: Math.random() > 0.8,
      dataUrl: '',
      parentId: null,
      isFolder: false
    });
  }

  return files;
};

const initialFiles = generateExampleFiles();

export default function Dashboard() {
  const [files, setFiles] = useState<FileItem[]>(initialFiles);
  const [currentFolder, setCurrentFolder] = useState<string | null>(null);
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [shareFile, setShareFile] = useState<FileItem | null>(null);
  const [previewFile, setPreviewFile] = useState<FileItem | null>(null);

  const handleUpload = (newFiles: File[]) => {
    const uploadedFiles = newFiles.map(file => ({
      id: uuidv4(),
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: Date.now(),
      shared: false,
      sharedWith: [],
      favorite: false,
      dataUrl: URL.createObjectURL(file),
      parentId: currentFolder,
      isFolder: false
    }));

    setFiles(prev => [...prev, ...uploadedFiles]);
    toast.success(`Uploaded ${newFiles.length} file(s)`);
  };

  const handleCreateFolder = (name: string) => {
    const newFolder: FileItem = {
      id: uuidv4(),
      name,
      size: 0,
      type: 'folder',
      lastModified: Date.now(),
      shared: false,
      sharedWith: [],
      favorite: false,
      dataUrl: '',
      parentId: currentFolder,
      isFolder: true
    };

    setFiles(prev => [...prev, newFolder]);
    setShowCreateFolder(false);
    toast.success('Folder created');
  };

  const handleDelete = (id: string) => {
    setFiles(prev => prev.filter(file => file.id !== id));
    toast.success('Item deleted');
  };

  const handleShare = (file: FileItem) => {
    setShareFile(file);
  };

  const handleShareSubmit = (email: string) => {
    setFiles(prev => prev.map(file => {
      if (file.id === shareFile?.id) {
        return {
          ...file,
          shared: true,
          sharedWith: [...file.sharedWith, email]
        };
      }
      return file;
    }));
    setShareFile(null);
    toast.success('File shared successfully');
  };

  const handleToggleFavorite = (id: string) => {
    setFiles(prev => prev.map(file => {
      if (file.id === id) {
        return { ...file, favorite: !file.favorite };
      }
      return file;
    }));
  };

  const handleDownload = (file: FileItem) => {
    // In a real app, this would trigger an actual download
    toast.success(`Downloading ${file.name}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* File List */}
          <div className="lg:col-span-8">
            <FileList
              files={files}
              currentFolder={currentFolder}
              onDownload={handleDownload}
              onDelete={handleDelete}
              onShare={handleShare}
              onToggleFavorite={handleToggleFavorite}
              onNavigate={setCurrentFolder}
              onCreateFolder={() => setShowCreateFolder(true)}
              onUpload={handleUpload}
            />
          </div>

          {/* Storage Stats */}
          <div className="lg:col-span-4">
            <StorageIndicator files={files} />
          </div>
        </div>
      </div>

      {/* Modals */}
      {showCreateFolder && (
        <CreateFolderModal
          onClose={() => setShowCreateFolder(false)}
          onCreateFolder={handleCreateFolder}
        />
      )}

      {shareFile && (
        <ShareModal
          file={shareFile}
          onClose={() => setShareFile(null)}
          onShare={handleShareSubmit}
        />
      )}

      {previewFile && (
        <FilePreview
          file={previewFile}
          onClose={() => setPreviewFile(null)}
          onDownload={() => handleDownload(previewFile)}
          onShare={() => handleShare(previewFile)}
          onToggleFavorite={() => handleToggleFavorite(previewFile.id)}
        />
      )}
    </div>
  );
}