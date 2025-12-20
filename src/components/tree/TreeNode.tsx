import React, { useState, useRef, useEffect, KeyboardEvent, FocusEvent } from 'react';
import { ChevronRight, ChevronDown, Folder, FolderOpen, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
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
import { TreeItemData, TreeNodeProps } from './types';

export const TreeNode: React.FC<TreeNodeProps> = ({
  item,
  level,
  isActive,
  onSelect,
  onToggle,
  onRename,
  onDelete,
  onAddChild,
  onAddSibling,
  onDuplicate,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(item.name);
  const inputRef = useRef<HTMLInputElement>(null);

  const hasChildren = item.children && item.children.length > 0;
  const isOpen = item.isOpen ?? false;

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleRenameStart = () => {
    setEditValue(item.name);
    setIsEditing(true);
  };

  const handleRenameSubmit = () => {
    if (editValue.trim() && editValue !== item.name) {
      onRename(item.id, editValue.trim());
    }
    setIsEditing(false);
  };

  const handleRenameCancel = () => {
    setEditValue(item.name);
    setIsEditing(false);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleRenameSubmit();
    } else if (e.key === 'Escape') {
      handleRenameCancel();
    }
  };

  const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
    handleRenameSubmit();
  };

  const renderIcon = () => {
    if (item.isFolder) {
      const FolderIcon = isOpen ? FolderOpen : Folder;
      return (
        <FolderIcon
          className="h-4 w-4 flex-shrink-0 text-blue-500"
        />
      );
    }
    return <FileText className="h-4 w-4 flex-shrink-0 text-muted-foreground" />;
  };

  const renderChevron = () => {
    if (!item.isFolder || !hasChildren) {
      return <div className="w-4" />;
    }
    const ChevronIcon = isOpen ? ChevronDown : ChevronRight;
    return (
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggle(item.id, !isOpen);
        }}
        className="hover:bg-accent rounded p-0.5 transition-colors"
      >
        <ChevronIcon className="h-3 w-3" />
      </button>
    );
  };

  return (
    <div>
      <ContextMenu>
        <ContextMenuTrigger asChild>
          <div
            className={cn(
              'group flex items-center gap-1.5 px-2 py-1.5 hover:bg-accent rounded-md cursor-pointer transition-colors',
              isActive && 'bg-accent'
            )}
            style={{ paddingLeft: `${level * 16 + 8}px` }}
            onClick={() => onSelect(item.id)}
          >
            {renderChevron()}
            {renderIcon()}
            {isEditing ? (
              <input
                ref={inputRef}
                type="text"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={handleBlur}
                className="flex-1 bg-background border border-primary rounded px-1 py-0 text-sm outline-none"
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <span className="flex-1 truncate text-sm">
                {item.name || 'Untitled'}
              </span>
            )}
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent className="w-56">
          {item.isFolder && (
            <>
              <ContextMenuSub>
                <ContextMenuSubTrigger>
                  <FileText className="mr-2 h-4 w-4" />
                  Add Child
                </ContextMenuSubTrigger>
                <ContextMenuSubContent>
                  <ContextMenuItem onClick={() => onAddChild(item.id, false)}>
                    <FileText className="mr-2 h-4 w-4" />
                    Document
                  </ContextMenuItem>
                  <ContextMenuItem onClick={() => onAddChild(item.id, true)}>
                    <Folder className="mr-2 h-4 w-4" />
                    Folder
                  </ContextMenuItem>
                </ContextMenuSubContent>
              </ContextMenuSub>
              <ContextMenuSeparator />
            </>
          )}
          <ContextMenuSub>
            <ContextMenuSubTrigger>
              <FileText className="mr-2 h-4 w-4" />
              Add Sibling
            </ContextMenuSubTrigger>
            <ContextMenuSubContent>
              <ContextMenuItem onClick={() => onAddSibling(item.id, false)}>
                <FileText className="mr-2 h-4 w-4" />
                Document
              </ContextMenuItem>
              <ContextMenuItem onClick={() => onAddSibling(item.id, true)}>
                <Folder className="mr-2 h-4 w-4" />
                Folder
              </ContextMenuItem>
            </ContextMenuSubContent>
          </ContextMenuSub>
          <ContextMenuSeparator />
          <ContextMenuItem onClick={handleRenameStart}>
            <FileText className="mr-2 h-4 w-4" />
            Rename
          </ContextMenuItem>
          <ContextMenuItem onClick={() => onDuplicate(item.id)}>
            <FileText className="mr-2 h-4 w-4" />
            Duplicate
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem
            onClick={() => onDelete(item.id)}
            className="text-destructive focus:text-destructive"
          >
            <FileText className="mr-2 h-4 w-4" />
            Delete
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>

      {isOpen && hasChildren && (
        <div>
          {item.children!.map((child) => (
            <TreeNode
              key={child.id}
              item={child}
              level={level + 1}
              isActive={isActive}
              onSelect={onSelect}
              onToggle={onToggle}
              onRename={onRename}
              onDelete={onDelete}
              onAddChild={onAddChild}
              onAddSibling={onAddSibling}
              onDuplicate={onDuplicate}
            />
          ))}
        </div>
      )}
    </div>
  );
};
