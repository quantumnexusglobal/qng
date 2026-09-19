import { NextResponse } from 'next/server';
import { getMongoDbDatabase } from '@/lib/mongodb';
import { saveServerSubmission, getServerSubmissions } from '@/lib/server-storage';
import { sendEventRegistrationEmail, sendAdminNotification } from '@/lib/email';
import { isRegistrationOpen } from '@/lib/events-store';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Re-check the registration cutoff server-side — the client-side check
    // guides the UI, but it can be bypassed by calling this endpoint directly.
    if (body.eventId) {
      try {
        const db = await getMongoDbDatabase();
        if (db) {
          const event = await db.collection('events').findOne({ id: body.eventId });
          if (event && !isRegistrationOpen(event as any)) {
            return NextResponse.json(
              { success: false, error: 'Registration is closed for this event' },
              { status: 403 }
            );
          }
        }
      } catch (dbErr) {
        console.warn('[MongoDB Registration] deadline check warn:', dbErr);
      }
    }

    const regRecord = {
      ...body,
      id: body.id || `r-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: body.status || 'Confirmed',
    };

    // 1. Save to Server Storage
    saveServerSubmission('registrations', regRecord);

    // 2. Save to MongoDB
    let insertedId = null;
    try {
      const db = await getMongoDbDatabase();
      if (db) {
        const collection = db.collection('registrations');
        const result = await collection.insertOne(regRecord);
        insertedId = result.insertedId;
      }
    } catch (dbErr) {
      console.warn('[MongoDB Registration] DB write error:', dbErr);
    }

    // 3. Send confirmation email to the registrant
    if (regRecord.email && regRecord.name) {
      const formattedDate = regRecord.eventDate
        ? new Date(regRecord.eventDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
        : undefined;
      await sendEventRegistrationEmail(
        regRecord.email,
        regRecord.name,
        regRecord.eventTitle || 'Quantum Event',
        { date: formattedDate, time: regRecord.time, location: regRecord.location },
        regRecord.token || regRecord.id,
        regRecord.eventId
      ).catch((err) => {
        console.warn('[Email] Registration confirmation error:', err);
      });
    }

    // 4. Notify admin of the new registration
    if (regRecord.email && regRecord.name) {
      await sendAdminNotification({
        formType: 'Event Registration',
        name: regRecord.name,
        email: regRecord.email,
        phone: regRecord.phone,
        organization: regRecord.organization,
        subject: `New Event Registration — ${regRecord.eventTitle || 'Quantum Event'}`,
        message: `Registered for: ${regRecord.eventTitle || 'Quantum Event'}\nToken: ${regRecord.token || regRecord.id}`,
      }).catch((err) => {
        console.warn('[Email] Admin notification error:', err);
      });
    }

    return NextResponse.json(
      { success: true, message: 'Event registration saved', id: insertedId || regRecord.id, data: regRecord },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error saving registration:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const serverRegs = getServerSubmissions('registrations');

    let mongoRegs: any[] = [];
    try {
      const db = await getMongoDbDatabase();
      if (db) {
        mongoRegs = await db.collection('registrations').find({}).sort({ createdAt: -1 }).toArray();
      }
    } catch (dbErr) {
      console.warn('[MongoDB GET Registrations] DB read warning:', dbErr);
    }

    const combined: any[] = [...serverRegs];
    mongoRegs.forEach((mr) => {
      const formatted = {
        id: mr._id ? String(mr._id) : mr.id || `r-${Date.now()}`,
        eventId: mr.eventId || '1',
        eventTitle: mr.eventTitle || 'Quantum Session',
        name: mr.name || 'Attendee',
        email: mr.email || '',
        phone: mr.phone || '',
        organization: mr.organization || 'Independent',
        role: mr.role || 'Attendee',
        background: mr.background || 'Beginner',
        teamName: mr.teamName || undefined,
        createdAt: mr.createdAt ? new Date(mr.createdAt).toISOString() : new Date().toISOString(),
        status: mr.status || 'Confirmed',
      };
      if (!combined.some((c) => (c.email && c.email.toLowerCase() === formatted.email.toLowerCase() && c.eventId === formatted.eventId) || c.id === formatted.id)) {
        combined.push(formatted);
      }
    });

    return NextResponse.json({ success: true, data: combined });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
