/**
 * Shared File System Utility
 *
 * Provides a unified file system data structure stored in localStorage
 * that can be used by both the FileManagerModal and DocumentTree components.
 */

const STORAGE_KEY = "REASON-file-system";

export interface FileSystemItem {
  id: string; // Unique identifier (path-based)
  name: string; // File/folder name
  type: "file" | "folder";
  parentId: string | null; // Parent folder ID (null for root)
  size?: number; // File size in bytes
  content?: string; // File content
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  isExpanded?: boolean; // For tree view
}

/**
 * Default mock file system structure
 */
const DEFAULT_FILE_SYSTEM: FileSystemItem[] = [
  // Root folders
  {
    id: "/documents",
    name: "documents",
    type: "folder",
    parentId: null,
    createdAt: "2025-12-15T10:00:00Z",
    updatedAt: "2025-12-15T10:00:00Z",
    isExpanded: false,
  },
  {
    id: "/images",
    name: "images",
    type: "folder",
    parentId: null,
    createdAt: "2025-12-15T10:00:00Z",
    updatedAt: "2025-12-15T10:00:00Z",
    isExpanded: false,
  },
  {
    id: "/projects",
    name: "projects",
    type: "folder",
    parentId: null,
    createdAt: "2025-12-15T10:00:00Z",
    updatedAt: "2025-12-15T10:00:00Z",
    isExpanded: false,
  },
  {
    id: "/src",
    name: "src",
    type: "folder",
    parentId: null,
    createdAt: "2025-12-15T10:00:00Z",
    updatedAt: "2025-12-15T10:00:00Z",
    isExpanded: false,
  },
  {
    id: "/public",
    name: "public",
    type: "folder",
    parentId: null,
    createdAt: "2025-12-15T10:00:00Z",
    updatedAt: "2025-12-15T10:00:00Z",
    isExpanded: false,
  },

  // Documents folder files
  {
    id: "/documents/notes.txt",
    name: "notes.txt",
    type: "file",
    parentId: "/documents",
    size: 1024,
    content: "# My Notes\n\nImportant notes go here...",
    createdAt: "2025-12-20T10:00:00Z",
    updatedAt: "2025-12-20T10:00:00Z",
  },
  {
    id: "/documents/research.md",
    name: "research.md",
    type: "file",
    parentId: "/documents",
    size: 2048,
    content: "# Research Document\n\nResearch findings...",
    createdAt: "2025-12-22T10:00:00Z",
    updatedAt: "2025-12-22T10:00:00Z",
  },
  {
    id: "/documents/report.pdf",
    name: "report.pdf",
    type: "file",
    parentId: "/documents",
    size: 5120,
    content: "PDF content placeholder",
    createdAt: "2025-12-25T10:00:00Z",
    updatedAt: "2025-12-25T10:00:00Z",
  },

  // Images folder files
  {
    id: "/images/screenshot.png",
    name: "screenshot.png",
    type: "file",
    parentId: "/images",
    size: 4096,
    content: "Image data placeholder",
    createdAt: "2025-12-21T10:00:00Z",
    updatedAt: "2025-12-21T10:00:00Z",
  },
  {
    id: "/images/diagram.svg",
    name: "diagram.svg",
    type: "file",
    parentId: "/images",
    size: 1536,
    content: '<svg width="100" height="100"><circle cx="50" cy="50" r="40" /></svg>',
    createdAt: "2025-12-23T10:00:00Z",
    updatedAt: "2025-12-23T10:00:00Z",
  },

  // Projects folder structure
  {
    id: "/projects/web-app",
    name: "web-app",
    type: "folder",
    parentId: "/projects",
    createdAt: "2025-12-24T10:00:00Z",
    updatedAt: "2025-12-24T10:00:00Z",
    isExpanded: false,
  },
  {
    id: "/projects/web-app/index.html",
    name: "index.html",
    type: "file",
    parentId: "/projects/web-app",
    size: 2048,
    content: "<!DOCTYPE html>\n<html>\n<head><title>My App</title></head>\n<body><h1>Hello World</h1></body>\n</html>",
    createdAt: "2025-12-24T10:00:00Z",
    updatedAt: "2025-12-24T10:00:00Z",
  },
  {
    id: "/projects/web-app/styles.css",
    name: "styles.css",
    type: "file",
    parentId: "/projects/web-app",
    size: 1024,
    content: "body { margin: 0; padding: 20px; font-family: sans-serif; }",
    createdAt: "2025-12-24T10:00:00Z",
    updatedAt: "2025-12-24T10:00:00Z",
  },
  {
    id: "/projects/web-app/script.js",
    name: "script.js",
    type: "file",
    parentId: "/projects/web-app",
    size: 3072,
    content: "console.log('Hello from script.js');",
    createdAt: "2025-12-26T10:00:00Z",
    updatedAt: "2025-12-26T10:00:00Z",
  },

  // Src folder structure
  {
    id: "/src/components",
    name: "components",
    type: "folder",
    parentId: "/src",
    createdAt: "2025-12-15T10:00:00Z",
    updatedAt: "2025-12-15T10:00:00Z",
    isExpanded: false,
  },
  {
    id: "/src/lib",
    name: "lib",
    type: "folder",
    parentId: "/src",
    createdAt: "2025-12-15T10:00:00Z",
    updatedAt: "2025-12-15T10:00:00Z",
    isExpanded: false,
  },
  {
    id: "/src/App.tsx",
    name: "App.tsx",
    type: "file",
    parentId: "/src",
    size: 1500,
    content: "import React from 'react';\n\nfunction App() {\n  return <div>App</div>;\n}\n\nexport default App;",
    createdAt: "2025-12-15T10:00:00Z",
    updatedAt: "2025-12-15T10:00:00Z",
  },
  {
    id: "/src/index.tsx",
    name: "index.tsx",
    type: "file",
    parentId: "/src",
    size: 800,
    content: "import React from 'react';\nimport ReactDOM from 'react-dom';\nimport App from './App';\n\nReactDOM.render(<App />, document.getElementById('root'));",
    createdAt: "2025-12-15T10:00:00Z",
    updatedAt: "2025-12-15T10:00:00Z",
  },

  // Components folder
  {
    id: "/src/components/Button.tsx",
    name: "Button.tsx",
    type: "file",
    parentId: "/src/components",
    size: 600,
    content: "export const Button = ({ children }) => <button>{children}</button>;",
    createdAt: "2025-12-15T10:00:00Z",
    updatedAt: "2025-12-15T10:00:00Z",
  },
  {
    id: "/src/components/Input.tsx",
    name: "Input.tsx",
    type: "file",
    parentId: "/src/components",
    size: 550,
    content: "export const Input = (props) => <input {...props} />;",
    createdAt: "2025-12-15T10:00:00Z",
    updatedAt: "2025-12-15T10:00:00Z",
  },
  {
    id: "/src/components/Modal.tsx",
    name: "Modal.tsx",
    type: "file",
    parentId: "/src/components",
    size: 750,
    content: "export const Modal = ({ children, isOpen }) => isOpen ? <div>{children}</div> : null;",
    createdAt: "2025-12-15T10:00:00Z",
    updatedAt: "2025-12-15T10:00:00Z",
  },

  // Lib folder
  {
    id: "/src/lib/utils.ts",
    name: "utils.ts",
    type: "file",
    parentId: "/src/lib",
    size: 450,
    content: "export const formatDate = (date: Date) => date.toISOString();",
    createdAt: "2025-12-15T10:00:00Z",
    updatedAt: "2025-12-15T10:00:00Z",
  },
  {
    id: "/src/lib/api.ts",
    name: "api.ts",
    type: "file",
    parentId: "/src/lib",
    size: 500,
    content: "export const fetchData = async (url: string) => fetch(url).then(r => r.json());",
    createdAt: "2025-12-15T10:00:00Z",
    updatedAt: "2025-12-15T10:00:00Z",
  },

  // Public folder
  {
    id: "/public/index.html",
    name: "index.html",
    type: "file",
    parentId: "/public",
    size: 400,
    content: "<!DOCTYPE html>\n<html>\n<head><title>App</title></head>\n<body><div id=\"root\"></div></body>\n</html>",
    createdAt: "2025-12-15T10:00:00Z",
    updatedAt: "2025-12-15T10:00:00Z",
  },
  {
    id: "/public/favicon.ico",
    name: "favicon.ico",
    type: "file",
    parentId: "/public",
    size: 350,
    content: "Favicon data",
    createdAt: "2025-12-15T10:00:00Z",
    updatedAt: "2025-12-15T10:00:00Z",
  },

  // Root files
  {
    id: "/readme.md",
    name: "readme.md",
    type: "file",
    parentId: null,
    size: 512,
    content: "# My Project\n\nProject description here...",
    createdAt: "2025-12-15T10:00:00Z",
    updatedAt: "2025-12-15T10:00:00Z",
  },
  {
    id: "/config.json",
    name: "config.json",
    type: "file",
    parentId: null,
    size: 256,
    content: '{\n  "version": "1.0.0",\n  "name": "my-project"\n}',
    createdAt: "2025-12-18T10:00:00Z",
    updatedAt: "2025-12-18T10:00:00Z",
  },
  {
    id: "/package.json",
    name: "package.json",
    type: "file",
    parentId: null,
    size: 800,
    content: '{\n  "name": "my-app",\n  "version": "1.0.0",\n  "dependencies": {}\n}',
    createdAt: "2025-12-15T10:00:00Z",
    updatedAt: "2025-12-15T10:00:00Z",
  },
  {
    id: "/README.md",
    name: "README.md",
    type: "file",
    parentId: null,
    size: 600,
    content: "# Project README\n\nGetting started guide...",
    createdAt: "2025-12-15T10:00:00Z",
    updatedAt: "2025-12-15T10:00:00Z",
  },
];

/**
 * Get all file system items from localStorage
 */
export function getFileSystem(): FileSystemItem[] {
  if (typeof window === "undefined") return DEFAULT_FILE_SYSTEM;

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error("Error loading file system from localStorage:", error);
  }

  // Initialize with default data
  saveFileSystem(DEFAULT_FILE_SYSTEM);
  return DEFAULT_FILE_SYSTEM;
}

/**
 * Save file system items to localStorage
 */
export function saveFileSystem(items: FileSystemItem[]): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (error) {
    console.error("Error saving file system to localStorage:", error);
  }
}

/**
 * Get a single item by ID
 */
export function getFileSystemItem(id: string): FileSystemItem | undefined {
  const items = getFileSystem();
  return items.find((item) => item.id === id);
}

/**
 * Get children of a folder
 */
export function getChildren(parentId: string | null): FileSystemItem[] {
  const items = getFileSystem();
  return items.filter((item) => item.parentId === parentId);
}

/**
 * Get all items in a specific path
 */
export function getItemsInPath(path: string): FileSystemItem[] {
  const items = getFileSystem();
  return items.filter((item) => item.id.startsWith(path));
}

/**
 * Create a new file or folder
 */
export function createFileSystemItem(
  name: string,
  type: "file" | "folder",
  parentId: string | null,
  content?: string
): FileSystemItem {
  const items = getFileSystem();
  const parentPath = parentId || "";
  const id = `${parentPath}/${name}`.replace(/\/+/g, "/");

  const newItem: FileSystemItem = {
    id,
    name,
    type,
    parentId,
    size: type === "file" ? (content?.length || 0) : undefined,
    content: type === "file" ? content : undefined,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isExpanded: type === "folder" ? false : undefined,
  };

  items.push(newItem);
  saveFileSystem(items);

  return newItem;
}

/**
 * Update an existing file or folder
 */
export function updateFileSystemItem(
  id: string,
  updates: Partial<FileSystemItem>
): FileSystemItem | null {
  const items = getFileSystem();
  const index = items.findIndex((item) => item.id === id);

  if (index === -1) return null;

  const updatedItem = {
    ...items[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  items[index] = updatedItem;
  saveFileSystem(items);

  return updatedItem;
}

/**
 * Delete a file or folder (and all its children)
 */
export function deleteFileSystemItem(id: string): boolean {
  const items = getFileSystem();
  const itemsToDelete = items.filter(
    (item) => item.id === id || item.id.startsWith(`${id}/`)
  );

  if (itemsToDelete.length === 0) return false;

  const newItems = items.filter(
    (item) => !itemsToDelete.some((toDelete) => toDelete.id === item.id)
  );

  saveFileSystem(newItems);
  return true;
}

/**
 * Rename a file or folder (updates ID and all children)
 */
export function renameFileSystemItem(id: string, newName: string): boolean {
  const items = getFileSystem();
  const item = items.find((i) => i.id === id);

  if (!item) return false;

  const parentPath = item.parentId || "";
  const newId = `${parentPath}/${newName}`.replace(/\/+/g, "/");

  // Update the item itself
  const updatedItems = items.map((i) => {
    if (i.id === id) {
      return { ...i, id: newId, name: newName, updatedAt: new Date().toISOString() };
    }
    // Update children paths
    if (i.id.startsWith(`${id}/`)) {
      const newChildId = i.id.replace(id, newId);
      const newParentId = i.parentId === id ? newId : i.parentId?.replace(id, newId);
      return { ...i, id: newChildId, parentId: newParentId || null, updatedAt: new Date().toISOString() };
    }
    return i;
  });

  saveFileSystem(updatedItems);
  return true;
}

/**
 * Move a file or folder to a new parent
 */
export function moveFileSystemItem(id: string, newParentId: string | null): boolean {
  const items = getFileSystem();
  const item = items.find((i) => i.id === id);

  if (!item) return false;

  const newParentPath = newParentId || "";
  const newId = `${newParentPath}/${item.name}`.replace(/\/+/g, "/");

  // Update the item and all its children
  const updatedItems = items.map((i) => {
    if (i.id === id) {
      return { ...i, id: newId, parentId: newParentId, updatedAt: new Date().toISOString() };
    }
    // Update children paths
    if (i.id.startsWith(`${id}/`)) {
      const newChildId = i.id.replace(id, newId);
      const newChildParentId = i.parentId === id ? newId : i.parentId?.replace(id, newId);
      return { ...i, id: newChildId, parentId: newChildParentId || null, updatedAt: new Date().toISOString() };
    }
    return i;
  });

  saveFileSystem(updatedItems);
  return true;
}

/**
 * Toggle folder expansion state
 */
export function toggleExpanded(id: string): boolean {
  const item = getFileSystemItem(id);
  if (!item || item.type !== "folder") return false;

  updateFileSystemItem(id, { isExpanded: !item.isExpanded });
  return true;
}

/**
 * Reset file system to default
 */
export function resetFileSystem(): void {
  saveFileSystem(DEFAULT_FILE_SYSTEM);
}

/**
 * Convert to format expected by @cubone/react-file-manager
 */
export function toCuboneFormat(items: FileSystemItem[]) {
  return items.map((item) => ({
    name: item.name,
    isDirectory: item.type === "folder",
    path: item.id,
    updatedAt: item.updatedAt,
    size: item.size || 0,
  }));
}

/**
 * Convert to format expected by mock-fs (for DocumentTree)
 */
export function toMockFsFormat(items: FileSystemItem[]): Record<string, { name: string; type: "file" | "dir" }[]> {
  const result: Record<string, { name: string; type: "file" | "dir" }[]> = {};

  items.forEach((item) => {
    const parentKey = item.parentId || "/";
    if (!result[parentKey]) {
      result[parentKey] = [];
    }

    result[parentKey].push({
      name: item.name,
      type: item.type === "folder" ? "dir" : "file",
    });
  });

  return result;
}
