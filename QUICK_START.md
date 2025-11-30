# Quick Start Guide

Complete guide to get started with the enhanced document tree, Next.js API, and Google Docs integration.

## 🚀 Installation

```bash
# Clone the repository
git clone <repository-url>
cd setup-a-lot

# Install dependencies
npm install
```

## ⚙️ Configuration

### 1. Environment Setup

Create `.env` from the example:

```bash
cp .env.example .env
```

### 2. Configure Google OAuth (Optional)

If you want Google Docs integration:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable **Google Docs API** and **Google Drive API**
4. Create OAuth 2.0 credentials
5. Add redirect URI: `http://localhost:3000/api/google-docs/callback`
6. Copy credentials to `.env`:

```env
GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here
```

## 🎯 Running the Application

### Option 1: Frontend Only (Default)

Uses localStorage for data persistence:

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

### Option 2: With Next.js API (Recommended)

Uses SQLite database and enables Google Docs integration:

**Terminal 1 - API Server:**
```bash
npm run api
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

- **Frontend:** [http://localhost:5173](http://localhost:5173)
- **API:** [http://localhost:3000/api](http://localhost:3000/api)

### Option 3: With Legacy Express Server

```bash
# Terminal 1
npm run server:watch

# Terminal 2
npm run dev
```

## 📚 Features

### ✨ Enhanced Tree Component

- **Professional Drag & Drop** using `react-complex-tree`
- **Right-Click Context Menu** with:
  - Add Child Note
  - Add Sibling Note
  - Rename
  - Duplicate
  - Delete
- **Visual Feedback** for drag operations
- **Keyboard Navigation**
- **Accessibility** (ARIA labels)

### 🔌 Next.js API Backend

- **RESTful API** with App Router
- **SQLite Database** for persistent storage
- **Full CRUD Operations**
- **Tree Management** (move, duplicate, search)
- **Bulk Sync** for offline support

### 📄 Google Docs Integration

- **OAuth2 Authentication**
- **Export** documents to Google Docs
- **Import** from Google Docs
- **Share** documents (user-specific or public)
- **Markdown → Google Docs** format conversion

## 🎨 Using the Tree Component

### Basic Operations

1. **Create Document**: Click "New Note" button or right-click → "Add Child/Sibling"
2. **Edit Document**: Click on a document to select it
3. **Move Document**: Drag and drop to reorder
4. **Delete Document**: Right-click → "Delete"
5. **Duplicate Document**: Right-click → "Duplicate"

### Drag & Drop

- **Drop Before**: Drag above a document (blue line indicator)
- **Drop After**: Drag below a document (blue line indicator)
- **Drop as Child**: Drag onto a document (outline indicator)

### Keyboard Shortcuts

- **Arrow Keys**: Navigate tree
- **Enter**: Select document
- **Space**: Expand/collapse

## 🔗 Google Docs Integration

### Setup

1. **Authenticate**:
   ```typescript
   import { googleDocsApi } from '@/lib/api';

   const authUrl = await googleDocsApi.getAuthUrl();
   window.location.href = authUrl;
   ```

2. **After OAuth callback**, save the tokens

### Export Document

```typescript
const result = await googleDocsApi.exportToGoogleDocs(
  documentId,
  accessToken,
  refreshToken
);

console.log('Google Doc URL:', result.url);
window.open(result.url, '_blank');
```

### Import Document

```typescript
const imported = await googleDocsApi.importFromGoogleDocs(
  'google-doc-id-from-url',
  accessToken,
  refreshToken
);

console.log('Imported:', imported.title);
```

### Share Document

```typescript
// Share with specific user
await googleDocsApi.shareWithUser(
  googleDocId,
  'user@example.com',
  accessToken,
  'writer',
  refreshToken
);

// Get public shareable link
const link = await googleDocsApi.getShareableLink(
  googleDocId,
  accessToken,
  refreshToken
);
```

## 📖 API Usage

### Document Operations

```typescript
import { documentsApi } from '@/lib/api';

// Get all documents
const docs = await documentsApi.getAll();

// Create document
const newDoc = await documentsApi.create({
  title: 'My Note',
  content: '# Hello World',
  parentId: null
});

// Update document
await documentsApi.update(docId, {
  title: 'Updated Title',
  content: 'New content'
});

// Delete document
await documentsApi.delete(docId);

// Move document
await documentsApi.move(draggedId, targetId, 'child');

// Search documents
const results = await documentsApi.search('query');
```

## 🎯 Example: Complete Workflow

```typescript
// 1. Create a document
const doc = await documentsApi.create({
  title: 'Project Proposal',
  content: '# Project Proposal\n\nOverview of the project...'
});

// 2. Export to Google Docs
const exported = await googleDocsApi.exportToGoogleDocs(
  doc.id,
  accessToken,
  refreshToken
);

// 3. Share with team
await googleDocsApi.shareWithUser(
  exported.googleDocId,
  'team@example.com',
  accessToken,
  'writer',
  refreshToken
);

// 4. Get shareable link
const link = await googleDocsApi.getShareableLink(
  exported.googleDocId,
  accessToken,
  refreshToken
);

console.log('Share this link:', link);
```

## 🛠️ Development

### Project Structure

```
setup-a-lot/
├── app/api/              # Next.js API routes
├── lib/                  # Backend services
│   ├── db/              # Database layer
│   └── services/        # Business logic
├── src/
│   ├── components/      # React components
│   └── lib/            # Frontend utilities
├── data/               # SQLite database
└── server/             # Legacy Express server
```

### Key Files

- `src/components/ComplexDocumentTree.tsx` - New tree component
- `src/components/GoogleDocsIntegration.tsx` - Google Docs UI
- `app/api/documents/` - Document API routes
- `app/api/google-docs/` - Google Docs API routes
- `lib/services/documentService.ts` - Document operations
- `lib/services/googleDocsService.ts` - Google integration

### Testing

```bash
# Test API endpoints
curl http://localhost:3000/api/documents

# Test document creation
curl -X POST http://localhost:3000/api/documents \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","content":"Hello"}'

# View database
sqlite3 data/documents.db
SELECT * FROM documents;
```

## 📝 Documentation

- **[TREE_IMPROVEMENTS.md](./TREE_IMPROVEMENTS.md)** - Tree component guide
- **[NEXTJS_API_GOOGLE_DOCS_GUIDE.md](./NEXTJS_API_GOOGLE_DOCS_GUIDE.md)** - Complete API reference
- **[API_README.md](./API_README.md)** - Legacy Express API docs

## 🔐 Security Notes

⚠️ **Important for Production:**

1. **Never commit `.env`** - Contains secrets
2. **Store OAuth tokens securely** - Use encrypted database
3. **Implement authentication** - Add user login (NextAuth recommended)
4. **Validate all inputs** - Prevent SQL injection
5. **Use HTTPS** - Secure connections only
6. **Rate limiting** - Prevent abuse
7. **Backup database** - Regular backups of SQLite

## 🐛 Troubleshooting

### "Failed to fetch documents"

- Check if API server is running (`npm run api`)
- Verify `VITE_API_URL` in `.env`
- Check browser console for CORS errors

### Google OAuth not working

- Verify credentials in Google Cloud Console
- Check redirect URI matches exactly
- Ensure APIs are enabled (Docs + Drive)

### Database locked error

- Stop all running processes
- Delete `.db-shm` and `.db-wal` files
- Restart API server

### Drag & Drop not working

- Check browser console for errors
- Verify `react-complex-tree` styles are loaded
- Try refreshing the page

## 🚢 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
```

### Manual Deployment

1. Build frontend: `npm run build`
2. Build API: `npm run api:build`
3. Start API: `npm run api:start`
4. Serve frontend from `dist/`

## 🎉 Next Steps

1. ✅ Explore the enhanced tree component
2. ✅ Try drag & drop operations
3. ✅ Test right-click context menu
4. ✅ Set up Google OAuth (optional)
5. ✅ Export a document to Google Docs
6. ✅ Share a document with teammates
7. ✅ Import a Google Doc

## 💡 Tips

- **Use Keyboard**: Arrow keys + Enter for quick navigation
- **Right-Click Everything**: Context menu has all actions
- **Drag Anywhere**: Three drop positions (before/after/child)
- **Search Fast**: Ctrl/Cmd+K to open search
- **Export Often**: Back up to Google Docs automatically

## 📞 Support

For issues or questions:
- Check documentation files
- Review [Next.js Docs](https://nextjs.org/docs)
- Check [Google Docs API Reference](https://developers.google.com/docs/api)
- Open an issue on GitHub

Happy documenting! 📝✨
