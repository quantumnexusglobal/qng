import type { Metadata } from 'next';
import { ObjectId } from 'mongodb';
import { getMongoDbDatabase } from '@/lib/mongodb';
import { getAttendeeCount, combineAttendeeCount } from '@/lib/attendee-counts';
import { EventItem } from '@/lib/events-store';
import { EventDetailClient } from './EventDetailClient';

const SITE_URL = 'https://www.quantumnexusglobal.org';

async function getEventById(id: string): Promise<EventItem | null> {
  try {
    const db = await getMongoDbDatabase();
    if (!db) return null;

    let filter: Record<string, unknown>;
    try {
      filter = { _id: new ObjectId(id) };
    } catch {
      filter = { id };
    }

    const doc = await db.collection('events').findOne(filter);
    if (!doc) return null;

    return {
      ...(doc as any),
      id: (doc as any).id || String((doc as any)._id),
      eventDate: (doc as any).eventDate ? new Date((doc as any).eventDate).toISOString() : (doc as any).eventDate,
      createdAt: (doc as any).createdAt ? new Date((doc as any).createdAt).toISOString() : new Date().toISOString(),
    } as EventItem;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const event = await getEventById(id);

  if (!event) {
    return { title: 'Event Not Found — Quantum Nexus Global' };
  }

  const description = event.description || (event.fullDescription || '').slice(0, 160) || 'Join this Quantum Nexus Global event.';
  const pageUrl = `${SITE_URL}/events/${event.id}`;

  return {
    title: event.title,
    description,
    openGraph: {
      title: event.title,
      description,
      url: pageUrl,
      type: 'website',
      images: event.imageUrl ? [{ url: event.imageUrl }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: event.title,
      description,
      images: event.imageUrl ? [event.imageUrl] : undefined,
    },
  };
}

export default async function EventDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const event = await getEventById(id);
  if (event) {
    const realCount = await getAttendeeCount(event.id);
    event.attendees = String(combineAttendeeCount(event.attendees, realCount));
  }
  return <EventDetailClient event={event} />;
}
