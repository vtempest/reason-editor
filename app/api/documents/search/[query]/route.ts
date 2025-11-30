import { NextRequest, NextResponse } from 'next/server';
import { DocumentService } from '@/lib/services/documentService';

// GET /api/documents/search/[query] - Search documents
export async function GET(
  request: NextRequest,
  { params }: { params: { query: string } }
) {
  try {
    const query = decodeURIComponent(params.query);
    const results = DocumentService.searchDocuments(query);

    return NextResponse.json({
      success: true,
      data: results,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to search documents',
      },
      { status: 500 }
    );
  }
}
