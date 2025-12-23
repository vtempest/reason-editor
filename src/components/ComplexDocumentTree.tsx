import { Fragment, useEffect, useMemo } from 'react';
import {
  DragTarget,
  ItemInstance,
  asyncDataLoaderFeature,
  createOnDropHandler,
  dragAndDropFeature,
  hotkeysCoreFeature,
  insertItemsAtTarget,
  keyboardDragAndDropFeature,
  removeItemsFromParents,
  renamingFeature,
  searchFeature,
  selectionFeature,
} from "@headless-tree/core";
import { AssistiveTreeDescription, useTree } from "@headless-tree/react";
import { FileText, ChevronRight, Folder } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Document } from './DocumentTree';
import { DocumentContextMenu } from './DocumentContextMenu';
import { TreeDataItem, asyncDataLoader, initializeTreeData, treeData } from './tree-data';

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

let newItemId = 0;
const insertNewItem = (dataTransfer: DataTransfer) => {
  const newId = `new-${newItemId++}`;
  treeData[newId] = {
    name: dataTransfer.getData("text/plain"),
  };
  return newId;
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
  // Initialize tree data whenever documents change
  useEffect(() => {
    initializeTreeData(documents);
  }, [documents]);

  // Get expanded items from documents
  const expandedItems = useMemo(() => {
    return documents.filter(doc => doc.isExpanded).map(doc => doc.id);
  }, [documents]);

  // Get selected items
  const selectedItems = useMemo(() => {
    return activeId ? [activeId] : [];
  }, [activeId]);

  const onDropForeignDragObject = (
    dataTransfer: DataTransfer,
    target: DragTarget<TreeDataItem>,
  ) => {
    const newId = insertNewItem(dataTransfer);
    insertItemsAtTarget([newId], target, (item, newChildrenIds) => {
      treeData[item.getId()].children = newChildrenIds;
    });
  };

  const onCompleteForeignDrop = (items: ItemInstance<TreeDataItem>[]) =>
    removeItemsFromParents(items, (item, newChildren) => {
      item.getItemData().children = newChildren;
    });

  const handleRename = (item: ItemInstance<TreeDataItem>, value: string) => {
    if (onRename && item.getId() !== 'root') {
      onRename(item.getId(), value);
      treeData[item.getId()].name = value;
    }
  };

  const handleDrop = createOnDropHandler((item, newChildren) => {
    const itemId = item.getId();

    // Update local tree data
    treeData[itemId].children = newChildren;

    // Find the dragged item and its new parent
    const draggedId = newChildren[newChildren.length - 1];
    const targetId = itemId === 'root' ? null : itemId;

    // Determine position based on the drop
    const position = 'child';

    // Call the onMove callback
    if (draggedId && draggedId !== 'root') {
      onMove(draggedId, targetId, position);
    }
  });

  const getCssClass = (item: ItemInstance<TreeDataItem>) =>
    cn("treeitem", {
      focused: item.isFocused(),
      expanded: item.isExpanded(),
      selected: item.isSelected(),
      folder: item.isFolder(),
      drop: item.isDragTarget(),
      searchmatch: item.isMatchingSearch(),
    });

  const tree = useTree<TreeDataItem>({
    initialState: {
      expandedItems,
      selectedItems,
    },
    rootItemId: "root",
    getItemName: (item) => item.getItemData()?.name || "Untitled",
    isItemFolder: (item) => !!item.getItemData()?.children || item.getId() === 'root',
    canReorder: true,
    onDrop: handleDrop,
    onRename: handleRename,
    onDropForeignDragObject,
    onCompleteForeignDrop,
    createForeignDragObject: (items) => ({
      format: "text/plain",
      data: items.map((item) => item.getId()).join(","),
    }),
    canDropForeignDragObject: (_, target) => target.item.isFolder(),
    indent: 20,
    dataLoader: asyncDataLoader,
    features: [
      asyncDataLoaderFeature,
      selectionFeature,
      hotkeysCoreFeature,
      dragAndDropFeature,
      keyboardDragAndDropFeature,
      renamingFeature,
      searchFeature,
    ],
  });

  return (
    <div className="flex-1 overflow-auto p-2 headless-tree-wrapper">
      <style>{`
        .headless-tree-wrapper .tree {
          height: 100%;
        }

        .headless-tree-wrapper .treeitem {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex: 1;
          min-width: 0;
          font-size: 0.875rem;
          line-height: 1.25rem;
        }

        .headless-tree-wrapper button {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          padding: 0.375rem 0.5rem;
          border-radius: 0.375rem;
          cursor: pointer;
          transition: background-color 0.2s;
          position: relative;
          border: none;
          background: transparent;
          width: 100%;
          text-align: left;
        }

        .headless-tree-wrapper button:hover {
          background-color: hsl(var(--sidebar-accent));
        }

        .headless-tree-wrapper .treeitem.selected {
          background-color: hsl(var(--sidebar-accent));
          font-weight: 500;
        }

        .headless-tree-wrapper .treeitem.drop {
          background-color: hsl(var(--primary) / 0.1);
          outline: 2px solid hsl(var(--primary));
          outline-offset: -2px;
        }

        .headless-tree-wrapper .dragline {
          height: 2px;
          background-color: hsl(var(--primary));
          position: absolute;
          pointer-events: none;
        }

        .headless-tree-wrapper .searchbox {
          padding: 0.5rem;
          margin-bottom: 0.5rem;
          border-bottom: 1px solid hsl(var(--border));
        }

        .headless-tree-wrapper .searchbox input {
          width: 100%;
          padding: 0.375rem 0.5rem;
          border: 1px solid hsl(var(--border));
          border-radius: 0.375rem;
          background: hsl(var(--background));
          color: hsl(var(--foreground));
        }

        .headless-tree-wrapper .renaming-item {
          padding: 0.375rem 0.5rem;
        }

        .headless-tree-wrapper .renaming-item input {
          width: 100%;
          padding: 0.25rem 0.5rem;
          border: 1px solid hsl(var(--primary));
          border-radius: 0.25rem;
          background: hsl(var(--background));
          color: hsl(var(--foreground));
        }

        .headless-tree-wrapper .treeitem span {
          flex: 1;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .headless-tree-wrapper svg {
          width: 1rem;
          height: 1rem;
          flex-shrink: 0;
          color: hsl(var(--muted-foreground));
        }

        .headless-tree-wrapper .chevron {
          transition: transform 0.2s;
        }

        .headless-tree-wrapper .chevron.expanded {
          transform: rotate(90deg);
        }
      `}</style>

      {tree.isSearchOpen() && (
        <div className="searchbox">
          <input {...tree.getSearchInputElementProps()} placeholder="Search..." />
          <span className="text-xs text-muted-foreground ml-2">
            ({tree.getSearchMatchingItems().length} matches)
          </span>
        </div>
      )}

      <div {...tree.getContainerProps()} className="tree">
        <AssistiveTreeDescription tree={tree} />
        {tree.getItems().map((item) => {
          if (item.getId() === 'root') return null;

          const doc = documents.find(d => d.id === item.getId());
          if (!doc) return null;

          return (
            <Fragment key={item.getId()}>
              {item.isRenaming() ? (
                <div
                  className="renaming-item"
                  style={{ marginLeft: `${item.getItemMeta().level * 20}px` }}
                >
                  <input {...item.getRenameInputProps()} />
                </div>
              ) : (
                <DocumentContextMenu
                  onAddChild={() => onAdd(doc.id, false)}
                  onAddChildFolder={() => onAdd(doc.id, true)}
                  onAddSibling={() => onAdd(doc.parentId || null, false)}
                  onAddSiblingFolder={() => onAdd(doc.parentId || null, true)}
                  onRename={() => item.startRenaming()}
                  onDuplicate={() => onDuplicate(doc.id)}
                  onDelete={() => onDelete(doc.id)}
                  onManageTags={() => onManageTags?.(doc.id)}
                >
                  <button
                    {...item.getProps()}
                    style={{ paddingLeft: `${item.getItemMeta().level * 20}px` }}
                    onClick={() => onSelect(item.getId())}
                  >
                    {item.isFolder() && item.getItemData()?.children && item.getItemData()!.children!.length > 0 && (
                      <ChevronRight
                        className={cn(
                          'chevron',
                          item.isExpanded() && 'expanded'
                        )}
                      />
                    )}
                    {doc.isFolder ? (
                      <Folder />
                    ) : (
                      <FileText />
                    )}
                    <div className={getCssClass(item)}>
                      <span>{item.getItemName()}</span>
                    </div>
                  </button>
                </DocumentContextMenu>
              )}
            </Fragment>
          );
        })}
        <div style={tree.getDragLineStyle()} className="dragline" />
      </div>
    </div>
  );
};
