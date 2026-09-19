import { NextResponse } from 'next/server';
import { getMongoDbDatabase } from '@/lib/mongodb';
import { sendBroadcastEmail } from '@/lib/email';

// Broadcasts can take a while for larger lists — allow the route to run longer
// than the default serverless timeout.
export const maxDuration = 300;

type AudienceKey = 'newsletter' | 'joins' | 'registrations' | 'pastEventAttendees' | 'contacts' | 'research';

interface Recipient {
  email: string;
  name?: string;
}

async function collectRecipients(
  db: Awaited<ReturnType<typeof getMongoDbDatabase>>,
  audiences: AudienceKey[],
  eventId?: string
): Promise<Recipient[]> {
  if (!db) return [];
  const byEmail = new Map<string, Recipient>();

  const add = (email: unknown, name: unknown) => {
    if (typeof email !== 'string' || !email.trim()) return;
    const key = email.trim().toLowerCase();
    const existing = byEmail.get(key);
    if (!existing) {
      byEmail.set(key, { email: key, name: typeof name === 'string' && name.trim() ? name.trim() : undefined });
    } else if (!existing.name && typeof name === 'string' && name.trim()) {
      existing.name = name.trim();
    }
  };

  if (audiences.includes('newsletter')) {
    const docs = await db.collection('newsletter_subscribers').find({ status: { $ne: 'Unsubscribed' } }).toArray();
    docs.forEach((d: any) => add(d.email, d.name));
  }

  if (audiences.includes('joins')) {
    const docs = await db.collection('joins').find({}).toArray();
    docs.forEach((d: any) => add(d.email, d.fullName || d.name));
  }

  if (audiences.includes('registrations')) {
    const filter = eventId ? { eventId } : {};
    const docs = await db.collection('registrations').find(filter).toArray();
    docs.forEach((d: any) => add(d.email, d.name));
  }

  if (audiences.includes('pastEventAttendees')) {
    const pastEvents = await db.collection('events').find({ eventDate: { $lt: new Date() } }, { projection: { id: 1 } }).toArray();
    const pastEventIds = pastEvents.map((event: any) => event.id).filter(Boolean);
    if (pastEventIds.length > 0) {
      const docs = await db.collection('registrations').find({
        eventId: { $in: pastEventIds },
        status: { $ne: 'Cancelled' },
      }).toArray();
      docs.forEach((d: any) => add(d.email, d.name));
    }
  }

  if (audiences.includes('contacts')) {
    const docs = await db.collection('contacts').find({}).toArray();
    docs.forEach((d: any) => add(d.email, d.name));
  }

  if (audiences.includes('research')) {
    const docs = await db.collection('research_grants').find({}).toArray();
    docs.forEach((d: any) => add(d.email, d.fullName || d.name));
  }

  return Array.from(byEmail.values());
}

function personalize(message: string, name?: string): string {
  return message.replace(/\{\{\s*name\s*\}\}/gi, name || 'there');
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { subject, message, audiences, eventId, posterUrl, dryRun } = body as {
      subject?: string;
      message?: string;
      audiences?: AudienceKey[];
      eventId?: string;
      posterUrl?: string;
      dryRun?: boolean;
    };

    if (!Array.isArray(audiences) || audiences.length === 0) {
      return NextResponse.json({ success: false, message: 'Select at least one audience.' }, { status: 400 });
    }
    if (!dryRun && audiences.includes('pastEventAttendees') && !eventId) {
      return NextResponse.json({ success: false, message: 'Select the upcoming event to recommend.' }, { status: 400 });
    }
    if (dryRun && audiences.includes('pastEventAttendees') && !eventId) {
      return NextResponse.json({ success: false, message: 'Select the upcoming event to recommend.' }, { status: 400 });
    }
    if (!dryRun && (!subject?.trim() || !message?.trim())) {
      return NextResponse.json({ success: false, message: 'Subject and message are required.' }, { status: 400 });
    }

    const db = await getMongoDbDatabase();
    if (!db) {
      return NextResponse.json({ success: false, message: 'MongoDB not configured' }, { status: 400 });
    }

    const recipients = await collectRecipients(db, audiences, eventId);

    if (dryRun) {
      return NextResponse.json({
        success: true,
        count: recipients.length,
        sample: recipients.slice(0, 8).map((r) => r.email),
      });
    }

    let sent = 0;
    const errors: string[] = [];

    for (const recipient of recipients) {
      try {
        const ok = await sendBroadcastEmail(recipient.email, subject!.trim(), personalize(message!.trim(), recipient.name), posterUrl);
        if (ok) sent++;
        else errors.push(`${recipient.email}: send failed (email not configured or provider error)`);
      } catch (err: any) {
        errors.push(`${recipient.email}: ${err.message || 'unknown error'}`);
      }
      // Small gap between sends — gentler on the SMTP provider's rate limits.
      await new Promise((resolve) => setTimeout(resolve, 150));
    }

    return NextResponse.json({
      success: true,
      total: recipients.length,
      sent,
      failed: recipients.length - sent,
      errors: errors.slice(0, 20),
    });
  } catch (error: any) {
    console.error('Error sending broadcast:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
