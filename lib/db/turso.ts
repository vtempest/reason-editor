import { createClient, Client, ResultSet } from '@libsql/client';

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

// Initialize Turso client
let client: Client;

export function getTursoClient() {
  if (client) return client;

  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  if (!url) {
    throw new Error('TURSO_DATABASE_URL environment variable is required');
  }

  client = createClient({
    url,
    authToken,
  });

  return client;
}

// Initialize database schema
export async function initializeDatabase() {
  const db = getTursoClient();

  await db.execute(`
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
  `);

  await db.execute(`CREATE INDEX IF NOT EXISTS idx_documents_parentId ON documents(parentId);`);
  await db.execute(`CREATE INDEX IF NOT EXISTS idx_documents_userId ON documents(userId);`);
  await db.execute(`CREATE INDEX IF NOT EXISTS idx_documents_createdAt ON documents(createdAt);`);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS google_docs_sync (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      documentId TEXT NOT NULL,
      googleDocId TEXT NOT NULL,
      lastSyncedAt TEXT NOT NULL,
      userId TEXT,
      FOREIGN KEY (documentId) REFERENCES documents(id) ON DELETE CASCADE,
      UNIQUE(documentId, googleDocId)
    );
  `);

  await db.execute(`CREATE INDEX IF NOT EXISTS idx_google_docs_sync_documentId ON google_docs_sync(documentId);`);
  await db.execute(`CREATE INDEX IF NOT EXISTS idx_google_docs_sync_googleDocId ON google_docs_sync(googleDocId);`);

  await db.execute(`
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
  `);

  await db.execute(`CREATE INDEX IF NOT EXISTS idx_research_quotes_documentId ON research_quotes(documentId);`);
  await db.execute(`CREATE INDEX IF NOT EXISTS idx_research_quotes_tags ON research_quotes(tags);`);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS share_tokens (
      id TEXT PRIMARY KEY,
      documentId TEXT NOT NULL,
      createdAt TEXT NOT NULL,
      expiresAt TEXT,
      FOREIGN KEY (documentId) REFERENCES documents(id) ON DELETE CASCADE
    );
  `);

  await db.execute(`CREATE INDEX IF NOT EXISTS idx_share_tokens_documentId ON share_tokens(documentId);`);
}

// Helper function to convert ResultSet to typed rows
function rowsToArray<T>(result: ResultSet): T[] {
  return result.rows.map((row) => {
    const obj: any = {};
    result.columns.forEach((col, i) => {
      obj[col] = row[i];
    });
    return obj as T;
  });
}

// Database operations
export const tursoQueries = {
  // Get all documents for a user
  async getAllDocuments(userId: string): Promise<Document[]> {
    const db = getTursoClient();
    const result = await db.execute({
      sql: `SELECT * FROM documents WHERE userId = ? OR userId IS NULL ORDER BY createdAt DESC`,
      args: [userId],
    });
    return rowsToArray<Document>(result);
  },

  // Get a single document
  async getDocument(id: string): Promise<Document | null> {
    const db = getTursoClient();
    const result = await db.execute({
      sql: `SELECT * FROM documents WHERE id = ?`,
      args: [id],
    });
    const rows = rowsToArray<Document>(result);
    return rows[0] || null;
  },

  // Create a document
  async createDocument(
    id: string,
    title: string,
    content: string,
    parentId: string | null,
    isExpanded: number,
    createdAt: string,
    updatedAt: string,
    userId?: string,
    metadata?: string,
    sharing?: string
  ): Promise<void> {
    const db = getTursoClient();
    await db.execute({
      sql: `INSERT INTO documents (id, title, content, parentId, isExpanded, createdAt, updatedAt, userId, metadata, sharing)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [id, title, content, parentId, isExpanded, createdAt, updatedAt, userId || null, metadata || null, sharing || null],
    });
  },

  // Update a document
  async updateDocument(
    title: string,
    content: string,
    parentId: string | null,
    isExpanded: number,
    metadata: string | null,
    sharing: string | null,
    updatedAt: string,
    id: string
  ): Promise<void> {
    const db = getTursoClient();
    await db.execute({
      sql: `UPDATE documents
            SET title = ?, content = ?, parentId = ?, isExpanded = ?, metadata = ?, sharing = ?, updatedAt = ?
            WHERE id = ?`,
      args: [title, content, parentId, isExpanded, metadata, sharing, updatedAt, id],
    });
  },

  // Delete a document
  async deleteDocument(id: string): Promise<void> {
    const db = getTursoClient();
    await db.execute({
      sql: `DELETE FROM documents WHERE id = ?`,
      args: [id],
    });
  },

  // Get all children of a document
  async getChildren(parentId: string): Promise<Document[]> {
    const db = getTursoClient();
    const result = await db.execute({
      sql: `SELECT * FROM documents WHERE parentId = ?`,
      args: [parentId],
    });
    return rowsToArray<Document>(result);
  },

  // Search documents
  async searchDocuments(query: string): Promise<Document[]> {
    const db = getTursoClient();
    const searchTerm = `%${query}%`;
    const result = await db.execute({
      sql: `SELECT * FROM documents WHERE (title LIKE ? OR content LIKE ?) ORDER BY createdAt DESC`,
      args: [searchTerm, searchTerm],
    });
    return rowsToArray<Document>(result);
  },

  // Google Docs sync operations
  async createGoogleDocSync(
    documentId: string,
    googleDocId: string,
    lastSyncedAt: string,
    userId?: string
  ): Promise<void> {
    const db = getTursoClient();
    await db.execute({
      sql: `INSERT INTO google_docs_sync (documentId, googleDocId, lastSyncedAt, userId)
            VALUES (?, ?, ?, ?)
            ON CONFLICT(documentId, googleDocId) DO UPDATE SET
              lastSyncedAt = excluded.lastSyncedAt`,
      args: [documentId, googleDocId, lastSyncedAt, userId || null],
    });
  },

  async getGoogleDocSync(documentId: string): Promise<any | null> {
    const db = getTursoClient();
    const result = await db.execute({
      sql: `SELECT * FROM google_docs_sync WHERE documentId = ?`,
      args: [documentId],
    });
    const rows = rowsToArray(result);
    return rows[0] || null;
  },

  async deleteGoogleDocSync(documentId: string): Promise<void> {
    const db = getTursoClient();
    await db.execute({
      sql: `DELETE FROM google_docs_sync WHERE documentId = ?`,
      args: [documentId],
    });
  },

  // Research quotes operations
  async createQuote(
    id: string,
    documentId: string,
    text: string,
    source: string | null,
    author: string | null,
    url: string | null,
    pageNumber: string | null,
    tags: string | null,
    createdAt: string
  ): Promise<void> {
    const db = getTursoClient();
    await db.execute({
      sql: `INSERT INTO research_quotes (id, documentId, text, source, author, url, pageNumber, tags, createdAt)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [id, documentId, text, source, author, url, pageNumber, tags, createdAt],
    });
  },

  async getQuotesByDocument(documentId: string): Promise<ResearchQuote[]> {
    const db = getTursoClient();
    const result = await db.execute({
      sql: `SELECT * FROM research_quotes WHERE documentId = ? ORDER BY createdAt DESC`,
      args: [documentId],
    });
    return rowsToArray<ResearchQuote>(result);
  },

  async updateQuote(
    text: string,
    source: string | null,
    author: string | null,
    url: string | null,
    pageNumber: string | null,
    tags: string | null,
    id: string
  ): Promise<void> {
    const db = getTursoClient();
    await db.execute({
      sql: `UPDATE research_quotes
            SET text = ?, source = ?, author = ?, url = ?, pageNumber = ?, tags = ?
            WHERE id = ?`,
      args: [text, source, author, url, pageNumber, tags, id],
    });
  },

  async deleteQuote(id: string): Promise<void> {
    const db = getTursoClient();
    await db.execute({
      sql: `DELETE FROM research_quotes WHERE id = ?`,
      args: [id],
    });
  },

  async searchQuotes(query: string): Promise<ResearchQuote[]> {
    const db = getTursoClient();
    const searchTerm = `%${query}%`;
    const result = await db.execute({
      sql: `SELECT * FROM research_quotes WHERE text LIKE ? OR source LIKE ? ORDER BY createdAt DESC`,
      args: [searchTerm, searchTerm],
    });
    return rowsToArray<ResearchQuote>(result);
  },

  // Bulk operations for syncing
  async deleteAllDocumentsForUser(userId: string): Promise<void> {
    const db = getTursoClient();
    await db.execute({
      sql: `DELETE FROM documents WHERE userId = ? OR userId IS NULL`,
      args: [userId],
    });
  },

  // Share token operations
  async createShareToken(id: string, documentId: string, createdAt: string): Promise<void> {
    const db = getTursoClient();
    await db.execute({
      sql: `INSERT INTO share_tokens (id, documentId, createdAt, expiresAt)
            VALUES (?, ?, ?, NULL)`,
      args: [id, documentId, createdAt],
    });
  },

  async getShareToken(id: string): Promise<{ id: string; documentId: string; createdAt: string; expiresAt: string | null } | null> {
    const db = getTursoClient();
    const result = await db.execute({
      sql: `SELECT * FROM share_tokens WHERE id = ?`,
      args: [id],
    });
    const rows = rowsToArray(result);
    return rows[0] || null;
  },

  async getShareTokenByDocumentId(documentId: string): Promise<{ id: string; documentId: string; createdAt: string; expiresAt: string | null } | null> {
    const db = getTursoClient();
    const result = await db.execute({
      sql: `SELECT * FROM share_tokens WHERE documentId = ? LIMIT 1`,
      args: [documentId],
    });
    const rows = rowsToArray(result);
    return rows[0] || null;
  },

  async deleteShareToken(id: string): Promise<void> {
    const db = getTursoClient();
    await db.execute({
      sql: `DELETE FROM share_tokens WHERE id = ?`,
      args: [id],
    });
  },
};

export { getTursoClient as db };
