import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export async function POST(request: Request) {
  try {
    const data = await request.formData();
    const file: File | null = data.get('file') as unknown as File;
    const directory: string = data.get('directory') as string || 'misc';
    const customFilename: string | null = data.get('filename') as string | null;

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create the directory if it doesn't exist
    const uploadDir = join(process.cwd(), 'public', directory);
    await mkdir(uploadDir, { recursive: true });

    // Generate unique filename
    const ext = file.name.split('.').pop() || 'png';
    const filename = customFilename ? `${customFilename}.${ext}` : `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const filePath = join(uploadDir, filename);

    // Write file to disk
    await writeFile(filePath, buffer);

    // Return the public URL path
    const publicUrl = `/${directory}/${filename}`;

    return NextResponse.json({ success: true, url: publicUrl });
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
