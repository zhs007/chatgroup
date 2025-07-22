export interface Document {
  id: string;
  title: string;
  content: string;
  format: 'markdown' | 'json' | 'yaml' | 'text';
  tags: string[];
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string; // Role ID
  lastModifiedBy: string; // Role ID
  version: number;
  isArchived: boolean;
}

export interface DocumentVersion {
  versionId: string;
  documentId: string;
  content: string;
  metadata: Record<string, any>;
  createdAt: Date;
  createdBy: string;
  version: number;
  changeDescription?: string;
}

export interface DocumentSearchFilter {
  query?: string;
  tags?: string[];
  format?: string;
  createdBy?: string;
  isArchived?: boolean;
  dateRange?: {
    from: Date;
    to: Date;
  };
}

export interface DocumentCreateRequest {
  title: string;
  content: string;
  format: 'markdown' | 'json' | 'yaml' | 'text';
  tags?: string[];
  metadata?: Record<string, any>;
  createdBy: string;
}

export interface DocumentUpdateRequest {
  title?: string;
  content?: string;
  tags?: string[];
  metadata?: Record<string, any>;
  lastModifiedBy: string;
  changeDescription?: string;
}

export interface DocumentManagerStats {
  totalDocuments: number;
  archivedDocuments: number;
  totalVersions: number;
  lastModified: Date;
}
