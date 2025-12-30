import { NextRequest, NextResponse } from "next/server";

/**
 * File Operations API
 *
 * Note: Since the file system is stored in localStorage (client-side),
 * these routes are designed to work with the client-side data structure.
 * In a production environment, you would integrate with a server-side
 * storage system (database, S3, etc.)
 */

export const dynamic = "force-dynamic";

/**
 * GET /api/files
 * Returns all files in the file system
 *
 * Query params:
 * - parentId: Filter by parent folder (optional)
 * - type: Filter by type ('file' or 'folder') (optional)
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const parentId = searchParams.get("parentId");
    const type = searchParams.get("type");

    // Since localStorage is client-side only, we return a response
    // indicating that the client should use the shared file system utility
    return NextResponse.json(
      {
        success: true,
        message: "Use getFileSystem() from @/lib/fileSystem on the client-side",
        note: "This API route is for demonstration. In production, integrate with server-side storage.",
        filters: {
          parentId: parentId || null,
          type: type || null,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch files",
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/files
 * Create a new file or folder
 *
 * Body:
 * - name: string (required)
 * - type: 'file' | 'folder' (required)
 * - parentId: string | null (required)
 * - content: string (optional, for files)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, type, parentId, content } = body;

    // Validate required fields
    if (!name || !type) {
      return NextResponse.json(
        {
          success: false,
          error: "name and type are required",
        },
        { status: 400 }
      );
    }

    if (type !== "file" && type !== "folder") {
      return NextResponse.json(
        {
          success: false,
          error: "type must be 'file' or 'folder'",
        },
        { status: 400 }
      );
    }

    // Return success with instructions
    return NextResponse.json(
      {
        success: true,
        message: "Use createFileSystemItem() from @/lib/fileSystem on the client-side",
        note: "This API route is for demonstration. In production, integrate with server-side storage.",
        data: {
          name,
          type,
          parentId: parentId || null,
          content: content || null,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to create file/folder",
      },
      { status: 500 }
    );
  }
}
