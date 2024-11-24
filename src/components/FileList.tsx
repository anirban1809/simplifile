import React, { useState, useCallback } from 'react';
import { FileItem } from '../types';
import { useDropzone } from 'react-dropzone';
import { 
  Download, Share2, Star, Trash2, StarOff, Folder, 
  FileText, Image, FileArchive, FileType, LayoutGrid, 
  LayoutList, Upload, Plus, ChevronLeft, ChevronRight,
  FolderOpen, ArrowLeft
} from 'lucide-react';
import FilePreview from './FilePreview';
import DeleteConfirmationDialog from './DeleteConfirmationDialog';
import { toast } from 'react-hot-toast';

interface FileListProps {
  files: FileItem[];
  currentFolder: string | null;
  onDownload: (file: FileItem) => void;
  onDelete: (id: string) => void;
  onShare: (file: FileItem) => void;
  onToggleFavorite: (id: string) => void;
  onNavigate: (folderId: string | null) => void;
  onCreateFolder: () => void;
  onUpload: (files: File[]) => void;
}

const ITEMS_PER_PAGE = 20;

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
  const [previewFile, setPreviewFile] = useState<FileItem | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemToDelete, setItemToDelete] = useState<FileItem | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    onUpload(acceptedFiles);
  }, [onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    noClick: true
  });

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (file: FileItem) => {
    if (file.isFolder) return <Folder className="h-5 w-5 text-blue-600" />;
    if (file.type.startsWith('image/')) return <Image className="h-5 w-5 text-green-600" />;
    if (file.type.includes('pdf')) return <FileText className="h-5 w-5 text-red-600" />;
    if (file.type.includes('zip') || file.type.includes('archive')) return <FileArchive className="h-5 w-5 text-yellow-600" />;
    return <FileType className="h-5 w-5 text-gray-600" />;
  };

  const handleDoubleClick = (file: FileItem) => {
    if (file.isFolder) {
      onNavigate(file.id);
      setCurrentPage(1); // Reset pagination when navigating
    } else {
      setPreviewFile(file);
    }
  };

  const handleDelete = (file: FileItem) => {
    setItemToDelete(file);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      onDelete(itemToDelete.id);
      setItemToDelete(null);
      toast.success(`${itemToDelete.isFolder ? 'Folder' : 'File'} deleted`);
    }
  };

  const currentFiles = files.filter(file => file.parentId === currentFolder);
  const totalPages = Math.max(1, Math.ceil(currentFiles.length / ITEMS_PER_PAGE));
  const paginatedFiles = currentFiles.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Get current folder name
  const getCurrentFolderName = () => {
    if (!currentFolder) return null;
    return files.find(f => f.id === currentFolder)?.name;
  };

  // Zero State Component
  const ZeroState = () => (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <FolderOpen className="h-16 w-16 text-gray-400 dark:text-gray-600 mb-4" />
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
        This folder is empty
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
        Drag and drop files here or use the upload button above to get started
      </p>
    </div>
  );

  return (
    <div {...getRootProps()} className="space-y-4">
      <input {...getInputProps()} />
      
      {/* Back Button and Current Folder */}
      {currentFolder && (
        <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
          <button
            onClick={() => onNavigate(null)}
            className="inline-flex items-center px-2 py-1 text-sm hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </button>
          <span className="text-gray-400 dark:text-gray-600">/</span>
          <span className="font-medium">{getCurrentFolderName()}</span>
        </div>
      )}
      
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => document.getElementById('file-upload')?.click()}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
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

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setViewMode(mode => mode === 'grid' ? 'list' : 'grid')}
            className="inline-flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-md hover:bg-gray-200 dark:hover:bg-gray-600"
          >
            {viewMode === 'grid' ? (
              <><LayoutList className="h-4 w-4 mr-2" />List View</>
            ) : (
              <><LayoutGrid className="h-4 w-4 mr-2" />Grid View</>
            )}
          </button>
          <button
            onClick={onCreateFolder}
            className="inline-flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-md hover:bg-gray-200 dark:hover:bg-gray-600"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Folder
          </button>
        </div>
      </div>

      {/* Drop Zone Overlay */}
      {isDragActive && (
        <div className="absolute inset-0 bg-blue-500 bg-opacity-10 border-2 border-blue-500 border-dashed rounded-lg flex items-center justify-center">
          <p className="text-blue-600 text-lg font-medium">Drop files here to upload</p>
        </div>
      )}

      {/* File List */}
      <div className={`bg-white dark:bg-gray-800 rounded-lg shadow ${isDragActive ? 'border-2 border-blue-500 border-dashed' : ''}`}>
        {currentFiles.length === 0 ? (
          <ZeroState />
        ) : viewMode === 'list' ? (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {paginatedFiles.map((file) => (
              <div
                key={file.id}
                onDoubleClick={() => handleDoubleClick(file)}
                className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
              >
                <div className="flex items-center space-x-3 flex-1">
                  {getFileIcon(file)}
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{file.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onToggleFavorite(file.id)}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-full"
                  >
                    {file.favorite ? (
                      <Star className="h-4 w-4 text-yellow-500" />
                    ) : (
                      <StarOff className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                  {!file.isFolder && (
                    <button
                      onClick={() => onDownload(file)}
                      className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-full"
                    >
                      <Download className="h-4 w-4 text-gray-400" />
                    </button>
                  )}
                  <button
                    onClick={() => onShare(file)}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-full"
                  >
                    <Share2 className="h-4 w-4 text-gray-400" />
                  </button>
                  <button
                    onClick={() => handleDelete(file)}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-full"
                  >
                    <Trash2 className="h-4 w-4 text-gray-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 p-4">
            {paginatedFiles.map((file) => (
              <div
                key={file.id}
                onDoubleClick={() => handleDoubleClick(file)}
                className="group relative flex flex-col items-center p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
              >
                {getFileIcon(file)}
                <span className="mt-2 text-sm font-medium text-gray-900 dark:text-white text-center truncate w-full">
                  {file.name}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {formatBytes(file.size)}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {currentFiles.length > ITEMS_PER_PAGE && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setCurrentPage(page => Math.max(1, page - 1))}
              disabled={currentPage === 1}
              className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 disabled:opacity-50"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </button>
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(page => Math.min(totalPages, page + 1))}
              disabled={currentPage === totalPages}
              className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 disabled:opacity-50"
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </button>
          </div>
        )}
      </div>

      {/* File Preview Modal */}
      {previewFile && (
        <FilePreview
          file={previewFile}
          onClose={() => setPreviewFile(null)}
          onDownload={() => onDownload(previewFile)}
          onShare={() => onShare(previewFile)}
          onToggleFavorite={() => onToggleFavorite(previewFile.id)}
        />
      )}

      {/* Delete Confirmation Dialog */}
      {itemToDelete && (
        <DeleteConfirmationDialog
          item={itemToDelete}
          onConfirm={confirmDelete}
          onCancel={() => setItemToDelete(null)}
        />
      )}
    </div>
  );
}