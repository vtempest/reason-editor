import React, { useRef, useMemo, useCallback } from "react";
import { Tree, TreeApi } from "../index";
import { DocumentNode } from "./DocumentNode";
import { Document } from "@/components/DocumentTree";

interface DocumentTreeWrapperProps {
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
  width?: number;
  height?: number;
}

// Build a hierarchical tree structure from flat document array
const buildTreeData = (documents: Document[]): Document => {
  const rootChildren = documents.filter(doc => !doc.parentId);

  const buildNode = (doc: Document): Document => {
    const children = documents.filter(d => d.parentId === doc.id);
    return {
      ...doc,
      children: children.length > 0 ? children.map(buildNode) : undefined
    };
  };

  // Create a virtual root node
  const root: Document = {
    id: 'ROOT',
    title: 'ROOT',
    content: '',
    parentId: null,
    isExpanded: true,
    children: rootChildren.map(buildNode)
  };

  return root;
};

export const DocumentTreeWrapper = ({
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
  width = 300,
  height = 500
}: DocumentTreeWrapperProps) => {
  const treeRef = useRef<TreeApi<Document>>(null);

  // Build hierarchical tree data from flat documents array
  const treeData = useMemo(() => buildTreeData(documents), [documents]);

  // Handler for moving nodes
  const handleMove = useCallback((
    dragIds: string[],
    parentId: string | null,
    index: number
  ) => {
    if (dragIds.length === 0) return;

    const draggedId = dragIds[0];

    // For now, we'll just use 'child' position since the new tree doesn't provide
    // the same granular position control. You could enhance this based on index.
    const actualParentId = parentId === 'ROOT' ? null : parentId;
    onMove(draggedId, actualParentId, 'child');
  }, [onMove]);

  // Handler for toggling expand/collapse
  const handleToggle = useCallback((id: string, isOpen: boolean) => {
    if (id !== 'ROOT') {
      onToggleExpand(id);
    }
  }, [onToggleExpand]);

  // Handler for renaming
  const handleEdit = useCallback((id: string, name: string) => {
    if (id !== 'ROOT' && onRename) {
      onRename(id, name);
    }
  }, [onRename]);

  // Handler for clicking a node
  const handleClick = useCallback((e: React.MouseEvent) => {
    // Click handling is done in the DocumentNode component
  }, []);

  // Pass additional handlers through the tree ref
  // We need to attach these to make them available in DocumentNode
  React.useEffect(() => {
    if (treeRef.current) {
      (treeRef.current as any).onAddChild = (parentId: string, isFolder: boolean) => {
        onAdd(parentId, isFolder);
      };
      (treeRef.current as any).onAddSibling = (siblingId: string, isFolder: boolean) => {
        const doc = documents.find(d => d.id === siblingId);
        onAdd(doc?.parentId || null, isFolder);
      };
      (treeRef.current as any).onDuplicate = onDuplicate;
      (treeRef.current as any).onDelete = onDelete;
      (treeRef.current as any).onManageTags = onManageTags;
      (treeRef.current as any).onDocumentSelect = onSelect;
    }
  }, [documents, onAdd, onDuplicate, onDelete, onManageTags, onSelect]);

  return (
    <div className="w-full h-full">
      <Tree
        ref={treeRef}
        data={treeData}
        getChildren="children"
        isOpen={(doc: Document) => doc.isExpanded || false}
        hideRoot={true}
        indent={16}
        onMove={handleMove}
        onToggle={handleToggle}
        onEdit={handleEdit}
        onClick={handleClick}
        rowHeight={32}
        width={width}
        height={height}
        openByDefault={false}
        disableDrag={false}
      >
        {DocumentNode}
      </Tree>
    </div>
  );
};
