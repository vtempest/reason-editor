"use client"

import type React from "react"
import { useRef, useCallback, useImperativeHandle, forwardRef, useState } from "react"
import { Tree, type NodeApi } from "react-arborist"
import { Folder, FolderOpen, Trash2, Edit2, Copy, FileText } from "lucide-react"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
  ContextMenuSub,
  ContextMenuSubTrigger,
  ContextMenuSubContent,
} from "@/components/ui/context-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { cn } from "@/lib/utils"
import { getFileIcon } from "@/lib/file-icons"
import type { Document } from "@/lib/db/schema"
import type { DocumentNode } from "@/lib/document-utils"

export interface DocumentTreeHandle {
  expandAll: () => void
  collapseAll: () => void
  edit: (nodeId: string) => void
}

interface DocumentTreeProps {
  data: DocumentNode[]
  activeId?: string | null
  onSelect: (document: Document) => void
  onMove?: (nodeId: string, parentId: string | null, position: "before" | "after" | "child") => void
  onDelete?: (nodeId: string) => void
  onRename?: (nodeId: string, newName: string) => void
  onDuplicate?: (nodeId: string) => void
  onNewFile?: (parentId: string | null) => void
  onNewFolder?: (parentId: string | null) => void
  searchTerm?: string
  height: number
}

export const DocumentTree = forwardRef<DocumentTreeHandle, DocumentTreeProps>(({
  data,
  activeId,
  onSelect,
  onMove,
  onDelete,
  onRename,
  onDuplicate,
  onNewFile,
  onNewFolder,
  height,
}, ref) => {
  const treeRef = useRef<any>(null)
  const [deleteConfirmNode, setDeleteConfirmNode] = useState<NodeApi<DocumentNode> | null>(null)

  useImperativeHandle(ref, () => ({
    expandAll: () => {
      if (treeRef.current) {
        treeRef.current.openAll()
      }
    },
    collapseAll: () => {
      if (treeRef.current) {
        treeRef.current.closeAll()
      }
    },
    edit: (nodeId: string) => {
      if (treeRef.current) {
        treeRef.current.edit(nodeId)
      }
    },
  }))

  const handleCreate = useCallback((node: NodeApi<DocumentNode>, type: "file" | "folder") => {
    if (type === "file" && onNewFile) {
      // If node is a folder, add as child, otherwise add as sibling
      const parentId = node.data.data.isFolder ? node.id : node.parent?.id || null
      onNewFile(parentId)
    } else if (type === "folder" && onNewFolder) {
      const parentId = node.data.data.isFolder ? node.id : node.parent?.id || null
      onNewFolder(parentId)
    }
  }, [onNewFile, onNewFolder])

  const handleDelete = useCallback((node: NodeApi<DocumentNode>) => {
    // Show confirmation dialog instead of deleting immediately
    setDeleteConfirmNode(node)
  }, [])

  const confirmDelete = useCallback(() => {
    if (deleteConfirmNode && onDelete) {
      onDelete(deleteConfirmNode.id)
      setDeleteConfirmNode(null)
    }
  }, [deleteConfirmNode, onDelete])

  const handleRename = useCallback((node: NodeApi<DocumentNode>) => {
    treeRef.current?.edit(node.id)
  }, [])

  const handleDuplicate = useCallback((node: NodeApi<DocumentNode>) => {
    if (onDuplicate) {
      onDuplicate(node.id)
    }
  }, [onDuplicate])

  return (
    <>
      <div className="w-full pl-2" style={{ height: `${height}px` }}>
        <Tree
          ref={treeRef}
          data={data}
          openByDefault={false}
          width="100%"
          height={height}
          indent={24}
          rowHeight={28}
          overscanCount={1}
          className="file-tree"
          onMove={(args) => {
            if (onMove && args.dragIds[0]) {
              const parentId = args.parentId || null
              onMove(args.dragIds[0], parentId, "child")
            }
          }}
          onRename={(args) => {
            if (onRename) {
              onRename(args.id, args.name)
            }
          }}
          initialOpenState={
            data.reduce((acc, node) => {
              if (node.data.isFolder && node.data.isExpanded) {
                acc[node.id] = true
              }
              return acc
            }, {} as Record<string, boolean>)
          }
          onToggle={(id) => {
            // Find the node and toggle its expanded state
            const findAndToggle = (nodes: DocumentNode[]): boolean => {
              for (const node of nodes) {
                if (node.id === id) {
                  // Could call a callback here if needed
                  return true
                }
                if (node.children && findAndToggle(node.children)) {
                  return true
                }
              }
              return false
            }
            findAndToggle(data)
          }}
        >
          {(props) => (
            <Node
              {...props}
              activeId={activeId}
              onCreate={handleCreate}
              onDelete={handleDelete}
              onRename={handleRename}
              onDuplicate={handleDuplicate}
              onSelect={onSelect}
            />
          )}
        </Tree>
      </div>

      <AlertDialog open={!!deleteConfirmNode} onOpenChange={(open) => !open && setDeleteConfirmNode(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Move to Trash?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to move "{deleteConfirmNode?.data.name}" to trash? You can restore it later from the trash.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Move to Trash</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
})

interface NodeProps {
  node: NodeApi<DocumentNode>
  style: React.CSSProperties
  dragHandle?: (el: HTMLDivElement | null) => void
  activeId?: string | null
  onCreate: (node: NodeApi<DocumentNode>, type: "file" | "folder") => void
  onDelete: (node: NodeApi<DocumentNode>) => void
  onRename: (node: NodeApi<DocumentNode>) => void
  onDuplicate: (node: NodeApi<DocumentNode>) => void
  onSelect: (document: Document) => void
}

function Node({
  node,
  style,
  dragHandle,
  activeId,
  onCreate,
  onDelete,
  onRename,
  onDuplicate,
  onSelect,
}: NodeProps) {
  const isFolder = node.data.data.isFolder
  const iconClass = getFileIcon(node.data.name, isFolder || false)
  const isActive = activeId === node.id

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div
          ref={dragHandle}
          style={style}
          className={cn(
            "flex cursor-pointer items-center gap-2 rounded px-2 py-1 hover:bg-accent transition-colors",
            isActive && "bg-accent",
            node.state.isDragging && "opacity-50",
          )}
          onClick={() => {
            if (isFolder) {
              node.toggle()
            } else {
              onSelect(node.data.data)
            }
          }}
        >
          {isFolder ? (
            node.isOpen ? (
              <FolderOpen className="h-4 w-4 flex-shrink-0 text-yellow-600 dark:text-yellow-500" />
            ) : (
              <Folder className="h-4 w-4 flex-shrink-0 text-yellow-600 dark:text-yellow-500" />
            )
          ) : (
            <span className={cn("icon flex-shrink-0", iconClass)} />
          )}
          {node.isEditing ? (
            <input
              autoFocus
              type="text"
              defaultValue={node.data.name}
              onBlur={(e) => node.submit(e.currentTarget.value)}
              onClick={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()}
              onKeyDown={(e) => {
                if (e.key === "Enter") node.submit(e.currentTarget.value)
                if (e.key === "Escape") node.reset()
              }}
              className="flex-1 rounded border bg-background px-1 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          ) : (
            <span className="flex-1 truncate text-sm">{node.data.name}</span>
          )}
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent className="w-56">
        {isFolder && (
          <>
            <ContextMenuSub>
              <ContextMenuSubTrigger>
                <Folder className="mr-2 h-4 w-4" />
                Add Child
              </ContextMenuSubTrigger>
              <ContextMenuSubContent>
                <ContextMenuItem onClick={() => onCreate(node, "file")}>
                  <FileText className="mr-2 h-4 w-4" />
                  Note
                </ContextMenuItem>
                <ContextMenuItem onClick={() => onCreate(node, "folder")}>
                  <Folder className="mr-2 h-4 w-4" />
                  Folder
                </ContextMenuItem>
              </ContextMenuSubContent>
            </ContextMenuSub>
            <ContextMenuSeparator />
          </>
        )}
        <ContextMenuItem onClick={() => onRename(node)}>
          <Edit2 className="mr-2 h-4 w-4" />
          Rename
        </ContextMenuItem>
        <ContextMenuItem onClick={() => onDuplicate(node)}>
          <Copy className="mr-2 h-4 w-4" />
          Duplicate
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem onClick={() => onDelete(node)} className="text-destructive">
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}
