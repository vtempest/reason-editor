import { NextRequest, NextResponse } from 'next/server';
import { GoogleDocsService } from '@/lib/services/googleDocsService';

// POST /api/google-docs/share - Share Google Doc with specific user or get shareable link
export async function POST(request: NextRequest) {
  try {
    const { googleDocId, accessToken, refreshToken, emailAddress, role, publicLink } = await request.json();

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

    if (publicLink) {
      // Get shareable link
      const link = await googleDocsService.getShareableLink(googleDocId);
      return NextResponse.json({
        success: true,
        data: { shareableLink: link },
      });
    } else if (emailAddress) {
      // Share with specific user
      await googleDocsService.shareGoogleDoc(googleDocId, emailAddress, role || 'reader');
      return NextResponse.json({
        success: true,
        data: { message: `Document shared with ${emailAddress}` },
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          error: 'Either emailAddress or publicLink must be specified',
        },
        { status: 400 }
      );
    }
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to share Google Doc',
      },
      { status: 500 }
    );
  }
}
