import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  ContextMenuSeparator,
} from '@/components/ui/context-menu';
import { Plus, Trash2, Copy, Edit, FolderPlus, Tag } from 'lucide-react';

interface DocumentContextMenuProps {
  children: React.ReactNode;
  onAddChild: () => void;
  onAddSibling: () => void;
  onRename: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onManageTags: () => void;
}

export const DocumentContextMenu = ({
  children,
  onAddChild,
  onAddSibling,
  onRename,
  onDuplicate,
  onDelete,
  onManageTags,
}: DocumentContextMenuProps) => {
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
      <ContextMenuContent className="w-56">
        <ContextMenuItem onClick={onAddChild}>
          <FolderPlus className="mr-2 h-4 w-4" />
          Add Child Note
        </ContextMenuItem>
        <ContextMenuItem onClick={onAddSibling}>
          <Plus className="mr-2 h-4 w-4" />
          Add Sibling Note
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem onClick={onRename}>
          <Edit className="mr-2 h-4 w-4" />
          Rename
        </ContextMenuItem>
        <ContextMenuItem onClick={onDuplicate}>
          <Copy className="mr-2 h-4 w-4" />
          Duplicate
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem onClick={onManageTags}>
          <Tag className="mr-2 h-4 w-4" />
          Manage Tags
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem onClick={onDelete} className="text-destructive focus:text-destructive">
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};
