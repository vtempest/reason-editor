import { useMemo, useRef } from 'react';
import {
  Tree,
  TreeItem,
  TreeItemIndex,
  TreeEnvironmentRef,
  UncontrolledTreeEnvironment,
  InteractionMode,
} from 'react-complex-tree';
import 'react-complex-tree/lib/style-modern.css';
import { FileText, ChevronRight, Folder } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Document } from './DocumentTree';
import { DocumentContextMenu } from './DocumentContextMenu';

interface ComplexDocumentTreeProps {
  documents: Document[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onAdd: (parentId: string | null, isFolder?: boolean) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  onToggleExpand: (id: string) => void;
  onMove: (draggedId: string, targetId: string | null, position: 'before' | 'after' | 'child') => void;
  onManageTags?: (id: string) => void;
  onRename?: (id: string, newTitle: string) => void;
}

// Transform flat document array to tree structure for react-complex-tree
const buildTreeData = (documents: Document[]) => {
  const items: Record<TreeItemIndex, TreeItem<Document>> = {
    root: {
      index: 'root',
      isFolder: true,
      children: documents.filter(doc => !doc.parentId).map(doc => doc.id),
      data: {} as Document,
    },
  };

  const processDocument = (doc: Document) => {
    const children = documents.filter(d => d.parentId === doc.id).map(d => d.id);
    items[doc.id] = {
      index: doc.id,
      canMove: true,
      canRename: true,
      isFolder: doc.isFolder || children.length > 0,
      children,
      data: doc,
    };

    // Process children recursively
    children.forEach(childId => {
      const child = documents.find(d => d.id === childId);
      if (child) processDocument(child);
    });
  };

  documents.filter(doc => !doc.parentId).forEach(processDocument);

  return items;
};

export const ComplexDocumentTree = ({
  documents,
  activeId,
  onSelect,
  onAdd,
  onDelete,
  onDuplicate,
  onToggleExpand,
  onMove,
  onManageTags,
  onRename,
}: ComplexDocumentTreeProps) => {
  const treeRef = useRef<TreeEnvironmentRef>(null);

  // Transform documents into tree data format
  const treeData = useMemo(() => buildTreeData(documents), [documents]);

  // Get expanded item IDs from documents
  const expandedItems = useMemo(() => {
    return documents.filter(doc => doc.isExpanded).map(doc => doc.id);
  }, [documents]);

  // Get focused item (active document)
  const focusedItem = activeId || undefined;

  const handleDrop = (items: TreeItem[], target: { targetType: string; parentItem?: TreeItemIndex; targetItem?: TreeItemIndex; childIndex?: number }) => {
    if (items.length === 0) return;

    const draggedId = items[0].index as string;

    if (target.targetType === 'item') {
      // Drop on item - make it a child
      onMove(draggedId, target.targetItem as string, 'child');
    } else if (target.targetType === 'between-items' && target.parentItem) {
      // Drop between items
      const parentId = target.parentItem === 'root' ? null : (target.parentItem as string);
      const siblings = parentId
        ? documents.filter(d => d.parentId === parentId)
        : documents.filter(d => !d.parentId);

      if (target.childIndex !== undefined && target.childIndex > 0) {
        const targetSibling = siblings[target.childIndex - 1];
        if (targetSibling) {
          onMove(draggedId, targetSibling.id, 'after');
        }
      } else if (target.childIndex === 0 && siblings.length > 0) {
        onMove(draggedId, siblings[0].id, 'before');
      }
    }
  };

  return (
    <div className="flex-1 overflow-auto p-2 complex-tree-wrapper">
      <style>{`
        .complex-tree-wrapper .rct-tree-root {
          height: 100%;
        }

        .complex-tree-wrapper .rct-tree-item-li {
          list-style: none;
        }

        .complex-tree-wrapper .rct-tree-item-title-container {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          padding: 0.375rem 0.5rem;
          border-radius: 0.375rem;
          cursor: pointer;
          transition: background-color 0.2s;
          position: relative;
        }

        .complex-tree-wrapper .rct-tree-item-title-container:hover {
          background-color: hsl(var(--sidebar-accent));
        }

        .complex-tree-wrapper .rct-tree-item-title-container-selected,
        .complex-tree-wrapper .rct-tree-item-title-container-selected:hover {
          background-color: hsl(var(--sidebar-accent));
          font-weight: 500;
        }

        .complex-tree-wrapper .rct-tree-item-title-container-dragging-over {
          background-color: hsl(var(--primary) / 0.1);
          outline: 2px solid hsl(var(--primary));
          outline-offset: -2px;
        }

        .complex-tree-wrapper .rct-tree-item-title-container-dragging-over-folder {
          background-color: hsl(var(--primary) / 0.15);
        }

        .complex-tree-wrapper .rct-tree-item-arrow {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 1.25rem;
          height: 1.25rem;
          padding: 0;
          transition: transform 0.2s;
          flex-shrink: 0;
        }

        .complex-tree-wrapper .rct-tree-item-arrow svg {
          width: 0.75rem;
          height: 0.75rem;
        }

        .complex-tree-wrapper .rct-tree-item-arrow-expanded {
          transform: rotate(90deg);
        }

        .complex-tree-wrapper .rct-tree-item-title {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex: 1;
          min-width: 0;
          font-size: 0.875rem;
          line-height: 1.25rem;
        }

        .complex-tree-wrapper .rct-tree-item-title span {
          flex: 1;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .complex-tree-wrapper .rct-tree-drag-between-line {
          height: 2px;
          background-color: hsl(var(--primary));
          margin: 0;
        }

        .complex-tree-wrapper .rct-tree-item-icon {
          width: 1rem;
          height: 1rem;
          flex-shrink: 0;
          color: hsl(var(--muted-foreground));
        }

        .complex-tree-wrapper .rct-tree-root ul {
          padding-left: 0.75rem;
        }

        .complex-tree-wrapper .rct-tree-item-li[aria-level="0"] > .rct-tree-item-title-container-grid-container > .rct-tree-item-button {
          padding-left: 0;
        }
      `}</style>

      <UncontrolledTreeEnvironment
        ref={treeRef}
        dataProvider={{
          async getTreeItem(itemId: TreeItemIndex) {
            return treeData[itemId];
          },
          async onChangeItemChildren(itemId: TreeItemIndex, newChildren: TreeItemIndex[]) {
            // Handle reordering
          },
          async onRenameItem(item: TreeItem, name: string) {
            if (onRename && item.index !== 'root') {
              onRename(item.index as string, name);
            }
          },
        }}
        getItemTitle={(item) => item.data.title || 'Untitled'}
        viewState={{
          ['tree-1']: {
            expandedItems,
            focusedItem,
            selectedItems: activeId ? [activeId] : [],
          },
        }}
        canDragAndDrop
        canDropOnFolder
        canDropOnNonFolder
        canReorderItems
        canRename
        onDrop={handleDrop}
        onRenameItem={(item, name) => {
          if (onRename && item.index !== 'root') {
            onRename(item.index as string, name);
          }
        }}
        onFocusItem={(item) => {
          if (item.index !== 'root') {
            onSelect(item.index as string);
          }
        }}
        onExpandItem={(item) => {
          if (item.index !== 'root') {
            onToggleExpand(item.index as string);
          }
        }}
        onCollapseItem={(item) => {
          if (item.index !== 'root') {
            onToggleExpand(item.index as string);
          }
        }}
        renderItemArrow={({ item, context }) => {
          if (!item.isFolder || item.children?.length === 0) {
            return <span className="rct-tree-item-arrow" />;
          }
          return (
            <button
              className="rct-tree-item-arrow"
              onClick={(e) => {
                e.stopPropagation();
                context.toggleExpandedState();
              }}
            >
              <ChevronRight className={cn(
                'transition-transform',
                context.isExpanded && 'rotate-90'
              )} />
            </button>
          );
        }}
        renderItem={({ item, depth, children, title, context, arrow }) => {
          if (item.index === 'root') return null;

          const doc = item.data;
          const interactiveElementProps = context.interactiveElementProps;

          return (
            <DocumentContextMenu
              onAddChild={() => onAdd(doc.id, false)}
              onAddChildFolder={() => onAdd(doc.id, true)}
              onAddSibling={() => onAdd(doc.parentId || null, false)}
              onAddSiblingFolder={() => onAdd(doc.parentId || null, true)}
              onRename={() => {
                onSelect(doc.id);
              }}
              onDuplicate={() => onDuplicate(doc.id)}
              onDelete={() => onDelete(doc.id)}
              onManageTags={() => onManageTags?.(doc.id)}
            >
              <li
                {...(context.itemContainerWithChildrenProps as any)}
                className={cn(
                  'rct-tree-item-li',
                )}
              >
                <div
                  {...(interactiveElementProps as any)}
                  className={cn(
                    'rct-tree-item-title-container',
                    context.isSelected && 'rct-tree-item-title-container-selected',
                    context.isDraggingOver && 'rct-tree-item-title-container-dragging-over',
                    context.isDraggingOverParent && item.isFolder && 'rct-tree-item-title-container-dragging-over-folder',
                  )}
                  style={{ paddingLeft: `${depth * 12 + 8}px` }}
                >
                  {arrow}
                  {doc.isFolder ? (
                    <Folder className="rct-tree-item-icon" />
                  ) : (
                    <FileText className="rct-tree-item-icon" />
                  )}
                  <span className="truncate text-sm">{title}</span>
                </div>
                {children}
              </li>
            </DocumentContextMenu>
          );
        }}
      >
        <Tree treeId="tree-1" rootItem="root" treeLabel="Documents" />
      </UncontrolledTreeEnvironment>
    </div>
  );
};
