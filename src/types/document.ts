// Extended document types with metadata and research quotes

export interface ResearchQuote {
  id: string;
  text: string;
  source?: string;
  author?: string;
  url?: string;
  pageNumber?: string;
  tags?: string[];
  createdAt: string;
  documentId: string;
}

export interface DocumentMetadata {
  tags?: string[];
  category?: string;
  status?: 'draft' | 'in-progress' | 'review' | 'final';
  dueDate?: string;
  priority?: 'low' | 'medium' | 'high';
  customFields?: Record<string, any>;
}

export interface SharingInfo {
  isPublic: boolean;
  sharedWith?: Array<{
    email: string;
    role: 'viewer' | 'editor';
    sharedAt: string;
  }>;
  shareLink?: string;
  googleDocId?: string;
}

export interface DocumentExtended {
  id: string;
  title: string;
  content: string;
  parentId: string | null;
  children?: DocumentExtended[];
  isExpanded?: boolean;
  createdAt?: string;
  updatedAt?: string;
  metadata?: DocumentMetadata;
  sharing?: SharingInfo;
  quotes?: ResearchQuote[];
}
