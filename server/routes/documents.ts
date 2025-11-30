import { Router, Request, Response } from 'express';
import { db } from '../database';
import { CreateDocumentRequest, UpdateDocumentRequest, MoveDocumentRequest, ApiResponse } from '../types';

const router = Router();

// Get all documents
router.get('/', (req: Request, res: Response) => {
  try {
    const documents = db.getAllDocuments();
    const response: ApiResponse = {
      success: true,
      data: documents,
    };
    res.json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch documents',
    };
    res.status(500).json(response);
  }
});

// Get a single document by ID
router.get('/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const document = db.getDocument(id);

    if (!document) {
      const response: ApiResponse = {
        success: false,
        error: 'Document not found',
      };
      return res.status(404).json(response);
    }

    const response: ApiResponse = {
      success: true,
      data: document,
    };
    res.json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch document',
    };
    res.status(500).json(response);
  }
});

// Create a new document
router.post('/', (req: Request, res: Response) => {
  try {
    const { title, content = '', parentId = null }: CreateDocumentRequest = req.body;

    if (!title) {
      const response: ApiResponse = {
        success: false,
        error: 'Title is required',
      };
      return res.status(400).json(response);
    }

    const newDocument = db.createDocument({
      title,
      content,
      parentId,
      isExpanded: false,
    });

    const response: ApiResponse = {
      success: true,
      data: newDocument,
    };
    res.status(201).json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create document',
    };
    res.status(500).json(response);
  }
});

// Update a document
router.put('/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates: UpdateDocumentRequest = req.body;

    const updatedDocument = db.updateDocument(id, updates);

    if (!updatedDocument) {
      const response: ApiResponse = {
        success: false,
        error: 'Document not found',
      };
      return res.status(404).json(response);
    }

    const response: ApiResponse = {
      success: true,
      data: updatedDocument,
    };
    res.json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update document',
    };
    res.status(500).json(response);
  }
});

// Delete a document
router.delete('/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = db.deleteDocument(id);

    if (!deleted) {
      const response: ApiResponse = {
        success: false,
        error: 'Document not found',
      };
      return res.status(404).json(response);
    }

    const response: ApiResponse = {
      success: true,
      data: { id },
    };
    res.json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete document',
    };
    res.status(500).json(response);
  }
});

// Duplicate a document
router.post('/:id/duplicate', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const duplicated = db.duplicateDocument(id);

    if (!duplicated) {
      const response: ApiResponse = {
        success: false,
        error: 'Document not found',
      };
      return res.status(404).json(response);
    }

    const response: ApiResponse = {
      success: true,
      data: duplicated,
    };
    res.status(201).json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to duplicate document',
    };
    res.status(500).json(response);
  }
});

// Move a document
router.post('/move', (req: Request, res: Response) => {
  try {
    const { draggedId, targetId, position }: MoveDocumentRequest = req.body;

    if (!draggedId || !position) {
      const response: ApiResponse = {
        success: false,
        error: 'draggedId and position are required',
      };
      return res.status(400).json(response);
    }

    const moved = db.moveDocument(draggedId, targetId, position);

    if (!moved) {
      const response: ApiResponse = {
        success: false,
        error: 'Failed to move document (invalid operation)',
      };
      return res.status(400).json(response);
    }

    const response: ApiResponse = {
      success: true,
      data: { draggedId, targetId, position },
    };
    res.json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to move document',
    };
    res.status(500).json(response);
  }
});

// Search documents
router.get('/search/:query', (req: Request, res: Response) => {
  try {
    const { query } = req.params;
    const results = db.searchDocuments(query);

    const response: ApiResponse = {
      success: true,
      data: results,
    };
    res.json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to search documents',
    };
    res.status(500).json(response);
  }
});

// Bulk update (for syncing)
router.post('/bulk', (req: Request, res: Response) => {
  try {
    const { documents } = req.body;

    if (!Array.isArray(documents)) {
      const response: ApiResponse = {
        success: false,
        error: 'documents must be an array',
      };
      return res.status(400).json(response);
    }

    db.bulkUpdate(documents);

    const response: ApiResponse = {
      success: true,
      data: db.getAllDocuments(),
    };
    res.json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to bulk update documents',
    };
    res.status(500).json(response);
  }
});

export default router;
