import { NextRequest, NextResponse } from 'next/server';
import { DocumentService } from '@/lib/services/documentService';

// POST /api/documents/bulk - Bulk update documents
export async function POST(request: NextRequest) {
  try {
    const { documents } = await request.json();

    if (!Array.isArray(documents)) {
      return NextResponse.json(
        {
          success: false,
          error: 'documents must be an array',
        },
        { status: 400 }
      );
    }

    const userId = request.headers.get('x-user-id') || undefined;
    const updated = await DocumentService.bulkUpdate(documents, userId);

    return NextResponse.json({
      success: true,
      data: updated,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to bulk update documents',
      },
      { status: 500 }
    );
  }
}
