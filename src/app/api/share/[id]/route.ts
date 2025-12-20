import { NextRequest, NextResponse } from 'next/server';
import { tursoQueries } from '@/lib/db/turso';

// GET /api/share/[id] - Get a shared document
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Look up the share token
    const shareToken = await tursoQueries.getShareToken(params.id);

    if (!shareToken) {
      return NextResponse.json(
        {
          success: false,
          error: 'Share link not found',
        },
        { status: 404 }
      );
    }

    // Check if the share token has expired
    if (shareToken.expiresAt) {
      const expiryDate = new Date(shareToken.expiresAt);
      if (expiryDate < new Date()) {
        return NextResponse.json(
          {
            success: false,
            error: 'Share link has expired',
          },
          { status: 410 }
        );
      }
    }

    // Fetch the document
    const document = await tursoQueries.getDocument(shareToken.documentId);

    if (!document) {
      return NextResponse.json(
        {
          success: false,
          error: 'Document not found',
        },
        { status: 404 }
      );
    }

    // Return the document
    return NextResponse.json({
      success: true,
      data: document,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch shared document',
      },
      { status: 500 }
    );
  }
}
