import Database from 'better-sqlite3';
import path from 'path';

export interface Document {
  id: string;
  title: string;
  content: string;
  parentId: string | null;
  isExpanded: number; // SQLite stores boolean as 0 or 1
  createdAt: string;
  updatedAt: string;
  userId?: string; // For multi-user support
  metadata?: string; // JSON string
  sharing?: string; // JSON string
}

export interface ResearchQuote {
  id: string;
  documentId: string;
  text: string;
  source?: string;
  author?: string;
  url?: string;
  pageNumber?: string;
  tags?: string; // JSON string
  createdAt: string;
}

// Initialize database
const dbPath = path.join(process.cwd(), 'data', 'documents.db');
const db = new Database(dbPath);

// Enable WAL mode for better concurrency
db.pragma('journal_mode = WAL');

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS documents (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL DEFAULT '',
    parentId TEXT,
    isExpanded INTEGER DEFAULT 0,
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL,
    userId TEXT,
    metadata TEXT,
    sharing TEXT,
    FOREIGN KEY (parentId) REFERENCES documents(id) ON DELETE CASCADE
  );

  CREATE INDEX IF NOT EXISTS idx_documents_parentId ON documents(parentId);
  CREATE INDEX IF NOT EXISTS idx_documents_userId ON documents(userId);
  CREATE INDEX IF NOT EXISTS idx_documents_createdAt ON documents(createdAt);

  CREATE TABLE IF NOT EXISTS google_docs_sync (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    documentId TEXT NOT NULL,
    googleDocId TEXT NOT NULL,
    lastSyncedAt TEXT NOT NULL,
    userId TEXT,
    FOREIGN KEY (documentId) REFERENCES documents(id) ON DELETE CASCADE,
    UNIQUE(documentId, googleDocId)
  );

  CREATE INDEX IF NOT EXISTS idx_google_docs_sync_documentId ON google_docs_sync(documentId);
  CREATE INDEX IF NOT EXISTS idx_google_docs_sync_googleDocId ON google_docs_sync(googleDocId);

  CREATE TABLE IF NOT EXISTS research_quotes (
    id TEXT PRIMARY KEY,
    documentId TEXT NOT NULL,
    text TEXT NOT NULL,
    source TEXT,
    author TEXT,
    url TEXT,
    pageNumber TEXT,
    tags TEXT,
    createdAt TEXT NOT NULL,
    FOREIGN KEY (documentId) REFERENCES documents(id) ON DELETE CASCADE
  );

  CREATE INDEX IF NOT EXISTS idx_research_quotes_documentId ON research_quotes(documentId);
  CREATE INDEX IF NOT EXISTS idx_research_quotes_tags ON research_quotes(tags);
`);

// Prepared statements for better performance
export const statements = {
  // Get all documents for a user
  getAllDocuments: db.prepare<string[]>(`
    SELECT * FROM documents
    WHERE userId = ? OR userId IS NULL
    ORDER BY createdAt DESC
  `),

  // Get a single document
  getDocument: db.prepare<string>(`
    SELECT * FROM documents WHERE id = ?
  `),

  // Create a document
  createDocument: db.prepare<[string, string, string, string | null, number, string, string, string | undefined, string | undefined, string | undefined]>(`
    INSERT INTO documents (id, title, content, parentId, isExpanded, createdAt, updatedAt, userId, metadata, sharing)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `),

  // Update a document
  updateDocument: db.prepare<[string, string, string | null, number, string | null, string | null, string, string]>(`
    UPDATE documents
    SET title = ?, content = ?, parentId = ?, isExpanded = ?, metadata = ?, sharing = ?, updatedAt = ?
    WHERE id = ?
  `),

  // Delete a document (cascade will handle children)
  deleteDocument: db.prepare<string>(`
    DELETE FROM documents WHERE id = ?
  `),

  // Get all children of a document
  getChildren: db.prepare<string>(`
    SELECT * FROM documents WHERE parentId = ?
  `),

  // Search documents
  searchDocuments: db.prepare<[string, string]>(`
    SELECT * FROM documents
    WHERE (title LIKE ? OR content LIKE ?)
    ORDER BY createdAt DESC
  `),

  // Google Docs sync operations
  createGoogleDocSync: db.prepare<[string, string, string, string | undefined]>(`
    INSERT INTO google_docs_sync (documentId, googleDocId, lastSyncedAt, userId)
    VALUES (?, ?, ?, ?)
    ON CONFLICT(documentId, googleDocId) DO UPDATE SET
      lastSyncedAt = excluded.lastSyncedAt
  `),

  getGoogleDocSync: db.prepare<string>(`
    SELECT * FROM google_docs_sync WHERE documentId = ?
  `),

  deleteGoogleDocSync: db.prepare<string>(`
    DELETE FROM google_docs_sync WHERE documentId = ?
  `),

  // Research quotes operations
  createQuote: db.prepare<[string, string, string, string | null, string | null, string | null, string | null, string | null, string]>(`
    INSERT INTO research_quotes (id, documentId, text, source, author, url, pageNumber, tags, createdAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `),

  getQuotesByDocument: db.prepare<string>(`
    SELECT * FROM research_quotes WHERE documentId = ? ORDER BY createdAt DESC
  `),

  updateQuote: db.prepare<[string, string | null, string | null, string | null, string | null, string | null, string]>(`
    UPDATE research_quotes
    SET text = ?, source = ?, author = ?, url = ?, pageNumber = ?, tags = ?
    WHERE id = ?
  `),

  deleteQuote: db.prepare<string>(`
    DELETE FROM research_quotes WHERE id = ?
  `),

  searchQuotes: db.prepare<[string, string]>(`
    SELECT * FROM research_quotes
    WHERE text LIKE ? OR source LIKE ?
    ORDER BY createdAt DESC
  `),
};

export { db };
