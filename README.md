# Document Management System

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

## 🚀 Quick Start

See **[QUICK_START.md](./QUICK_START.md)** for detailed setup instructions.

```bash
# Install dependencies
npm install

# Frontend only (localStorage)
npm run dev

# With API backend (recommended)
npm run api          # Terminal 1
npm run dev          # Terminal 2
```

## 📚 Documentation

- **[QUICK_START.md](./QUICK_START.md)** - Complete setup guide
- **[TREE_IMPROVEMENTS.md](./TREE_IMPROVEMENTS.md)** - Tree component features
- **[NEXTJS_API_GOOGLE_DOCS_GUIDE.md](./NEXTJS_API_GOOGLE_DOCS_GUIDE.md)** - API reference & Google Docs
- **[API_README.md](./API_README.md)** - Legacy Express API docs

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
- **Database**: SQLite with better-sqlite3
- **Integration**: Google Docs API, Google Drive API
- **Auth**: OAuth2 (Google)

## Project info

**URL**: https://lovable.dev/projects/3e55455b-7215-4482-bae4-62ae70c2599b

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/3e55455b-7215-4482-bae4-62ae70c2599b) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/3e55455b-7215-4482-bae4-62ae70c2599b) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
