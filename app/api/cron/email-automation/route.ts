import { NextResponse } from 'next/server';
import { getMongoDbDatabase } from '@/lib/mongodb';
import {
  sendEventReminderEmail,
  sendPostEventThankYouEmail,
  sendCommunityDripEmail,
  sendReengagementEmail,
  sendNextEventRecommendationEmail,
} from '@/lib/email';

export const dynamic = 'force-dynamic';

const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;
const MAX_PER_CATEGORY = 50;

/**
 * Verifies the request came from Vercel Cron (or another trusted scheduler)
 * via the CRON_SECRET env var. If no secret is configured, the endpoint is
 * left open — fine for local testing, but set CRON_SECRET before deploying.
 */
function isAuthorized(request: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return true;
  return request.headers.get('authorization') === `Bearer ${secret}`;
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const db = await getMongoDbDatabase();
  if (!db) {
    return NextResponse.json(
      { success: false, message: 'MongoDB not configured — email automation skipped' },
      { status: 200 }
    );
  }

  const now = Date.now();
  const results = {
    reminders24h: 0,
    reminders1h: 0,
    thankYou: 0,
    drip1: 0,
    drip2: 0,
    reengagement: 0,
    recommendations: 0,
    errors: [] as string[],
  };

  try {
    // ── Event reminders: fire once when a registered event crosses the
    // 24h and 1h thresholds. Window-independent — safe at any cron interval.
    const upcomingEvents = await db
      .collection('events')
      .find({ eventDate: { $ne: null, $gt: new Date(now) } })
      .toArray();

    for (const event of upcomingEvents as any[]) {
      const eventDate = new Date(event.eventDate).getTime();
      const msUntil = eventDate - now;
      const eventMeta = {
        date: new Date(event.eventDate).toLocaleDateString('en-US', {
          weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
        }),
        time: event.time,
        location: event.location,
      };

      if (msUntil <= 24 * HOUR && results.reminders24h < MAX_PER_CATEGORY) {
        const regs = await db
          .collection('registrations')
          .find({ eventId: event.id, reminder24hSentAt: { $exists: false }, status: { $ne: 'Cancelled' } })
          .limit(MAX_PER_CATEGORY - results.reminders24h)
          .toArray();

        for (const reg of regs as any[]) {
          if (!reg.email || !reg.name) continue;
          try {
            await sendEventReminderEmail(reg.email, reg.name, event.title || reg.eventTitle, eventMeta, event.id, '24h');
            await db.collection('registrations').updateOne({ _id: reg._id }, { $set: { reminder24hSentAt: new Date() } });
            results.reminders24h++;
          } catch (err: any) {
            results.errors.push(`24h reminder ${reg.email}: ${err.message}`);
          }
        }
      }

      if (msUntil <= 1 * HOUR && results.reminders1h < MAX_PER_CATEGORY) {
        const regs = await db
          .collection('registrations')
          .find({ eventId: event.id, reminder1hSentAt: { $exists: false }, status: { $ne: 'Cancelled' } })
          .limit(MAX_PER_CATEGORY - results.reminders1h)
          .toArray();

        for (const reg of regs as any[]) {
          if (!reg.email || !reg.name) continue;
          try {
            await sendEventReminderEmail(reg.email, reg.name, event.title || reg.eventTitle, eventMeta, event.id, '1h');
            await db.collection('registrations').updateOne({ _id: reg._id }, { $set: { reminder1hSentAt: new Date() } });
            results.reminders1h++;
          } catch (err: any) {
            results.errors.push(`1h reminder ${reg.email}: ${err.message}`);
          }
        }
      }
    }

    // ── Post-event thank you: events that ended in the last 48h.
    const pastEvents = await db
      .collection('events')
      .find({ eventDate: { $ne: null, $lt: new Date(now), $gt: new Date(now - 2 * DAY) } })
      .toArray();

    for (const event of pastEvents as any[]) {
      if (results.thankYou >= MAX_PER_CATEGORY) break;
      const regs = await db
        .collection('registrations')
        .find({ eventId: event.id, thankYouSentAt: { $exists: false }, status: { $ne: 'Cancelled' } })
        .limit(MAX_PER_CATEGORY - results.thankYou)
        .toArray();

      for (const reg of regs as any[]) {
        if (!reg.email || !reg.name) continue;
        try {
          await sendPostEventThankYouEmail(reg.email, reg.name, event.title || reg.eventTitle, event.id);
          await db.collection('registrations').updateOne({ _id: reg._id }, { $set: { thankYouSentAt: new Date() } });
          results.thankYou++;
        } catch (err: any) {
          results.errors.push(`thank-you ${reg.email}: ${err.message}`);
        }
      }
    }

    // ── Next-event recommendation: after an event ends, recommend the
    // nearest upcoming event once per attendee and recommended event.
    const nextEvent = await db
      .collection('events')
      .findOne({ eventDate: { $ne: null, $gt: new Date(now) } }, { sort: { eventDate: 1 } });

    if (nextEvent && results.recommendations < MAX_PER_CATEGORY) {
      for (const event of pastEvents as any[]) {
        if (results.recommendations >= MAX_PER_CATEGORY) break;
        const regs = await db.collection('registrations').find({
          eventId: event.id,
          status: { $ne: 'Cancelled' },
        }).limit(MAX_PER_CATEGORY).toArray();

        for (const reg of regs as any[]) {
          if (results.recommendations >= MAX_PER_CATEGORY || !reg.email || !reg.name) continue;
          const email = String(reg.email).trim().toLowerCase();
          const alreadySent = await db.collection('event_recommendations').findOne({
            email,
            sourceEventId: event.id,
            recommendedEventId: nextEvent.id,
          });
          if (alreadySent) continue;

          const nextEventDate = nextEvent.eventDate ? new Date(nextEvent.eventDate) : null;
          const sent = await sendNextEventRecommendationEmail(
            email,
            String(reg.name),
            event.title || reg.eventTitle || 'the event you joined',
            nextEvent.title || 'Quantum Nexus Event',
            String(nextEvent.id),
            {
              date: nextEventDate?.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }),
              time: nextEvent.time,
              location: nextEvent.location,
            }
          );
          if (sent) {
            await db.collection('event_recommendations').insertOne({
              email,
              sourceEventId: event.id,
              recommendedEventId: nextEvent.id,
              sentAt: new Date(),
            });
            results.recommendations++;
          }
        }
      }
    }

    // ── Community welcome drip: day-3 tips, day-7 nudge.
    const drip1Candidates = await db
      .collection('joins')
      .find({ createdAt: { $lte: new Date(now - 3 * DAY).toISOString() }, dripStage: { $exists: false } })
      .limit(MAX_PER_CATEGORY)
      .toArray();

    for (const j of drip1Candidates as any[]) {
      const email = j.email;
      const name = j.fullName || j.name;
      if (!email || !name) continue;
      try {
        await sendCommunityDripEmail(email, name, 1);
        await db.collection('joins').updateOne({ _id: j._id }, { $set: { dripStage: 1, dripStageSentAt: new Date() } });
        results.drip1++;
      } catch (err: any) {
        results.errors.push(`drip1 ${email}: ${err.message}`);
      }
    }

    const drip2Candidates = await db
      .collection('joins')
      .find({ createdAt: { $lte: new Date(now - 7 * DAY).toISOString() }, dripStage: 1 })
      .limit(MAX_PER_CATEGORY)
      .toArray();

    for (const j of drip2Candidates as any[]) {
      const email = j.email;
      const name = j.fullName || j.name;
      if (!email || !name) continue;
      try {
        await sendCommunityDripEmail(email, name, 2);
        await db.collection('joins').updateOne({ _id: j._id }, { $set: { dripStage: 2, dripStageSentAt: new Date() } });
        results.drip2++;
      } catch (err: any) {
        results.errors.push(`drip2 ${email}: ${err.message}`);
      }
    }

    // ── Re-engagement: joined 30+ days ago, never registered for an event.
    const reengageCandidates = await db
      .collection('joins')
      .find({
        createdAt: { $lte: new Date(now - 30 * DAY).toISOString() },
        reengagementSentAt: { $exists: false },
        reengagementSkip: { $ne: true },
      })
      .limit(200)
      .toArray();

    for (const j of reengageCandidates as any[]) {
      if (results.reengagement >= MAX_PER_CATEGORY) break;
      const email = (j.email || '').toLowerCase();
      const name = j.fullName || j.name;
      if (!email || !name) continue;

      const hasRegistered = await db
        .collection('registrations')
        .findOne({ email: { $regex: `^${email.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, $options: 'i' } });

      if (hasRegistered) {
        await db.collection('joins').updateOne({ _id: j._id }, { $set: { reengagementSkip: true } });
        continue;
      }

      try {
        await sendReengagementEmail(email, name);
        await db.collection('joins').updateOne({ _id: j._id }, { $set: { reengagementSentAt: new Date() } });
        results.reengagement++;
      } catch (err: any) {
        results.errors.push(`reengagement ${email}: ${err.message}`);
      }
    }

    return NextResponse.json({ success: true, ranAt: new Date().toISOString(), results });
  } catch (error: any) {
    console.error('[Cron] Email automation error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
