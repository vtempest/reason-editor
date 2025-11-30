import { Document } from './types';

// In-memory database (replace with actual database in production)
let documents: Document[] = [
  {
    id: '1',
    title: 'Welcome',
    content: '# Welcome to the Note App\n\nThis is your first note.',
    parentId: null,
    isExpanded: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const db = {
  // Get all documents
  getAllDocuments(): Document[] {
    return documents;
  },

  // Get a single document by ID
  getDocument(id: string): Document | undefined {
    return documents.find(doc => doc.id === id);
  },

  // Create a new document
  createDocument(doc: Omit<Document, 'id' | 'createdAt' | 'updatedAt'>): Document {
    const newDoc: Document = {
      ...doc,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    documents.push(newDoc);
    return newDoc;
  },

  // Update a document
  updateDocument(id: string, updates: Partial<Document>): Document | null {
    const index = documents.findIndex(doc => doc.id === id);
    if (index === -1) return null;

    documents[index] = {
      ...documents[index],
      ...updates,
      id, // Ensure ID doesn't change
      updatedAt: new Date().toISOString(),
    };
    return documents[index];
  },

  // Delete a document and all its children
  deleteDocument(id: string): boolean {
    const deleteRecursive = (docId: string) => {
      // Find and delete children first
      const children = documents.filter(doc => doc.parentId === docId);
      children.forEach(child => deleteRecursive(child.id));

      // Delete the document itself
      const index = documents.findIndex(doc => doc.id === docId);
      if (index !== -1) {
        documents.splice(index, 1);
      }
    };

    const exists = documents.some(doc => doc.id === id);
    if (exists) {
      deleteRecursive(id);
      return true;
    }
    return false;
  },

  // Duplicate a document (without children)
  duplicateDocument(id: string): Document | null {
    const original = documents.find(doc => doc.id === id);
    if (!original) return null;

    const duplicate: Document = {
      ...original,
      id: Date.now().toString(),
      title: `${original.title} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    documents.push(duplicate);
    return duplicate;
  },

  // Move a document
  moveDocument(draggedId: string, targetId: string | null, position: 'before' | 'after' | 'child'): boolean {
    const draggedDoc = documents.find(doc => doc.id === draggedId);
    if (!draggedDoc) return false;

    // Prevent moving to itself
    if (draggedId === targetId) return false;

    // Prevent moving a parent into its own child
    const isDescendant = (parentId: string, childId: string | null): boolean => {
      if (!childId) return false;
      if (parentId === childId) return true;
      const child = documents.find(doc => doc.id === childId);
      return child ? isDescendant(parentId, child.parentId) : false;
    };

    if (targetId && isDescendant(draggedId, targetId)) {
      return false;
    }

    // Determine new parent based on position
    let newParentId: string | null;
    if (position === 'child') {
      newParentId = targetId;
    } else {
      const targetDoc = targetId ? documents.find(doc => doc.id === targetId) : null;
      newParentId = targetDoc ? targetDoc.parentId : null;
    }

    // Update the document's parent
    draggedDoc.parentId = newParentId;
    draggedDoc.updatedAt = new Date().toISOString();

    return true;
  },

  // Bulk update (for syncing from client)
  bulkUpdate(docs: Document[]): void {
    documents = docs.map(doc => ({
      ...doc,
      updatedAt: new Date().toISOString(),
    }));
  },

  // Search documents
  searchDocuments(query: string): Document[] {
    const lowercaseQuery = query.toLowerCase();
    return documents.filter(doc =>
      doc.title.toLowerCase().includes(lowercaseQuery) ||
      doc.content.toLowerCase().includes(lowercaseQuery)
    );
  },
};
