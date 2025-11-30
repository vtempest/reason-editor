import { Document } from '@/components/DocumentTree';
import { DraggableDocumentTree } from '@/components/DraggableDocumentTree';
import { OutlineView } from '@/components/OutlineView';
import { FloatingSearch } from '@/components/FloatingSearch';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { FolderOpen, List, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  documents: Document[];
  activeId: string | null;
  activeDocument: Document | undefined;
  onSelect: (id: string) => void;
  onAdd: (parentId: string | null) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  onToggleExpand: (id: string) => void;
  onMove: (draggedId: string, targetId: string | null, position: 'before' | 'after' | 'child') => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSearchClear: () => void;
  onSearchFocus: () => void;
  // Mobile drawer props
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  isMobile?: boolean;
  // View mode
  viewMode: 'tree' | 'outline';
  onViewModeChange: (mode: 'tree' | 'outline') => void;
}

export const Sidebar = ({
  documents,
  activeId,
  activeDocument,
  onSelect,
  onAdd,
  onDelete,
  onDuplicate,
  onToggleExpand,
  onMove,
  searchQuery,
  onSearchChange,
  onSearchClear,
  onSearchFocus,
  isOpen,
  onOpenChange,
  isMobile,
  viewMode,
  onViewModeChange,
}: SidebarProps) => {
  const sidebarContent = (
    <aside className="flex h-full w-full flex-col bg-sidebar-background relative">
      {/* Floating search */}
      <div className="absolute top-3 left-3 right-3 z-20">
        <FloatingSearch
          value={searchQuery}
          onChange={onSearchChange}
          onClear={onSearchClear}
          onFocus={onSearchFocus}
        />
      </div>

      {/* Header with view toggle */}
      <div className="border-b border-sidebar-border px-4 py-4 pt-16">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {viewMode === 'tree' ? (
              <FolderOpen className="h-5 w-5 text-sidebar-primary" />
            ) : (
              <List className="h-5 w-5 text-sidebar-primary" />
            )}
            <h2 className="font-serif text-lg font-semibold text-sidebar-foreground">
              {viewMode === 'tree' ? 'Notes' : 'Outline'}
            </h2>
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onViewModeChange('tree')}
              className={cn(
                'h-8 w-8 p-0',
                viewMode === 'tree' && 'bg-sidebar-accent'
              )}
              title="Document Tree"
            >
              <FolderOpen className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onViewModeChange('outline')}
              className={cn(
                'h-8 w-8 p-0',
                viewMode === 'outline' && 'bg-sidebar-accent'
              )}
              title="Document Outline"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Content area */}
      <div className="flex-1 overflow-hidden">
        {viewMode === 'tree' ? (
          <DraggableDocumentTree
            documents={documents}
            activeId={activeId}
            onSelect={(id) => {
              onSelect(id);
              if (isMobile && onOpenChange) {
                onOpenChange(false);
              }
            }}
            onAdd={onAdd}
            onDelete={onDelete}
            onDuplicate={onDuplicate}
            onToggleExpand={onToggleExpand}
            onMove={onMove}
          />
        ) : (
          <OutlineView content={activeDocument?.content || ''} />
        )}
      </div>

      {/* Footer with new note button (only in tree view) */}
      {viewMode === 'tree' && (
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
      )}
    </aside>
  );

  // Mobile: render in a drawer
  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={onOpenChange}>
        <SheetContent side="left" className="w-80 p-0">
          {sidebarContent}
        </SheetContent>
      </Sheet>
    );
  }

  // Desktop: render as fixed sidebar
  return (
    <div className="w-80 border-r border-sidebar-border">
      {sidebarContent}
    </div>
  );
};
