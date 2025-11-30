import { NextRequest, NextResponse } from 'next/server';
import { statements } from '@/lib/db/sqlite';

// PUT /api/quotes/[id] - Update a quote
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { text, source, author, url, pageNumber, tags } = body;

    if (!text) {
      return NextResponse.json(
        {
          success: false,
          error: 'text is required',
        },
        { status: 400 }
      );
    }

    statements.updateQuote.run(
      text,
      source || null,
      author || null,
      url || null,
      pageNumber || null,
      tags ? JSON.stringify(tags) : null,
      params.id
    );

    return NextResponse.json({
      success: true,
      data: {
        id: params.id,
        text,
        source,
        author,
        url,
        pageNumber,
        tags,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to update quote',
      },
      { status: 500 }
    );
  }
}

// DELETE /api/quotes/[id] - Delete a quote
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    statements.deleteQuote.run(params.id);

    return NextResponse.json({
      success: true,
      data: { id: params.id },
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to delete quote',
      },
      { status: 500 }
    );
  }
}
