import { DataLoader } from "@headless-tree/core";
import { Document } from "./DocumentTree";

export interface TreeDataItem {
  name: string;
  children?: string[];
}

// Global data store for tree items
export let treeData: Record<string, TreeDataItem> = {};

// Initialize tree data from documents
export const initializeTreeData = (documents: Document[]) => {
  const data: Record<string, TreeDataItem> = {
    root: {
      name: "Root",
      children: documents.filter(doc => !doc.parentId).map(doc => doc.id),
    },
  };

  documents.forEach(doc => {
    const children = documents.filter(d => d.parentId === doc.id).map(d => d.id);
    data[doc.id] = {
      name: doc.title || "Untitled",
      children: children.length > 0 || doc.isFolder ? children : undefined,
    };
  });

  treeData = data;
  return data;
};

// Async data loader for headless-tree
export const asyncDataLoader: DataLoader<TreeDataItem> = async (itemIds) => {
  return itemIds.map((id) => ({
    id,
    data: treeData[id] || { name: "Unknown" },
  }));
};
