import { useState, useMemo, useEffect, useRef } from 'react';
import { Search, FileText, X, Settings, Users, Moon, Sun, Command, Filter } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { Document } from './DocumentTree';

interface SearchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  documents: Document[];
  onSelectDocument: (id: string) => void;
  onOpenSettings?: () => void;
  onOpenTeams?: () => void;
  onToggleTheme?: () => void;
  currentTheme?: string;
}

interface SearchResult {
  document: Document;
  matchType: 'title' | 'content' | 'heading' | 'bold';
  preview?: string;
  previewHtml?: string;
}

type SearchField = 'all' | 'titles' | 'headings' | 'bold' | 'content';

interface CommandAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  action: () => void;
  keywords?: string[];
}

export const SearchModal = ({
  open,
  onOpenChange,
  documents,
  onSelectDocument,
  onOpenSettings,
  onOpenTeams,
  onToggleTheme,
  currentTheme = 'light',
}: SearchModalProps) => {
  const [query, setQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [searchFields, setSearchFields] = useState<Set<SearchField>>(new Set(['all']));
  const inputRef = useRef<HTMLInputElement>(null);

  // Helper function to extract text from HTML
  const extractTextFromHtml = (html: string): string => {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || '';
  };

  // Helper function to extract specific content from HTML
  const extractFromHtml = (html: string, selector: string): string[] => {
    const div = document.createElement('div');
    div.innerHTML = html;
    const elements = div.querySelectorAll(selector);
    return Array.from(elements).map(el => el.textContent || '');
  };

  // Helper function to get HTML snippet with context
  const getHtmlSnippet = (html: string, query: string, maxLength: number = 120): { text: string; html: string } => {
    const div = document.createElement('div');
    div.innerHTML = html;
    const textContent = div.textContent || '';
    const lowerText = textContent.toLowerCase();
    const lowerQuery = query.toLowerCase();
    const matchIndex = lowerText.indexOf(lowerQuery);

    if (matchIndex === -1) {
      const text = textContent.substring(0, maxLength);
      return {
        text: text + (textContent.length > maxLength ? '...' : ''),
        html: html.substring(0, maxLength) + (html.length > maxLength ? '...' : '')
      };
    }

    const start = Math.max(0, matchIndex - 40);
    const end = Math.min(textContent.length, matchIndex + query.length + 40);
    const snippetText = textContent.substring(start, end);

    // Find corresponding HTML position
    let currentPos = 0;
    let htmlStart = 0;
    let htmlEnd = html.length;

    const walker = document.createTreeWalker(div, NodeFilter.SHOW_TEXT);
    let node;

    while ((node = walker.nextNode())) {
      const nodeText = node.textContent || '';
      const nodeLength = nodeText.length;

      if (currentPos <= start && currentPos + nodeLength > start) {
        // Found start position
        const offset = start - currentPos;
        htmlStart = html.indexOf(nodeText) + offset;
      }

      if (currentPos <= end && currentPos + nodeLength >= end) {
        // Found end position
        const offset = end - currentPos;
        htmlEnd = html.indexOf(nodeText) + offset;
        break;
      }

      currentPos += nodeLength;
    }

    const htmlSnippet = html.substring(Math.max(0, htmlStart - 20), Math.min(html.length, htmlEnd + 20));

    return {
      text: (start > 0 ? '...' : '') + snippetText + (end < textContent.length ? '...' : ''),
      html: (start > 0 ? '...' : '') + htmlSnippet + (end < html.length ? '...' : '')
    };
  };

  const toggleField = (field: SearchField) => {
    setSearchFields(prev => {
      const newFields = new Set(prev);

      if (field === 'all') {
        // If selecting 'all', clear all other selections
        return new Set(['all']);
      }

      // Remove 'all' if selecting a specific field
      newFields.delete('all');

      if (newFields.has(field)) {
        newFields.delete(field);
        // If no fields selected, default to 'all'
        if (newFields.size === 0) {
          newFields.add('all');
        }
      } else {
        newFields.add(field);
      }

      return newFields;
    });
  };

  // Define command actions
  const commandActions = useMemo<CommandAction[]>(() => {
    const actions: CommandAction[] = [];

    if (onOpenSettings) {
      actions.push({
        id: 'settings',
        label: 'Open Settings',
        icon: <Settings className="h-4 w-4" />,
        action: () => {
          onOpenSettings();
          onOpenChange(false);
        },
        keywords: ['settings', 'preferences', 'config'],
      });
    }

    if (onOpenTeams) {
      actions.push({
        id: 'teams',
        label: 'Manage Teams',
        icon: <Users className="h-4 w-4" />,
        action: () => {
          onOpenTeams();
          onOpenChange(false);
        },
        keywords: ['teams', 'organization', 'members', 'collaborate'],
      });
    }

    if (onToggleTheme) {
      actions.push({
        id: 'theme',
        label: currentTheme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode',
        icon: currentTheme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />,
        action: () => {
          onToggleTheme();
        },
        keywords: ['theme', 'dark', 'light', 'mode', 'appearance'],
      });
    }

    return actions;
  }, [onOpenSettings, onOpenTeams, onToggleTheme, currentTheme, onOpenChange]);

  const searchResults = useMemo(() => {
    if (!query.trim()) return [];

    const results: SearchResult[] = [];
    const lowerQuery = query.toLowerCase();
    const searchAll = searchFields.has('all');

    documents.forEach((doc) => {
      const content = doc.content || '';
      const title = doc.title || '';

      // Search in titles
      if ((searchAll || searchFields.has('titles')) && title.toLowerCase().includes(lowerQuery)) {
        const snippet = getHtmlSnippet(content, query);
        results.push({
          document: doc,
          matchType: 'title',
          preview: snippet.text,
          previewHtml: snippet.html,
        });
        return; // Don't check other fields if title matches
      }

      // Search in headings
      if (searchAll || searchFields.has('headings')) {
        const headings = extractFromHtml(content, 'h1, h2, h3, h4, h5, h6');
        const headingMatch = headings.some(h => h.toLowerCase().includes(lowerQuery));
        if (headingMatch) {
          const snippet = getHtmlSnippet(content, query);
          results.push({
            document: doc,
            matchType: 'heading',
            preview: snippet.text,
            previewHtml: snippet.html,
          });
          return;
        }
      }

      // Search in bold text
      if (searchAll || searchFields.has('bold')) {
        const boldTexts = extractFromHtml(content, 'strong, b');
        const boldMatch = boldTexts.some(b => b.toLowerCase().includes(lowerQuery));
        if (boldMatch) {
          const snippet = getHtmlSnippet(content, query);
          results.push({
            document: doc,
            matchType: 'bold',
            preview: snippet.text,
            previewHtml: snippet.html,
          });
          return;
        }
      }

      // Search in general content
      if (searchAll || searchFields.has('content')) {
        const textContent = extractTextFromHtml(content);
        if (textContent.toLowerCase().includes(lowerQuery)) {
          const snippet = getHtmlSnippet(content, query);
          results.push({
            document: doc,
            matchType: 'content',
            preview: snippet.text,
            previewHtml: snippet.html,
          });
        }
      }
    });

    return results;
  }, [query, documents, searchFields]);

  // Filter command actions based on query
  const filteredCommands = useMemo(() => {
    if (!query.trim()) return commandActions;

    const lowerQuery = query.toLowerCase();
    return commandActions.filter((cmd) => {
      const matchesLabel = cmd.label.toLowerCase().includes(lowerQuery);
      const matchesKeywords = cmd.keywords?.some((kw) => kw.toLowerCase().includes(lowerQuery));
      return matchesLabel || matchesKeywords;
    });
  }, [query, commandActions]);

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

  const hasCommands = filteredCommands.length > 0;
  const hasResults = searchResults.length > 0;
  const showEmpty = query.trim() !== '' && !hasCommands && !hasResults;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl w-[95vw] sm:w-full p-0 gap-0 max-h-[90vh] sm:max-h-[85vh]">
        <DialogHeader className="px-4 py-4 border-b border-border">
          <div className="space-y-3">
            <div className="relative">
              <Command className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                ref={inputRef}
                type="text"
                placeholder="Search notes or type a command..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-9 pr-20 border-none shadow-none focus-visible:ring-0 text-sm sm:text-base"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                {query && (
                  <button
                    onClick={() => setQuery('')}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={cn(
                    "text-muted-foreground hover:text-foreground",
                    showFilters && "text-foreground"
                  )}
                  title="Filter search fields"
                >
                  <Filter className="h-4 w-4" />
                </button>
              </div>
            </div>

            {showFilters && (
              <div className="flex flex-wrap gap-3 pt-2 border-t border-border">
                <label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={searchFields.has('all')}
                    onCheckedChange={() => toggleField('all')}
                  />
                  <span className="text-sm">All</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={searchFields.has('titles')}
                    onCheckedChange={() => toggleField('titles')}
                  />
                  <span className="text-sm">Titles</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={searchFields.has('headings')}
                    onCheckedChange={() => toggleField('headings')}
                  />
                  <span className="text-sm">Headings</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={searchFields.has('bold')}
                    onCheckedChange={() => toggleField('bold')}
                  />
                  <span className="text-sm">Bold Text</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={searchFields.has('content')}
                    onCheckedChange={() => toggleField('content')}
                  />
                  <span className="text-sm">Content</span>
                </label>
              </div>
            )}
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[50vh] sm:max-h-[60vh]">
          {query.trim() === '' ? (
            <div className="py-2">
              {commandActions.length > 0 && (
                <>
                  <div className="px-4 py-2">
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Quick Actions
                    </h3>
                  </div>
                  {commandActions.map((cmd) => (
                    <button
                      key={cmd.id}
                      onClick={cmd.action}
                      className="w-full px-4 py-3 text-left hover:bg-muted/50 transition-colors border-b border-border last:border-0"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 text-muted-foreground">
                          {cmd.icon}
                        </div>
                        <span className="text-sm font-medium">{cmd.label}</span>
                      </div>
                    </button>
                  ))}
                </>
              )}
              <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                <Search className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
                <p className="text-sm text-muted-foreground">
                  Type to search across all your notes
                </p>
              </div>
            </div>
          ) : showEmpty ? (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
              <p className="text-sm text-muted-foreground">
                No results found for "{query}"
              </p>
            </div>
          ) : (
            <div className="py-2">
              {hasCommands && (
                <>
                  <div className="px-4 py-2">
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Commands
                    </h3>
                  </div>
                  {filteredCommands.map((cmd) => (
                    <button
                      key={cmd.id}
                      onClick={cmd.action}
                      className="w-full px-4 py-3 text-left hover:bg-muted/50 transition-colors border-b border-border"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 text-muted-foreground">
                          {cmd.icon}
                        </div>
                        <span className="text-sm font-medium">{cmd.label}</span>
                      </div>
                    </button>
                  ))}
                </>
              )}

              {hasResults && (
                <>
                  {hasCommands && (
                    <div className="px-4 py-2 mt-2">
                      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Notes
                      </h3>
                    </div>
                  )}
                  {searchResults.map((result) => (
                    <button
                      key={result.document.id}
                      onClick={() => handleSelect(result.document.id)}
                      className="w-full px-4 py-3 text-left hover:bg-muted/50 transition-colors border-b border-border last:border-0"
                    >
                      <div className="flex items-start gap-3">
                        <FileText className="h-4 w-4 mt-1 flex-shrink-0 text-muted-foreground" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium text-sm truncate">
                              {result.document.title || 'Untitled'}
                            </h3>
                            {result.matchType !== 'title' && result.matchType !== 'content' && (
                              <span className="text-xs px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                                {result.matchType}
                              </span>
                            )}
                          </div>
                          {result.previewHtml ? (
                            <div
                              className="text-xs text-muted-foreground line-clamp-2 preview-content"
                              dangerouslySetInnerHTML={{ __html: result.previewHtml }}
                              style={{
                                wordBreak: 'break-word',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                              }}
                            />
                          ) : result.preview ? (
                            <p className="text-xs text-muted-foreground line-clamp-2">
                              {result.preview}
                            </p>
                          ) : null}
                        </div>
                      </div>
                    </button>
                  ))}
                </>
              )}
            </div>
          )}
        </ScrollArea>

        <div className="px-4 py-3 border-t border-border bg-muted/30">
          <p className="text-xs text-muted-foreground text-center hidden sm:block">
            Press <kbd className="px-1.5 py-0.5 rounded bg-background border border-border">⌘K</kbd> or <kbd className="px-1.5 py-0.5 rounded bg-background border border-border">Ctrl+K</kbd> to open • <kbd className="px-1.5 py-0.5 rounded bg-background border border-border">ESC</kbd> to close
          </p>
          <p className="text-xs text-muted-foreground text-center sm:hidden">
            Tap <kbd className="px-1.5 py-0.5 rounded bg-background border border-border">ESC</kbd> to close
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
