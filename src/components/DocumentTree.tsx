import { ChevronRight, FileText, Plus, Trash2, FolderOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useState } from 'react';

export interface Document {
  id: string;
  title: string;
  content: string;
  parentId: string | null;
  children?: Document[];
  isExpanded?: boolean;
  isFolder?: boolean;
  tags?: string[];
  sharing?: {
    isPublic: boolean;
    sharedWith?: Array<{
      email: string;
      role: 'viewer' | 'editor';
      sharedAt: string;
    }>;
    shareLink?: string;
    googleDocId?: string;
  };
}

interface DocumentTreeProps {
  documents: Document[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onAdd: (parentId: string | null) => void;
  onDelete: (id: string) => void;
  onToggleExpand: (id: string) => void;
}

interface TreeNodeProps {
  document: Document;
  level: number;
  isActive: boolean;
  activeId: string | null;
  onSelect: (id: string) => void;
  onAdd: (parentId: string) => void;
  onDelete: (id: string) => void;
  onToggleExpand: (id: string) => void;
}

const TreeNode = ({
  document,
  level,
  isActive,
  activeId,
  onSelect,
  onAdd,
  onDelete,
  onToggleExpand,
}: TreeNodeProps) => {
  const hasChildren = document.children && document.children.length > 0;

  return (
    <div>
      <div
        className={cn(
          'group flex items-center gap-1 px-2 py-1.5 hover:bg-sidebar-accent rounded-md cursor-pointer transition-colors',
          isActive && 'bg-sidebar-accent'
        )}
        style={{ paddingLeft: `${level * 12 + 8}px` }}
      >
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            'h-5 w-5 p-0 hover:bg-transparent',
            !hasChildren && 'invisible'
          )}
          onClick={(e) => {
            e.stopPropagation();
            onToggleExpand(document.id);
          }}
        >
          <ChevronRight
            className={cn(
              'h-3 w-3 transition-transform',
              document.isExpanded && 'rotate-90'
            )}
          />
        </Button>

        <div
          className="flex flex-1 items-center gap-2 min-w-0"
          onClick={() => onSelect(document.id)}
        >
          <FileText className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
          <span className="flex-1 truncate text-sm">{document.title || 'Untitled'}</span>
        </div>

        <div className="opacity-0 group-hover:opacity-100 flex gap-0.5 transition-opacity">
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={(e) => {
              e.stopPropagation();
              onAdd(document.id);
            }}
            title="Add child note"
          >
            <Plus className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 text-destructive hover:text-destructive"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(document.id);
            }}
            title="Delete note"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {document.isExpanded && document.children && (
        <div>
          {document.children.map((child) => (
            <TreeNode
              key={child.id}
              document={child}
              level={level + 1}
              isActive={child.id === activeId}
              activeId={activeId}
              onSelect={onSelect}
              onAdd={onAdd}
              onDelete={onDelete}
              onToggleExpand={onToggleExpand}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const DocumentTree = ({
  documents,
  activeId,
  onSelect,
  onAdd,
  onDelete,
  onToggleExpand,
}: DocumentTreeProps) => {
  return (
    <div className="flex h-full flex-col bg-sidebar-background">
      <div className="border-b border-sidebar-border px-4 py-4">
        <div className="flex items-center gap-2">
          <FolderOpen className="h-5 w-5 text-sidebar-primary" />
          <h2 className="font-serif text-lg font-semibold text-sidebar-foreground">Notes</h2>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-2">
        {documents.map((doc) => (
          <TreeNode
            key={doc.id}
            document={doc}
            level={0}
            isActive={doc.id === activeId}
            activeId={activeId}
            onSelect={onSelect}
            onAdd={onAdd}
            onDelete={onDelete}
            onToggleExpand={onToggleExpand}
          />
        ))}
      </div>

      <div className="border-t border-sidebar-border p-3">
        <Button
          onClick={() => onAdd(null)}
          className="w-full bg-sidebar-primary hover:bg-sidebar-primary/90 text-sidebar-primary-foreground"
          size="sm"
        >
          <Plus className="mr-2 h-4 w-4" />
          New Note
        </Button>
      </div>
    </div>
  );
};
