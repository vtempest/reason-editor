import { NextRequest, NextResponse } from 'next/server';
import { GoogleDocsService } from '@/lib/services/googleDocsService';

// GET /api/google-docs/auth - Get OAuth URL for authorization
export async function GET(request: NextRequest) {
  try {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const redirectUri = process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/api/google-docs/callback';

    if (!clientId || !clientSecret) {
      return NextResponse.json(
        {
          success: false,
          error: 'Google OAuth credentials not configured. Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET environment variables.',
        },
        { status: 500 }
      );
    }

    const authUrl = GoogleDocsService.getAuthUrl({
      clientId,
      clientSecret,
      redirectUri,
    });

    return NextResponse.json({
      success: true,
      data: { authUrl },
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to generate auth URL',
      },
      { status: 500 }
    );
  }
}
