import { Hash, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useMemo, useState } from 'react';

interface OutlineItem {
  id: string;
  level: number;
  text: string;
  line: number;
}

interface OutlineViewProps {
  content: string;
  onNavigate?: (line: number) => void;
}

export const OutlineView = ({ content, onNavigate }: OutlineViewProps) => {
  const [expandedLevels, setExpandedLevels] = useState<Set<number>>(new Set([1, 2]));

  const outline = useMemo(() => {
    const items: OutlineItem[] = [];
    const lines = content.split('\n');

    lines.forEach((line, index) => {
      const match = line.match(/^(#{1,6})\s+(.+)$/);
      if (match) {
        items.push({
          id: `heading-${index}`,
          level: match[1].length,
          text: match[2],
          line: index,
        });
      }
    });

    return items;
  }, [content]);

  const toggleLevel = (level: number) => {
    setExpandedLevels((prev) => {
      const next = new Set(prev);
      if (next.has(level)) {
        next.delete(level);
      } else {
        next.add(level);
      }
      return next;
    });
  };

  if (outline.length === 0) {
    return (
      <div className="flex h-full items-center justify-center p-6 text-center">
        <div>
          <Hash className="mx-auto h-12 w-12 text-muted-foreground opacity-50 mb-3" />
          <p className="text-sm text-muted-foreground">
            No headings found in this document
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Use # for headings
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-auto p-2">
        {outline.map((item, index) => {
          const nextItem = outline[index + 1];
          const hasChildren = nextItem && nextItem.level > item.level;
          const isExpanded = expandedLevels.has(item.level);

          // Skip items that are under a collapsed parent
          if (index > 0) {
            const prevItem = outline[index - 1];
            if (prevItem.level < item.level && !expandedLevels.has(prevItem.level)) {
              return null;
            }
          }

          return (
            <div
              key={item.id}
              className={cn(
                'group flex items-center gap-1 px-2 py-1.5 hover:bg-sidebar-accent rounded-md cursor-pointer transition-colors',
              )}
              style={{ paddingLeft: `${(item.level - 1) * 12 + 8}px` }}
              onClick={() => onNavigate?.(item.line)}
            >
              <button
                className={cn(
                  'h-5 w-5 p-0 flex items-center justify-center hover:bg-transparent',
                  !hasChildren && 'invisible'
                )}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleLevel(item.level);
                }}
              >
                <ChevronRight
                  className={cn(
                    'h-3 w-3 transition-transform text-muted-foreground',
                    isExpanded && 'rotate-90'
                  )}
                />
              </button>

              <Hash
                className={cn(
                  'h-3 w-3 flex-shrink-0 text-muted-foreground',
                  item.level === 1 && 'h-4 w-4'
                )}
              />
              <span
                className={cn(
                  'flex-1 truncate text-sm',
                  item.level === 1 && 'font-semibold',
                  item.level === 2 && 'font-medium'
                )}
              >
                {item.text}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
