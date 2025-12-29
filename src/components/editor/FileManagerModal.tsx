"use client";

import { useRef, useCallback, useState } from "react";
import { getData, getDrive } from "./filemanager-data";
// @ts-ignore - @svar-ui/react-filemanager may not have types
import { Filemanager, getMenuOptions } from "@svar-ui/react-filemanager";
import { Willow } from "@svar-ui/react-core";
import "@svar-ui/react-filemanager/style.css";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface FileManagerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function FileManagerModal({ open, onOpenChange }: FileManagerModalProps) {
  const fmApiRef = useRef<any>();

  const init = useCallback((api: any) => {
    fmApiRef.current = api;

    fmApiRef.current.on("download-file", ({ id }: { id: string }) => {
      window.alert(`Demo mode - no download available. File ID: ${id}`);
    });
  }, []);

  const menuOptions = useCallback((mode: string, item: any) => {
    switch (mode) {
      case "file":
      case "folder":
        if (item.id === "/Code") return false;
        if (item.id === "/Pictures")
          return getMenuOptions().filter((o: any) => o.id === "rename");
        return [
          ...getMenuOptions(mode),
          {
            comp: "separator",
          },
          {
            icon: "wxi-cat",
            text: "Clone",
            id: "clone",
            hotkey: "Ctrl+Shift+V",
            handler: ({ context }: any) => {
              const { panels, activePanel } = fmApiRef.current.getState();
              fmApiRef.current.exec("copy-files", {
                ids: [context.id],
                target: panels[activePanel].path,
              });
            },
          },
        ];

      default:
        return getMenuOptions(mode);
    }
  }, []);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl h-[80vh] p-0">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle>File Manager</DialogTitle>
          <DialogDescription>
            Browse and manage demo files and folders
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-hidden px-6 pb-6">
          <div className="h-full border rounded-md">
            <Willow>
              <Filemanager
                init={init}
                data={getData()}
                drive={getDrive()}
                menuOptions={menuOptions}
              />
            </Willow>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
