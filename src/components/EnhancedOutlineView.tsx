import { Hash, ChevronRight, Tag, Share2, Calendar, AlertCircle, Quote, GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useMemo, useState, useEffect } from 'react';
import { DocumentExtended } from '@/types/document';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DocumentActionsMenu } from './DocumentActionsMenu';
import { ResearchQuotes } from './ResearchQuotes';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
  ContextMenuCheckboxItem,
} from '@/components/ui/context-menu';

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
  onReorder?: (fromIndex: number, toIndex: number) => void;
}

const STORAGE_KEY = 'outline-collapse-preferences';

export const EnhancedOutlineView = ({
  document,
  onNavigate,
  onDocumentUpdate,
  onReorder,
}: EnhancedOutlineViewProps) => {
  const [collapsedIds, setCollapsedIds] = useState<Set<string>>(new Set());
  const [defaultCollapseLevel, setDefaultCollapseLevel] = useState<number | null>(null);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [dragOverItem, setDragOverItem] = useState<string | null>(null);

  const outline = useMemo(() => {
    const items: OutlineItem[] = [];

    // Parse HTML content for headings
    const parser = new DOMParser();
    const doc = parser.parseFromString(document.content, 'text/html');
    const headings = doc.querySelectorAll('h1, h2, h3, h4, h5, h6');

    headings.forEach((heading, index) => {
      const level = parseInt(heading.tagName.substring(1));
      const text = heading.textContent || '';

      items.push({
        id: `heading-${index}`,
        level: level,
        text: text,
        line: index, // Note: line numbers don't apply to HTML, but keeping for navigation
      });
    });

    return items;
  }, [document.content]);

  // Load preferences from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const prefs = JSON.parse(stored);
        setDefaultCollapseLevel(prefs.defaultCollapseLevel || null);
        if (prefs.defaultCollapseLevel) {
          applyCollapseToLevel(prefs.defaultCollapseLevel);
        }
      }
    } catch (e) {
      console.error('Failed to load outline preferences:', e);
    }
  }, []);

  // Save default collapse level to localStorage
  const saveDefaultCollapseLevel = (level: number | null) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ defaultCollapseLevel: level }));
      setDefaultCollapseLevel(level);
    } catch (e) {
      console.error('Failed to save outline preferences:', e);
    }
  };

  // Get all children (recursive) for a given item
  const getChildrenIds = (itemId: string): string[] => {
    const index = outline.findIndex((item) => item.id === itemId);
    if (index === -1) return [];

    const parentLevel = outline[index].level;
    const children: string[] = [];

    for (let i = index + 1; i < outline.length; i++) {
      if (outline[i].level <= parentLevel) break;
      children.push(outline[i].id);
    }

    return children;
  };

  // Toggle collapse for a specific item and all its children
  const toggleCollapse = (itemId: string) => {
    setCollapsedIds((prev) => {
      const next = new Set(prev);
      if (next.has(itemId)) {
        // Expand: remove this item and all its descendants from collapsed
        next.delete(itemId);
        const children = getChildrenIds(itemId);
        children.forEach((childId) => next.delete(childId));
      } else {
        // Collapse: add this item to collapsed
        next.add(itemId);
      }
      return next;
    });
  };

  // Check if an item should be hidden because a parent is collapsed
  const isHiddenByParent = (itemIndex: number): boolean => {
    const currentLevel = outline[itemIndex].level;

    // Look backwards for parent items
    for (let i = itemIndex - 1; i >= 0; i--) {
      if (outline[i].level < currentLevel) {
        // Found a parent
        if (collapsedIds.has(outline[i].id)) {
          return true;
        }
        // Continue checking higher-level parents
        if (outline[i].level === 1) break;
      }
    }

    return false;
  };

  // Collapse all headings at or below a specific level
  const applyCollapseToLevel = (level: number) => {
    const newCollapsed = new Set<string>();
    outline.forEach((item) => {
      if (item.level === level) {
        newCollapsed.add(item.id);
      }
    });
    setCollapsedIds(newCollapsed);
  };

  // Handle drag and drop
  const handleDragStart = (e: React.DragEvent, itemId: string) => {
    setDraggedItem(itemId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, itemId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverItem(itemId);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    setDragOverItem(null);
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (!draggedItem || draggedItem === targetId) return;

    const fromIndex = outline.findIndex((item) => item.id === draggedItem);
    const toIndex = outline.findIndex((item) => item.id === targetId);

    if (fromIndex !== -1 && toIndex !== -1 && onReorder) {
      onReorder(fromIndex, toIndex);
    }

    setDraggedItem(null);
    setDragOverItem(null);
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
                  Use the heading buttons in the toolbar
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-1">
              {outline.map((item, index) => {
                const nextItem = outline[index + 1];
                const hasChildren = nextItem && nextItem.level > item.level;
                const isCollapsed = collapsedIds.has(item.id);

                // Skip items that are hidden by collapsed parent
                if (isHiddenByParent(index)) {
                  return null;
                }

                return (
                  <ContextMenu key={item.id}>
                    <ContextMenuTrigger>
                      <div
                        draggable
                        onDragStart={(e) => handleDragStart(e, item.id)}
                        onDragOver={(e) => handleDragOver(e, item.id)}
                        onDragEnd={handleDragEnd}
                        onDrop={(e) => handleDrop(e, item.id)}
                        className={cn(
                          'group flex items-center gap-1 px-2 py-1.5 hover:bg-sidebar-accent rounded-md cursor-pointer transition-colors',
                          draggedItem === item.id && 'opacity-50',
                          dragOverItem === item.id && 'border-t-2 border-primary'
                        )}
                        style={{ paddingLeft: `${(item.level - 1) * 12 + 8}px` }}
                        onClick={() => onNavigate?.(item.line)}
                      >
                        <GripVertical className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity cursor-grab" />

                        <button
                          className={cn(
                            'h-5 w-5 p-0 flex items-center justify-center hover:bg-transparent',
                            !hasChildren && 'invisible'
                          )}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleCollapse(item.id);
                          }}
                        >
                          <ChevronRight
                            className={cn(
                              'h-3 w-3 transition-transform text-muted-foreground',
                              !isCollapsed && 'rotate-90'
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
                    </ContextMenuTrigger>
                    <ContextMenuContent>
                      <ContextMenuSub>
                        <ContextMenuSubTrigger>Collapse to...</ContextMenuSubTrigger>
                        <ContextMenuSubContent>
                          <ContextMenuItem onClick={() => applyCollapseToLevel(1)}>
                            Heading 1
                          </ContextMenuItem>
                          <ContextMenuItem onClick={() => applyCollapseToLevel(2)}>
                            Heading 2
                          </ContextMenuItem>
                          <ContextMenuItem onClick={() => applyCollapseToLevel(3)}>
                            Heading 3
                          </ContextMenuItem>
                          <ContextMenuItem onClick={() => applyCollapseToLevel(4)}>
                            Heading 4
                          </ContextMenuItem>
                          <ContextMenuItem onClick={() => setCollapsedIds(new Set())}>
                            Expand All
                          </ContextMenuItem>
                        </ContextMenuSubContent>
                      </ContextMenuSub>
                      <ContextMenuSeparator />
                      <ContextMenuCheckboxItem
                        checked={defaultCollapseLevel !== null}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            // Save current first collapsed level as default
                            const firstCollapsed = outline.find(item => collapsedIds.has(item.id));
                            if (firstCollapsed) {
                              saveDefaultCollapseLevel(firstCollapsed.level);
                            }
                          } else {
                            saveDefaultCollapseLevel(null);
                          }
                        }}
                      >
                        Keep this collapse level as default
                      </ContextMenuCheckboxItem>
                    </ContextMenuContent>
                  </ContextMenu>
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
