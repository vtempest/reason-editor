"use client"

import React, { useMemo, useState, useCallback } from "react"
import {
  createFileTree,
  isDir,
  isFile,
  Node,
  useDnd,
  useHotkeys,
  useObserver,
  useRovingFocus,
  useSelections,
  useTraits,
  useVirtualize,
  type Dir,
} from "exploration"
import { createStyles } from "@dash-ui/styles"
import reset from "@dash-ui/reset"
import { VscFolder, VscFolderOpened, VscFile } from "react-icons/vsc"
import * as colors from "@radix-ui/colors"
import type { Document } from "@/lib/db/schema"
import type { DocumentNode } from "@/lib/document-utils"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubTrigger,
  ContextMenuSubContent,
} from "@/components/ui/context-menu"
import { Plus, Trash2, Copy, Edit, FolderPlus, FileText, Folder } from "lucide-react"

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

interface DocumentMeta {
  id: string
  document: Document
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
  height,
}: DocumentTreeProps) {
  const windowRef = React.useRef<HTMLDivElement | null>(null)
  const [renamingId, setRenamingId] = useState<number | null>(null)
  const [renameValue, setRenameValue] = useState("")
  const inputRef = React.useRef<HTMLInputElement | null>(null)

  // Create the tree with root nodes
  const tree = useMemo(() => {
    // Helper to find node in tree structure
    const findNode = (nodes: DocumentNode[], path: string): DocumentNode | null => {
      for (const node of nodes) {
        if (node.id === path || node.name === path) return node
        if (node.children) {
          const found = findNode(node.children, path)
          if (found) return found
        }
      }
      return null
    }

    const treeInstance = createFileTree<DocumentMeta>(
      (parent: Dir<DocumentMeta>, { createFile, createDir }) => {
        // Root level - return the top-level nodes
        if (!parent.meta || parent.path === '/') {
          return Promise.resolve(
            data.map((node) => {
              const meta: DocumentMeta = {
                id: node.id,
                document: node.data,
              }

              if (node.data.isFolder) {
                return createDir(
                  {
                    name: node.name || 'Untitled',
                    meta,
                  },
                  node.data.isExpanded === 1
                )
              }
              return createFile({
                name: node.name || 'Untitled',
                meta,
              })
            })
          )
        }

        // Find the node by the parent's path
        const node = findNode(data, parent.meta.id)

        if (!node || !node.children) {
          return Promise.resolve([])
        }

        return Promise.resolve(
          node.children.map((child) => {
            const meta: DocumentMeta = {
              id: child.id,
              document: child.data,
            }

            if (child.data.isFolder) {
              return createDir(
                {
                  name: child.name || 'Untitled',
                  meta,
                },
                child.data.isExpanded === 1
              )
            }
            return createFile({
              name: child.name || 'Untitled',
              meta,
            })
          })
        )
      },
      {
        root: { name: '/' },
      }
    )

    // Load root directory
    treeInstance.expand(treeInstance.root)

    return treeInstance
  }, [data])

  const rovingFocus = useRovingFocus(tree)
  const selections = useSelections(tree)
  const traits = useTraits(tree, ["selected", "focused", "drop-target"])
  const dnd = useDnd(tree, { windowRef })
  const virtualize = useVirtualize(tree, { windowRef, nodeHeight: 24 })
  useHotkeys(tree, { windowRef, rovingFocus, selections })

  useObserver(selections.didChange, (value) => {
    const selected = Array.from(value)
    traits.set("selected", selected)

    if (selected.length === 1) {
      const node = tree.getById(selected[0])

      if (node && isFile(node) && node.meta) {
        onSelect(node.meta.document)
      }
    }
  })

  useObserver(rovingFocus.didChange, (value) => {
    traits.set("focused", [value])
  })

  useObserver(dnd.didChange, (event) => {
    if (!event) return

    if (event.type === "enter" || event.type === "expanded") {
      if (event.node.parentId === event.dir.id) {
        return traits.clear("drop-target")
      }

      const nodes = event.dir.nodes ? [...event.dir.nodes] : []
      const nodeIds: number[] = [event.dir.id, ...nodes]
      let nodeId: number | undefined

      while ((nodeId = nodes.pop())) {
        const node = tree.getById(nodeId)

        if (node) {
          if (isDir(node) && node.nodes) {
            nodeIds.push(...node.nodes)
            nodes.push(...node.nodes)
          }
        }
      }

      traits.set("drop-target", nodeIds)
    } else if (event.type === "drop") {
      traits.clear("drop-target")
      const selected = new Set(selections.narrow())

      if (
        event.node === event.dir ||
        (selected.has(event.node.id) && selected.has(event.dir.id))
      ) {
        return
      }

      if (selected.has(event.node.id)) {
        const moveSelections = async () => {
          if (!tree.isVisible(event.dir)) {
            await tree.expand(event.dir)
          }

          const promises: Promise<void>[] = []

          for (const id of selected) {
            const node = tree.getById(id)

            if (node) {
              promises.push(tree.move(node, event.dir))

              // Call onMove callback if provided
              if (onMove && node.meta && event.dir.meta) {
                onMove(node.meta.id, event.dir.meta.id, "child")
              }
            }
          }

          await Promise.all(promises)
        }

        moveSelections()
        selections.clear()
      } else {
        // Move in tree first for visual update
        tree.move(event.node, event.dir)

        // Then call onMove callback if provided
        if (onMove && event.node.meta && event.dir.meta) {
          onMove(event.node.meta.id, event.dir.meta.id, "child")
        }
      }
    } else if (event.type === "end") {
      traits.clear("drop-target")
    }
  })

  const plugins = [traits, rovingFocus, selections, dnd]

  // Handle rename start
  const handleRenameStart = useCallback((nodeId: number, currentName: string) => {
    setRenamingId(nodeId)
    setRenameValue(currentName)
    setTimeout(() => {
      inputRef.current?.focus()
      inputRef.current?.select()
    }, 0)
  }, [])

  // Handle rename submit
  const handleRenameSubmit = useCallback(() => {
    if (renamingId !== null && renameValue.trim()) {
      const node = tree.getById(renamingId)
      if (node?.meta && onRename) {
        onRename(node.meta.id, renameValue.trim())
      }
    }
    setRenamingId(null)
    setRenameValue("")
  }, [renamingId, renameValue, tree, onRename])

  // Handle rename cancel
  const handleRenameCancel = useCallback(() => {
    setRenamingId(null)
    setRenameValue("")
  }, [])

  // Focus input when renaming starts
  React.useEffect(() => {
    if (renamingId !== null && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [renamingId])

  return (
    <div ref={windowRef} className={explorerStyles()} style={{ height: `${height}px` }}>
      <div {...virtualize.props}>
        {virtualize.map((props) => {
          const isRenaming = renamingId === props.node.id
          const nodeParentId = props.node.parentId ? tree.getById(props.node.parentId)?.meta?.id : null

          return (
            <ContextMenu key={props.node.id}>
              <ContextMenuTrigger asChild>
                <Node
                  plugins={plugins}
                  {...props}
                  onDoubleClick={() => {
                    if (!isRenaming) {
                      handleRenameStart(props.node.id, props.node.basename)
                    }
                  }}
                >
                  {isDir(props.node) ? (
                    props.node.expanded ? (
                      <VscFolderOpened />
                    ) : (
                      <VscFolder />
                    )
                  ) : (
                    <VscFile />
                  )}

                  {isRenaming ? (
                    <input
                      ref={inputRef}
                      type="text"
                      value={renameValue}
                      onChange={(e) => setRenameValue(e.target.value)}
                      onBlur={handleRenameSubmit}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleRenameSubmit()
                        } else if (e.key === "Escape") {
                          handleRenameCancel()
                        }
                      }}
                      className="flex-1 bg-transparent outline-none border border-blue-500 px-1"
                      onClick={(e) => e.stopPropagation()}
                    />
                  ) : (
                    <span>{props.node.basename}</span>
                  )}
                </Node>
              </ContextMenuTrigger>
              <ContextMenuContent className="w-56">
                <ContextMenuSub>
                  <ContextMenuSubTrigger>
                    <FolderPlus className="mr-2 h-4 w-4" />
                    Add Child
                  </ContextMenuSubTrigger>
                  <ContextMenuSubContent>
                    <ContextMenuItem
                      onClick={() => {
                        if (onNewFile && props.node.meta) {
                          onNewFile(isDir(props.node) ? props.node.meta.id : nodeParentId)
                        }
                      }}
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      Note
                    </ContextMenuItem>
                    <ContextMenuItem
                      onClick={() => {
                        if (onNewFolder && props.node.meta) {
                          onNewFolder(isDir(props.node) ? props.node.meta.id : nodeParentId)
                        }
                      }}
                    >
                      <Folder className="mr-2 h-4 w-4" />
                      Folder
                    </ContextMenuItem>
                  </ContextMenuSubContent>
                </ContextMenuSub>
                <ContextMenuSub>
                  <ContextMenuSubTrigger>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Sibling
                  </ContextMenuSubTrigger>
                  <ContextMenuSubContent>
                    <ContextMenuItem
                      onClick={() => {
                        if (onNewFile) {
                          onNewFile(nodeParentId)
                        }
                      }}
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      Note
                    </ContextMenuItem>
                    <ContextMenuItem
                      onClick={() => {
                        if (onNewFolder) {
                          onNewFolder(nodeParentId)
                        }
                      }}
                    >
                      <Folder className="mr-2 h-4 w-4" />
                      Folder
                    </ContextMenuItem>
                  </ContextMenuSubContent>
                </ContextMenuSub>
                <ContextMenuSeparator />
                <ContextMenuItem
                  onClick={() => {
                    handleRenameStart(props.node.id, props.node.basename)
                  }}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Rename
                </ContextMenuItem>
                <ContextMenuItem
                  onClick={() => {
                    if (onDuplicate && props.node.meta) {
                      onDuplicate(props.node.meta.id)
                    }
                  }}
                >
                  <Copy className="mr-2 h-4 w-4" />
                  Duplicate
                </ContextMenuItem>
                <ContextMenuSeparator />
                <ContextMenuItem
                  onClick={() => {
                    if (onDelete && props.node.meta) {
                      onDelete(props.node.meta.id)
                    }
                  }}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </ContextMenuItem>
              </ContextMenuContent>
            </ContextMenu>
          )
        })}
      </div>
    </div>
  )
}

const styles = createStyles({
  themes: {
    light: {
      colors: {
        ...colors,
        textColor: colors.slate.slate12,
        bgColor: colors.blue.blue1,

        selected: {
          textColor: colors.blue.blue11,
        },

        focused: {
          bgColor: colors.blue.blue3,
          borderColor: colors.blue.blue11,
        },

        dropTarget: {
          bgColor: colors.blue.blue4,
        },
      },
    },
    dark: {
      colors: {
        ...colors,
        textColor: colors.slate.slate2,
        bgColor: colors.slate.slate12,

        selected: {
          textColor: colors.blue.blue9,
        },

        focused: {
          bgColor: colors.blackA.blackA10,
          borderColor: colors.blue.blue9,
        },

        dropTarget: {
          bgColor: colors.whiteA.whiteA5,
        },
      },
    },
  },
})

const explorerStyles = styles.one((t) => ({
  background: t.colors.bgColor,
  color: t.colors.textColor,
  width: "100%",
  overflow: "auto",

  ...[...Array(20).keys()].reduce((acc, depth) => {
    acc[`[data-exploration-depth="${depth}"]`] = {
      display: "flex",
      gap: "0.3333em",
      alignItems: "center",
      width: "100%",
      paddingLeft: `${depth}rem`,
      borderStyle: "solid",
      borderWidth: 1,
      borderColor: "transparent",
      "*:last-child": {
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
      },
    }

    return acc
  }, {} as Style),

  svg: {
    opacity: 0.5,
  },

  '[data-exploration-type="dir"] svg': {
    opacity: 1,
    color: t.colors.amberDark.amber9,
  },

  ".selected": {
    color: t.colors.selected.textColor,
  },

  ".focused": {
    borderColor: t.colors.focused.borderColor,
    backgroundColor: t.colors.focused.bgColor,
    outline: "none",
  },

  ".drop-target": {
    backgroundColor: t.colors.dropTarget.bgColor,
  },
}))

styles.insertGlobal(reset)

type Style = { [key: string]: React.CSSProperties | Style }
