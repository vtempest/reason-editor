import { useState, useEffect } from 'react';
import { Editor } from '@tiptap/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, ChevronUp, ChevronDown, Replace, ReplaceAll } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchReplaceBarProps {
  editor: Editor;
  isOpen: boolean;
  onClose: () => void;
}

export const SearchReplaceBar = ({ editor, isOpen, onClose }: SearchReplaceBarProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [replaceTerm, setReplaceTerm] = useState('');
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [showReplace, setShowReplace] = useState(true);

  // Get current results info from editor storage
  const results = editor.storage.searchAndReplace?.results || [];
  const currentIndex = editor.storage.searchAndReplace?.currentIndex ?? -1;
  const resultsCount = results.length;
  const currentPosition = resultsCount > 0 ? currentIndex + 1 : 0;

  useEffect(() => {
    if (isOpen) {
      // Focus search input when opened
      setTimeout(() => {
        document.getElementById('search-input')?.focus();
      }, 100);
    } else {
      // Clear search when closed
      editor.commands.clearSearch();
      setSearchTerm('');
      setReplaceTerm('');
      setShowReplace(true);
    }
  }, [isOpen, editor]);

  useEffect(() => {
    // Update search when term or case sensitivity changes
    editor.commands.setSearchTerm(searchTerm);
    editor.commands.setCaseSensitive(caseSensitive);
  }, [searchTerm, caseSensitive, editor]);

  useEffect(() => {
    // Update replace term
    editor.commands.setReplaceTerm(replaceTerm);
  }, [replaceTerm, editor]);

  const handleNext = () => {
    editor.commands.goToNextSearchResult();
  };

  const handlePrevious = () => {
    editor.commands.goToPreviousSearchResult();
  };

  const handleReplace = () => {
    editor.commands.replace();
  };

  const handleReplaceAll = () => {
    if (confirm(`Replace all ${resultsCount} occurrences?`)) {
      editor.commands.replaceAll();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (e.shiftKey) {
        handlePrevious();
      } else {
        handleNext();
      }
      e.preventDefault();
    } else if (e.key === 'Escape') {
      onClose();
      e.preventDefault();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="border-b border-border bg-card">
      <div className="flex items-center gap-2 px-4 py-2">
        {/* Search Input */}
        <div className="flex items-center gap-1 flex-1">
          <Input
            id="search-input"
            type="text"
            placeholder="Find"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
            className="h-8 text-sm"
          />

          <div className="flex items-center text-xs text-muted-foreground min-w-[60px] justify-center">
            {resultsCount > 0 ? `${currentPosition}/${resultsCount}` : 'No results'}
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={handlePrevious}
            disabled={resultsCount === 0}
            className="h-8 w-8 p-0"
            title="Previous (Shift+Enter)"
          >
            <ChevronUp className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleNext}
            disabled={resultsCount === 0}
            className="h-8 w-8 p-0"
            title="Next (Enter)"
          >
            <ChevronDown className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCaseSensitive(!caseSensitive)}
            className={cn(
              'h-8 px-2 text-xs font-mono',
              caseSensitive && 'bg-muted'
            )}
            title="Match case"
          >
            Aa
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowReplace(!showReplace)}
            className={cn(
              'h-8 w-8 p-0',
              showReplace && 'bg-muted'
            )}
            title="Toggle replace"
          >
            <Replace className="h-4 w-4" />
          </Button>
        </div>

        {/* Replace Section (shown when toggle is active) */}
        {showReplace && (
          <div className="flex items-center gap-1 flex-1">
            <Input
              type="text"
              placeholder="Replace"
              value={replaceTerm}
              onChange={(e) => setReplaceTerm(e.target.value)}
              onKeyDown={handleKeyDown}
              className="h-8 text-sm"
            />

            <Button
              variant="ghost"
              size="sm"
              onClick={handleReplace}
              disabled={resultsCount === 0}
              className="h-8 px-3 text-xs"
              title="Replace"
            >
              Replace
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleReplaceAll}
              disabled={resultsCount === 0}
              className="h-8 px-3 text-xs"
              title="Replace all"
            >
              <ReplaceAll className="h-4 w-4 mr-1" />
              All
            </Button>
          </div>
        )}

        {/* Close Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="h-8 w-8 p-0 shrink-0"
          title="Close (Esc)"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
