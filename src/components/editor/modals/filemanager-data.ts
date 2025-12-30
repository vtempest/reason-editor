/**
 * File Manager Data
 *
 * Now uses the shared file system from localStorage.
 * This file is kept for backward compatibility.
 */

import { getFileSystem } from "@/lib/fileSystem";

export interface FileItem {
  id: string;
  name: string;
  type: "folder" | "file";
  date?: string;
  size?: number;
}

/**
 * Get file data from shared file system
 * Converts from FileSystemItem format to FileItem format
 */
export function getData(): FileItem[] {
  const fileSystemItems = getFileSystem();

  return fileSystemItems.map((item) => ({
    id: item.id,
    name: item.name,
    type: item.type,
    date: item.updatedAt ? item.updatedAt.split("T")[0] : undefined,
    size: item.size,
  }));
}
