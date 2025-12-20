"use client"

import { Tree, type NodeRendererProps } from "react-arborist"
import type { Document } from "@/lib/db/schema"
import type { DocumentNode } from "@/lib/document-utils"
import { ChevronRight, File, Folder, FolderOpen, Copy, Trash2, Edit, FilePlus, FolderPlus } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"

interface DocumentTreeProps {
  data: DocumentNode[]
  onSelect: (document: Document) => void
  onMove?: (nodeId: string, parentId: string | null, index: number) => void
  onDelete?: (nodeId: string) => void
  onRename?: (nodeId: string, newName: string) => void
  onDuplicate?: (nodeId: string) => void
  onNewFile?: (parentId: string | null) => void
  onNewFolder?: (parentId: string | null) => void
  searchTerm?: string
  height: number
}

export function DocumentTree({
  data,
  onSelect,
  onMove,
  onDelete,
  onRename,
  onDuplicate,
  onNewFile,
  onNewFolder,
  searchTerm,
  height,
}: DocumentTreeProps) {
  const handleMove = (args: { dragIds: string[]; parentId: string | null; index: number }) => {
    console.log("[v0] Tree move:", args)
    if (onMove && args.dragIds.length > 0) {
      onMove(args.dragIds[0], args.parentId, args.index)
    }
  }

  return (
    <Tree
      data={data}
      openByDefault={false}
      width="100%"
      height={height}
      indent={24}
      rowHeight={32}
      searchTerm={searchTerm}
      searchMatch={(node, term) => node.data.name.toLowerCase().includes(term.toLowerCase())}
      onActivate={(node) => onSelect(node.data.data)}
      onMove={handleMove}
    >
      {(props) => (
        <Node
          {...props}
          onDelete={onDelete}
          onRename={onRename}
          onDuplicate={onDuplicate}
          onNewFile={onNewFile}
          onNewFolder={onNewFolder}
        />
      )}
    </Tree>
  )
}

interface NodeProps extends NodeRendererProps<DocumentNode> {
  onDelete?: (nodeId: string) => void
  onRename?: (nodeId: string, newName: string) => void
  onDuplicate?: (nodeId: string) => void
  onNewFile?: (parentId: string | null) => void
  onNewFolder?: (parentId: string | null) => void
}

function Node({ node, style, dragHandle, onDelete, onRename, onDuplicate, onNewFile, onNewFolder }: NodeProps) {
  const isFolder = node.data.data.isFolder === 1
  const isDivider = node.data.data.type === 3

  const handleDelete = () => {
    if (onDelete && confirm(`Delete "${node.data.name}"?`)) {
      onDelete(node.id)
    }
  }

  const handleRename = () => {
    if (onRename) {
      const newName = prompt("Enter new name:", node.data.name)
      if (newName && newName !== node.data.name) {
        onRename(node.id, newName)
      }
    }
  }

  const handleDuplicate = () => {
    if (onDuplicate) {
      onDuplicate(node.id)
    }
  }

  const handleNewFile = () => {
    if (onNewFile) {
      onNewFile(isFolder ? node.id : null)
    }
  }

  const handleNewFolder = () => {
    if (onNewFolder) {
      onNewFolder(isFolder ? node.id : null)
    }
  }

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <div
          ref={dragHandle}
          style={style}
          className={cn(
            "flex items-center gap-2 px-2 py-1 cursor-pointer hover:bg-accent rounded-sm transition-colors",
            node.state.isSelected && "bg-accent",
            node.state.isFocused && "ring-1 ring-ring",
            node.state.isDragging && "opacity-50",
          )}
          onClick={() => node.toggle()}
        >
          {isFolder && (
            <>
              <ChevronRight
                className={cn(
                  "h-4 w-4 shrink-0 transition-transform text-muted-foreground",
                  node.isOpen && "rotate-90",
                )}
              />
              {node.isOpen ? (
                <FolderOpen className="h-4 w-4 shrink-0 text-blue-500" />
              ) : (
                <Folder className="h-4 w-4 shrink-0 text-blue-500" />
              )}
            </>
          )}
          {!isFolder && !isDivider && <File className="h-4 w-4 shrink-0 ml-6 text-muted-foreground" />}
          <span
            className={cn(
              "text-sm truncate",
              isDivider && "font-semibold text-muted-foreground",
              !isFolder && !isDivider && "text-foreground",
            )}
          >
            {node.data.name}
          </span>
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        {isFolder && (
          <>
            <ContextMenuItem onClick={handleNewFile}>
              <FilePlus className="mr-2 h-4 w-4" />
              New File
            </ContextMenuItem>
            <ContextMenuItem onClick={handleNewFolder}>
              <FolderPlus className="mr-2 h-4 w-4" />
              New Folder
            </ContextMenuItem>
            <ContextMenuSeparator />
          </>
        )}
        <ContextMenuItem onClick={handleRename}>
          <Edit className="mr-2 h-4 w-4" />
          Rename
        </ContextMenuItem>
        <ContextMenuItem onClick={handleDuplicate}>
          <Copy className="mr-2 h-4 w-4" />
          Duplicate
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem onClick={handleDelete} className="text-destructive focus:text-destructive">
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}
