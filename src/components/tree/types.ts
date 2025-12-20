export interface TreeItemData {
  id: string;
  name: string;
  isFolder: boolean;
  isOpen?: boolean;
  children?: TreeItemData[];
}

export interface TreeContextMenuProps {
  onRename: () => void;
  onDelete: () => void;
  onAddChild: () => void;
  onAddChildFolder: () => void;
  onAddSibling: () => void;
  onAddSiblingFolder: () => void;
  onDuplicate: () => void;
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
  onMove?: (srcIds: string[], dstParentId: string | null, dstIndex: number) => void;
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
  onMove?: (srcIds: string[], dstParentId: string | null, dstIndex: number) => void;
}
