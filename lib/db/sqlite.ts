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
  createDocument: db.prepare<[string, string, string, string | null, number, string, string, string | undefined]>(`
    INSERT INTO documents (id, title, content, parentId, isExpanded, createdAt, updatedAt, userId)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `),

  // Update a document
  updateDocument: db.prepare<[string, string, string | null, number, string, string]>(`
    UPDATE documents
    SET title = ?, content = ?, parentId = ?, isExpanded = ?, updatedAt = ?
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
};

export { db };
