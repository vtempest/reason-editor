import { NextRequest, NextResponse } from 'next/server';
import { DocumentService } from '@/lib/services/documentService';

// POST /api/documents/move - Move a document
export async function POST(request: NextRequest) {
  try {
    const { draggedId, targetId, position } = await request.json();

    if (!draggedId || !position) {
      return NextResponse.json(
        {
          success: false,
          error: 'draggedId and position are required',
        },
        { status: 400 }
      );
    }

    const moved = await DocumentService.moveDocument(draggedId, targetId, position);

    if (!moved) {
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to move document (invalid operation)',
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data: { draggedId, targetId, position },
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to move document',
      },
      { status: 500 }
    );
  }
}
