import { NextRequest, NextResponse } from 'next/server';
import { GoogleDocsService } from '@/lib/services/googleDocsService';

// GET /api/google-docs/callback - OAuth callback handler
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');

    if (!code) {
      return NextResponse.json(
        {
          success: false,
          error: 'Authorization code not provided',
        },
        { status: 400 }
      );
    }

    const clientId = process.env.GOOGLE_CLIENT_ID!;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET!;
    const redirectUri = process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/api/google-docs/callback';

    const tokens = await GoogleDocsService.getTokensFromCode(
      { clientId, clientSecret, redirectUri },
      code
    );

    // In production, you'd save these tokens securely (database, session, etc.)
    // For now, return them to the client
    return NextResponse.json({
      success: true,
      data: {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        message: 'Authorization successful! Store these tokens securely.',
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to exchange authorization code',
      },
      { status: 500 }
    );
  }
}
