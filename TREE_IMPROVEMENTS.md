# Tree Menu Improvements

This document describes the enhanced tree menu implementation with right-click menu, drag-and-drop functionality using `react-complex-tree`, and Next.js-style API backend.

## 🎯 Features Implemented

### 1. **React Complex Tree Integration**
- Replaced custom HTML5 drag-drop with professional `react-complex-tree` library
- Enhanced drag-and-drop UX with visual feedback
- Support for three drop positions: before, after, and child
- Tree state management with expand/collapse
- Keyboard navigation support
- Accessibility improvements (ARIA labels)

### 2. **Enhanced Right-Click Context Menu**
- **Add Child Note** - Create a new child under the selected node
- **Add Sibling Note** - Create a sibling at the same level
- **Rename** - Focus on the selected document for editing
- **Duplicate** - Copy the document (without children)
- **Delete** - Remove document and all descendants
- Integrated seamlessly with react-complex-tree

### 3. **Professional API Backend**
- Express.js REST API server
- Full CRUD operations for documents
- Hierarchical document management
- Search functionality
- Bulk sync operations
- TypeScript support throughout
- CORS enabled for frontend access

## 📁 New Files Created

```
setup-a-lot/
├── src/
│   ├── components/
│   │   └── ComplexDocumentTree.tsx    # New tree component using react-complex-tree
│   └── lib/
│       └── api.ts                      # API client for backend communication
├── server/
│   ├── server.ts                       # Express server entry point
│   ├── types.ts                        # TypeScript interfaces
│   ├── database.ts                     # In-memory database
│   └── routes/
│       └── documents.ts                # Document CRUD endpoints
├── .env.example                        # Environment configuration template
├── API_README.md                       # API documentation
└── TREE_IMPROVEMENTS.md                # This file
```

## 🚀 Getting Started

### Installation

The necessary packages are already installed:
- `react-complex-tree` - Professional tree component
- `express` - Web server framework
- `cors` - Cross-origin resource sharing
- `tsx` - TypeScript execution

### Running the Application

#### Option 1: Frontend Only (Current State)

```bash
npm run dev
```

This uses local storage for persistence (no backend needed).

#### Option 2: With Backend API

**Terminal 1 - Start API Server:**
```bash
npm run server:watch
```

**Terminal 2 - Start Frontend:**
```bash
npm run dev
```

- Frontend: `http://localhost:5173`
- API: `http://localhost:3001/api`
- Health Check: `http://localhost:3001/health`

### Configuration

Create a `.env` file from the example:

```bash
cp .env.example .env
```

Edit `.env`:
```env
VITE_API_URL=http://localhost:3001/api
PORT=3001
```

## 🎨 New Tree Component Features

### ComplexDocumentTree.tsx

The new tree component provides:

#### **Drag and Drop**
- Click and hold on any document to start dragging
- Visual indicators show valid drop zones
- Three drop positions:
  - **Before** - Insert above target (horizontal line indicator)
  - **After** - Insert below target (horizontal line indicator)
  - **Child** - Make it a child of target (outline indicator)
- Prevents invalid moves (can't move parent into child)

#### **Right-Click Context Menu**
Right-click any document to access:
- Add Child Note
- Add Sibling Note
- Rename
- Duplicate
- Delete

#### **Visual Enhancements**
- Smooth transitions for expand/collapse
- Hover states with background highlight
- Selected document highlighting
- Drag-over visual feedback
- Indentation based on tree depth

#### **Custom Styling**
The component includes embedded CSS that integrates with your existing Tailwind theme:
- Uses CSS custom properties for theming
- Respects sidebar color scheme
- Responsive to hover and focus states

## 🔌 API Integration

### API Client Usage

Import the API client in your components:

```typescript
import { documentsApi } from '@/lib/api';

// Get all documents
const docs = await documentsApi.getAll();

// Create a document
const newDoc = await documentsApi.create({
  title: 'My Note',
  content: '# Hello World',
  parentId: null
});

// Update a document
await documentsApi.update(docId, {
  title: 'Updated Title',
  content: 'New content'
});

// Delete a document
await documentsApi.delete(docId);

// Duplicate a document
const copy = await documentsApi.duplicate(docId);

// Move a document
await documentsApi.move(draggedId, targetId, 'child');

// Search documents
const results = await documentsApi.search('search query');
```

### API Endpoints

See `API_README.md` for complete API documentation.

**Base URL:** `http://localhost:3001/api`

**Available Endpoints:**
- `GET /documents` - Get all documents
- `GET /documents/:id` - Get single document
- `POST /documents` - Create document
- `PUT /documents/:id` - Update document
- `DELETE /documents/:id` - Delete document
- `POST /documents/:id/duplicate` - Duplicate document
- `POST /documents/move` - Move document
- `GET /documents/search/:query` - Search documents
- `POST /documents/bulk` - Bulk sync

## 🎯 Tree Component Props

```typescript
interface ComplexDocumentTreeProps {
  documents: Document[];              // Array of documents
  activeId: string | null;            // Currently selected document ID
  onSelect: (id: string) => void;     // Called when document is selected
  onAdd: (parentId: string | null) => void;  // Called to add new document
  onDelete: (id: string) => void;     // Called to delete document
  onDuplicate: (id: string) => void;  // Called to duplicate document
  onToggleExpand: (id: string) => void; // Called to expand/collapse
  onMove: (draggedId: string, targetId: string | null, position: 'before' | 'after' | 'child') => void;
}
```

## 📊 Data Structure

```typescript
interface Document {
  id: string;                // Unique identifier
  title: string;             // Document title
  content: string;           // Markdown content
  parentId: string | null;   // Parent document ID (null for root)
  children?: Document[];     // Computed child documents
  isExpanded?: boolean;      // Expansion state
  createdAt?: string;        // ISO timestamp
  updatedAt?: string;        // ISO timestamp
}
```

## 🔄 Migration from Old to New Tree

The new `ComplexDocumentTree` is a drop-in replacement for `DraggableDocumentTree`:

**Before:**
```typescript
import { DraggableDocumentTree } from '@/components/DraggableDocumentTree';
```

**After:**
```typescript
import { ComplexDocumentTree } from '@/components/ComplexDocumentTree';
```

The component interface is identical, so no other changes are needed!

## 🎨 Customization

### Styling

The tree component uses:
- Tailwind CSS utilities
- CSS custom properties from your theme
- Embedded styles for react-complex-tree

To customize colors, edit the embedded `<style>` block in `ComplexDocumentTree.tsx`:

```css
.complex-tree-wrapper .rct-tree-item-title-container {
  /* Customize appearance */
}
```

### Behavior

Adjust drag-drop behavior in the `handleDrop` function:

```typescript
const handleDrop = (items, target) => {
  // Custom logic here
};
```

## 🔧 Development Tips

### Testing Drag-Drop

1. Click and hold on any document title
2. Drag to desired location
3. Watch for visual indicators
4. Release to drop

### Testing Context Menu

1. Right-click on any document
2. Select an action
3. Verify the operation

### Debugging

Enable console logs in:
- `server/server.ts` - API requests
- `ComplexDocumentTree.tsx` - Tree operations

## 🚀 Production Deployment

### Database Migration

The current implementation uses in-memory storage. For production:

1. Replace `server/database.ts` with real database (PostgreSQL, MongoDB, etc.)
2. Implement proper connection pooling
3. Add database migrations
4. Use environment variables for connection strings

### Example with PostgreSQL:

```typescript
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = {
  async getAllDocuments() {
    const result = await pool.query('SELECT * FROM documents');
    return result.rows;
  },
  // ... other methods
};
```

### Security Considerations

Add to production:
- Authentication middleware
- Rate limiting
- Input validation with Zod
- SQL injection prevention (use parameterized queries)
- XSS protection
- HTTPS enforcement

## 📚 Additional Resources

- [react-complex-tree Documentation](https://rct.lukasbach.com/)
- [Express.js Guide](https://expressjs.com/)
- API_README.md - Complete API documentation
- TREE_IMPROVEMENTS.md - This file

## 🎉 Summary

You now have:
✅ Professional drag-and-drop tree using react-complex-tree
✅ Enhanced right-click context menu
✅ Full REST API backend with Express
✅ TypeScript API client
✅ Complete API documentation
✅ Production-ready architecture

The tree supports all the features you requested:
- **Drag and Drop** - Smooth, professional implementation
- **Right-Click Menu** - Full context menu with all operations
- **API Backend** - Next.js-style REST API for document management

Enjoy your improved tree menu! 🌳
