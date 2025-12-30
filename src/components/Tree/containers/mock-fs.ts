/**
 * Mock File System
 *
 * Now uses the shared file system from localStorage.
 * This ensures that both the FileManagerModal and DocumentTree
 * components work with the same data source.
 */

import { getFileSystem, toMockFsFormat } from "@/lib/fileSystem";

/**
 * Get the mock file system from shared localStorage
 */
export function getMockFs(): Record<string, { name: string; type: "file" | "dir" }[]> {
  const fileSystemItems = getFileSystem();
  return toMockFsFormat(fileSystemItems);
}

/**
 * Legacy export for backward compatibility
 * This is now a function that returns the current file system state
 */
export const mockFs = getMockFs();
