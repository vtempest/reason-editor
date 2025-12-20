import { NextRequest, NextResponse } from 'next/server';
import { DocumentService } from '@/lib/services/documentService';

// GET /api/documents - Get all documents
export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id') || undefined;
    const documents = await DocumentService.getAllDocuments(userId);
    const tree = DocumentService.buildTree(documents);

    return NextResponse.json({
      success: true,
      data: tree,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch documents',
      },
      { status: 500 }
    );
  }
}

// POST /api/documents - Create a new document
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, content, parentId } = body;

    if (!title) {
      return NextResponse.json(
        {
          success: false,
          error: 'Title is required',
        },
        { status: 400 }
      );
    }

    const userId = request.headers.get('x-user-id') || undefined;
    const newDocument = await DocumentService.createDocument(
      {
        title,
        content: content || '',
        parentId: parentId || null,
        isExpanded: false,
      },
      userId
    );

    return NextResponse.json(
      {
        success: true,
        data: newDocument,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to create document',
      },
      { status: 500 }
    );
  }
}
