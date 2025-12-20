import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { X, Plus } from 'lucide-react';
import { Document } from '@/components/DocumentTree';
import { cn } from '@/lib/utils';
import { useState, useRef, useEffect } from 'react';

interface DocumentTabsProps {
  openTabs: string[];
  activeTab: string | null;
  documents: Document[];
  onTabChange: (tabId: string) => void;
  onTabClose: (tabId: string) => void;
  onTabAdd: () => void;
  onRename?: (tabId: string, newTitle: string) => void;
}

export const DocumentTabs = ({
  openTabs,
  activeTab,
  documents,
  onTabChange,
  onTabClose,
  onTabAdd,
  onRename,
}: DocumentTabsProps) => {
  const [renamingTabId, setRenamingTabId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const getDocumentTitle = (docId: string) => {
    const doc = documents.find((d) => d.id === docId);
    return doc?.title || 'Untitled';
  };

  // Focus input when renaming starts
  useEffect(() => {
    if (renamingTabId && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [renamingTabId]);

  const handleDoubleClick = (tabId: string) => {
    if (onRename) {
      setRenamingTabId(tabId);
      setRenameValue(getDocumentTitle(tabId));
    }
  };

  const handleRenameSubmit = () => {
    if (renamingTabId && renameValue.trim() && onRename) {
      onRename(renamingTabId, renameValue.trim());
    }
    setRenamingTabId(null);
    setRenameValue('');
  };

  const handleRenameKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleRenameSubmit();
    } else if (e.key === 'Escape') {
      setRenamingTabId(null);
      setRenameValue('');
    }
  };

  if (openTabs.length === 0) {
    return null;
  }

  return (
    <div className="border-b border-border bg-card">
      <Tabs value={activeTab || undefined} onValueChange={onTabChange}>
        <div className="flex items-center overflow-x-auto">
          <TabsList className="h-10 bg-transparent p-0 rounded-none border-0 flex-nowrap">
            {openTabs.map((tabId) => (
              <div key={tabId} className="relative group">
                <TabsTrigger
                  value={tabId}
                  onDoubleClick={() => handleDoubleClick(tabId)}
                  className={cn(
                    'relative h-10 rounded-none border-r border-border px-4 py-2',
                    'data-[state=active]:bg-background data-[state=active]:shadow-none',
                    'data-[state=inactive]:bg-muted/50',
                    'hover:bg-muted',
                    'pr-8'
                  )}
                >
                  {renamingTabId === tabId ? (
                    <input
                      ref={inputRef}
                      type="text"
                      value={renameValue}
                      onChange={(e) => setRenameValue(e.target.value)}
                      onKeyDown={handleRenameKeyDown}
                      onBlur={handleRenameSubmit}
                      className="max-w-[150px] text-sm bg-transparent border-none outline-none focus:ring-1 focus:ring-primary rounded px-1"
                      onClick={(e) => e.stopPropagation()}
                    />
                  ) : (
                    <span className="max-w-[150px] truncate text-sm">
                      {getDocumentTitle(tabId)}
                    </span>
                  )}
                </TabsTrigger>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    'absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 p-0',
                    'opacity-0 group-hover:opacity-100 transition-opacity',
                    'hover:bg-destructive/10 hover:text-destructive'
                  )}
                  onClick={(e) => {
                    e.stopPropagation();
                    onTabClose(tabId);
                  }}
                  title="Close tab"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </TabsList>

          <Button
            variant="ghost"
            size="sm"
            className="h-10 w-10 p-0 rounded-none border-r border-border shrink-0"
            onClick={onTabAdd}
            title="New note"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </Tabs>
    </div>
  );
};
