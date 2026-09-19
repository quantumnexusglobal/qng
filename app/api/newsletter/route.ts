import { NextResponse } from 'next/server';
import { getMongoDbDatabase } from '@/lib/mongodb';
import { sendNewsletterWelcomeEmail, sendAdminNotification } from '@/lib/email';
import { saveServerSubmission, getServerSubmissions, deleteServerSubmission } from '@/lib/server-storage';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email || typeof email !== 'string' || !email.includes('@') || !email.includes('.')) {
      return NextResponse.json(
        { success: false, error: 'Please provide a valid email address.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const subscriber = {
      id: `nl-${Date.now()}`,
      email: cleanEmail,
      source: 'Website Footer',
      subscribedAt: new Date().toISOString(),
      status: 'Active',
    };

    // 1. Save to Server JSON Storage
    saveServerSubmission('newsletter', subscriber);

    // 2. Save to MongoDB
    try {
      const db = await getMongoDbDatabase();
      if (db) {
        await db.collection('newsletter_subscribers').updateOne(
          { email: cleanEmail },
          { $set: subscriber },
          { upsert: true }
        );
      }
    } catch (dbErr) {
      console.warn('[MongoDB Newsletter] DB write error, saved to server backup:', dbErr);
    }

    // 3. Send Welcome Email to Subscriber
    await sendNewsletterWelcomeEmail(cleanEmail).catch((err) => {
      console.warn('[Newsletter] Failed to send welcome email:', err);
    });

    // 4. Send Alert to Admin
    await sendAdminNotification({
      formType: 'Contact Us Inquiry',
      name: 'New Newsletter Subscriber',
      email: cleanEmail,
      subject: 'New Newsletter Subscription',
      message: `A new user subscribed to the QNexus community newsletter: ${cleanEmail}`,
    }).catch((err) => {
      console.warn('[Newsletter] Failed to send admin alert:', err);
    });

    return NextResponse.json({
      success: true,
      message: 'Thank you for subscribing! Check your inbox for your welcome note.',
      data: subscriber,
    });
  } catch (error: any) {
    console.error('Newsletter API error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const serverSubs = getServerSubmissions('newsletter');

    let mongoSubs: any[] = [];
    try {
      const db = await getMongoDbDatabase();
      if (db) {
        mongoSubs = await db.collection('newsletter_subscribers').find({}).sort({ subscribedAt: -1 }).toArray();
      }
    } catch (dbErr) {
      console.warn('[MongoDB GET Newsletter] DB read error:', dbErr);
    }

    const combined: any[] = [...serverSubs];
    mongoSubs.forEach((ms) => {
      const formatted = {
        id: ms._id ? String(ms._id) : ms.id || `nl-${Date.now()}`,
        email: ms.email || '',
        source: ms.source || 'Website Footer',
        subscribedAt: ms.subscribedAt || ms.createdAt || new Date().toISOString(),
        status: ms.status || 'Active',
      };
      if (!combined.some((c) => c.email && c.email.toLowerCase() === formatted.email.toLowerCase())) {
        combined.push(formatted);
      }
    });

    return NextResponse.json({ success: true, data: combined });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const email = searchParams.get('email');

    if (id) deleteServerSubmission('newsletter', id);

    try {
      const db = await getMongoDbDatabase();
      if (db) {
        if (id) await db.collection('newsletter_subscribers').deleteOne({ $or: [{ id }, { _id: id }] });
        if (email) await db.collection('newsletter_subscribers').deleteOne({ email: email.toLowerCase() });
      }
    } catch (dbErr) {
      console.warn('[MongoDB DELETE Newsletter] DB delete error:', dbErr);
    }

    return NextResponse.json({ success: true, message: 'Subscriber removed' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
