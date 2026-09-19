import { NextResponse } from 'next/server';
import { getMongoDbDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const db = await getMongoDbDatabase();
    if (!db) return NextResponse.json({ success: false, message: 'MongoDB not configured' }, { status: 400 });

    const { id } = await params;

    let filter: Record<string, unknown>;
    try {
      filter = { _id: new ObjectId(id) };
    } catch {
      filter = { id };
    }

    const event = await db.collection('events').findOne(filter);
    if (!event) {
      return NextResponse.json({ success: false, message: 'Event not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: event });
  } catch (error: any) {
    console.error('Error fetching event:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const db = await getMongoDbDatabase();
    if (!db) return NextResponse.json({ success: false, message: 'MongoDB not configured' }, { status: 400 });

    const body = await request.json();
    const { id } = await params;

    // Try ObjectId first, then string id field
    let filter: Record<string, unknown>;
    try {
      filter = { _id: new ObjectId(id) };
    } catch {
      filter = { id };
    }

    const { _id, ...updateFields } = body;
    const result = await db.collection('events').updateOne(filter, { $set: { ...updateFields, updatedAt: new Date() } });

    if (result.matchedCount === 0) {
      return NextResponse.json({ success: false, message: 'Event not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Event updated' });
  } catch (error: any) {
    console.error('Error updating event:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const db = await getMongoDbDatabase();
    if (!db) return NextResponse.json({ success: false, message: 'MongoDB not configured' }, { status: 400 });

    const { id } = await params;

    let filter: Record<string, unknown>;
    try {
      filter = { _id: new ObjectId(id) };
    } catch {
      filter = { id };
    }

    const result = await db.collection('events').deleteOne(filter);

    if (result.deletedCount === 0) {
      return NextResponse.json({ success: false, message: 'Event not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Event deleted' });
  } catch (error: any) {
    console.error('Error deleting event:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
