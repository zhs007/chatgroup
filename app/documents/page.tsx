'use client';

import { useState, useEffect } from 'react';
import { Document, DocumentSearchFilter } from '@/types/document';

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchFilter, setSearchFilter] = useState<DocumentSearchFilter>({});

  // 表单状态
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    format: 'markdown' as const,
    tags: '',
    metadata: ''
  });

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/documents?action=list');
      const data = await response.json();
      if (data.documents) {
        setDocuments(data.documents);
      }
    } catch (error) {
      console.error('Failed to load documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const searchDocuments = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append('action', 'search');
      
      if (searchFilter.query) params.append('query', searchFilter.query);
      if (searchFilter.tags?.length) params.append('tags', searchFilter.tags.join(','));
      if (searchFilter.format) params.append('format', searchFilter.format);
      if (searchFilter.createdBy) params.append('createdBy', searchFilter.createdBy);
      if (searchFilter.isArchived !== undefined) params.append('isArchived', searchFilter.isArchived.toString());

      const response = await fetch(`/api/documents?${params}`);
      const data = await response.json();
      if (data.documents) {
        setDocuments(data.documents);
      }
    } catch (error) {
      console.error('Failed to search documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const createDocument = async () => {
    try {
      const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(Boolean);
      let metadata = {};
      
      if (formData.metadata.trim()) {
        try {
          metadata = JSON.parse(formData.metadata);
        } catch (error) {
          alert('Metadata must be valid JSON');
          return;
        }
      }

      const response = await fetch('/api/documents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'create',
          title: formData.title,
          content: formData.content,
          format: formData.format,
          tags: tagsArray,
          metadata,
          createdBy: 'user' // 在实际应用中应该从会话中获取
        }),
      });

      if (response.ok) {
        setFormData({
          title: '',
          content: '',
          format: 'markdown',
          tags: '',
          metadata: ''
        });
        setShowCreateForm(false);
        loadDocuments();
      } else {
        const data = await response.json();
        alert(`Failed to create document: ${data.error}`);
      }
    } catch (error) {
      console.error('Failed to create document:', error);
      alert('Failed to create document');
    }
  };

  const viewDocument = async (documentId: string) => {
    try {
      const response = await fetch(`/api/documents?action=get&documentId=${documentId}`);
      const data = await response.json();
      if (data.document) {
        setSelectedDocument(data.document);
      }
    } catch (error) {
      console.error('Failed to load document:', error);
    }
  };

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleString();
  };

  const formatContent = (content: string, format: string) => {
    if (format === 'json') {
      try {
        return JSON.stringify(JSON.parse(content), null, 2);
      } catch {
        return content;
      }
    }
    return content;
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">项目文档管理</h1>
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md"
            >
              新建文档
            </button>
          </div>

          {/* 搜索区域 */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold mb-3">搜索文档</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="text"
                placeholder="搜索关键词..."
                value={searchFilter.query || ''}
                onChange={(e) => setSearchFilter({ ...searchFilter, query: e.target.value })}
                className="border border-gray-300 rounded-md px-3 py-2"
              />
              <input
                type="text"
                placeholder="标签（用逗号分隔）..."
                value={searchFilter.tags?.join(',') || ''}
                onChange={(e) => setSearchFilter({ 
                  ...searchFilter, 
                  tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) 
                })}
                className="border border-gray-300 rounded-md px-3 py-2"
              />
              <select
                value={searchFilter.format || ''}
                onChange={(e) => setSearchFilter({ ...searchFilter, format: e.target.value || undefined })}
                className="border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="">所有格式</option>
                <option value="markdown">Markdown</option>
                <option value="json">JSON</option>
                <option value="yaml">YAML</option>
                <option value="text">Text</option>
              </select>
            </div>
            <div className="mt-4 flex gap-2">
              <button
                onClick={searchDocuments}
                className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md"
              >
                搜索
              </button>
              <button
                onClick={() => {
                  setSearchFilter({});
                  loadDocuments();
                }}
                className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-md"
              >
                重置
              </button>
            </div>
          </div>

          {/* 文档列表 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 文档卡片列表 */}
            <div>
              <h3 className="text-lg font-semibold mb-4">文档列表 ({documents.length})</h3>
              {loading ? (
                <div className="text-center py-4">加载中...</div>
              ) : documents.length === 0 ? (
                <div className="text-center py-4 text-gray-500">暂无文档</div>
              ) : (
                <div className="space-y-3">
                  {documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md cursor-pointer transition-shadow"
                      onClick={() => viewDocument(doc.id)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-lg text-blue-600 hover:text-blue-800">
                          {doc.title}
                        </h4>
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                          {doc.format}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 mb-2">
                        创建者: {doc.createdBy} | 版本: {doc.version}
                      </div>
                      {doc.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-2">
                          {doc.tags.map((tag, index) => (
                            <span key={index} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="text-xs text-gray-500">
                        更新时间: {formatDate(doc.updatedAt)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 文档详情 */}
            <div>
              {selectedDocument ? (
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold">{selectedDocument.title}</h3>
                    <button
                      onClick={() => setSelectedDocument(null)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      ✕
                    </button>
                  </div>
                  
                  <div className="mb-4 text-sm text-gray-600">
                    <div>格式: {selectedDocument.format}</div>
                    <div>创建者: {selectedDocument.createdBy}</div>
                    <div>最后修改: {selectedDocument.lastModifiedBy}</div>
                    <div>版本: {selectedDocument.version}</div>
                    <div>创建时间: {formatDate(selectedDocument.createdAt)}</div>
                    <div>更新时间: {formatDate(selectedDocument.updatedAt)}</div>
                  </div>

                  {selectedDocument.tags.length > 0 && (
                    <div className="mb-4">
                      <div className="text-sm font-medium mb-2">标签:</div>
                      <div className="flex flex-wrap gap-1">
                        {selectedDocument.tags.map((tag, index) => (
                          <span key={index} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mb-4">
                    <div className="text-sm font-medium mb-2">内容:</div>
                    <pre className="bg-gray-50 p-3 rounded-md text-sm overflow-auto max-h-96 whitespace-pre-wrap">
                      {formatContent(selectedDocument.content, selectedDocument.format)}
                    </pre>
                  </div>

                  {Object.keys(selectedDocument.metadata).length > 0 && (
                    <div>
                      <div className="text-sm font-medium mb-2">元数据:</div>
                      <pre className="bg-gray-50 p-3 rounded-md text-sm overflow-auto">
                        {JSON.stringify(selectedDocument.metadata, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              ) : (
                <div className="border border-gray-200 rounded-lg p-4 text-center text-gray-500">
                  点击左侧文档查看详情
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 创建文档模态框 */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">创建新文档</h2>
              <button
                onClick={() => setShowCreateForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">标题 *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="输入文档标题..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">格式 *</label>
                <select
                  value={formData.format}
                  onChange={(e) => setFormData({ ...formData, format: e.target.value as any })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                >
                  <option value="markdown">Markdown</option>
                  <option value="json">JSON</option>
                  <option value="yaml">YAML</option>
                  <option value="text">Text</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">标签</label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="用逗号分隔，如: 设计,游戏,创意"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">内容 *</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 h-40"
                  placeholder="输入文档内容..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">元数据 (JSON格式)</label>
                <textarea
                  value={formData.metadata}
                  onChange={(e) => setFormData({ ...formData, metadata: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 h-20"
                  placeholder='{"type": "design", "priority": "high"}'
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-medium py-2 px-4 rounded-md"
                >
                  取消
                </button>
                <button
                  onClick={createDocument}
                  disabled={!formData.title || !formData.content}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-medium py-2 px-4 rounded-md"
                >
                  创建
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
