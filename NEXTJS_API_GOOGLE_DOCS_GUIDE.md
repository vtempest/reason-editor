# Next.js API with Google Docs Integration Guide

This guide covers the complete Next.js API implementation with SQLite storage and Google Docs integration for document sharing and collaboration.

## 🚀 Quick Start

### 1. Setup Environment

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# API Configuration
VITE_API_URL=http://localhost:3000/api
PORT=3000

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here
GOOGLE_REDIRECT_URI=http://localhost:3000/api/google-docs/callback
```

### 2. Get Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable these APIs:
   - **Google Docs API**
   - **Google Drive API**
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
5. Application type: **Web application**
6. Authorized redirect URIs: `http://localhost:3000/api/google-docs/callback`
7. Copy Client ID and Client Secret to `.env`

### 3. Run the Application

**Terminal 1 - Start Next.js API Server:**
```bash
npm run api
```

**Terminal 2 - Start Vite Frontend:**
```bash
npm run dev
```

- Frontend: `http://localhost:5173`
- API: `http://localhost:3000/api`

## 📁 Architecture

```
setup-a-lot/
├── app/
│   └── api/                         # Next.js API Routes
│       ├── documents/
│       │   ├── route.ts             # GET all, POST create
│       │   ├── [id]/route.ts        # GET, PUT, DELETE single
│       │   ├── [id]/duplicate/route.ts
│       │   ├── move/route.ts
│       │   ├── search/[query]/route.ts
│       │   └── bulk/route.ts
│       └── google-docs/
│           ├── auth/route.ts         # OAuth URL
│           ├── callback/route.ts     # OAuth callback
│           ├── export/route.ts       # Export to Google Docs
│           ├── import/route.ts       # Import from Google Docs
│           └── share/route.ts        # Share Google Doc
├── lib/
│   ├── db/
│   │   └── sqlite.ts                # SQLite database & schema
│   └── services/
│       ├── documentService.ts       # Document CRUD operations
│       └── googleDocsService.ts     # Google Docs API wrapper
├── src/
│   └── lib/
│       └── api.ts                   # Frontend API client
├── data/
│   └── documents.db                 # SQLite database file
└── next.config.mjs                  # Next.js configuration
```

## 📊 Database Schema

### Documents Table

```sql
CREATE TABLE documents (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL DEFAULT '',
  parentId TEXT,
  isExpanded INTEGER DEFAULT 0,
  createdAt TEXT NOT NULL,
  updatedAt TEXT NOT NULL,
  userId TEXT,
  FOREIGN KEY (parentId) REFERENCES documents(id) ON DELETE CASCADE
);
```

### Google Docs Sync Table

```sql
CREATE TABLE google_docs_sync (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  documentId TEXT NOT NULL,
  googleDocId TEXT NOT NULL,
  lastSyncedAt TEXT NOT NULL,
  userId TEXT,
  FOREIGN KEY (documentId) REFERENCES documents(id) ON DELETE CASCADE,
  UNIQUE(documentId, googleDocId)
);
```

## 🔌 API Endpoints

### Document Management

#### GET `/api/documents`
Get all documents (hierarchical tree structure)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "title": "Welcome",
      "content": "# Hello",
      "parentId": null,
      "isExpanded": true,
      "children": [...],
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### POST `/api/documents`
Create a new document

**Request:**
```json
{
  "title": "My Note",
  "content": "# Hello World",
  "parentId": null
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "1234567890abc",
    "title": "My Note",
    "content": "# Hello World",
    "parentId": null,
    "isExpanded": false,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### GET `/api/documents/[id]`
Get a single document

#### PUT `/api/documents/[id]`
Update a document

**Request:**
```json
{
  "title": "Updated Title",
  "content": "Updated content",
  "isExpanded": true
}
```

#### DELETE `/api/documents/[id]`
Delete a document and all its children

#### POST `/api/documents/[id]/duplicate`
Duplicate a document (without children)

#### POST `/api/documents/move`
Move a document in the tree

**Request:**
```json
{
  "draggedId": "123",
  "targetId": "456",
  "position": "child"
}
```

Positions: `before`, `after`, `child`

#### GET `/api/documents/search/[query]`
Search documents by title or content

#### POST `/api/documents/bulk`
Bulk update all documents (for sync)

**Request:**
```json
{
  "documents": [
    { "id": "1", "title": "Doc 1", "content": "..." },
    { "id": "2", "title": "Doc 2", "content": "..." }
  ]
}
```

### Google Docs Integration

#### GET `/api/google-docs/auth`
Get OAuth authorization URL

**Response:**
```json
{
  "success": true,
  "data": {
    "authUrl": "https://accounts.google.com/o/oauth2/v2/auth?..."
  }
}
```

**Usage:**
1. Call this endpoint
2. Redirect user to `authUrl`
3. User authorizes
4. Google redirects to callback with code

#### GET `/api/google-docs/callback`
OAuth callback handler (receives authorization code)

**Query Params:**
- `code`: Authorization code from Google

**Response:**
```json
{
  "success": true,
  "data": {
    "accessToken": "ya29.a0...",
    "refreshToken": "1//0e...",
    "message": "Authorization successful!"
  }
}
```

**Important:** Store these tokens securely! You'll need them for API calls.

#### POST `/api/google-docs/export`
Export document to Google Docs

**Request:**
```json
{
  "documentId": "local-doc-id",
  "accessToken": "ya29.a0...",
  "refreshToken": "1//0e..."
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "googleDocId": "1a2b3c4d5e",
    "url": "https://docs.google.com/document/d/1a2b3c4d5e/edit"
  }
}
```

**Features:**
- Converts markdown to Google Docs format
- Preserves headings (H1-H6)
- Preserves bold text
- Creates sync record in database

#### POST `/api/google-docs/import`
Import document from Google Docs

**Request:**
```json
{
  "googleDocId": "1a2b3c4d5e",
  "accessToken": "ya29.a0...",
  "refreshToken": "1//0e...",
  "parentId": null
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "new-local-id",
    "title": "Imported Document",
    "content": "Extracted text content...",
    "parentId": null
  }
}
```

#### POST `/api/google-docs/share`
Share Google Doc or get shareable link

**Share with specific user:**
```json
{
  "googleDocId": "1a2b3c4d5e",
  "emailAddress": "user@example.com",
  "role": "reader",
  "accessToken": "ya29.a0...",
  "refreshToken": "1//0e..."
}
```

Roles: `reader`, `writer`, `commenter`

**Get public shareable link:**
```json
{
  "googleDocId": "1a2b3c4d5e",
  "publicLink": true,
  "accessToken": "ya29.a0...",
  "refreshToken": "1//0e..."
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "shareableLink": "https://docs.google.com/document/d/1a2b3c4d5e/edit"
  }
}
```

## 💻 Frontend Integration

### Document Operations

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

// Search
const results = await documentsApi.search('query');

// Bulk sync
await documentsApi.bulkUpdate(allDocuments);
```

### Google Docs Integration

```typescript
import { googleDocsApi } from '@/lib/api';

// 1. Get OAuth URL and redirect user
const authUrl = await googleDocsApi.getAuthUrl();
window.location.href = authUrl;

// 2. After OAuth callback, you'll have tokens
const accessToken = 'ya29.a0...';
const refreshToken = '1//0e...';

// 3. Export document to Google Docs
const exported = await googleDocsApi.exportToGoogleDocs(
  documentId,
  accessToken,
  refreshToken
);
console.log('Document URL:', exported.url);

// 4. Import from Google Docs
const imported = await googleDocsApi.importFromGoogleDocs(
  'google-doc-id',
  accessToken,
  refreshToken,
  parentId
);

// 5. Share with specific user
await googleDocsApi.shareWithUser(
  googleDocId,
  'user@example.com',
  accessToken,
  'writer',
  refreshToken
);

// 6. Get public shareable link
const link = await googleDocsApi.getShareableLink(
  googleDocId,
  accessToken,
  refreshToken
);
```

## 🔐 Security Considerations

### Production Checklist

1. **Environment Variables**
   - Never commit `.env` to git
   - Use environment-specific configs
   - Rotate secrets regularly

2. **OAuth Tokens**
   - Store tokens securely (encrypted database)
   - Implement token refresh logic
   - Don't expose tokens to client-side

3. **Authentication**
   - Implement user authentication (NextAuth recommended)
   - Add user-based document access control
   - Validate all inputs

4. **Database**
   - Use prepared statements (already implemented)
   - Regular backups
   - Consider PostgreSQL for production

5. **API Security**
   - Rate limiting
   - CORS configuration
   - Input validation with Zod
   - SQL injection prevention (using prepared statements)

## 🎯 Usage Examples

### Example 1: Export Document to Google Docs

```typescript
async function exportDocument(docId: string, tokens: { access: string, refresh: string }) {
  try {
    // Export to Google Docs
    const result = await googleDocsApi.exportToGoogleDocs(
      docId,
      tokens.access,
      tokens.refresh
    );

    // Open the Google Doc
    window.open(result.url, '_blank');

    // Optionally, get a shareable link
    const shareLink = await googleDocsApi.getShareableLink(
      result.googleDocId,
      tokens.access,
      tokens.refresh
    );

    console.log('Shareable link:', shareLink);
  } catch (error) {
    console.error('Export failed:', error);
  }
}
```

### Example 2: Import and Organize Google Doc

```typescript
async function importAndOrganize(
  googleDocId: string,
  parentDocId: string | null,
  tokens: { access: string, refresh: string }
) {
  try {
    // Import the Google Doc
    const imported = await googleDocsApi.importFromGoogleDocs(
      googleDocId,
      tokens.access,
      tokens.refresh,
      parentDocId
    );

    console.log('Imported document:', imported.title);

    // Organize in tree
    if (parentDocId) {
      await documentsApi.move(imported.id, parentDocId, 'child');
    }

    return imported;
  } catch (error) {
    console.error('Import failed:', error);
  }
}
```

### Example 3: Collaborative Workflow

```typescript
async function createAndShareDocument(
  title: string,
  content: string,
  collaborators: string[],
  tokens: { access: string, refresh: string }
) {
  // 1. Create local document
  const doc = await documentsApi.create({ title, content });

  // 2. Export to Google Docs
  const exported = await googleDocsApi.exportToGoogleDocs(
    doc.id,
    tokens.access,
    tokens.refresh
  );

  // 3. Share with collaborators
  for (const email of collaborators) {
    await googleDocsApi.shareWithUser(
      exported.googleDocId,
      email,
      tokens.access,
      'writer', // Give write access
      tokens.refresh
    );
  }

  // 4. Get public link for wider sharing
  const publicLink = await googleDocsApi.getShareableLink(
    exported.googleDocId,
    tokens.access,
    tokens.refresh
  );

  return {
    localDoc: doc,
    googleDocUrl: exported.url,
    shareableLink: publicLink,
  };
}
```

## 🔧 Development Tips

### Testing the API

```bash
# Test document creation
curl -X POST http://localhost:3000/api/documents \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","content":"Hello"}'

# Test getting all documents
curl http://localhost:3000/api/documents

# Test search
curl http://localhost:3000/api/documents/search/test
```

### Database Inspection

```bash
# Install SQLite CLI
sqlite3 data/documents.db

# View all documents
SELECT * FROM documents;

# View sync status
SELECT * FROM google_docs_sync;
```

### Debugging Google OAuth

1. Check credentials are correct in `.env`
2. Verify redirect URI matches Google Console
3. Check API is enabled in Google Cloud
4. Inspect tokens in callback response

## 📈 Scaling to Production

### Database Migration

Replace SQLite with PostgreSQL:

```bash
npm install pg @types/pg
```

Update `lib/db/postgres.ts`:
```typescript
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function getAllDocuments(userId: string) {
  const result = await pool.query(
    'SELECT * FROM documents WHERE userId = $1',
    [userId]
  );
  return result.rows;
}
```

### Add Authentication

Use NextAuth.js:

```bash
npm install next-auth
```

See [NextAuth Documentation](https://next-auth.js.org/) for setup.

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel deploy

# Set environment variables in Vercel dashboard
```

## 🎉 Summary

You now have:

✅ **Next.js API Routes** - RESTful API with App Router
✅ **SQLite Storage** - Persistent document storage
✅ **Google Docs Integration** - Export/import/share functionality
✅ **OAuth Authentication** - Secure Google API access
✅ **Full CRUD Operations** - Create, read, update, delete
✅ **Tree Operations** - Move, duplicate, search
✅ **Markdown Support** - Converts markdown to Google Docs format
✅ **Sharing Features** - Public links and user-specific sharing

For questions or issues, refer to:
- [Next.js Documentation](https://nextjs.org/docs)
- [Google Docs API Reference](https://developers.google.com/docs/api)
- [SQLite Documentation](https://www.sqlite.org/docs.html)

Happy coding! 🚀
