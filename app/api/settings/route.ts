import { NextResponse } from 'next/server';
import { getMongoDbDatabase } from '@/lib/mongodb';

const SETTINGS_KEY = 'site-settings';

export async function GET() {
  try {
    const db = await getMongoDbDatabase();
    if (!db) return NextResponse.json({ success: false, message: 'MongoDB not configured' }, { status: 400 });
    const doc = await db.collection('settings').findOne({ _key: SETTINGS_KEY });
    return NextResponse.json({ success: true, data: doc });
  } catch (error: any) {
    console.error('Error fetching settings:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const db = await getMongoDbDatabase();
    if (!db) return NextResponse.json({ success: false, message: 'MongoDB not configured' }, { status: 400 });
    const body = await request.json();
    const { _id, ...updateFields } = body;
    await db.collection('settings').updateOne(
      { _key: SETTINGS_KEY },
      { $set: { ...updateFields, _key: SETTINGS_KEY, updatedAt: new Date() } },
      { upsert: true }
    );
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error updating settings:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
