import React from 'react';
import * as ContextMenu from '@radix-ui/react-context-menu';
import { FileItem } from '../types';
import { 
  Download, Share2, Trash2, Edit, FolderInput, 
  Star, StarOff, Copy, FileText 
} from 'lucide-react';

interface FileContextMenuProps {
  file: FileItem;
  onDownload: () => void;
  onDelete: () => void;
  onShare: () => void;
  onRename: () => void;
  onMove: () => void;
  onToggleFavorite: () => void;
  onCopyLink: () => void;
  children: React.ReactNode;
}

export default function FileContextMenu({
  file,
  onDownload,
  onDelete,
  onShare,
  onRename,
  onMove,
  onToggleFavorite,
  onCopyLink,
  children
}: FileContextMenuProps) {
  return (
    <ContextMenu.Root>
      <ContextMenu.Trigger>{children}</ContextMenu.Trigger>
      
      <ContextMenu.Portal>
        <ContextMenu.Content 
          className="min-w-[220px] bg-white rounded-lg shadow-lg border border-gray-200 p-1"
        >
          {!file.isFolder && (
            <ContextMenu.Item 
              className="flex items-center px-2 py-2 text-sm text-gray-700 hover:bg-blue-50 rounded-md cursor-pointer"
              onSelect={onDownload}
            >
              <Download className="mr-2 h-4 w-4" />
              Download
            </ContextMenu.Item>
          )}

          <ContextMenu.Item 
            className="flex items-center px-2 py-2 text-sm text-gray-700 hover:bg-blue-50 rounded-md cursor-pointer"
            onSelect={onShare}
          >
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </ContextMenu.Item>

          <ContextMenu.Item 
            className="flex items-center px-2 py-2 text-sm text-gray-700 hover:bg-blue-50 rounded-md cursor-pointer"
            onSelect={onRename}
          >
            <Edit className="mr-2 h-4 w-4" />
            Rename
          </ContextMenu.Item>

          <ContextMenu.Item 
            className="flex items-center px-2 py-2 text-sm text-gray-700 hover:bg-blue-50 rounded-md cursor-pointer"
            onSelect={onMove}
          >
            <FolderInput className="mr-2 h-4 w-4" />
            Move to
          </ContextMenu.Item>

          <ContextMenu.Item 
            className="flex items-center px-2 py-2 text-sm text-gray-700 hover:bg-blue-50 rounded-md cursor-pointer"
            onSelect={onToggleFavorite}
          >
            {file.favorite ? (
              <>
                <StarOff className="mr-2 h-4 w-4" />
                Remove from favorites
              </>
            ) : (
              <>
                <Star className="mr-2 h-4 w-4" />
                Add to favorites
              </>
            )}
          </ContextMenu.Item>

          {!file.isFolder && (
            <ContextMenu.Item 
              className="flex items-center px-2 py-2 text-sm text-gray-700 hover:bg-blue-50 rounded-md cursor-pointer"
              onSelect={onCopyLink}
            >
              <Copy className="mr-2 h-4 w-4" />
              Copy link
            </ContextMenu.Item>
          )}

          <ContextMenu.Separator className="h-px bg-gray-200 my-1" />

          <ContextMenu.Item 
            className="flex items-center px-2 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md cursor-pointer"
            onSelect={onDelete}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </ContextMenu.Item>
        </ContextMenu.Content>
      </ContextMenu.Portal>
    </ContextMenu.Root>
  );
}