import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const ARTIFACT_IMG = 'C:\\Users\\AANANDI\\.gemini\\antigravity-ide\\brain\\63e9cf25-56c8-44b4-b124-0062c1ecf79d\\quantum_computer_white_bg_1787214579031.jpg';
const PUBLIC_IMG = path.join(process.cwd(), 'public', 'quantum-computer-white.jpg');

export async function GET() {
  try {
    // Copy to public if not exists
    if (fs.existsSync(ARTIFACT_IMG) && !fs.existsSync(PUBLIC_IMG)) {
      fs.copyFileSync(ARTIFACT_IMG, PUBLIC_IMG);
    }

    const fileToRead = fs.existsSync(PUBLIC_IMG) ? PUBLIC_IMG : ARTIFACT_IMG;
    if (fs.existsSync(fileToRead)) {
      const buffer = fs.readFileSync(fileToRead);
      return new NextResponse(buffer, {
        headers: {
          'Content-Type': 'image/jpeg',
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      });
    }

    return NextResponse.json({ error: 'Image not found' }, { status: 404 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
