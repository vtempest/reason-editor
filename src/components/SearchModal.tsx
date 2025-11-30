import { useState, useMemo, useEffect, useRef } from 'react';
import { Search, FileText, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Document } from './DocumentTree';

interface SearchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  documents: Document[];
  onSelectDocument: (id: string) => void;
}

interface SearchResult {
  document: Document;
  matchType: 'title' | 'content';
  preview?: string;
}

export const SearchModal = ({
  open,
  onOpenChange,
  documents,
  onSelectDocument,
}: SearchModalProps) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const searchResults = useMemo(() => {
    if (!query.trim()) return [];

    const results: SearchResult[] = [];
    const lowerQuery = query.toLowerCase();

    documents.forEach((doc) => {
      const titleMatch = doc.title.toLowerCase().includes(lowerQuery);
      const contentMatch = doc.content.toLowerCase().includes(lowerQuery);

      if (titleMatch) {
        results.push({
          document: doc,
          matchType: 'title',
        });
      } else if (contentMatch) {
        // Find the context around the match
        const contentLower = doc.content.toLowerCase();
        const matchIndex = contentLower.indexOf(lowerQuery);
        const start = Math.max(0, matchIndex - 40);
        const end = Math.min(doc.content.length, matchIndex + query.length + 40);
        const preview = doc.content.substring(start, end);

        results.push({
          document: doc,
          matchType: 'content',
          preview: (start > 0 ? '...' : '') + preview + (end < doc.content.length ? '...' : ''),
        });
      }
    });

    return results;
  }, [query, documents]);

  const handleSelect = (id: string) => {
    onSelectDocument(id);
    onOpenChange(false);
    setQuery('');
  };

  useEffect(() => {
    if (open) {
      // Focus input when modal opens
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      // Clear query when modal closes
      setQuery('');
    }
  }, [open]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!open) return;

      if (e.key === 'Escape') {
        onOpenChange(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0 gap-0">
        <DialogHeader className="px-4 py-4 border-b border-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              ref={inputRef}
              type="text"
              placeholder="Search notes..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-9 pr-9 border-none shadow-none focus-visible:ring-0"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh]">
          {query.trim() === '' ? (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <Search className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
              <p className="text-sm text-muted-foreground">
                Type to search across all your notes
              </p>
            </div>
          ) : searchResults.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
              <p className="text-sm text-muted-foreground">
                No notes found matching "{query}"
              </p>
            </div>
          ) : (
            <div className="py-2">
              {searchResults.map((result) => (
                <button
                  key={result.document.id}
                  onClick={() => handleSelect(result.document.id)}
                  className="w-full px-4 py-3 text-left hover:bg-muted/50 transition-colors border-b border-border last:border-0"
                >
                  <div className="flex items-start gap-3">
                    <FileText className="h-4 w-4 mt-1 flex-shrink-0 text-muted-foreground" />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm mb-1 truncate">
                        {result.document.title || 'Untitled'}
                      </h3>
                      {result.matchType === 'content' && result.preview && (
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {result.preview}
                        </p>
                      )}
                      {result.matchType === 'title' && result.document.content && (
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {result.document.content.substring(0, 120)}
                          {result.document.content.length > 120 ? '...' : ''}
                        </p>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </ScrollArea>

        <div className="px-4 py-3 border-t border-border bg-muted/30">
          <p className="text-xs text-muted-foreground text-center">
            Press <kbd className="px-1.5 py-0.5 rounded bg-background border border-border">ESC</kbd> to close
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
