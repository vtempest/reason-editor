import { statements, db } from '../db/sqlite';

export interface Document {
  id: string;
  title: string;
  content: string;
  parentId: string | null;
  isExpanded?: boolean;
  createdAt?: string;
  updatedAt?: string;
  children?: Document[];
  userId?: string;
}

export class DocumentService {
  /**
   * Get all documents for a user
   */
  static getAllDocuments(userId?: string): Document[] {
    const rows = statements.getAllDocuments.all(userId || 'anonymous');
    return rows.map((row: any) => ({
      ...row,
      isExpanded: Boolean(row.isExpanded),
      children: [], // Will be populated if needed
    }));
  }

  /**
   * Get a single document by ID
   */
  static getDocument(id: string): Document | null {
    const row: any = statements.getDocument.get(id);
    if (!row) return null;

    return {
      ...row,
      isExpanded: Boolean(row.isExpanded),
    };
  }

  /**
   * Create a new document
   */
  static createDocument(
    data: Omit<Document, 'id' | 'createdAt' | 'updatedAt'>,
    userId?: string
  ): Document {
    const id = Date.now().toString() + Math.random().toString(36).substring(7);
    const now = new Date().toISOString();

    statements.createDocument.run(
      id,
      data.title,
      data.content || '',
      data.parentId || null,
      data.isExpanded ? 1 : 0,
      now,
      now,
      userId || 'anonymous'
    );

    return {
      id,
      title: data.title,
      content: data.content || '',
      parentId: data.parentId || null,
      isExpanded: data.isExpanded || false,
      createdAt: now,
      updatedAt: now,
      userId: userId || 'anonymous',
    };
  }

  /**
   * Update a document
   */
  static updateDocument(id: string, updates: Partial<Document>): Document | null {
    const existing = this.getDocument(id);
    if (!existing) return null;

    const now = new Date().toISOString();

    statements.updateDocument.run(
      updates.title !== undefined ? updates.title : existing.title,
      updates.content !== undefined ? updates.content : existing.content,
      updates.parentId !== undefined ? updates.parentId : existing.parentId,
      updates.isExpanded !== undefined ? (updates.isExpanded ? 1 : 0) : (existing.isExpanded ? 1 : 0),
      now,
      id
    );

    return this.getDocument(id);
  }

  /**
   * Delete a document and all its children
   */
  static deleteDocument(id: string): boolean {
    // Get all children recursively
    const deleteRecursive = (docId: string) => {
      const children: any[] = statements.getChildren.all(docId);
      children.forEach((child) => deleteRecursive(child.id));
      statements.deleteDocument.run(docId);
    };

    const exists = this.getDocument(id);
    if (!exists) return false;

    deleteRecursive(id);
    return true;
  }

  /**
   * Duplicate a document (without children)
   */
  static duplicateDocument(id: string, userId?: string): Document | null {
    const original = this.getDocument(id);
    if (!original) return null;

    return this.createDocument(
      {
        title: `${original.title} (Copy)`,
        content: original.content,
        parentId: original.parentId,
        isExpanded: false,
      },
      userId
    );
  }

  /**
   * Move a document to a new parent
   */
  static moveDocument(
    draggedId: string,
    targetId: string | null,
    position: 'before' | 'after' | 'child'
  ): boolean {
    const draggedDoc = this.getDocument(draggedId);
    if (!draggedDoc) return false;

    // Prevent moving to itself
    if (draggedId === targetId) return false;

    // Prevent moving parent into its own child
    const isDescendant = (parentId: string, childId: string | null): boolean => {
      if (!childId) return false;
      if (parentId === childId) return true;
      const child = this.getDocument(childId);
      return child ? isDescendant(parentId, child.parentId) : false;
    };

    if (targetId && isDescendant(draggedId, targetId)) {
      return false;
    }

    // Determine new parent
    let newParentId: string | null;
    if (position === 'child') {
      newParentId = targetId;
    } else {
      const targetDoc = targetId ? this.getDocument(targetId) : null;
      newParentId = targetDoc ? targetDoc.parentId : null;
    }

    // Update the document
    this.updateDocument(draggedId, { parentId: newParentId });
    return true;
  }

  /**
   * Search documents by title or content
   */
  static searchDocuments(query: string): Document[] {
    const searchTerm = `%${query}%`;
    const rows: any[] = statements.searchDocuments.all(searchTerm, searchTerm);
    return rows.map((row) => ({
      ...row,
      isExpanded: Boolean(row.isExpanded),
    }));
  }

  /**
   * Build hierarchical tree structure from flat list
   */
  static buildTree(documents: Document[]): Document[] {
    const docMap = new Map<string, Document>();
    const rootDocs: Document[] = [];

    // First pass: create map
    documents.forEach((doc) => {
      docMap.set(doc.id, { ...doc, children: [] });
    });

    // Second pass: build tree
    docMap.forEach((doc) => {
      if (doc.parentId) {
        const parent = docMap.get(doc.parentId);
        if (parent) {
          parent.children = parent.children || [];
          parent.children.push(doc);
        } else {
          // Parent not found, treat as root
          rootDocs.push(doc);
        }
      } else {
        rootDocs.push(doc);
      }
    });

    return rootDocs;
  }

  /**
   * Bulk update documents (for syncing)
   */
  static bulkUpdate(documents: Document[], userId?: string): Document[] {
    // Use transaction for bulk operations
    const transaction = db.transaction((docs: Document[]) => {
      // Delete all existing documents for this user
      db.prepare(`DELETE FROM documents WHERE userId = ? OR userId IS NULL`).run(
        userId || 'anonymous'
      );

      // Insert all new documents
      docs.forEach((doc) => {
        statements.createDocument.run(
          doc.id,
          doc.title,
          doc.content || '',
          doc.parentId || null,
          doc.isExpanded ? 1 : 0,
          doc.createdAt || new Date().toISOString(),
          doc.updatedAt || new Date().toISOString(),
          userId || 'anonymous'
        );
      });
    });

    transaction(documents);
    return this.getAllDocuments(userId);
  }
}
