import React, { FocusEvent, KeyboardEvent } from "react";
import { ChevronRight, FileText, Folder } from "lucide-react";
import { NodeRendererProps, NodeHandlers } from "../types";
import { Document } from "@/components/editor/DocumentTree";
import { DocumentContextMenu } from "@/components/editor/DocumentContextMenu";
import { cn } from "@/lib/utils";

type FormProps = { defaultValue: string } & NodeHandlers;

function RenameForm({ defaultValue, submit, reset }: FormProps) {
  const inputProps = {
    defaultValue,
    autoFocus: true,
    className: "bg-sidebar-background text-sidebar-foreground px-1 py-0.5 rounded outline-none focus:ring-2 focus:ring-sidebar-primary",
    onBlur: (e: FocusEvent<HTMLInputElement>) => {
      submit(e.currentTarget.value);
    },
    onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => {
      switch (e.key) {
        case "Enter":
          submit(e.currentTarget.value);
          break;
        case "Escape":
          reset();
          break;
      }
    }
  };

  return <input type="text" {...inputProps} />;
}

function ToggleButton({ toggle, isOpen, isFolder, isSelected }: any) {
  if (isFolder) {
    return (
      <button
        tabIndex={-1}
        onClick={toggle}
        className="flex items-center justify-center w-5 h-5 transition-transform"
      >
        <ChevronRight
          className={cn(
            "w-3 h-3 transition-transform",
            isOpen && "rotate-90"
          )}
        />
      </button>
    );
  } else {
    return <div className="w-5 h-5" />;
  }
}

function Icon({ isFolder, isSelected }: any) {
  const iconClass = "w-4 h-4 flex-shrink-0";

  if (isFolder) {
    return (
      <Folder
        className={cn(iconClass, "text-blue-500")}
      />
    );
  } else {
    return (
      <FileText
        className={cn(iconClass, "text-muted-foreground")}
      />
    );
  }
}

export const DocumentNode = ({
  innerRef,
  data,
  styles,
  state,
  handlers,
  tree
}: NodeRendererProps<Document>) => {
  const folder = data.isFolder || (Array.isArray(data.children) && data.children.length > 0);
  const open = state.isOpen;
  const name = data.title || "Untitled";

  // Get context menu handlers from the tree API
  const handleAddChild = () => {
    // This will be handled by the parent component
    (tree as any).onAddChild?.(data.id, false);
  };

  const handleAddChildFolder = () => {
    (tree as any).onAddChild?.(data.id, true);
  };

  const handleAddSibling = () => {
    (tree as any).onAddSibling?.(data.id, false);
  };

  const handleAddSiblingFolder = () => {
    (tree as any).onAddSibling?.(data.id, true);
  };

  const handleDuplicate = () => {
    (tree as any).onDuplicate?.(data.id);
  };

  const handleDelete = () => {
    (tree as any).onDelete?.(data.id);
  };

  const handleManageTags = () => {
    (tree as any).onManageTags?.(data.id);
  };

  const handleClick = (e: React.MouseEvent) => {
    handlers.select(e, { selectOnClick: true });
    // Also notify the parent to select this document
    if ((tree as any).onDocumentSelect) {
      (tree as any).onDocumentSelect(data.id);
    }
  };

  return (
    <DocumentContextMenu
      onAddChild={handleAddChild}
      onAddChildFolder={handleAddChildFolder}
      onAddSibling={handleAddSibling}
      onAddSiblingFolder={handleAddSiblingFolder}
      onRename={() => handlers.edit()}
      onDuplicate={handleDuplicate}
      onDelete={handleDelete}
      onManageTags={handleManageTags}
    >
      <div
        ref={innerRef}
        style={styles.row}
        className={cn(
          "cursor-pointer select-none",
          state.isSelected && "bg-sidebar-accent font-medium",
          state.isDragging && "opacity-50"
        )}
        onClick={handleClick}
      >
        <div
          className="flex items-center gap-1 px-2 py-1.5 hover:bg-sidebar-accent rounded-md transition-colors"
          style={styles.indent}
        >
          <ToggleButton
            toggle={handlers.toggle}
            isOpen={open}
            isFolder={folder}
            isSelected={state.isSelected}
          />
          <Icon isFolder={folder} isSelected={state.isSelected} />
          {state.isEditing ? (
            <RenameForm defaultValue={name} {...handlers} />
          ) : (
            <span className="truncate text-sm flex-1">{name}</span>
          )}
        </div>
      </div>
    </DocumentContextMenu>
  );
};
