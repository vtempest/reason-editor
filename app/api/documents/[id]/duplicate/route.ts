import { NextRequest, NextResponse } from 'next/server';
import { DocumentService } from '@/lib/services/documentService';

// POST /api/documents/[id]/duplicate - Duplicate a document
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = request.headers.get('x-user-id') || undefined;
    const duplicated = DocumentService.duplicateDocument(params.id, userId);

    if (!duplicated) {
      return NextResponse.json(
        {
          success: false,
          error: 'Document not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: duplicated,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to duplicate document',
      },
      { status: 500 }
    );
  }
}
