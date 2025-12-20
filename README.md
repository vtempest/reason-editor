# Research Editor for Annotated Summaries in Outline Notation 

![logo](https://i.imgur.com/VoAVfyI.jpeg)

A modern, hierarchical document management system with professional drag-and-drop, Google Docs integration, and persistent storage.

## ✨ Features

- 🌳 **Enhanced Tree Component** - Professional drag-and-drop with react-complex-tree
- 🖱️ **Right-Click Context Menu** - Quick actions for all document operations
- 🔌 **Next.js API Backend** - RESTful API with SQLite storage
- 📄 **Google Docs Integration** - Export, import, and share with Google Docs
- 🔍 **Full-Text Search** - Search documents by title and content
- 💾 **Persistent Storage** - SQLite database with proper schema
- 🎨 **Modern UI** - Beautiful interface with shadcn/ui components
- ⌨️ **Keyboard Navigation** - Full keyboard support with shortcuts

## 🎯 Key Capabilities

### Document Tree
- Hierarchical document organization
- Drag and drop to reorder (before/after/child positions)
- Right-click context menu for all operations
- Expand/collapse document branches
- Visual feedback during drag operations

### API Operations
- Full CRUD (Create, Read, Update, Delete)
- Move documents in tree hierarchy
- Duplicate documents
- Search by title or content
- Bulk sync for offline support

### Google Docs
- OAuth2 authentication
- Export markdown to Google Docs format
- Import Google Docs content
- Share with specific users (reader/writer/commenter)
- Generate public shareable links
- Markdown formatting preservation

## 🛠️ Technology Stack

- **Frontend**: React 19, TypeScript, Vite
- **UI**: shadcn/ui, Tailwind CSS, Radix UI
- **Tree**: react-complex-tree
- **Backend**: Next.js 16 App Router
- **Database**: SQLite with adapters
- **Integration**: Google Docs API, Google Drive API
- **Auth**: OAuth2 (Google)