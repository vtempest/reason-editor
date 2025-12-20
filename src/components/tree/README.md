# Document Tree Component

A feature-rich tree component for displaying hierarchical document structures with folders, files, and context menu operations.

## Features

- **Hierarchical Structure**: Support for nested folders and documents
- **Context Menu**: Right-click menu with operations like rename, delete, duplicate, add child/sibling
- **Inline Editing**: Click rename to edit items inline
- **Folder Icons**: Visual distinction between folders and documents
- **Expand/Collapse**: Toggle folder visibility
- **Active Selection**: Highlight currently selected item

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

## Data Structure

```typescript
interface TreeItemData {
  id: string;           // Unique identifier
  name: string;         // Display name
  isFolder: boolean;    // Whether this is a folder or document
  isOpen?: boolean;     // Whether folder is expanded
  children?: TreeItemData[]; // Child items (for folders)
}
```

## Context Menu Operations

Right-click on any tree item to access:

- **Add Child** (folders only): Add a document or folder as a child
- **Add Sibling**: Add a document or folder at the same level
- **Rename**: Edit the item name inline
- **Duplicate**: Create a copy of the item
- **Delete**: Remove the item

## Styling

The component uses Tailwind CSS and shadcn/ui components. It respects the theme through CSS variables:

- `bg-sidebar-background`: Background color
- `text-sidebar-foreground`: Text color
- `border-sidebar-border`: Border color
- `bg-accent`: Hover and active states

## Example Data

Sample data is provided in `sampleData.ts` for testing and reference.
