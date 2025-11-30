import { Hash, ChevronRight, Tag, Share2, Calendar, AlertCircle, Quote } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useMemo, useState } from 'react';
import { DocumentExtended } from '@/types/document';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DocumentActionsMenu } from './DocumentActionsMenu';
import { ResearchQuotes } from './ResearchQuotes';

interface OutlineItem {
  id: string;
  level: number;
  text: string;
  line: number;
}

interface EnhancedOutlineViewProps {
  document: DocumentExtended;
  onNavigate?: (line: number) => void;
  onDocumentUpdate?: (updates: Partial<DocumentExtended>) => void;
}

export const EnhancedOutlineView = ({
  document,
  onNavigate,
  onDocumentUpdate,
}: EnhancedOutlineViewProps) => {
  const [expandedLevels, setExpandedLevels] = useState<Set<number>>(new Set([1, 2]));

  const outline = useMemo(() => {
    const items: OutlineItem[] = [];
    const lines = document.content.split('\n');

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
  }, [document.content]);

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

  const statusColors = {
    draft: 'bg-gray-500',
    'in-progress': 'bg-blue-500',
    review: 'bg-yellow-500',
    final: 'bg-green-500',
  };

  const priorityColors = {
    low: 'bg-gray-400',
    medium: 'bg-orange-400',
    high: 'bg-red-500',
  };

  return (
    <div className="flex h-full flex-col">
      {/* Header with metadata and actions */}
      <div className="border-b p-3 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <h3 className="font-semibold truncate">{document.title || 'Untitled'}</h3>
            {document.metadata?.status && (
              <Badge
                className={`${statusColors[document.metadata.status]} text-white text-xs`}
                variant="secondary"
              >
                {document.metadata.status}
              </Badge>
            )}
            {document.metadata?.priority && (
              <Badge
                className={`${priorityColors[document.metadata.priority]} text-white text-xs`}
                variant="secondary"
              >
                {document.metadata.priority}
              </Badge>
            )}
          </div>
          <DocumentActionsMenu
            document={document}
            onMetadataUpdate={(metadata) =>
              onDocumentUpdate?.({ metadata })
            }
            onSharingUpdate={(sharing) =>
              onDocumentUpdate?.({ sharing })
            }
            onDelete={() => {}}
            onDuplicate={() => {}}
          />
        </div>

        {/* Metadata display */}
        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
          {document.metadata?.tags && document.metadata.tags.length > 0 && (
            <div className="flex items-center gap-1">
              <Tag className="h-3 w-3" />
              <div className="flex gap-1">
                {document.metadata.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {document.metadata?.dueDate && (
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>Due: {new Date(document.metadata.dueDate).toLocaleDateString()}</span>
            </div>
          )}

          {document.sharing?.isPublic && (
            <div className="flex items-center gap-1">
              <Share2 className="h-3 w-3" />
              <span>Public</span>
            </div>
          )}

          {document.sharing?.sharedWith && document.sharing.sharedWith.length > 0 && (
            <div className="flex items-center gap-1">
              <Share2 className="h-3 w-3" />
              <span>Shared with {document.sharing.sharedWith.length}</span>
            </div>
          )}
        </div>
      </div>

      {/* Tabs for Outline and Quotes */}
      <Tabs defaultValue="outline" className="flex-1 flex flex-col">
        <TabsList className="w-full justify-start border-b rounded-none h-auto p-0">
          <TabsTrigger value="outline" className="rounded-none data-[state=active]:border-b-2">
            <Hash className="h-4 w-4 mr-2" />
            Outline ({outline.length})
          </TabsTrigger>
          <TabsTrigger value="quotes" className="rounded-none data-[state=active]:border-b-2">
            <Quote className="h-4 w-4 mr-2" />
            Quotes ({document.quotes?.length || 0})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="outline" className="flex-1 overflow-auto p-2 mt-0">
          {outline.length === 0 ? (
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
          ) : (
            <div className="space-y-1">
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
          )}
        </TabsContent>

        <TabsContent value="quotes" className="flex-1 overflow-auto p-2 mt-0">
          <ResearchQuotes
            documentId={document.id}
            quotes={document.quotes || []}
            onQuotesChange={(quotes) => onDocumentUpdate?.({ quotes })}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
