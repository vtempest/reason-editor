import React, { useState } from 'react';
import { FolderOpen, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
}) => {
  const [treeData, setTreeData] = useState<TreeItemData>(data);

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
        if (found) return found;
      }
    }
    return null;
  };

  // Helper to update tree data immutably
  const updateTree = (updater: (data: TreeItemData) => TreeItemData) => {
    setTreeData(updater({ ...treeData }));
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
      if (parent?.children) {
        const siblingIndex = parent.children.findIndex(
          (child) => child.id === siblingId
        );
        const newItem: TreeItemData = {
          id: `${Date.now()}-${Math.random()}`,
          name: isFolder ? 'New Folder' : 'New Document',
          isFolder,
          isOpen: false,
          children: isFolder ? [] : undefined,
        };
        parent.children.splice(siblingIndex + 1, 0, newItem);
      }
      return data;
    });
    onAddSibling?.(siblingId, isFolder);
  };

  const handleDuplicate = (id: string) => {
    updateTree((data) => {
      const node = findNodeById(data, id);
      const parent = findParentById(data, id);
      if (node && parent?.children) {
        const nodeIndex = parent.children.findIndex(
          (child) => child.id === id
        );
        const duplicate: TreeItemData = {
          ...JSON.parse(JSON.stringify(node)),
          id: `${Date.now()}-${Math.random()}`,
          name: `${node.name} (Copy)`,
        };
        parent.children.splice(nodeIndex + 1, 0, duplicate);
      }
      return data;
    });
    onDuplicate?.(id);
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
      />
    );
  };

  return (
    <div className="flex h-full flex-col bg-sidebar-background">
      <div className="border-b border-sidebar-border px-4 py-4">
        <div className="flex items-center gap-2">
          <FolderOpen className="h-5 w-5 text-sidebar-primary" />
          <h2 className="font-serif text-lg font-semibold text-sidebar-foreground">
            Documents
          </h2>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-2">
        {treeData.children && treeData.children.length > 0 ? (
          treeData.children.map((child) => renderTree(child, 0))
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
            No documents yet
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
