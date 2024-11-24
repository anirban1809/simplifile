import React, { useState, useCallback } from 'react';
import { FileItem } from '../types';
import { useDropzone } from 'react-dropzone';
import { 
  Download, Share2, Star, Trash2, StarOff, Folder, 
  FileText, Image, FileArchive, FileType, LayoutGrid, 
  LayoutList, Upload, Plus, ChevronLeft, ChevronRight,
  FolderOpen, ArrowLeft, Link, CheckCircle2
} from 'lucide-react';
import FilePreview from './FilePreview';
import DeleteConfirmationDialog from './DeleteConfirmationDialog';
import ShareModal from './ShareModal';
import { toast } from 'react-hot-toast';

interface FileListProps {
  files: FileItem[];
  currentFolder: string | null;
  onDownload: (files: FileItem[]) => void;
  onDelete: (ids: string[]) => void;
  onShare: (files: FileItem[]) => void;
  onToggleFavorite: (id: string) => void;
  onNavigate: (folderId: string | null) => void;
  onCreateFolder: () => void;
  onUpload: (files: File[]) => void;
}

export default function FileList({
  files,
  currentFolder,
  onDownload,
  onDelete,
  onShare,
  onToggleFavorite,
  onNavigate,
  onCreateFolder,
  onUpload
}: FileListProps) {
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareItem, setShareItem] = useState<FileItem | null>(null);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

  const onDrop = useCallback((acceptedFiles: File[]) => {
    onUpload(acceptedFiles);
  }, [onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    noClick: true,
    noKeyboard: true
  });

  const getCurrentFolder = () => {
    return files.find(f => f.id === currentFolder);
  };

  const currentFiles = files.filter(file => file.parentId === currentFolder);

  const getFileIcon = (file: FileItem) => {
    if (file.isFolder) return <Folder className="h-5 w-5" />;
    if (file.type.startsWith('image/')) return <Image className="h-5 w-5" />;
    if (file.type === 'application/pdf') return <FileText className="h-5 w-5" />;
    if (file.type === 'application/zip') return <FileArchive className="h-5 w-5" />;
    return <FileType className="h-5 w-5" />;
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const toggleSelection = (id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    const newSelection = new Set(selectedItems);
    if (selectedItems.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedItems(newSelection);
  };

  const handleBatchAction = (action: 'download' | 'delete' | 'share') => {
    const selectedFiles = files.filter(file => selectedItems.has(file.id));
    
    switch (action) {
      case 'download':
        onDownload(selectedFiles);
        setSelectedItems(new Set());
        break;
      case 'delete':
        setShowDeleteDialog(true);
        break;
      case 'share':
        setShowShareModal(true);
        setShareItem(selectedFiles[0]); // For now, we'll use the first file's sharing UI
        break;
    }
  };

  return (
    <div {...getRootProps()} className="space-y-6">
      <input {...getInputProps()} />
      
      {/* Back Button and Current Folder */}
      {currentFolder && (
        <div className="flex items-center justify-between px-6 pt-4">
          <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
            <button
              onClick={() => onNavigate(null)}
              className="inline-flex items-center px-2 py-1 text-sm hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </button>
            <span className="text-gray-400 dark:text-gray-600">/</span>
            <span className="font-medium">{getCurrentFolder()?.name}</span>
          </div>
          
          {/* Share Folder Button */}
          <button
            onClick={() => {
              const folder = getCurrentFolder();
              if (folder) {
                setShareItem(folder);
                setShowShareModal(true);
              }
            }}
            className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share Folder
          </button>
        </div>
      )}
      
      {/* Header Actions */}
      <div className="flex items-center justify-between px-6 pt-4">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => document.getElementById('file-upload')?.click()}
            className="inline-flex items-center h-10 px-4 bg-accent text-white text-sm font-medium rounded-md hover:bg-accent-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent"
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload Files
            <input
              id="file-upload"
              type="file"
              multiple
              className="hidden"
              onChange={(e) => {
                if (e.target.files) {
                  onUpload(Array.from(e.target.files));
                }
              }}
            />
          </button>

          {selectedItems.size > 0 && (
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleBatchAction('download')}
                className="inline-flex items-center h-10 px-3 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                <Download className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleBatchAction('share')}
                className="inline-flex items-center h-10 px-3 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                <Share2 className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleBatchAction('delete')}
                className="inline-flex items-center h-10 px-3 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 rounded-md hover:bg-red-100 dark:hover:bg-red-900/50"
              >
                <Trash2 className="h-4 w-4" />
              </button>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {selectedItems.size} selected
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setViewMode(mode => mode === 'grid' ? 'list' : 'grid')}
            className="inline-flex items-center h-10 px-4 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-md hover:bg-gray-200 dark:hover:bg-gray-600"
          >
            {viewMode === 'grid' ? (
              <><LayoutList className="h-4 w-4 mr-2" />List View</>
            ) : (
              <><LayoutGrid className="h-4 w-4 mr-2" />Grid View</>
            )}
          </button>
          <button
            onClick={onCreateFolder}
            className="inline-flex items-center h-10 px-4 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-md hover:bg-gray-200 dark:hover:bg-gray-600"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Folder
          </button>
        </div>
      </div>

      {/* Drop Zone Overlay */}
      {isDragActive && (
        <div className="absolute inset-0 bg-accent bg-opacity-10 border-2 border-accent border-dashed rounded-lg flex items-center justify-center">
          <p className="text-accent text-lg font-medium">Drop files here to upload</p>
        </div>
      )}

      {/* Empty State */}
      {currentFiles.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 px-4">
          <FolderOpen className="h-12 w-12 text-gray-400 dark:text-gray-600 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No files yet</h3>
          <p className="text-gray-500 dark:text-gray-400 text-center mb-4">
            Drop files here or use the upload button to add files
          </p>
        </div>
      )}

      {/* File List */}
      {currentFiles.length > 0 && (
        <div className={`bg-white dark:bg-gray-800 rounded-lg shadow ${isDragActive ? 'border-2 border-accent border-dashed' : ''}`}>
          {viewMode === 'list' ? (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {currentFiles.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 group cursor-pointer"
                  onClick={(e) => toggleSelection(file.id, e)}
                  onDoubleClick={() => {
                    if (file.isFolder) {
                      onNavigate(file.id);
                    } else {
                      setSelectedFile(file);
                    }
                  }}
                >
                  <div className="flex-shrink-0 mr-4">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      selectedItems.has(file.id)
                        ? 'bg-accent text-white'
                        : 'text-gray-400 dark:text-gray-500'
                    }`}>
                      {selectedItems.has(file.id) ? (
                        <CheckCircle2 className="h-5 w-5" />
                      ) : (
                        getFileIcon(file)
                      )}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {file.name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {!file.isFolder && formatBytes(file.size)} • {new Date(file.lastModified).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="ml-4 flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {!file.isFolder && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDownload([file]);
                        }}
                        className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                      >
                        <Download className="h-5 w-5" />
                      </button>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShareItem(file);
                        setShowShareModal(true);
                      }}
                      className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                    >
                      <Share2 className="h-5 w-5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(file.id);
                      }}
                      className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                    >
                      {file.favorite ? (
                        <Star className="h-5 w-5 text-yellow-500" />
                      ) : (
                        <StarOff className="h-5 w-5" />
                      )}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedFile(file);
                        setShowDeleteDialog(true);
                      }}
                      className="p-1 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-500"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 p-6">
              {currentFiles.map((file) => (
                <div
                  key={file.id}
                  className={`group relative flex flex-col items-center p-4 rounded-lg border transition-colors cursor-pointer ${
                    selectedItems.has(file.id)
                      ? 'border-accent bg-accent/5 dark:bg-accent/10'
                      : 'border-gray-200 dark:border-gray-700 hover:border-accent dark:hover:border-accent'
                  }`}
                  onClick={(e) => toggleSelection(file.id, e)}
                  onDoubleClick={() => {
                    if (file.isFolder) {
                      onNavigate(file.id);
                    } else {
                      setSelectedFile(file);
                    }
                  }}
                >
                  {selectedItems.has(file.id) && (
                    <div className="absolute top-2 right-2 text-accent">
                      <CheckCircle2 className="h-5 w-5" />
                    </div>
                  )}
                  <div className="w-full aspect-square flex items-center justify-center mb-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    {file.type.startsWith('image/') ? (
                      <img
                        src={file.dataUrl}
                        alt={file.name}
                        className="max-h-full max-w-full object-contain rounded"
                      />
                    ) : (
                      <div className="text-gray-400 dark:text-gray-500">
                        {getFileIcon(file)}
                      </div>
                    )}
                  </div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white text-center truncate w-full">
                    {file.name}
                  </p>
                  {!file.isFolder && (
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {formatBytes(file.size)}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* File Preview Modal */}
      {selectedFile && !showDeleteDialog && (
        <FilePreview
          file={selectedFile}
          onClose={() => setSelectedFile(null)}
          onDownload={() => onDownload([selectedFile])}
          onShare={() => {
            setShareItem(selectedFile);
            setSelectedFile(null);
            setShowShareModal(true);
          }}
          onToggleFavorite={() => onToggleFavorite(selectedFile.id)}
        />
      )}

      {/* Delete Confirmation Dialog */}
      {showDeleteDialog && (
        <DeleteConfirmationDialog
          items={selectedItems.size > 0 
            ? Array.from(selectedItems).map(id => files.find(f => f.id === id)!).filter(Boolean)
            : [selectedFile!]
          }
          onConfirm={() => {
            if (selectedItems.size > 0) {
              onDelete(Array.from(selectedItems));
              setSelectedItems(new Set());
            } else {
              onDelete([selectedFile!.id]);
              setSelectedFile(null);
            }
            setShowDeleteDialog(false);
          }}
          onCancel={() => {
            setShowDeleteDialog(false);
            setSelectedFile(null);
          }}
        />
      )}

      {/* Share Modal */}
      {showShareModal && shareItem && (
        <ShareModal
          files={selectedItems.size > 0
            ? Array.from(selectedItems).map(id => files.find(f => f.id === id)!).filter(Boolean)
            : [shareItem]
          }
          onClose={() => {
            setShowShareModal(false);
            setShareItem(null);
            setSelectedItems(new Set());
          }}
          onShare={(email) => {
            onShare(selectedItems.size > 0
              ? Array.from(selectedItems).map(id => files.find(f => f.id === id)!).filter(Boolean)
              : [shareItem]
            );
            setShowShareModal(false);
            setShareItem(null);
            setSelectedItems(new Set());
          }}
        />
      )}
    </div>
  );
}