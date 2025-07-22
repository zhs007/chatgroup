import { 
  Document, 
  DocumentVersion, 
  DocumentSearchFilter, 
  DocumentCreateRequest,
  DocumentUpdateRequest,
  DocumentManagerStats 
} from '../types/document';

export class DocumentManager {
  private documents: Map<string, Document> = new Map();
  private versions: Map<string, DocumentVersion[]> = new Map();

  /**
   * 创建新文档
   */
  async createDocument(request: DocumentCreateRequest): Promise<Document> {
    const id = this.generateId();
    const now = new Date();
    
    const document: Document = {
      id,
      title: request.title,
      content: request.content,
      format: request.format,
      tags: request.tags || [],
      metadata: request.metadata || {},
      createdAt: now,
      updatedAt: now,
      createdBy: request.createdBy,
      lastModifiedBy: request.createdBy,
      version: 1,
      isArchived: false
    };

    this.documents.set(id, document);
    
    // 创建初始版本
    await this.createVersion(document, 'Initial creation');
    
    return document;
  }

  /**
   * 获取文档
   */
  async getDocument(id: string): Promise<Document | null> {
    const document = this.documents.get(id);
    return document || null;
  }

  /**
   * 更新文档
   */
  async updateDocument(id: string, request: DocumentUpdateRequest): Promise<Document | null> {
    const document = this.documents.get(id);
    if (!document) {
      return null;
    }

    const now = new Date();
    const updatedDocument: Document = {
      ...document,
      title: request.title !== undefined ? request.title : document.title,
      content: request.content !== undefined ? request.content : document.content,
      tags: request.tags !== undefined ? request.tags : document.tags,
      metadata: request.metadata !== undefined ? 
        { ...document.metadata, ...request.metadata } : document.metadata,
      updatedAt: now,
      lastModifiedBy: request.lastModifiedBy,
      version: document.version + 1
    };

    this.documents.set(id, updatedDocument);
    
    // 创建新版本
    await this.createVersion(updatedDocument, request.changeDescription);
    
    return updatedDocument;
  }

  /**
   * 删除文档（软删除 - 归档）
   */
  async deleteDocument(id: string): Promise<boolean> {
    const document = this.documents.get(id);
    if (!document) {
      return false;
    }

    document.isArchived = true;
    document.updatedAt = new Date();
    this.documents.set(id, document);
    
    return true;
  }

  /**
   * 硬删除文档和所有版本
   */
  async permanentDeleteDocument(id: string): Promise<boolean> {
    const deleted = this.documents.delete(id);
    this.versions.delete(id);
    return deleted;
  }

  /**
   * 搜索文档
   */
  async searchDocuments(filter: DocumentSearchFilter = {}): Promise<Document[]> {
    let results = Array.from(this.documents.values());

    // 过滤归档状态
    if (filter.isArchived !== undefined) {
      results = results.filter(doc => doc.isArchived === filter.isArchived);
    }

    // 文本搜索
    if (filter.query) {
      const query = filter.query.toLowerCase();
      results = results.filter(doc => 
        doc.title.toLowerCase().includes(query) ||
        doc.content.toLowerCase().includes(query) ||
        doc.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // 标签过滤
    if (filter.tags && filter.tags.length > 0) {
      results = results.filter(doc => 
        filter.tags!.some(tag => doc.tags.includes(tag))
      );
    }

    // 格式过滤
    if (filter.format) {
      results = results.filter(doc => doc.format === filter.format);
    }

    // 创建者过滤
    if (filter.createdBy) {
      results = results.filter(doc => doc.createdBy === filter.createdBy);
    }

    // 日期范围过滤
    if (filter.dateRange) {
      const { from, to } = filter.dateRange;
      results = results.filter(doc => 
        doc.createdAt >= from && doc.createdAt <= to
      );
    }

    return results.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
  }

  /**
   * 列出所有文档
   */
  async listDocuments(includeArchived: boolean = false): Promise<Document[]> {
    const documents = Array.from(this.documents.values());
    
    if (!includeArchived) {
      return documents.filter(doc => !doc.isArchived);
    }
    
    return documents.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
  }

  /**
   * 获取文档版本历史
   */
  async getDocumentVersions(documentId: string): Promise<DocumentVersion[]> {
    const versions = this.versions.get(documentId) || [];
    return versions.sort((a, b) => b.version - a.version);
  }

  /**
   * 获取特定版本的文档
   */
  async getDocumentVersion(documentId: string, version: number): Promise<DocumentVersion | null> {
    const versions = this.versions.get(documentId) || [];
    return versions.find(v => v.version === version) || null;
  }

  /**
   * 还原文档到指定版本
   */
  async restoreDocumentVersion(documentId: string, version: number, restoredBy: string): Promise<Document | null> {
    const targetVersion = await this.getDocumentVersion(documentId, version);
    if (!targetVersion) {
      return null;
    }

    const document = this.documents.get(documentId);
    if (!document) {
      return null;
    }

    const restoreRequest: DocumentUpdateRequest = {
      content: targetVersion.content,
      metadata: targetVersion.metadata,
      lastModifiedBy: restoredBy,
      changeDescription: `Restored to version ${version}`
    };

    return await this.updateDocument(documentId, restoreRequest);
  }

  /**
   * 获取统计信息
   */
  async getStats(): Promise<DocumentManagerStats> {
    const allDocs = Array.from(this.documents.values());
    const totalVersions = Array.from(this.versions.values())
      .reduce((sum, versions) => sum + versions.length, 0);
    
    const lastModified = allDocs.length > 0 
      ? new Date(Math.max(...allDocs.map(doc => doc.updatedAt.getTime())))
      : new Date();

    return {
      totalDocuments: allDocs.length,
      archivedDocuments: allDocs.filter(doc => doc.isArchived).length,
      totalVersions,
      lastModified
    };
  }

  /**
   * 创建文档版本
   */
  private async createVersion(document: Document, changeDescription?: string): Promise<void> {
    const versionId = this.generateId();
    const version: DocumentVersion = {
      versionId,
      documentId: document.id,
      content: document.content,
      metadata: { ...document.metadata },
      createdAt: document.updatedAt,
      createdBy: document.lastModifiedBy,
      version: document.version,
      changeDescription
    };

    const versions = this.versions.get(document.id) || [];
    versions.push(version);
    this.versions.set(document.id, versions);
  }

  /**
   * 生成唯一ID
   */
  private generateId(): string {
    return `doc_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }

  /**
   * 清空所有数据（用于测试）
   */
  async clearAll(): Promise<void> {
    this.documents.clear();
    this.versions.clear();
  }

  /**
   * 导出所有数据
   */
  async exportData(): Promise<{ documents: Document[], versions: Record<string, DocumentVersion[]> }> {
    const documents = Array.from(this.documents.values());
    const versions: Record<string, DocumentVersion[]> = {};
    
    for (const [docId, docVersions] of this.versions.entries()) {
      versions[docId] = docVersions;
    }

    return { documents, versions };
  }

  /**
   * 导入数据
   */
  async importData(data: { documents: Document[], versions: Record<string, DocumentVersion[]> }): Promise<void> {
    this.documents.clear();
    this.versions.clear();

    for (const doc of data.documents) {
      this.documents.set(doc.id, doc);
    }

    for (const [docId, docVersions] of Object.entries(data.versions)) {
      this.versions.set(docId, docVersions);
    }
  }
}

// 单例实例
export const documentManager = new DocumentManager();
