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
import { Folder, Share2 } from 'lucide-react';

// Generate example files
const generateExampleFiles = (): FileItem[] => {
  const files: FileItem[] = [];
  const types = ['image/jpeg', 'application/pdf', 'text/plain', 'application/zip'];
  const names = ['Project Report', 'Meeting Notes', 'Design Assets', 'Source Code'];
  const folders = ['Documents', 'Images', 'Downloads', 'Projects'];

  // Add folders
  folders.forEach((name) => {
    files.push({
      id: uuidv4(),
      name,
      size: 0,
      type: 'folder',
      lastModified: Date.now() - Math.random() * 10000000,
      shared: Math.random() > 0.7,
      sharedWith: [],
      favorite: Math.random() > 0.7,
      dataUrl: '',
      parentId: null,
      isFolder: true
    });
  });

  // Add files
  for (let i = 0; i < 20; i++) {
    const type = types[Math.floor(Math.random() * types.length)];
    const baseName = names[Math.floor(Math.random() * names.length)];
    const parentId = Math.random() > 0.5 ? files[Math.floor(Math.random() * folders.length)].id : null;

    files.push({
      id: uuidv4(),
      name: `${baseName} ${i + 1}.${type.split('/')[1]}`,
      size: Math.floor(Math.random() * 10000000),
      type,
      lastModified: Date.now() - Math.random() * 10000000,
      shared: Math.random() > 0.7,
      sharedWith: [],
      favorite: Math.random() > 0.7,
      dataUrl: '',
      parentId,
      isFolder: false
    });
  }

  return files;
};

export default function Dashboard() {
  const [files, setFiles] = useState<FileItem[]>(generateExampleFiles());
  const [currentFolder, setCurrentFolder] = useState<string | null>(null);
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [activeTab, setActiveTab] = useState<'my-files' | 'shared'>('my-files');

  const myFiles = files.filter(file => !file.shared);
  const sharedFiles = files.filter(file => file.shared);

  const handleUpload = (uploadedFiles: File[]) => {
    const newFiles = uploadedFiles.map(file => ({
      id: uuidv4(),
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified,
      shared: false,
      sharedWith: [],
      favorite: false,
      dataUrl: URL.createObjectURL(file),
      parentId: currentFolder,
      isFolder: false
    }));

    setFiles([...files, ...newFiles]);
    toast.success(`${uploadedFiles.length} files uploaded`);
  };

  const handleDownload = (file: FileItem) => {
    // In a real app, this would download the actual file
    toast.success(`Downloading ${file.name}`);
  };

  const handleDelete = (id: string) => {
    setFiles(files.filter(file => file.id !== id));
    toast.success('Item deleted');
  };

  const handleShare = (file: FileItem) => {
    setSelectedFile(file);
    setShowShareModal(true);
  };

  const handleToggleFavorite = (id: string) => {
    setFiles(files.map(file => 
      file.id === id ? { ...file, favorite: !file.favorite } : file
    ));
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

    setFiles([...files, newFolder]);
    setShowCreateFolder(false);
    toast.success('Folder created');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-8">
            {/* Tabs */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm mb-6">
              <div className="border-b border-gray-200 dark:border-gray-700">
                <nav className="flex space-x-4 px-4" aria-label="Tabs">
                  <button
                    onClick={() => setActiveTab('my-files')}
                    className={`flex items-center px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === 'my-files'
                        ? 'border-accent text-accent'
                        : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <Folder className="h-4 w-4 mr-2" />
                    My Files
                    <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                      activeTab === 'my-files'
                        ? 'bg-accent/10 text-accent'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                    }`}>
                      {myFiles.length}
                    </span>
                  </button>
                  <button
                    onClick={() => setActiveTab('shared')}
                    className={`flex items-center px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === 'shared'
                        ? 'border-accent text-accent'
                        : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Shared with me
                    <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                      activeTab === 'shared'
                        ? 'bg-accent/10 text-accent'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                    }`}>
                      {sharedFiles.length}
                    </span>
                  </button>
                </nav>
              </div>
            </div>

            {/* File Lists */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              {activeTab === 'my-files' ? (
                <FileList
                  files={myFiles}
                  currentFolder={currentFolder}
                  onDownload={handleDownload}
                  onDelete={handleDelete}
                  onShare={handleShare}
                  onToggleFavorite={handleToggleFavorite}
                  onNavigate={setCurrentFolder}
                  onCreateFolder={() => setShowCreateFolder(true)}
                  onUpload={handleUpload}
                />
              ) : (
                <FileList
                  files={sharedFiles}
                  currentFolder={currentFolder}
                  onDownload={handleDownload}
                  onDelete={handleDelete}
                  onShare={handleShare}
                  onToggleFavorite={handleToggleFavorite}
                  onNavigate={setCurrentFolder}
                  onCreateFolder={() => setShowCreateFolder(true)}
                  onUpload={handleUpload}
                />
              )}
            </div>
          </div>

          {/* Storage Stats */}
          <div className="lg:col-span-4">
            <StorageIndicator files={files} />
          </div>
        </div>
      </div>

      {/* Create Folder Modal */}
      {showCreateFolder && (
        <CreateFolderModal
          onClose={() => setShowCreateFolder(false)}
          onCreateFolder={handleCreateFolder}
        />
      )}

      {/* Share Modal */}
      {showShareModal && selectedFile && (
        <ShareModal
          file={selectedFile}
          onClose={() => {
            setShowShareModal(false);
            setSelectedFile(null);
          }}
          onShare={(email) => {
            setFiles(files.map(f => 
              f.id === selectedFile.id
                ? { ...f, shared: true, sharedWith: [...f.sharedWith, email] }
                : f
            ));
            setShowShareModal(false);
            setSelectedFile(null);
            toast.success(`Shared with ${email}`);
          }}
        />
      )}
    </div>
  );
}