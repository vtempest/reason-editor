import { Document } from '@/components/DocumentTree';
import { ComplexDocumentTree } from '@/components/ComplexDocumentTree';
import { OutlineView } from '@/components/OutlineView';
import { FloatingSearch } from '@/components/FloatingSearch';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { FolderOpen, List, FileText, Settings, Archive, Trash2, UserPlus, Columns2, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';

interface SidebarProps {
  documents: Document[];
  activeId: string | null;
  activeDocument: Document | undefined;
  onSelect: (id: string) => void;
  onAdd: (parentId: string | null, isFolder?: boolean) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  onToggleExpand: (id: string) => void;
  onMove: (draggedId: string, targetId: string | null, position: 'before' | 'after' | 'child') => void;
  onManageTags?: (id: string) => void;
  onRename?: (id: string, newTitle: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSearchClear: () => void;
  onSearchFocus: () => void;
  // Mobile drawer props
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  isMobile?: boolean;
  // View mode
  viewMode: 'tree' | 'outline' | 'split';
  onViewModeChange: (mode: 'tree' | 'outline' | 'split') => void;
  // Settings
  onSettingsClick?: () => void;
  onInviteClick?: () => void;
  // Archive and Trash callbacks
  onArchive?: (id: string) => void;
  onRestore?: (id: string) => void;
  onPermanentDelete?: (id: string) => void;
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
  onManageTags,
  onRename,
  searchQuery,
  onSearchChange,
  onSearchClear,
  onSearchFocus,
  isOpen,
  onOpenChange,
  isMobile,
  viewMode,
  onViewModeChange,
  onSettingsClick,
  onInviteClick,
  onArchive,
  onRestore,
  onPermanentDelete,
}: SidebarProps) => {
  // Get archived and deleted documents
  const archivedDocs = documents.filter(doc => doc.isArchived && !doc.isDeleted);
  const deletedDocs = documents.filter(doc => doc.isDeleted);

  // Filter to only show active documents in the tree (not archived or deleted)
  const activeDocuments = documents.filter(doc => !doc.isArchived && !doc.isDeleted);

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
      <div className="border-b border-sidebar-border px-4 py-3 pt-16">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {viewMode === 'tree' ? (
              <FolderOpen className="h-5 w-5 text-sidebar-primary" />
            ) : viewMode === 'outline' ? (
              <List className="h-5 w-5 text-sidebar-primary" />
            ) : (
              <Columns2 className="h-5 w-5 text-sidebar-primary" />
            )}
            <h2 className="font-serif text-lg font-semibold text-sidebar-foreground">
              {viewMode === 'tree' ? 'Notes' : viewMode === 'outline' ? 'Outline' : 'Split View'}
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
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onViewModeChange('split')}
              className={cn(
                'h-8 w-8 p-0',
                viewMode === 'split' && 'bg-sidebar-accent'
              )}
              title="Split View (Files + Outline)"
            >
              <Columns2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Content area */}
      <div className="flex-1 overflow-hidden">
        {viewMode === 'tree' ? (
          <ComplexDocumentTree
            documents={activeDocuments}
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
            onManageTags={(id) => {
              onManageTags?.(id);
              if (isMobile && onOpenChange) {
                onOpenChange(false);
              }
            }}
            onRename={onRename}
          />
        ) : viewMode === 'outline' ? (
          <OutlineView
            content={activeDocument?.content || ''}
            onNavigate={(headingText) => {
              // Call the global scroll function set by TiptapEditor
              if ((window as any).__scrollToHeading) {
                (window as any).__scrollToHeading(headingText);
              }
            }}
          />
        ) : (
          <PanelGroup direction="vertical" className="h-full">
            <Panel defaultSize={50} minSize={20}>
              <div className="h-full overflow-hidden flex flex-col">
                <div className="flex-1 overflow-auto">
                  <ComplexDocumentTree
                    documents={activeDocuments}
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
                    onManageTags={(id) => {
                      onManageTags?.(id);
                      if (isMobile && onOpenChange) {
                        onOpenChange(false);
                      }
                    }}
                    onRename={onRename}
                  />
                </div>
              </div>
            </Panel>
            <PanelResizeHandle className="h-1 bg-sidebar-border hover:bg-sidebar-primary/50 transition-colors" />
            <Panel defaultSize={50} minSize={20}>
              <div className="h-full overflow-hidden flex flex-col">
                <div className="flex-1 overflow-auto">
                  <OutlineView
                    content={activeDocument?.content || ''}
                    onNavigate={(headingText) => {
                      // Call the global scroll function set by TiptapEditor
                      if ((window as any).__scrollToHeading) {
                        (window as any).__scrollToHeading(headingText);
                      }
                    }}
                  />
                </div>
              </div>
            </Panel>
          </PanelGroup>
        )}
      </div>

      {/* Footer with new note button and utility links */}
      {(viewMode === 'tree' || viewMode === 'split') && (
        <div className="border-t border-sidebar-border p-3 space-y-2">
          <Button
            onClick={() => onAdd(null)}
            className="w-full bg-sidebar-primary hover:bg-sidebar-primary/90 text-sidebar-primary-foreground"
            size="sm"
          >
            <FileText className="mr-2 h-4 w-4" />
            New Note
          </Button>

          <Separator className="my-2" />

          <TooltipProvider delayDuration={300}>
            <nav className="flex items-center justify-around gap-1">
              {/* Archive Dropdown */}
              <DropdownMenu>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-9 w-9 p-0 text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent"
                      >
                        <Archive className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p>Archive</p>
                  </TooltipContent>
                </Tooltip>
                <DropdownMenuContent align="end" className="w-56">
                  {archivedDocs.length > 0 ? (
                    <>
                      {archivedDocs.slice(0, 5).map((doc) => (
                        <DropdownMenuItem
                          key={doc.id}
                          className="flex items-center justify-between"
                          onClick={() => onRestore?.(doc.id)}
                        >
                          <span className="truncate flex-1">{doc.title || 'Untitled'}</span>
                          <RotateCcw className="h-3 w-3 ml-2 opacity-60" />
                        </DropdownMenuItem>
                      ))}
                      {archivedDocs.length > 5 && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem disabled className="text-xs text-center">
                            {archivedDocs.length - 5} more archived...
                          </DropdownMenuItem>
                        </>
                      )}
                    </>
                  ) : (
                    <DropdownMenuItem disabled className="text-center text-muted-foreground">
                      No archived notes
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Trash Dropdown */}
              <DropdownMenu>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-9 w-9 p-0 text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p>Trash</p>
                  </TooltipContent>
                </Tooltip>
                <DropdownMenuContent align="end" className="w-56">
                  {deletedDocs.length > 0 ? (
                    <>
                      {deletedDocs.slice(0, 5).map((doc) => (
                        <DropdownMenuItem
                          key={doc.id}
                          className="flex items-center justify-between"
                          onClick={() => onRestore?.(doc.id)}
                        >
                          <span className="truncate flex-1">{doc.title || 'Untitled'}</span>
                          <RotateCcw className="h-3 w-3 ml-2 opacity-60" />
                        </DropdownMenuItem>
                      ))}
                      {deletedDocs.length > 5 && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem disabled className="text-xs text-center">
                            {deletedDocs.length - 5} more in trash...
                          </DropdownMenuItem>
                        </>
                      )}
                    </>
                  ) : (
                    <DropdownMenuItem disabled className="text-center text-muted-foreground">
                      Trash is empty
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Settings Button */}
              {!isMobile && onSettingsClick && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={onSettingsClick}
                      className="h-9 w-9 p-0 text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent"
                    >
                      <Settings className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p>Settings</p>
                  </TooltipContent>
                </Tooltip>
              )}

              {/* Invite Button */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onInviteClick}
                    className="h-9 w-9 p-0 text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent"
                  >
                    <UserPlus className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p>Invite</p>
                </TooltipContent>
              </Tooltip>
            </nav>
          </TooltipProvider>
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

  // Desktop: render as sidebar (width controlled by parent panel)
  return (
    <div className="h-full border-r border-sidebar-border">
      {sidebarContent}
    </div>
  );
};
