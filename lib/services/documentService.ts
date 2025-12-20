import { tursoQueries } from '../db/turso';

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
  static async getAllDocuments(userId?: string): Promise<Document[]> {
    const rows = await tursoQueries.getAllDocuments(userId || 'anonymous');
    return rows.map((row: any) => ({
      ...row,
      isExpanded: Boolean(row.isExpanded),
      children: [], // Will be populated if needed
    }));
  }

  /**
   * Get a single document by ID
   */
  static async getDocument(id: string): Promise<Document | null> {
    const row = await tursoQueries.getDocument(id);
    if (!row) return null;

    return {
      ...row,
      isExpanded: Boolean(row.isExpanded),
    };
  }

  /**
   * Create a new document
   */
  static async createDocument(
    data: Omit<Document, 'id' | 'createdAt' | 'updatedAt'>,
    userId?: string
  ): Promise<Document> {
    const id = Date.now().toString() + Math.random().toString(36).substring(7);
    const now = new Date().toISOString();

    await tursoQueries.createDocument(
      id,
      data.title,
      data.content || '',
      data.parentId || null,
      data.isExpanded ? 1 : 0,
      now,
      now,
      userId || 'anonymous',
      undefined,
      undefined
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
  static async updateDocument(id: string, updates: Partial<Document>): Promise<Document | null> {
    const existing = await this.getDocument(id);
    if (!existing) return null;

    const now = new Date().toISOString();

    await tursoQueries.updateDocument(
      updates.title !== undefined ? updates.title : existing.title,
      updates.content !== undefined ? updates.content : existing.content,
      updates.parentId !== undefined ? updates.parentId : existing.parentId,
      updates.isExpanded !== undefined ? (updates.isExpanded ? 1 : 0) : (existing.isExpanded ? 1 : 0),
      null,
      null,
      now,
      id
    );

    return await this.getDocument(id);
  }

  /**
   * Delete a document and all its children
   */
  static async deleteDocument(id: string): Promise<boolean> {
    // Get all children recursively
    const deleteRecursive = async (docId: string) => {
      const children = await tursoQueries.getChildren(docId);
      for (const child of children) {
        await deleteRecursive(child.id);
      }
      await tursoQueries.deleteDocument(docId);
    };

    const exists = await this.getDocument(id);
    if (!exists) return false;

    await deleteRecursive(id);
    return true;
  }

  /**
   * Duplicate a document (without children)
   */
  static async duplicateDocument(id: string, userId?: string): Promise<Document | null> {
    const original = await this.getDocument(id);
    if (!original) return null;

    return await this.createDocument(
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
  static async moveDocument(
    draggedId: string,
    targetId: string | null,
    position: 'before' | 'after' | 'child'
  ): Promise<boolean> {
    const draggedDoc = await this.getDocument(draggedId);
    if (!draggedDoc) return false;

    // Prevent moving to itself
    if (draggedId === targetId) return false;

    // Prevent moving parent into its own child
    const isDescendant = async (parentId: string, childId: string | null): Promise<boolean> => {
      if (!childId) return false;
      if (parentId === childId) return true;
      const child = await this.getDocument(childId);
      return child ? await isDescendant(parentId, child.parentId) : false;
    };

    if (targetId && await isDescendant(draggedId, targetId)) {
      return false;
    }

    // Determine new parent
    let newParentId: string | null;
    if (position === 'child') {
      newParentId = targetId;
    } else {
      const targetDoc = targetId ? await this.getDocument(targetId) : null;
      newParentId = targetDoc ? targetDoc.parentId : null;
    }

    // Update the document
    await this.updateDocument(draggedId, { parentId: newParentId });
    return true;
  }

  /**
   * Search documents by title or content
   */
  static async searchDocuments(query: string): Promise<Document[]> {
    const rows = await tursoQueries.searchDocuments(query);
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
  static async bulkUpdate(documents: Document[], userId?: string): Promise<Document[]> {
    // Delete all existing documents for this user
    await tursoQueries.deleteAllDocumentsForUser(userId || 'anonymous');

    // Insert all new documents
    for (const doc of documents) {
      await tursoQueries.createDocument(
        doc.id,
        doc.title,
        doc.content || '',
        doc.parentId || null,
        doc.isExpanded ? 1 : 0,
        doc.createdAt || new Date().toISOString(),
        doc.updatedAt || new Date().toISOString(),
        userId || 'anonymous',
        undefined,
        undefined
      );
    }

    return await this.getAllDocuments(userId);
  }
}
