// Server-only helper — live registration counts per event, added on top of
// the admin-set "attendees" seed number so the shown count never drops below
// the seed floor and only climbs as real registrations come in.
import { getMongoDbDatabase } from './mongodb';

export function combineAttendeeCount(seed: string | number | undefined, realCount: number): number {
  const base = parseInt(String(seed ?? '0').replace(/\D/g, ''), 10) || 0;
  return base + realCount;
}

export async function getAttendeeCountMap(eventIds: string[]): Promise<Record<string, number>> {
  const map: Record<string, number> = {};
  if (eventIds.length === 0) return map;
  try {
    const db = await getMongoDbDatabase();
    if (!db) return map;
    const results = await db
      .collection('registrations')
      .aggregate([
        { $match: { eventId: { $in: eventIds }, status: { $ne: 'Cancelled' } } },
        { $group: { _id: '$eventId', count: { $sum: 1 } } },
      ])
      .toArray();
    for (const r of results as any[]) {
      map[String(r._id)] = r.count;
    }
  } catch {
    // ignore — counts default to 0
  }
  return map;
}

export async function getAttendeeCount(eventId: string): Promise<number> {
  try {
    const db = await getMongoDbDatabase();
    if (!db) return 0;
    return await db.collection('registrations').countDocuments({ eventId, status: { $ne: 'Cancelled' } });
  } catch {
    return 0;
  }
}
