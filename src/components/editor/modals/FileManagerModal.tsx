"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import {
  ChonkyActions,
  ChonkyFileActionData,
  FileArray,
  FileBrowser,
  FileContextMenu,
  FileList,
  FileNavbar,
  FileToolbar,
  setChonkyDefaults,
} from "chonky";
import { ChonkyIconFA } from "chonky-icon-fontawesome";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
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
  const [currentFolderId, setCurrentFolderId] = useState("/");

  // Initialize Chonky defaults on mount (client-side only)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setChonkyDefaults({ iconComponent: ChonkyIconFA });
    }
  }, []);

  // Convert our data format to Chonky format
  const fileMap = useMemo(() => {
    const data = getData();
    const map = new Map();

    // Add root folder
    map.set("/", {
      id: "/",
      name: "Root",
      isDir: true,
    });

    // Convert all files and folders
    data.forEach((item) => {
      const parts = item.id.split("/").filter(Boolean);
      const name = parts[parts.length - 1] || "Root";
      const parentId = parts.length > 1
        ? "/" + parts.slice(0, -1).join("/")
        : "/";

      map.set(item.id, {
        id: item.id,
        name: name,
        isDir: item.type === "folder",
        modDate: item.date,
        size: item.size,
        parentId: parentId,
      });
    });

    return map;
  }, []);

  // Get files for current folder
  const files: FileArray = useMemo(() => {
    const currentFiles: FileArray = [];

    fileMap.forEach((file) => {
      if (file.parentId === currentFolderId) {
        currentFiles.push(file);
      }
    });

    return currentFiles;
  }, [currentFolderId, fileMap]);

  // Build folder chain for breadcrumb navigation
  const folderChain: FileArray = useMemo(() => {
    const chain: FileArray = [];
    let folderId = currentFolderId;

    while (folderId) {
      const folder = fileMap.get(folderId);
      if (folder) {
        chain.unshift(folder);
      }
      if (folderId === "/") break;

      // Get parent folder
      const parts = folderId.split("/").filter(Boolean);
      if (parts.length > 1) {
        folderId = "/" + parts.slice(0, -1).join("/");
      } else {
        folderId = "/";
      }
    }

    return chain;
  }, [currentFolderId, fileMap]);

  // Handle file actions
  const handleFileAction = useCallback(
    (data: ChonkyFileActionData) => {
      if (data.id === ChonkyActions.OpenFiles.id) {
        const { targetFile, files } = data.payload;
        const fileToOpen = targetFile ?? files[0];
        if (fileToOpen && fileToOpen.isDir) {
          setCurrentFolderId(fileToOpen.id);
        } else if (fileToOpen) {
          toast.info(`Opening: ${fileToOpen.name}`);
        }
      } else if (data.id === ChonkyActions.DownloadFiles.id) {
        const { files } = data.payload;
        toast.info(
          `Download: ${files.map((f) => f.name).join(", ")}`
        );
      } else if (data.id === ChonkyActions.DeleteFiles.id) {
        const { files } = data.state.selectedFilesForAction;
        toast.info(
          `Delete: ${files.map((f) => f.name).join(", ")}`
        );
      } else if (data.id === ChonkyActions.CreateFolder.id) {
        toast.info("Create folder action triggered");
      }
    },
    []
  );

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
          <div className="h-full border rounded-md overflow-hidden bg-background">
            <DndProvider backend={HTML5Backend}>
              <FileBrowser
                files={files}
                folderChain={folderChain}
                onFileAction={handleFileAction}
                fileActions={[
                  ChonkyActions.OpenFiles,
                  ChonkyActions.DownloadFiles,
                  ChonkyActions.DeleteFiles,
                  ChonkyActions.CreateFolder,
                ]}
              >
                <FileNavbar />
                <FileToolbar />
                <FileList />
                <FileContextMenu />
              </FileBrowser>
            </DndProvider>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
