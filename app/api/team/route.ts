import { NextResponse } from 'next/server';
import { getMongoDbDatabase } from '@/lib/mongodb';

/**
 * Team member schema (MongoDB document)
 * {
 *   id: string,
 *   name: string,
 *   role: string,   // Position/title — blank for regular members, only the founder carries a title
 *   bio: string,
 *   imageUrl: string,
 *   linkedin: string,
 *   twitter?: string,
 *   order: number,
 *   createdAt: Date,
 * }
 */

export async function GET() {
  try {
    const db = await getMongoDbDatabase();
    if (!db) return NextResponse.json({ success: false, message: 'MongoDB not configured' }, { status: 400 });
    const members = await db.collection('team').find({}).sort({ order: 1 }).toArray();
    return NextResponse.json({ success: true, data: members });
  } catch (error: any) {
    console.error('Error fetching team members:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const db = await getMongoDbDatabase();
    if (!db) return NextResponse.json({ success: false, message: 'MongoDB not configured' }, { status: 400 });
    const body = await request.json();
    const member = {
      ...body,
      createdAt: new Date(),
    };
    await db.collection('team').updateOne(
      { id: member.id },
      { $set: member },
      { upsert: true }
    );
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating team member:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const db = await getMongoDbDatabase();
    if (!db) return NextResponse.json({ success: false, message: 'MongoDB not configured' }, { status: 400 });
    const body = await request.json();
    const { id, _id, ...updateFields } = body;
    if (!id) return NextResponse.json({ success: false, message: 'Missing team member id' }, { status: 400 });
    const result = await db.collection('team').updateOne(
      { id },
      { $set: { ...updateFields, updatedAt: new Date() } },
      { upsert: true }
    );
    return NextResponse.json({ success: true, matchedCount: result.matchedCount });
  } catch (error: any) {
    console.error('Error updating team member:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const db = await getMongoDbDatabase();
    if (!db) return NextResponse.json({ success: false, message: 'MongoDB not configured' }, { status: 400 });
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ success: false, message: 'Missing team member id' }, { status: 400 });
    await db.collection('team').deleteOne({ id });
    return NextResponse.json({ success: true, message: 'Team member deleted' });
  } catch (error: any) {
    console.error('Error deleting team member:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
