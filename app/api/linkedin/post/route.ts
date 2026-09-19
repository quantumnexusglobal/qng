import { NextResponse } from 'next/server';
import { postToLinkedIn } from '@/lib/linkedin';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const text = (body.text || '').trim();
    if (!text) {
      return NextResponse.json({ success: false, error: 'Post text is required.' }, { status: 400 });
    }

    const result = await postToLinkedIn(text);
    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 });
    }
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error posting to LinkedIn:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
