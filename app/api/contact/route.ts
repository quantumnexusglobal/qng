import { NextResponse } from 'next/server';
import { getMongoDbDatabase } from '@/lib/mongodb';
import { sendContactNotification } from '@/lib/email';
import { saveServerSubmission, getServerSubmissions } from '@/lib/server-storage';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, subject, message, phone, organization, company, inquiryType } = body;

    const senderName = (name || '').trim();
    const senderEmail = (email || '').trim().toLowerCase();

    const contactRecord = {
      id: body.id || `c-${Date.now()}`,
      name: senderName,
      email: senderEmail,
      subject: subject || inquiryType || 'General Inquiry',
      message: message || '',
      phone: phone || '',
      company: company || organization || 'Independent',
      inquiryType: inquiryType || 'General Inquiry',
      createdAt: new Date().toISOString(),
      status: 'New',
    };

    // 1. Save to Server JSON storage
    saveServerSubmission('contacts', contactRecord);

    // 2. Save to MongoDB (if configured)
    let savedId = null;
    try {
      const db = await getMongoDbDatabase();
      if (db) {
        const collection = db.collection('contacts');
        const result = await collection.insertOne(contactRecord);
        savedId = result.insertedId;
      }
    } catch (dbErr) {
      console.warn('[MongoDB Contact] DB write error, saved to server backup:', dbErr);
    }

    // 3. Send notification email to admin
    if (senderName && senderEmail && message) {
      await sendContactNotification({
        name: senderName,
        email: senderEmail,
        subject: contactRecord.subject,
        message,
        phone,
        organization: contactRecord.company,
        inquiryType: contactRecord.inquiryType,
      }).catch((err) => {
        console.warn('[Email] Contact notification error:', err);
      });
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Inquiry received. Our team has been notified!',
        id: savedId || contactRecord.id,
        data: contactRecord,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error processing contact inquiry:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // 1. Read from server JSON backup
    const serverContacts = getServerSubmissions('contacts');

    // 2. Read from MongoDB if available
    let mongoContacts: any[] = [];
    try {
      const db = await getMongoDbDatabase();
      if (db) {
        mongoContacts = await db.collection('contacts').find({}).sort({ createdAt: -1 }).toArray();
      }
    } catch (dbErr) {
      console.warn('[MongoDB GET Contacts] DB read warning:', dbErr);
    }

    // 3. Merge both sources
    const combined: any[] = [...serverContacts];
    mongoContacts.forEach((mc) => {
      const formatted = {
        id: mc._id ? String(mc._id) : mc.id || `c-${Date.now()}`,
        name: mc.name || 'Anonymous',
        email: mc.email || '',
        company: mc.company || mc.organization || 'N/A',
        inquiryType: mc.inquiryType || 'General Inquiry',
        subject: mc.subject || 'No Subject',
        message: mc.message || '',
        createdAt: mc.createdAt ? new Date(mc.createdAt).toISOString() : new Date().toISOString(),
        status: mc.status || 'New',
      };
      if (!combined.some((c) => (c.email && c.email.toLowerCase() === formatted.email.toLowerCase() && c.message === formatted.message) || c.id === formatted.id)) {
        combined.push(formatted);
      }
    });

    return NextResponse.json({ success: true, data: combined });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
