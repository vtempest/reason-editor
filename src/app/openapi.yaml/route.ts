import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'openapi.yaml');
    const fileContents = await readFile(filePath, 'utf8');

    return new NextResponse(fileContents, {
      headers: {
        'Content-Type': 'application/x-yaml',
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to load OpenAPI specification' },
      { status: 500 }
    );
  }
}
