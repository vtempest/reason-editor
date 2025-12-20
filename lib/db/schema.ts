import { sqliteTable, text, integer, index, unique } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const documents = sqliteTable('documents', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  content: text('content').default('').notNull(),
  parentId: text('parentId').references((): any => documents.id, { onDelete: 'cascade' }),
  isExpanded: integer('isExpanded').default(0),
  createdAt: text('createdAt').notNull(),
  updatedAt: text('updatedAt').notNull(),
  userId: text('userId'),
  metadata: text('metadata'),
  sharing: text('sharing'),
}, (table) => {
  return {
    parentIdIdx: index('idx_documents_parentId').on(table.parentId),
    userIdIdx: index('idx_documents_userId').on(table.userId),
    createdAtIdx: index('idx_documents_createdAt').on(table.createdAt),
  };
});

export const googleDocsSync = sqliteTable('google_docs_sync', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  documentId: text('documentId').notNull().references(() => documents.id, { onDelete: 'cascade' }),
  googleDocId: text('googleDocId').notNull(),
  lastSyncedAt: text('lastSyncedAt').notNull(),
  userId: text('userId'),
}, (table) => {
  return {
    documentIdIdx: index('idx_google_docs_sync_documentId').on(table.documentId),
    googleDocIdIdx: index('idx_google_docs_sync_googleDocId').on(table.googleDocId),
    uniqueDoc: unique().on(table.documentId, table.googleDocId),
  };
});

export const researchQuotes = sqliteTable('research_quotes', {
  id: text('id').primaryKey(),
  documentId: text('documentId').notNull().references(() => documents.id, { onDelete: 'cascade' }),
  text: text('text').notNull(),
  source: text('source'),
  author: text('author'),
  url: text('url'),
  pageNumber: text('pageNumber'),
  tags: text('tags'),
  createdAt: text('createdAt').notNull(),
}, (table) => {
  return {
    documentIdIdx: index('idx_research_quotes_documentId').on(table.documentId),
    tagsIdx: index('idx_research_quotes_tags').on(table.tags),
  };
});
