import React, { useState, useEffect } from 'react';
import { FolderOpen, Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TreeNode } from './TreeNode';
import { TreeItemData, DocumentTreeProps } from './types';

export const DocumentTree: React.FC<DocumentTreeProps> = ({
  data,
  activeId,
  onSelect,
  onToggle,
  onRename,
  onDelete,
  onAddChild,
  onAddSibling,
  onDuplicate,
  onManageTags,
  onArchive,
  onMove,
}) => {
  const [treeData, setTreeData] = useState<TreeItemData>(data);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState<TreeItemData>(data);

  // Sync with external data changes
  useEffect(() => {
    setTreeData(data);
    setFilteredData(data);
  }, [data]);

  // Filter tree based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredData(treeData);
      return;
    }

    const filterTree = (node: TreeItemData): TreeItemData | null => {
      const matchesSearch = node.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      const filteredChildren = node.children
        ?.map(filterTree)
        .filter((child): child is TreeItemData => child !== null);

      if (matchesSearch || (filteredChildren && filteredChildren.length > 0)) {
        return {
          ...node,
          children: filteredChildren,
          isOpen: searchQuery.trim() ? true : node.isOpen, // Auto-expand during search
        };
      }

      return null;
    };

    const filtered = filterTree(treeData);
    setFilteredData(filtered || { ...treeData, children: [] });
  }, [searchQuery, treeData]);

  // Helper function to find a node by id
  const findNodeById = (
    node: TreeItemData,
    id: string
  ): TreeItemData | null => {
    if (node.id === id) return node;
    if (node.children) {
      for (const child of node.children) {
        const found = findNodeById(child, id);
        if (found) return found;
      }
    }
    return null;
  };

  // Helper function to find parent of a node
  const findParentById = (
    node: TreeItemData,
    id: string,
    parent: TreeItemData | null = null
  ): TreeItemData | null => {
    if (node.id === id) return parent;
    if (node.children) {
      for (const child of node.children) {
        const found = findParentById(child, id, node);
        if (found !== null) return found;
      }
    }
    return null;
  };

  // Helper to update tree data immutably
  const updateTree = (updater: (data: TreeItemData) => TreeItemData) => {
    setTreeData((prev) => updater(JSON.parse(JSON.stringify(prev))));
  };

  const handleToggle = (id: string, isOpen: boolean) => {
    updateTree((data) => {
      const node = findNodeById(data, id);
      if (node) {
        node.isOpen = isOpen;
      }
      return data;
    });
    onToggle?.(id, isOpen);
  };

  const handleRename = (id: string, newName: string) => {
    updateTree((data) => {
      const node = findNodeById(data, id);
      if (node) {
        node.name = newName;
      }
      return data;
    });
    onRename?.(id, newName);
  };

  const handleDelete = (id: string) => {
    updateTree((data) => {
      const parent = findParentById(data, id);
      if (parent?.children) {
        parent.children = parent.children.filter((child) => child.id !== id);
      } else if (data.children) {
        // Delete from root level
        data.children = data.children.filter((child) => child.id !== id);
      }
      return data;
    });
    onDelete?.(id);
  };

  const handleAddChild = (parentId: string, isFolder: boolean) => {
    updateTree((data) => {
      const parent = findNodeById(data, parentId);
      if (parent) {
        if (!parent.children) {
          parent.children = [];
        }
        const newItem: TreeItemData = {
          id: `${Date.now()}-${Math.random()}`,
          name: isFolder ? 'New Folder' : 'New Document',
          isFolder,
          isOpen: false,
          children: isFolder ? [] : undefined,
        };
        parent.children.push(newItem);
        parent.isOpen = true;
      }
      return data;
    });
    onAddChild?.(parentId, isFolder);
  };

  const handleAddSibling = (siblingId: string, isFolder: boolean) => {
    updateTree((data) => {
      const parent = findParentById(data, siblingId);
      const targetArray = parent?.children || data.children;

      if (targetArray) {
        const siblingIndex = targetArray.findIndex(
          (child) => child.id === siblingId
        );
        const newItem: TreeItemData = {
          id: `${Date.now()}-${Math.random()}`,
          name: isFolder ? 'New Folder' : 'New Document',
          isFolder,
          isOpen: false,
          children: isFolder ? [] : undefined,
        };
        targetArray.splice(siblingIndex + 1, 0, newItem);
      }
      return data;
    });
    onAddSibling?.(siblingId, isFolder);
  };

  const handleDuplicate = (id: string) => {
    updateTree((data) => {
      const node = findNodeById(data, id);
      const parent = findParentById(data, id);
      const targetArray = parent?.children || data.children;

      if (node && targetArray) {
        const nodeIndex = targetArray.findIndex((child) => child.id === id);
        const duplicate: TreeItemData = {
          ...JSON.parse(JSON.stringify(node)),
          id: `${Date.now()}-${Math.random()}`,
          name: `${node.name} (Copy)`,
        };
        targetArray.splice(nodeIndex + 1, 0, duplicate);
      }
      return data;
    });
    onDuplicate?.(id);
  };

  const handleMove = (
    draggedId: string,
    targetId: string,
    position: 'before' | 'after' | 'inside'
  ) => {
    updateTree((data) => {
      const draggedNode = findNodeById(data, draggedId);
      const targetNode = findNodeById(data, targetId);
      const draggedParent = findParentById(data, draggedId);

      if (!draggedNode || !targetNode) return data;

      // Prevent dropping a folder into itself or its descendants
      if (draggedNode.isFolder && findNodeById(draggedNode, targetId)) {
        return data;
      }

      // Remove from original position
      const sourceArray = draggedParent?.children || data.children;
      if (sourceArray) {
        const draggedIndex = sourceArray.findIndex(
          (child) => child.id === draggedId
        );
        sourceArray.splice(draggedIndex, 1);
      }

      // Add to new position
      if (position === 'inside' && targetNode.isFolder) {
        if (!targetNode.children) {
          targetNode.children = [];
        }
        targetNode.children.push(draggedNode);
        targetNode.isOpen = true;
      } else {
        const targetParent = findParentById(data, targetId);
        const targetArray = targetParent?.children || data.children;

        if (targetArray) {
          const targetIndex = targetArray.findIndex(
            (child) => child.id === targetId
          );
          const insertIndex =
            position === 'before' ? targetIndex : targetIndex + 1;
          targetArray.splice(insertIndex, 0, draggedNode);
        }
      }

      return data;
    });
    onMove?.(draggedId, targetId, position);
  };

  const handleAddRoot = () => {
    updateTree((data) => {
      if (!data.children) {
        data.children = [];
      }
      const newItem: TreeItemData = {
        id: `${Date.now()}-${Math.random()}`,
        name: 'New Document',
        isFolder: false,
      };
      data.children.push(newItem);
      return data;
    });
  };

  const renderTree = (item: TreeItemData, level: number = 0) => {
    return (
      <TreeNode
        key={item.id}
        item={item}
        level={level}
        isActive={item.id === activeId}
        onSelect={onSelect}
        onToggle={handleToggle}
        onRename={handleRename}
        onDelete={handleDelete}
        onAddChild={handleAddChild}
        onAddSibling={handleAddSibling}
        onDuplicate={handleDuplicate}
        onManageTags={onManageTags}
        onArchive={onArchive}
        onMove={handleMove}
      />
    );
  };

  return (
    <div className="flex h-full flex-col bg-sidebar-background">
      <div className="border-b border-sidebar-border px-4 py-4">
        <div className="flex items-center gap-2 mb-3">
          <FolderOpen className="h-5 w-5 text-sidebar-primary" />
          <h2 className="font-serif text-lg font-semibold text-sidebar-foreground">
            Documents
          </h2>
        </div>
        <div className="relative">
          <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 h-9 bg-sidebar-accent/50"
          />
        </div>
      </div>

      <div className="flex-1 overflow-auto p-2">
        {filteredData.children && filteredData.children.length > 0 ? (
          filteredData.children.map((child) => renderTree(child, 0))
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
            {searchQuery
              ? 'No documents match your search'
              : 'No documents yet'}
          </div>
        )}
      </div>

      <div className="border-t border-sidebar-border p-3">
        <Button
          onClick={handleAddRoot}
          className="w-full bg-sidebar-primary hover:bg-sidebar-primary/90 text-sidebar-primary-foreground"
          size="sm"
        >
          <Plus className="mr-2 h-4 w-4" />
          New Document
        </Button>
      </div>
    </div>
  );
};
