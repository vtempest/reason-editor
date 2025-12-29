import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import { eq, and } from 'drizzle-orm';
import { documents, researchQuotes, shareTokens } from './schema';

// Initialize Turso client
const turso = createClient({
  url: process.env.TURSO_DATABASE_URL || process.env.DATABASE_URL || 'file:./local.db',
  authToken: process.env.TURSO_AUTH_TOKEN || process.env.DATABASE_AUTH_TOKEN,
});

// Initialize Drizzle ORM
const db = drizzle(turso);

// Query functions for quotes
export const tursoQueries = {
  // Get all quotes for a document
  async getQuotesByDocument(documentId: string) {
    return await db
      .select()
      .from(researchQuotes)
      .where(eq(researchQuotes.documentId, documentId));
  },

  // Create a new quote
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
  ) {
    return await db.insert(researchQuotes).values({
      id,
      documentId,
      text,
      source,
      author,
      url,
      pageNumber,
      tags,
      createdAt,
    });
  },

  // Update a quote
  async updateQuote(
    text: string,
    source: string | null,
    author: string | null,
    url: string | null,
    pageNumber: string | null,
    tags: string | null,
    id: string
  ) {
    return await db
      .update(researchQuotes)
      .set({
        text,
        source,
        author,
        url,
        pageNumber,
        tags,
      })
      .where(eq(researchQuotes.id, id));
  },

  // Delete a quote
  async deleteQuote(id: string) {
    return await db.delete(researchQuotes).where(eq(researchQuotes.id, id));
  },

  // Get a document by ID
  async getDocument(documentId: string) {
    const result = await db
      .select()
      .from(documents)
      .where(eq(documents.id, parseInt(documentId)))
      .limit(1);
    return result[0];
  },

  // Get share token by document ID
  async getShareTokenByDocumentId(documentId: string) {
    const result = await db
      .select()
      .from(shareTokens)
      .where(eq(shareTokens.documentId, documentId))
      .limit(1);
    return result[0];
  },

  // Create a share token
  async createShareToken(
    id: string,
    documentId: string,
    createdAt: string,
    expiresAt?: string
  ) {
    return await db.insert(shareTokens).values({
      id,
      documentId,
      createdAt,
      expiresAt: expiresAt || null,
    });
  },

  // Get share token by ID
  async getShareToken(id: string) {
    const result = await db
      .select()
      .from(shareTokens)
      .where(eq(shareTokens.id, id))
      .limit(1);
    return result[0];
  },
};
