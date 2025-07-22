import { NextRequest, NextResponse } from 'next/server';
import { documentManager } from '@/lib/document-manager';
import { DocumentCreateRequest, DocumentUpdateRequest, DocumentSearchFilter } from '@/types/document';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const documentId = searchParams.get('documentId');

    switch (action) {
      case 'list':
        const includeArchived = searchParams.get('includeArchived') === 'true';
        const documents = await documentManager.listDocuments(includeArchived);
        return NextResponse.json({ documents });

      case 'get':
        if (!documentId) {
          return NextResponse.json({ error: 'Document ID is required' }, { status: 400 });
        }
        const document = await documentManager.getDocument(documentId);
        if (!document) {
          return NextResponse.json({ error: 'Document not found' }, { status: 404 });
        }
        return NextResponse.json({ document });

      case 'versions':
        if (!documentId) {
          return NextResponse.json({ error: 'Document ID is required' }, { status: 400 });
        }
        const versions = await documentManager.getDocumentVersions(documentId);
        return NextResponse.json({ versions });

      case 'version':
        if (!documentId) {
          return NextResponse.json({ error: 'Document ID is required' }, { status: 400 });
        }
        const versionNumber = parseInt(searchParams.get('version') || '');
        if (isNaN(versionNumber)) {
          return NextResponse.json({ error: 'Valid version number is required' }, { status: 400 });
        }
        const version = await documentManager.getDocumentVersion(documentId, versionNumber);
        if (!version) {
          return NextResponse.json({ error: 'Version not found' }, { status: 404 });
        }
        return NextResponse.json({ version });

      case 'search':
        const searchFilter: DocumentSearchFilter = {};
        
        const query = searchParams.get('query');
        if (query) searchFilter.query = query;
        
        const tags = searchParams.get('tags');
        if (tags) searchFilter.tags = tags.split(',');
        
        const format = searchParams.get('format');
        if (format) searchFilter.format = format;
        
        const createdBy = searchParams.get('createdBy');
        if (createdBy) searchFilter.createdBy = createdBy;
        
        const isArchived = searchParams.get('isArchived');
        if (isArchived !== null) searchFilter.isArchived = isArchived === 'true';
        
        const from = searchParams.get('from');
        const to = searchParams.get('to');
        if (from && to) {
          searchFilter.dateRange = {
            from: new Date(from),
            to: new Date(to)
          };
        }
        
        const searchResults = await documentManager.searchDocuments(searchFilter);
        return NextResponse.json({ documents: searchResults });

      case 'stats':
        const stats = await documentManager.getStats();
        return NextResponse.json({ stats });

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Document API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    switch (action) {
      case 'create':
        const { title, content, format, tags, metadata, createdBy } = body;
        if (!title || !content || !format || !createdBy) {
          return NextResponse.json({ 
            error: 'Title, content, format, and createdBy are required' 
          }, { status: 400 });
        }

        const createRequest: DocumentCreateRequest = {
          title,
          content,
          format,
          tags: tags || [],
          metadata: metadata || {},
          createdBy
        };

        const newDocument = await documentManager.createDocument(createRequest);
        return NextResponse.json({ document: newDocument });

      case 'update':
        const { documentId, ...updateData } = body;
        if (!documentId || !updateData.lastModifiedBy) {
          return NextResponse.json({ 
            error: 'Document ID and lastModifiedBy are required' 
          }, { status: 400 });
        }

        const updateRequest: DocumentUpdateRequest = {
          title: updateData.title,
          content: updateData.content,
          tags: updateData.tags,
          metadata: updateData.metadata,
          lastModifiedBy: updateData.lastModifiedBy,
          changeDescription: updateData.changeDescription
        };

        const updatedDocument = await documentManager.updateDocument(documentId, updateRequest);
        if (!updatedDocument) {
          return NextResponse.json({ error: 'Document not found' }, { status: 404 });
        }
        return NextResponse.json({ document: updatedDocument });

      case 'restore':
        const { documentId: restoreDocId, version, restoredBy } = body;
        if (!restoreDocId || !version || !restoredBy) {
          return NextResponse.json({ 
            error: 'Document ID, version, and restoredBy are required' 
          }, { status: 400 });
        }

        const restoredDocument = await documentManager.restoreDocumentVersion(
          restoreDocId, 
          version, 
          restoredBy
        );
        if (!restoredDocument) {
          return NextResponse.json({ error: 'Document or version not found' }, { status: 404 });
        }
        return NextResponse.json({ document: restoredDocument });

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Document API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const documentId = searchParams.get('documentId');
    const permanent = searchParams.get('permanent') === 'true';

    if (!documentId) {
      return NextResponse.json({ error: 'Document ID is required' }, { status: 400 });
    }

    let success: boolean;
    if (permanent) {
      success = await documentManager.permanentDeleteDocument(documentId);
    } else {
      success = await documentManager.deleteDocument(documentId);
    }

    if (!success) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      message: permanent ? 'Document permanently deleted' : 'Document archived' 
    });
  } catch (error) {
    console.error('Document API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
