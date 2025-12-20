import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubTrigger,
  ContextMenuSubContent,
} from '@/components/ui/context-menu';
import { Plus, Trash2, Copy, Edit, FolderPlus, Tag, Folder, FileText } from 'lucide-react';

interface DocumentContextMenuProps {
  children: React.ReactNode;
  onAddChild: () => void;
  onAddChildFolder: () => void;
  onAddSibling: () => void;
  onAddSiblingFolder: () => void;
  onRename: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onManageTags: () => void;
}

export const DocumentContextMenu = ({
  children,
  onAddChild,
  onAddChildFolder,
  onAddSibling,
  onAddSiblingFolder,
  onRename,
  onDuplicate,
  onDelete,
  onManageTags,
}: DocumentContextMenuProps) => {
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
      <ContextMenuContent className="w-56">
        <ContextMenuSub>
          <ContextMenuSubTrigger>
            <FolderPlus className="mr-2 h-4 w-4" />
            Add Child
          </ContextMenuSubTrigger>
          <ContextMenuSubContent>
            <ContextMenuItem onClick={onAddChild}>
              <FileText className="mr-2 h-4 w-4" />
              Note
            </ContextMenuItem>
            <ContextMenuItem onClick={onAddChildFolder}>
              <Folder className="mr-2 h-4 w-4" />
              Folder
            </ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>
        <ContextMenuSub>
          <ContextMenuSubTrigger>
            <Plus className="mr-2 h-4 w-4" />
            Add Sibling
          </ContextMenuSubTrigger>
          <ContextMenuSubContent>
            <ContextMenuItem onClick={onAddSibling}>
              <FileText className="mr-2 h-4 w-4" />
              Note
            </ContextMenuItem>
            <ContextMenuItem onClick={onAddSiblingFolder}>
              <Folder className="mr-2 h-4 w-4" />
              Folder
            </ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>
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
