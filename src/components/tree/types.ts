export interface TreeItemData {
  id: string;
  name: string;
  isFolder: boolean;
  isOpen?: boolean;
  children?: TreeItemData[];
  tags?: string[];
  isArchived?: boolean;
  isDeleted?: boolean;
  content?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface TreeContextMenuProps {
  onRename: () => void;
  onDelete: () => void;
  onAddChild: () => void;
  onAddChildFolder: () => void;
  onAddSibling: () => void;
  onAddSiblingFolder: () => void;
  onDuplicate: () => void;
  onManageTags?: () => void;
  onArchive?: () => void;
}

export interface TreeNodeProps {
  item: TreeItemData;
  level: number;
  isActive: boolean;
  onSelect: (id: string) => void;
  onToggle: (id: string, isOpen: boolean) => void;
  onRename: (id: string, newName: string) => void;
  onDelete: (id: string) => void;
  onAddChild: (parentId: string, isFolder: boolean) => void;
  onAddSibling: (siblingId: string, isFolder: boolean) => void;
  onDuplicate: (id: string) => void;
  onManageTags?: (id: string) => void;
  onArchive?: (id: string) => void;
  onMove?: (draggedId: string, targetId: string, position: 'before' | 'after' | 'inside') => void;
}

export interface DocumentTreeProps {
  data: TreeItemData;
  activeId: string | null;
  onSelect: (id: string) => void;
  onToggle?: (id: string, isOpen: boolean) => void;
  onRename?: (id: string, newName: string) => void;
  onDelete?: (id: string) => void;
  onAddChild?: (parentId: string, isFolder: boolean) => void;
  onAddSibling?: (siblingId: string, isFolder: boolean) => void;
  onDuplicate?: (id: string) => void;
  onManageTags?: (id: string) => void;
  onArchive?: (id: string) => void;
  onMove?: (draggedId: string, targetId: string, position: 'before' | 'after' | 'inside') => void;
}

export type DropPosition = 'before' | 'after' | 'inside' | null;
