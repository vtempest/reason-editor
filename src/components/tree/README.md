# Document Tree Component

A comprehensive, feature-rich tree component for displaying hierarchical document structures with folders and files.

## Features

- ✅ **Hierarchical Structure**: Support for nested folders and documents
- ✅ **Drag & Drop**: Intuitive drag-and-drop functionality to reorganize items
- ✅ **Context Menu**: Right-click menu for common operations
- ✅ **Inline Rename**: Click to rename documents and folders
- ✅ **Search**: Built-in search functionality with auto-expand
- ✅ **Tag Support**: Display document tags inline
- ✅ **Visual Feedback**: Hover states, drag indicators, and drop zones
- ✅ **Keyboard Navigation**: Full keyboard support
- ✅ **TypeScript**: Full type safety with comprehensive interfaces

## Usage

```tsx
import { DocumentTree, sampleTreeData } from '@/components/tree';

function App() {
  const [activeId, setActiveId] = useState<string | null>(null);

  return (
    <DocumentTree
      data={sampleTreeData}
      activeId={activeId}
      onSelect={(id) => setActiveId(id)}
      onToggle={(id, isOpen) => console.log('Toggle', id, isOpen)}
      onRename={(id, newName) => console.log('Rename', id, newName)}
      onDelete={(id) => console.log('Delete', id)}
      onAddChild={(parentId, isFolder) => console.log('Add child', parentId, isFolder)}
      onAddSibling={(siblingId, isFolder) => console.log('Add sibling', siblingId, isFolder)}
      onDuplicate={(id) => console.log('Duplicate', id)}
    />
  );
}
```

## Props

### DocumentTreeProps

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `data` | `TreeItemData` | Yes | The root tree data structure |
| `activeId` | `string \| null` | Yes | ID of the currently active/selected item |
| `onSelect` | `(id: string) => void` | Yes | Callback when an item is selected |
| `onToggle` | `(id: string, isOpen: boolean) => void` | No | Callback when a folder is expanded/collapsed |
| `onRename` | `(id: string, newName: string) => void` | No | Callback when an item is renamed |
| `onDelete` | `(id: string) => void` | No | Callback when an item is deleted |
| `onAddChild` | `(parentId: string, isFolder: boolean) => void` | No | Callback when a child is added |
| `onAddSibling` | `(siblingId: string, isFolder: boolean) => void` | No | Callback when a sibling is added |
| `onDuplicate` | `(id: string) => void` | No | Callback when an item is duplicated |
| `onManageTags` | `(id: string) => void` | No | Callback when managing tags |
| `onArchive` | `(id: string) => void` | No | Callback when archiving an item |
| `onMove` | `(draggedId: string, targetId: string, position: 'before' \| 'after' \| 'inside') => void` | No | Callback when an item is moved via drag-and-drop |

## Data Structure

```typescript
interface TreeItemData {
  id: string;              // Unique identifier
  name: string;            // Display name
  isFolder: boolean;       // Whether this is a folder or document
  isOpen?: boolean;        // Whether folder is expanded
  children?: TreeItemData[]; // Child items (for folders)
  tags?: string[];         // Optional tags for the document
  isArchived?: boolean;    // Whether the item is archived
  isDeleted?: boolean;     // Whether the item is deleted
  content?: string;        // Document content
  createdAt?: Date | string;  // Creation timestamp
  updatedAt?: Date | string;  // Last update timestamp
}
```

## Context Menu Operations

Right-click on any tree item to access:

- **Add Child** (folders only)
  - Document
  - Folder
- **Add Sibling**
  - Document
  - Folder
- **Rename** - Edit item name inline
- **Duplicate** - Create a copy
- **Manage Tags** - Open tag management (if handler provided)
- **Archive** - Archive the item (if handler provided)
- **Delete** - Remove the item

## Drag and Drop

Items can be dragged and dropped to reorder or move them:

1. **Before**: Drop above an item to insert before it
2. **After**: Drop below an item to insert after it
3. **Inside**: Drop in the middle of a folder to move inside it

Visual indicators show where the item will be dropped:
- Blue line above/below for before/after
- Blue ring around folder for inside
- Dragged item becomes semi-transparent

## Search Functionality

The built-in search bar allows filtering documents:
- Type to search by document name (case-insensitive)
- Matching items and their ancestors are shown
- Folders auto-expand during search
- Clear search to restore full tree

## Styling

The component uses Tailwind CSS and shadcn/ui components. It respects the theme through CSS variables:

- `bg-sidebar-background`: Background color
- `text-sidebar-foreground`: Text color
- `border-sidebar-border`: Border color
- `bg-accent`: Hover and active states
- `text-primary`: Tag colors and highlights
- `text-destructive`: Delete action color

## Keyboard Support

- **Enter**: Confirm rename
- **Escape**: Cancel rename
- **Click**: Select item
- **Right-click**: Open context menu
- **Drag**: Reorder items

## Tag Display

Documents can display tags inline:
- Up to 2 tags are shown directly
- Additional tags show a "+N" indicator
- Tags appear with colored badges next to the document name
- Click "Manage Tags" in context menu to edit

## Example Data

Sample data is provided in `sampleData.ts` for testing and reference.
