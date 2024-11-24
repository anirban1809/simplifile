export interface FileItem {
  id: string;
  name: string;
  size: number;
  type: string;
  lastModified: number;
  shared: boolean;
  sharedWith: string[];
  favorite: boolean;
  dataUrl: string;
  parentId: string | null;
  isFolder: boolean;
}

export interface FileSystemNode {
  item: FileItem;
  children: FileSystemNode[];
}