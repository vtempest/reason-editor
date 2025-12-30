# Shared File System

## Overview

The Reason Editor now uses a **unified file system** stored in localStorage that is shared between:
- **FileManagerModal** (`@cubone/react-file-manager`)
- **DocumentTree** (File tree in components/Tree)
- **API Routes** (`/api/files/*`)

This ensures consistent data across all file browsing interfaces.

## Storage Location

All file system data is stored in localStorage under the key:
```
REASON-file-system
```

## Data Structure

```typescript
interface FileSystemItem {
  id: string;              // Unique path-based ID (e.g., "/src/App.tsx")
  name: string;            // File/folder name
  type: "file" | "folder"; // Item type
  parentId: string | null; // Parent folder ID (null for root)
  size?: number;           // File size in bytes
  content?: string;        // File content (for files)
  createdAt: string;       // ISO date string
  updatedAt: string;       // ISO date string
  isExpanded?: boolean;    // Folder expansion state (for tree view)
}
```

## Usage

### Import the Utility

```typescript
import {
  getFileSystem,
  saveFileSystem,
  getFileSystemItem,
  createFileSystemItem,
  updateFileSystemItem,
  deleteFileSystemItem,
  renameFileSystemItem,
  moveFileSystemItem,
  toggleExpanded,
  resetFileSystem,
  toCuboneFormat,
  toMockFsFormat,
} from "@/lib/fileSystem";
```

### Common Operations

#### Get All Files

```typescript
const allFiles = getFileSystem();
```

#### Get a Specific File/Folder

```typescript
const file = getFileSystemItem("/src/App.tsx");
```

#### Get Children of a Folder

```typescript
import { getChildren } from "@/lib/fileSystem";
const children = getChildren("/src"); // Get all items in /src folder
```

#### Create a New File

```typescript
const newFile = createFileSystemItem(
  "example.ts",           // name
  "file",                 // type
  "/src",                 // parentId
  "console.log('Hi!');"   // content (optional)
);
```

#### Create a New Folder

```typescript
const newFolder = createFileSystemItem(
  "utils",    // name
  "folder",   // type
  "/src",     // parentId
);
```

#### Update a File

```typescript
updateFileSystemItem("/src/App.tsx", {
  content: "// Updated content",
  size: 18,
});
```

#### Rename a File/Folder

```typescript
const success = renameFileSystemItem("/src/App.tsx", "Application.tsx");
// This updates the ID from /src/App.tsx to /src/Application.tsx
// and updates all children paths if it's a folder
```

#### Move a File/Folder

```typescript
const success = moveFileSystemItem("/src/App.tsx", "/components");
// Moves from /src/App.tsx to /components/App.tsx
```

#### Delete a File/Folder

```typescript
const success = deleteFileSystemItem("/src/utils");
// Deletes the folder and ALL its children
```

#### Toggle Folder Expansion

```typescript
toggleExpanded("/src"); // Toggle open/closed state for tree view
```

#### Reset to Default Data

```typescript
resetFileSystem(); // Resets to the default mock file system
```

## Component Integration

### FileManagerModal

The FileManagerModal automatically uses the shared file system:

```typescript
// The component now automatically loads from getFileSystem()
<FileManagerModal open={isOpen} onOpenChange={setIsOpen} />
```

The data is automatically converted to Cubone format using `toCuboneFormat()`.

### DocumentTree / Mock FS

The mock file system now loads from the shared source:

```typescript
import { getMockFs } from "@/components/Tree/containers/mock-fs";

const fileSystem = getMockFs();
// Returns Record<string, { name: string; type: "file" | "dir" }[]>
```

### Old FileManager Data

For backward compatibility, `getData()` still works:

```typescript
import { getData } from "@/components/editor/modals/filemanager-data";

const files = getData(); // Returns FileItem[]
```

This now pulls from the shared file system instead of static data.

## API Routes

### GET /api/files

Get all files in the system.

**Query Parameters:**
- `parentId` - Filter by parent folder (optional)
- `type` - Filter by type: 'file' or 'folder' (optional)

**Response:**
```json
{
  "success": true,
  "message": "Use getFileSystem() from @/lib/fileSystem on the client-side"
}
```

### POST /api/files

Create a new file or folder.

**Request Body:**
```json
{
  "name": "example.ts",
  "type": "file",
  "parentId": "/src",
  "content": "console.log('Hello');"
}
```

### GET /api/files/[id]

Get a specific file by ID (URL-encoded path).

**Example:** `GET /api/files/%2Fsrc%2FApp.tsx`

### PUT /api/files/[id]

Update a file or folder.

**Request Body:**
```json
{
  "content": "// Updated",
  "size": 11
}
```

### DELETE /api/files/[id]

Delete a file or folder (and all children).

### PATCH /api/files/[id]

Rename a file or folder.

**Request Body:**
```json
{
  "newName": "NewFileName.tsx"
}
```

## Important Notes

### localStorage Limitations

- **Client-side only**: localStorage only works in the browser, not in server-side API routes
- **Storage limit**: Most browsers limit localStorage to 5-10MB
- **Synchronous**: All operations are synchronous
- **String storage**: Data is JSON stringified/parsed

### Production Considerations

For production use, consider:

1. **Server-side storage**: Replace localStorage with a database (Turso, PostgreSQL, etc.)
2. **File uploads**: Implement actual file upload handling (S3, R2, local disk)
3. **Authentication**: Add user-based file isolation
4. **Permissions**: Implement file/folder permissions
5. **Versioning**: Add file version history
6. **Real-time sync**: Use WebSockets for multi-user collaboration
7. **Search/indexing**: Add full-text search capabilities

## Migration from Old System

### Before (filemanager-data.ts)

```typescript
import { getData } from "./filemanager-data";
const files = getData();
```

### After (shared system)

```typescript
import { getFileSystem } from "@/lib/fileSystem";
const files = getFileSystem();
```

### Before (mock-fs.ts)

```typescript
import { mockFs } from "./mock-fs";
const rootFiles = mockFs["/"];
```

### After (shared system)

```typescript
import { getMockFs } from "./mock-fs";
const mockFs = getMockFs();
const rootFiles = mockFs["/"];
```

## Default File Structure

The default mock file system includes:

```
/
├── documents/
│   ├── notes.txt
│   ├── research.md
│   └── report.pdf
├── images/
│   ├── screenshot.png
│   └── diagram.svg
├── projects/
│   └── web-app/
│       ├── index.html
│       ├── styles.css
│       └── script.js
├── src/
│   ├── components/
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   └── Modal.tsx
│   ├── lib/
│   │   ├── utils.ts
│   │   └── api.ts
│   ├── App.tsx
│   └── index.tsx
├── public/
│   ├── index.html
│   └── favicon.ico
├── package.json
├── README.md
├── readme.md
└── config.json
```

## Testing

To reset the file system during development:

```typescript
import { resetFileSystem } from "@/lib/fileSystem";

// In your component or dev console:
resetFileSystem();
```

To inspect the current file system:

```typescript
import { getFileSystem } from "@/lib/fileSystem";

// In browser console:
console.table(getFileSystem());
```

## Future Enhancements

Potential improvements:

1. **Conflict resolution**: Handle concurrent updates
2. **Undo/redo**: Implement operation history
3. **Trash/archive**: Soft delete functionality
4. **File watching**: Detect external changes
5. **Compression**: Store large files compressed
6. **Encryption**: Encrypt sensitive file content
7. **Cloud sync**: Sync with cloud storage providers
8. **Offline support**: ServiceWorker for offline access

## Support

For issues or questions about the shared file system:

1. Check the source code: `src/lib/fileSystem.ts`
2. Review API routes: `src/app/api/files/`
3. See component usage: `src/components/editor/modals/FileManagerModal.tsx`
