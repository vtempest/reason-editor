import { NextRequest, NextResponse } from 'next/server';
import { GoogleDocsService } from '@/lib/services/googleDocsService';
import { DocumentService } from '@/lib/services/documentService';

// POST /api/google-docs/import - Import document from Google Docs
export async function POST(request: NextRequest) {
  try {
    const { googleDocId, accessToken, refreshToken, parentId } = await request.json();

    if (!googleDocId || !accessToken) {
      return NextResponse.json(
        {
          success: false,
          error: 'googleDocId and accessToken are required',
        },
        { status: 400 }
      );
    }

    // Get Google OAuth credentials
    const clientId = process.env.GOOGLE_CLIENT_ID!;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET!;
    const redirectUri = process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/api/google-docs/callback';

    // Create Google Docs service
    const googleDocsService = new GoogleDocsService(
      { clientId, clientSecret, redirectUri },
      accessToken,
      refreshToken
    );

    // Import from Google Docs
    const imported = await googleDocsService.importFromGoogleDocs(googleDocId);

    // Create a new document with imported content
    const userId = request.headers.get('x-user-id') || undefined;
    const newDocument = await DocumentService.createDocument(
      {
        title: imported.title,
        content: imported.content,
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
        error: error.message || 'Failed to import from Google Docs',
      },
      { status: 500 }
    );
  }
}
