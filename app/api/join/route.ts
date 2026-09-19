import { NextResponse } from 'next/server';
import { getMongoDbDatabase } from '@/lib/mongodb';
import { sendWelcomeEmail, sendAdminNotification } from '@/lib/email';
import { saveServerSubmission, getServerSubmissions, updateServerSubmissionStatus } from '@/lib/server-storage';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      fullName,
      email,
      phone,
      company,
      position,
      expertise,
      experience,
      country,
      message,
    } = body;

    const applicantName = (fullName || name || '').trim();
    const applicantEmail = (email || '').trim().toLowerCase();

    const joinRecord = {
      id: body.id || `j-${Date.now()}`,
      fullName: applicantName,
      name: applicantName,
      email: applicantEmail,
      phone: phone || '',
      company: company || 'Independent',
      position: position || 'Student / Learner',
      expertise: expertise || 'Beginner',
      experience: experience || 'Beginner',
      country: country || 'India',
      message: message || '',
      createdAt: new Date().toISOString(),
      status: 'Pending',
    };

    // 1. Save to Server JSON storage (Guaranteed local fallback)
    saveServerSubmission('joins', joinRecord);

    // 2. Save to MongoDB Atlas (if connected)
    let savedId = null;
    try {
      const db = await getMongoDbDatabase();
      if (db) {
        const collection = db.collection('joins');
        const result = await collection.insertOne(joinRecord);
        savedId = result.insertedId;
      }
    } catch (dbErr) {
      console.warn('[MongoDB Join] DB write warning, saved to server backup:', dbErr);
    }

    // 3. Send welcome email to applicant
    if (applicantEmail && applicantName) {
      await sendWelcomeEmail(applicantEmail, applicantName).catch((err) => {
        console.warn('[Email] Welcome email error:', err);
      });
    }

    // 4. Notify admin of new application
    if (applicantEmail && applicantName) {
      await sendAdminNotification({
        formType: 'Join Us Application',
        name: applicantName,
        email: applicantEmail,
        phone,
        organization: company,
        position,
        expertise,
        experience,
        country,
        subject: `New Community Member Application (${experience || 'Beginner'})`,
        message,
      }).catch((err) => {
        console.warn('[Email] Admin notification error:', err);
      });
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Application received and recorded successfully.',
        id: savedId || joinRecord.id,
        data: joinRecord,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error processing join application:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // 1. Read from server JSON backup
    const serverJoins = getServerSubmissions('joins');

    // 2. Read from MongoDB if available
    let mongoJoins: any[] = [];
    try {
      const db = await getMongoDbDatabase();
      if (db) {
        mongoJoins = await db.collection('joins').find({}).sort({ createdAt: -1 }).toArray();
      }
    } catch (dbErr) {
      console.warn('[MongoDB GET Joins] DB read warning:', dbErr);
    }

    // 3. Merge both sources (no duplicates)
    const combined: any[] = [...serverJoins];
    mongoJoins.forEach((mj) => {
      const formatted = {
        id: mj._id ? String(mj._id) : mj.id || `j-${Date.now()}`,
        fullName: mj.fullName || mj.name || 'Anonymous',
        email: mj.email || '',
        phone: mj.phone || '',
        company: mj.company || 'N/A',
        position: mj.position || 'Student / Engineer',
        expertise: mj.expertise || 'general',
        experience: mj.experience || 'Beginner',
        country: mj.country || 'India',
        message: mj.message || '',
        createdAt: mj.createdAt ? new Date(mj.createdAt).toISOString() : new Date().toISOString(),
        status: mj.status || 'Pending',
      };
      if (!combined.some((c) => (c.email && c.email.toLowerCase() === formatted.email.toLowerCase()) || c.id === formatted.id)) {
        combined.push(formatted);
      }
    });

    return NextResponse.json({ success: true, data: combined });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Application ID is required' },
        { status: 400 }
      );
    }

    updateServerSubmissionStatus('joins', id, status || 'Pending');

    try {
      const db = await getMongoDbDatabase();
      if (db) {
        await db.collection('joins').updateOne(
          { $or: [{ id }, { _id: id }] },
          { $set: { status, updatedAt: new Date() } }
        );
      }
    } catch (dbErr) {
      console.warn('[MongoDB PUT Join] DB update error:', dbErr);
    }

    return NextResponse.json({ success: true, message: 'Status updated' });
  } catch (error: any) {
    console.error('Error in /api/join PUT:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
