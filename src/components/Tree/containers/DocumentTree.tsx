"use client"

import React, { useMemo } from "react"
import {
  UncontrolledTreeEnvironment,
  Tree,
  StaticTreeDataProvider,
  TreeItem,
  TreeItemIndex,
  TreeEnvironmentRef,
} from "react-complex-tree"
import "react-complex-tree/lib/style-modern.css"
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

interface TreeItemData {
  document: Document
  name: string
}

export function DocumentTree({
  data,
  activeId,
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
  const treeRef = React.useRef<TreeEnvironmentRef>(null)
  const [expandedItems, setExpandedItems] = React.useState<TreeItemIndex[]>([])
  const [selectedItems, setSelectedItems] = React.useState<TreeItemIndex[]>([])

  // Convert DocumentNode[] to react-complex-tree format
  const treeItems = useMemo(() => {
    const items: Record<TreeItemIndex, TreeItem<TreeItemData>> = {
      root: {
        index: "root",
        isFolder: true,
        children: [],
        data: { document: null as any, name: "Root" },
      },
    }

    function processNode(node: DocumentNode, parentId: string = "root") {
      const isFolder = node.data.isFolder === 1
      const item: TreeItem<TreeItemData> = {
        index: node.id,
        isFolder,
        children: node.children?.map((child) => child.id) || undefined,
        data: {
          document: node.data,
          name: node.name || "Untitled",
        },
        canMove: true,
        canRename: true,
      }

      items[node.id] = item

      // Add to parent's children
      if (items[parentId]) {
        if (!items[parentId].children) {
          items[parentId].children = []
        }
        if (!items[parentId].children!.includes(node.id)) {
          items[parentId].children!.push(node.id)
        }
      }

      // Process children recursively
      if (node.children) {
        node.children.forEach((child) => processNode(child, node.id))
      }
    }

    data.forEach((node) => processNode(node, "root"))
    return items
  }, [data])

  const dataProvider = useMemo(
    () => new StaticTreeDataProvider(treeItems),
    [treeItems]
  )

  const handlePrimaryAction = (item: TreeItem<TreeItemData>) => {
    if (!item.isFolder && item.data.document) {
      setSelectedItems([item.index])
      onSelect(item.data.document)
    }
  }

  const handleSelectItems = (items: TreeItemIndex[]) => {
    setSelectedItems(items)
    // If a single item is selected and it's a document (not folder), trigger onSelect
    if (items.length === 1 && items[0] !== 'root') {
      const item = treeItems[items[0]]
      if (item && !item.isFolder && item.data.document) {
        onSelect(item.data.document)
      }
    }
  }

  const handleDrop = (items: TreeItem<TreeItemData>[], target: any) => {
    if (onMove && items.length > 0) {
      const draggedId = items[0].index as string
      let targetId: string | null
      let position: "before" | "after" | "child"

      if (target.targetType === "item") {
        // Dropping ON an item - make it a child
        targetId = target.targetItem === "root" ? null : (target.targetItem as string)
        position = "child"
      } else {
        // Dropping BETWEEN items
        const parentId = target.parentItem === "root" ? null : (target.parentItem as string)
        const parent = treeItems[target.parentItem]
        const siblings = parent?.children || []
        const childIndex = target.childIndex

        if (childIndex === 0) {
          // First position - use "child" of parent if we want it at the beginning
          // Or "before" the first sibling
          if (siblings.length > 0) {
            targetId = siblings[0] as string
            position = "before"
          } else {
            targetId = parentId
            position = "child"
          }
        } else {
          // Insert after the previous sibling
          targetId = siblings[childIndex - 1] as string
          position = "after"
        }
      }

      onMove(draggedId, targetId, position)
    }
  }

  const handleRenameItem = (item: TreeItem<TreeItemData>, name: string) => {
    if (onRename) {
      onRename(item.index as string, name)
    }
  }

  const startRenaming = (itemIndex: TreeItemIndex) => {
    if (treeRef.current) {
      treeRef.current.startRenamingItem("document-tree", itemIndex)
    }
  }

  // Sync selectedItems when activeId changes externally (e.g., from tab clicks)
  React.useEffect(() => {
    if (activeId) {
      setSelectedItems([activeId])
    } else {
      setSelectedItems([])
    }
  }, [activeId])

  // Create dynamic viewState that responds to activeId and selection changes
  const viewState = useMemo(() => ({
    "document-tree": {
      selectedItems,
      expandedItems,
    },
  }), [selectedItems, expandedItems])

  // Create a key that changes when data structure changes to force re-render
  const treeKey = useMemo(() => {
    return `tree-${data.length}-${data.map(d => d.id).join('-')}`
  }, [data])

  return (
    <div style={{ height: `${height}px` }} className="w-full">
      <UncontrolledTreeEnvironment
        key={treeKey}
        ref={treeRef}
        dataProvider={dataProvider}
        getItemTitle={(item) => item.data.name}
        viewState={viewState}
        onExpandItem={(item) => setExpandedItems(prev => [...prev, item.index])}
        onCollapseItem={(item) => setExpandedItems(prev => prev.filter(id => id !== item.index))}
        onSelectItems={(items) => handleSelectItems(items)}
        canDragAndDrop={true}
        canReorderItems={true}
        canDropOnFolder={true}
        canDropOnNonFolder={false}
        onPrimaryAction={handlePrimaryAction}
        onDrop={handleDrop}
        onRenameItem={handleRenameItem}
        renderItemTitle={({ title, item, context, info }) => {
          if (item.index === "root") return null

          const isFolder = item.isFolder
          const document = item.data.document

          const handleDelete = () => {
            if (onDelete && confirm(`Delete "${title}"?`)) {
              onDelete(item.index as string)
            }
          }

          const handleRename = () => {
            if (context.isRenaming) return
            startRenaming(item.index)
          }

          const handleDoubleClick = () => {
            if (!context.isRenaming) {
              startRenaming(item.index)
            }
          }

          // Show rename input when in renaming mode
          if (context.isRenaming) {
            return (
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  const input = e.currentTarget.querySelector('input')
                  if (input) {
                    info.submitRenameInput(input.value)
                  }
                }}
                className="flex items-center gap-1.5 px-1.5 py-0.5"
              >
                <input
                  ref={(input) => input?.focus()}
                  defaultValue={title}
                  onBlur={info.abortRenameInput}
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') {
                      info.abortRenameInput()
                    }
                  }}
                  className="flex-1 px-1 py-0.5 text-sm bg-background border border-input rounded focus:outline-none focus:ring-1 focus:ring-ring"
                  onClick={(e) => e.stopPropagation()}
                />
              </form>
            )
          }

          const handleDuplicate = () => {
            if (onDuplicate) {
              onDuplicate(item.index as string)
            }
          }

          const handleNewFile = () => {
            if (onNewFile) {
              onNewFile(isFolder ? (item.index as string) : null)
            }
          }

          const handleNewFolder = () => {
            if (onNewFolder) {
              onNewFolder(isFolder ? (item.index as string) : null)
            }
          }

          return (
            <ContextMenu>
              <ContextMenuTrigger asChild>
                <div
                  className={cn(
                    "flex items-center gap-1.5 px-1.5 py-0.5 cursor-pointer hover:bg-accent rounded-sm transition-colors",
                    context.isSelected && "bg-accent",
                    context.isFocused && "ring-1 ring-ring",
                    context.isDraggingOver && "bg-accent/50",
                  )}
                  onDoubleClick={handleDoubleClick}
                >
                  {isFolder ? (
                    <>
                      <ChevronRight
                        className={cn(
                          "h-3.5 w-3.5 shrink-0 transition-transform text-muted-foreground",
                          context.isExpanded && "rotate-90",
                        )}
                      />
                      {context.isExpanded ? (
                        <FolderOpen className="h-3.5 w-3.5 shrink-0 text-blue-500" />
                      ) : (
                        <Folder className="h-3.5 w-3.5 shrink-0 text-blue-500" />
                      )}
                    </>
                  ) : (
                    <File className="h-3.5 w-3.5 shrink-0 ml-4 text-muted-foreground" />
                  )}
                  <span className="text-sm truncate flex-1 text-sidebar-foreground">
                    {title || 'Untitled'}
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
        }}
      >
        <Tree treeId="document-tree" rootItem="root" treeLabel="Documents" />
      </UncontrolledTreeEnvironment>
    </div>
  )
}
