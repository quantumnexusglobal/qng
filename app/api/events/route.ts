import { NextResponse } from 'next/server';
import { getMongoDbDatabase } from '@/lib/mongodb';
import { getAttendeeCountMap, combineAttendeeCount } from '@/lib/attendee-counts';

/**
 * Event schema (MongoDB document)
 * {
 *   id: string,
 *   title: string,
 *   description: string,
 *   dateTime: ISODate string,
 *   location: string,
 *   imageUrl?: string,
 *   registrationLink?: string,
 *   category?: string,
 *   attendees?: string,
 *   badge?: string,
 *   status?: 'upcoming' | 'past',
 *   createdAt: Date,
 * }
 */

export async function GET() {
  try {
    const db = await getMongoDbDatabase();
    if (!db) return NextResponse.json({ success: false, message: 'MongoDB not configured' }, { status: 400 });
    const events = await db.collection('events').find({}).sort({ eventDate: 1 }).toArray();

    // Merge in real registration counts so every page fetching events shows
    // actual attendance, not just the admin-set seed number.
    const ids = events.map((e: any) => e.id).filter(Boolean);
    const countMap = await getAttendeeCountMap(ids);
    const eventsWithRealCounts = events.map((e: any) => ({
      ...e,
      attendees: String(combineAttendeeCount(e.attendees, countMap[e.id] || 0)),
    }));

    return NextResponse.json({ success: true, data: eventsWithRealCounts });
  } catch (error: any) {
    console.error('Error fetching events:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const db = await getMongoDbDatabase();
    if (!db) return NextResponse.json({ success: false, message: 'MongoDB not configured' }, { status: 400 });
    const body = await request.json();
    const event = {
      ...body,
      createdAt: new Date(),
      eventDate: body.eventDate ? new Date(body.eventDate) : null,
    };
    const result = await db.collection('events').insertOne(event);
    return NextResponse.json({ success: true, insertedId: result.insertedId }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating event:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const db = await getMongoDbDatabase();
    if (!db) return NextResponse.json({ success: false, message: 'MongoDB not configured' }, { status: 400 });
    const body = await request.json();
    const { id, _id, ...updateFields } = body;
    if (!id) return NextResponse.json({ success: false, message: 'Missing event id' }, { status: 400 });
    const result = await db.collection('events').updateOne(
      { id },
      { $set: { ...updateFields, updatedAt: new Date() } },
      { upsert: false }
    );
    return NextResponse.json({ success: true, matchedCount: result.matchedCount });
  } catch (error: any) {
    console.error('Error updating event:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const db = await getMongoDbDatabase();
    if (!db) return NextResponse.json({ success: false, message: 'MongoDB not configured' }, { status: 400 });
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ success: false, message: 'Missing event id' }, { status: 400 });
    await db.collection('events').deleteOne({ id });
    return NextResponse.json({ success: true, message: 'Event deleted' });
  } catch (error: any) {
    console.error('Error deleting event:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
