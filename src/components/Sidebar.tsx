import { DocumentTree, Document } from '@/components/DocumentTree';
import { SearchBar } from '@/components/SearchBar';
import { Sheet, SheetContent } from '@/components/ui/sheet';

interface SidebarProps {
  documents: Document[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onAdd: (parentId: string | null) => void;
  onDelete: (id: string) => void;
  onToggleExpand: (id: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSearchClear: () => void;
  // Mobile drawer props
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  isMobile?: boolean;
}

export const Sidebar = ({
  documents,
  activeId,
  onSelect,
  onAdd,
  onDelete,
  onToggleExpand,
  searchQuery,
  onSearchChange,
  onSearchClear,
  isOpen,
  onOpenChange,
  isMobile,
}: SidebarProps) => {
  const sidebarContent = (
    <aside className="flex h-full w-full flex-col">
      <div className="p-4 border-b border-sidebar-border">
        <SearchBar
          value={searchQuery}
          onChange={onSearchChange}
          onClear={onSearchClear}
        />
      </div>
      <div className="flex-1 overflow-hidden">
        <DocumentTree
          documents={documents}
          activeId={activeId}
          onSelect={(id) => {
            onSelect(id);
            // Close drawer on mobile when selecting a document
            if (isMobile && onOpenChange) {
              onOpenChange(false);
            }
          }}
          onAdd={onAdd}
          onDelete={onDelete}
          onToggleExpand={onToggleExpand}
        />
      </div>
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
