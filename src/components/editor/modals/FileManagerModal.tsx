"use client";

import { useState, useMemo } from "react";
import { FileManager } from "@cubone/react-file-manager";
import "@cubone/react-file-manager/dist/style.css";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { getData } from "./filemanager-data";
import { toast } from "sonner";

interface FileManagerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function FileManagerModal({ open, onOpenChange }: FileManagerModalProps) {
  const [currentPath, setCurrentPath] = useState("/");

  // Convert our data format to @cubone/react-file-manager format
  const files = useMemo(() => {
    const data = getData();

    return data.map((item) => ({
      name: item.name,
      isDirectory: item.type === "folder",
      path: item.id,
      updatedAt: item.date ? new Date(item.date).toISOString() : new Date().toISOString(),
      size: item.size || 0,
    }));
  }, []);

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

  const handleRename = (oldPath: string, newName: string) => {
    toast.info(`Rename: ${oldPath} to ${newName}`);
    return Promise.resolve();
  };

  const handleUpload = () => {
    toast.info("Upload action triggered");
    return {};
  };

  const handleRefresh = () => {
    toast.info("Refreshing file list");
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
