"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Tree, type NodeApi } from "react-arborist"
import { File, Folder, FolderOpen, Trash2, Edit2, Copy } from "lucide-react"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import { cn } from "@/lib/utils"

export interface FileNode {
  id: string
  name: string
  children?: FileNode[]
  isFolder?: boolean
}

const initialData: FileNode[] = [
  {
    id: "1",
    name: "src",
    isFolder: true,
    children: [
      {
        id: "2",
        name: "components",
        isFolder: true,
        children: [
          { id: "3", name: "Button.tsx" },
          { id: "4", name: "Input.tsx" },
          { id: "5", name: "Card.tsx" },
        ],
      },
      {
        id: "6",
        name: "hooks",
        isFolder: true,
        children: [
          { id: "7", name: "useAuth.ts" },
          { id: "8", name: "useData.ts" },
        ],
      },
      { id: "9", name: "App.tsx" },
      { id: "10", name: "index.ts" },
    ],
  },
  {
    id: "11",
    name: "public",
    isFolder: true,
    children: [
      { id: "12", name: "logo.svg" },
      { id: "13", name: "favicon.ico" },
    ],
  },
  { id: "14", name: "package.json" },
  { id: "15", name: "tsconfig.json" },
  { id: "16", name: "README.md" },
]

export function FileTree() {
  const [data, setData] = useState<FileNode[]>(initialData)
  const treeRef = useRef<any>(null)

  const handleCreate = (node: NodeApi<FileNode>, type: "file" | "folder") => {
    const newId = String(Date.now())
    const newNode: FileNode = {
      id: newId,
      name: type === "folder" ? "New Folder" : "new-file.txt",
      isFolder: type === "folder",
      children: type === "folder" ? [] : undefined,
    }

    if (node.data.isFolder) {
      const updated = addNode(data, node.id, newNode)
      setData(updated)
      setTimeout(() => {
        treeRef.current?.edit(newId)
      }, 100)
    }
  }

  const handleDelete = (node: NodeApi<FileNode>) => {
    const updated = removeNode(data, node.id)
    setData(updated)
  }

  const handleRename = (node: NodeApi<FileNode>) => {
    treeRef.current?.edit(node.id)
  }

  const handleDuplicate = (node: NodeApi<FileNode>) => {
    const newNode = { ...node.data, id: String(Date.now()), name: `${node.data.name} (copy)` }
    if (node.parent) {
      const updated = addNode(data, node.parent.id, newNode)
      setData(updated)
    }
  }

  return (
    <div className="rounded-lg border bg-card p-4 shadow-sm">
      <Tree
        ref={treeRef}
        data={data}
        openByDefault={false}
        width="100%"
        height={500}
        indent={24}
        rowHeight={32}
        overscanCount={1}
        className="file-tree"
        onMove={(args) => {
          const updated = moveNode(data, args.dragIds[0], args.parentId, args.index)
          setData(updated)
        }}
        onRename={(args) => {
          const updated = renameNode(data, args.id, args.name)
          setData(updated)
        }}
      >
        {(props) => (
          <Node
            {...props}
            onCreate={handleCreate}
            onDelete={handleDelete}
            onRename={handleRename}
            onDuplicate={handleDuplicate}
          />
        )}
      </Tree>
    </div>
  )
}

interface NodeProps {
  node: NodeApi<FileNode>
  style: React.CSSProperties
  dragHandle?: (el: HTMLDivElement | null) => void
  onCreate: (node: NodeApi<FileNode>, type: "file" | "folder") => void
  onDelete: (node: NodeApi<FileNode>) => void
  onRename: (node: NodeApi<FileNode>) => void
  onDuplicate: (node: NodeApi<FileNode>) => void
}

function Node({ node, style, dragHandle, onCreate, onDelete, onRename, onDuplicate }: NodeProps) {
  const isFolder = node.data.isFolder
  const Icon = isFolder ? (node.isOpen ? FolderOpen : Folder) : File

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div
          ref={dragHandle}
          style={style}
          className={cn(
            "flex cursor-pointer items-center gap-2 rounded px-2 py-1 hover:bg-accent",
            node.isSelected && "bg-accent",
            node.state.isDragging && "opacity-50",
          )}
          onClick={() => node.isInternal && node.toggle()}
        >
          <Icon className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
          {node.isEditing ? (
            <input
              autoFocus
              type="text"
              defaultValue={node.data.name}
              onBlur={(e) => node.submit(e.currentTarget.value)}
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
      <ContextMenuContent className="w-48">
        {isFolder && (
          <>
            <ContextMenuItem onClick={() => onCreate(node, "file")}>
              <File className="mr-2 h-4 w-4" />
              New File
            </ContextMenuItem>
            <ContextMenuItem onClick={() => onCreate(node, "folder")}>
              <Folder className="mr-2 h-4 w-4" />
              New Folder
            </ContextMenuItem>
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

// Helper functions to manipulate tree data
function addNode(nodes: FileNode[], parentId: string | null, newNode: FileNode): FileNode[] {
  return nodes.map((node) => {
    if (node.id === parentId) {
      return {
        ...node,
        children: [...(node.children || []), newNode],
      }
    }
    if (node.children) {
      return {
        ...node,
        children: addNode(node.children, parentId, newNode),
      }
    }
    return node
  })
}

function removeNode(nodes: FileNode[], nodeId: string): FileNode[] {
  return nodes
    .filter((node) => node.id !== nodeId)
    .map((node) => ({
      ...node,
      children: node.children ? removeNode(node.children, nodeId) : undefined,
    }))
}

function renameNode(nodes: FileNode[], nodeId: string, newName: string): FileNode[] {
  return nodes.map((node) => {
    if (node.id === nodeId) {
      return { ...node, name: newName }
    }
    if (node.children) {
      return {
        ...node,
        children: renameNode(node.children, nodeId, newName),
      }
    }
    return node
  })
}

function moveNode(nodes: FileNode[], dragId: string, parentId: string | null, index: number): FileNode[] {
  // Find the dragged node
  let draggedNode: FileNode | null = null
  const findAndRemove = (items: FileNode[]): FileNode[] => {
    return items
      .filter((item) => {
        if (item.id === dragId) {
          draggedNode = item
          return false
        }
        return true
      })
      .map((item) => ({
        ...item,
        children: item.children ? findAndRemove(item.children) : undefined,
      }))
  }

  let result = findAndRemove(nodes)

  if (!draggedNode) return nodes

  // Add to new location
  if (parentId === null) {
    result.splice(index, 0, draggedNode)
  } else {
    const addToParent = (items: FileNode[]): FileNode[] => {
      return items.map((item) => {
        if (item.id === parentId) {
          const newChildren = [...(item.children || [])]
          newChildren.splice(index, 0, draggedNode!)
          return { ...item, children: newChildren }
        }
        if (item.children) {
          return { ...item, children: addToParent(item.children) }
        }
        return item
      })
    }
    result = addToParent(result)
  }

  return result
}
