import React, { useState, useRef, useEffect, KeyboardEvent, FocusEvent, DragEvent } from 'react';
import { ChevronRight, ChevronDown, Folder, FolderOpen, FileText, GripVertical, Tag } from 'lucide-react';
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
import { TreeItemData, TreeNodeProps, DropPosition } from './types';

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
  onManageTags,
  onArchive,
  onMove,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(item.name);
  const [isDragging, setIsDragging] = useState(false);
  const [dropPosition, setDropPosition] = useState<DropPosition>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const nodeRef = useRef<HTMLDivElement>(null);

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

  // Drag and Drop handlers
  const handleDragStart = (e: DragEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setIsDragging(true);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', item.id);
  };

  const handleDragEnd = (e: DragEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setIsDragging(false);
    setDropPosition(null);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (!nodeRef.current) return;

    const rect = nodeRef.current.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const height = rect.height;

    // Determine drop position based on cursor location
    if (item.isFolder && y > height * 0.33 && y < height * 0.66) {
      setDropPosition('inside');
    } else if (y <= height * 0.33) {
      setDropPosition('before');
    } else {
      setDropPosition('after');
    }
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setDropPosition(null);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const draggedId = e.dataTransfer.getData('text/plain');

    if (draggedId && draggedId !== item.id && dropPosition && onMove) {
      onMove(draggedId, item.id, dropPosition);
    }

    setDropPosition(null);
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

  const renderTags = () => {
    if (!item.tags || item.tags.length === 0) return null;

    return (
      <div className="flex items-center gap-1 ml-2">
        {item.tags.slice(0, 2).map((tag, index) => (
          <span
            key={index}
            className="inline-flex items-center px-1.5 py-0.5 rounded text-xs bg-primary/10 text-primary"
          >
            {tag}
          </span>
        ))}
        {item.tags.length > 2 && (
          <span className="text-xs text-muted-foreground">
            +{item.tags.length - 2}
          </span>
        )}
      </div>
    );
  };

  return (
    <div>
      <ContextMenu>
        <ContextMenuTrigger asChild>
          <div
            ref={nodeRef}
            draggable={!isEditing}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={cn(
              'group relative flex items-center gap-1.5 px-2 py-1.5 hover:bg-accent rounded-md cursor-pointer transition-all',
              isActive && 'bg-accent font-medium',
              isDragging && 'opacity-40',
              dropPosition === 'before' && 'border-t-2 border-primary',
              dropPosition === 'after' && 'border-b-2 border-primary',
              dropPosition === 'inside' && 'ring-2 ring-primary ring-inset'
            )}
            style={{ paddingLeft: `${level * 16 + 8}px` }}
            onClick={() => !isEditing && onSelect(item.id)}
          >
            <GripVertical className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
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
              <>
                <span className="flex-1 truncate text-sm">
                  {item.name || 'Untitled'}
                </span>
                {renderTags()}
              </>
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
          {onManageTags && (
            <>
              <ContextMenuSeparator />
              <ContextMenuItem onClick={() => onManageTags(item.id)}>
                <Tag className="mr-2 h-4 w-4" />
                Manage Tags
              </ContextMenuItem>
            </>
          )}
          {onArchive && (
            <ContextMenuItem onClick={() => onArchive(item.id)}>
              <FileText className="mr-2 h-4 w-4" />
              Archive
            </ContextMenuItem>
          )}
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
              isActive={child.id === isActive}
              onSelect={onSelect}
              onToggle={onToggle}
              onRename={onRename}
              onDelete={onDelete}
              onAddChild={onAddChild}
              onAddSibling={onAddSibling}
              onDuplicate={onDuplicate}
              onManageTags={onManageTags}
              onArchive={onArchive}
              onMove={onMove}
            />
          ))}
        </div>
      )}
    </div>
  );
};
