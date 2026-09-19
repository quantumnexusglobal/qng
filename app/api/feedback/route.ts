import { NextResponse } from 'next/server';
import { getMongoDbDatabase } from '@/lib/mongodb';

/**
 * Feedback / testimonial submissions.
 * Public POST from /feedback, admin-moderated (status: pending/approved/rejected)
 * from /admin/feedback. Approved entries show on the homepage Testimonials section.
 */

export async function GET(request: Request) {
  try {
    const db = await getMongoDbDatabase();
    if (!db) return NextResponse.json({ success: false, message: 'MongoDB not configured' }, { status: 400 });

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const filter = status ? { status } : {};

    const docs = await db.collection('feedback_testimonials').find(filter).sort({ createdAt: -1 }).toArray();
    return NextResponse.json({ success: true, data: docs });
  } catch (error: any) {
    console.error('Error fetching feedback:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const db = await getMongoDbDatabase();
    if (!db) return NextResponse.json({ success: false, message: 'MongoDB not configured' }, { status: 400 });

    const body = await request.json();
    if (!body.name || !String(body.name).trim() || !body.message || !String(body.message).trim()) {
      return NextResponse.json({ success: false, message: 'Name and feedback message are required.' }, { status: 400 });
    }

    const doc = {
      id: `fb-${Date.now()}`,
      name: String(body.name).trim(),
      email: body.email ? String(body.email).trim() : '',
      role: body.role ? String(body.role).trim() : '',
      organization: body.organization ? String(body.organization).trim() : '',
      message: String(body.message).trim(),
      rating: typeof body.rating === 'number' && body.rating >= 1 && body.rating <= 5 ? body.rating : undefined,
      photoUrl: body.photoUrl ? String(body.photoUrl).trim() : '',
      status: 'pending' as const,
      createdAt: new Date(),
    };

    await db.collection('feedback_testimonials').insertOne(doc);
    return NextResponse.json({ success: true, data: doc }, { status: 201 });
  } catch (error: any) {
    console.error('Error saving feedback:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const db = await getMongoDbDatabase();
    if (!db) return NextResponse.json({ success: false, message: 'MongoDB not configured' }, { status: 400 });

    const body = await request.json();
    const { id, status } = body;
    if (!id || !['pending', 'approved', 'rejected'].includes(status)) {
      return NextResponse.json({ success: false, message: 'Missing or invalid id/status.' }, { status: 400 });
    }

    const result = await db.collection('feedback_testimonials').updateOne({ id }, { $set: { status } });
    if (result.matchedCount === 0) {
      return NextResponse.json({ success: false, message: 'Submission not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error updating feedback:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const db = await getMongoDbDatabase();
    if (!db) return NextResponse.json({ success: false, message: 'MongoDB not configured' }, { status: 400 });

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ success: false, message: 'Missing id' }, { status: 400 });

    await db.collection('feedback_testimonials').deleteOne({ id });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting feedback:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
