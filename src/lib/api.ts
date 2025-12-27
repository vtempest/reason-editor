import { Document } from '@/components/editor/DocumentTree';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

export const documentsApi = {
  // Get all documents
  async getAll(): Promise<Document[]> {
    const response = await fetch(`${API_BASE_URL}/documents`);
    const result: ApiResponse<Document[]> = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Failed to fetch documents');
    }

    return result.data || [];
  },

  // Get a single document
  async getById(id: string): Promise<Document> {
    const response = await fetch(`${API_BASE_URL}/documents/${id}`);
    const result: ApiResponse<Document> = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Failed to fetch document');
    }

    return result.data!;
  },

  // Create a new document
  async create(data: { title: string; content?: string; parentId?: string | null }): Promise<Document> {
    const response = await fetch(`${API_BASE_URL}/documents`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result: ApiResponse<Document> = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Failed to create document');
    }

    return result.data!;
  },

  // Update a document
  async update(id: string, updates: Partial<Document>): Promise<Document> {
    const response = await fetch(`${API_BASE_URL}/documents/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });

    const result: ApiResponse<Document> = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Failed to update document');
    }

    return result.data!;
  },

  // Delete a document
  async delete(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/documents/${id}`, {
      method: 'DELETE',
    });

    const result: ApiResponse = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Failed to delete document');
    }
  },

  // Duplicate a document
  async duplicate(id: string): Promise<Document> {
    const response = await fetch(`${API_BASE_URL}/documents/${id}/duplicate`, {
      method: 'POST',
    });

    const result: ApiResponse<Document> = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Failed to duplicate document');
    }

    return result.data!;
  },

  // Move a document
  async move(draggedId: string, targetId: string | null, position: 'before' | 'after' | 'child'): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/documents/move`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ draggedId, targetId, position }),
    });

    const result: ApiResponse = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Failed to move document');
    }
  },

  // Search documents
  async search(query: string): Promise<Document[]> {
    const response = await fetch(`${API_BASE_URL}/documents/search/${encodeURIComponent(query)}`);
    const result: ApiResponse<Document[]> = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Failed to search documents');
    }

    return result.data || [];
  },

  // Bulk update (for syncing local state)
  async bulkUpdate(documents: Document[]): Promise<Document[]> {
    const response = await fetch(`${API_BASE_URL}/documents/bulk`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ documents }),
    });

    const result: ApiResponse<Document[]> = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Failed to sync documents');
    }

    return result.data || [];
  },
};

// Google Docs Integration API
export const googleDocsApi = {
  // Get OAuth authorization URL
  async getAuthUrl(): Promise<string> {
    const response = await fetch(`${API_BASE_URL}/google-docs/auth`);
    const result: ApiResponse<{ authUrl: string }> = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Failed to get auth URL');
    }

    return result.data!.authUrl;
  },

  // Export document to Google Docs
  async exportToGoogleDocs(
    documentId: string,
    accessToken: string,
    refreshToken?: string
  ): Promise<{ googleDocId: string; url: string }> {
    const response = await fetch(`${API_BASE_URL}/google-docs/export`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ documentId, accessToken, refreshToken }),
    });

    const result: ApiResponse<{ googleDocId: string; url: string }> = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Failed to export to Google Docs');
    }

    return result.data!;
  },

  // Import document from Google Docs
  async importFromGoogleDocs(
    googleDocId: string,
    accessToken: string,
    refreshToken?: string,
    parentId?: string | null
  ): Promise<Document> {
    const response = await fetch(`${API_BASE_URL}/google-docs/import`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ googleDocId, accessToken, refreshToken, parentId }),
    });

    const result: ApiResponse<Document> = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Failed to import from Google Docs');
    }

    return result.data!;
  },

  // Share Google Doc with specific user
  async shareWithUser(
    googleDocId: string,
    emailAddress: string,
    accessToken: string,
    role: 'reader' | 'writer' | 'commenter' = 'reader',
    refreshToken?: string
  ): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/google-docs/share`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        googleDocId,
        emailAddress,
        role,
        accessToken,
        refreshToken,
      }),
    });

    const result: ApiResponse = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Failed to share document');
    }
  },

  // Get shareable link for Google Doc
  async getShareableLink(
    googleDocId: string,
    accessToken: string,
    refreshToken?: string
  ): Promise<string> {
    const response = await fetch(`${API_BASE_URL}/google-docs/share`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        googleDocId,
        accessToken,
        refreshToken,
        publicLink: true,
      }),
    });

    const result: ApiResponse<{ shareableLink: string }> = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Failed to get shareable link');
    }

    return result.data!.shareableLink;
  },
};
