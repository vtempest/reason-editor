export interface Document {
  id: string;
  title: string;
  content: string;
  parentId: string | null;
  children?: Document[];
  isExpanded?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateDocumentRequest {
  title: string;
  content?: string;
  parentId?: string | null;
}

export interface UpdateDocumentRequest {
  title?: string;
  content?: string;
  parentId?: string | null;
  isExpanded?: boolean;
}

export interface MoveDocumentRequest {
  draggedId: string;
  targetId: string | null;
  position: 'before' | 'after' | 'child';
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}
