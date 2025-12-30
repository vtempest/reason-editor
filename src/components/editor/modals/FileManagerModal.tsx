"use client";

import { useState, useMemo, useEffect } from "react";
import { FileManager } from "@cubone/react-file-manager";
import "@cubone/react-file-manager/dist/style.css";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  getFileSystem,
  toCuboneFormat,
  renameFileSystemItem,
  createFileSystemItem,
  updateFileSystemItem,
} from "@/lib/fileSystem";
import { toast } from "sonner";

interface FileManagerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function FileManagerModal({ open, onOpenChange }: FileManagerModalProps) {
  const [currentPath, setCurrentPath] = useState("/");
  const [refreshKey, setRefreshKey] = useState(0);

  // Convert our shared file system to @cubone/react-file-manager format
  const files = useMemo(() => {
    const fileSystemItems = getFileSystem();
    return toCuboneFormat(fileSystemItems);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshKey]); // Refresh when refreshKey changes

  const handleFolderChange = (path: string) => {
    setCurrentPath(path);
  };

  const handleSelectionChange = (selectedFiles: any[]) => {
    if (selectedFiles.length === 1) {
      const file = selectedFiles[0];
      if (!file.isDirectory) {
        toast.info(`Selected: ${file.name}`);
      }
    }
  };

  const handleRename = async (oldPath: string, newName: string) => {
    try {
      const success = renameFileSystemItem(oldPath, newName);
      if (success) {
        toast.success(`Renamed to ${newName}`);
        setRefreshKey((prev) => prev + 1); // Trigger refresh
      } else {
        toast.error("Failed to rename item");
      }
    } catch (error) {
      console.error("Rename error:", error);
      toast.error("Failed to rename item");
    }
    return Promise.resolve();
  };

  const handleUpload = () => {
    // In a real implementation, this would handle file uploads
    toast.info("Upload functionality - use API route /api/files/upload");
    return {};
  };

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
    toast.success("File list refreshed");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl h-[80vh] p-0 flex flex-col">
        <DialogHeader className="px-6 pt-6 pb-4">
          <DialogTitle>File Manager</DialogTitle>
          <DialogDescription>
            Browse and manage demo files and folders
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden px-6 pb-6">
          <div className="h-full rounded-md overflow-hidden">
            <FileManager
              files={files}
              initialPath={currentPath}
              onFolderChange={handleFolderChange}
              onSelectionChange={handleSelectionChange}
              onRename={handleRename}
              onUpload={handleUpload}
              onRefresh={handleRefresh}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
