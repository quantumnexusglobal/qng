import { Navigation } from "@/components/landing/navigation";
import { HeroSection } from "@/components/landing/hero-section";
import { FeaturesSection } from "@/components/landing/features-section";
import { EventsSection } from "@/components/landing/events-section";
import { InfrastructureSection } from "@/components/landing/infrastructure-section";
import { MetricsSection } from "@/components/landing/metrics-section";
import { SpeakersSection } from "@/components/landing/speakers-section";
import { GallerySection } from "@/components/landing/gallery-section";
import { TestimonialsSection } from "@/components/landing/testimonials-section";
import { CtaSection } from "@/components/landing/cta-section";
import { getMongoDbDatabase } from "@/lib/mongodb";
import { getAttendeeCountMap, combineAttendeeCount } from "@/lib/attendee-counts";
import { EventItem } from "@/lib/events-store";

// Event data does not need second-level freshness. A ten-minute window keeps
// the public page fast without repeatedly regenerating the page under traffic.
export const revalidate = 600;

async function fetchEvents(): Promise<EventItem[]> {
  try {
    const db = await getMongoDbDatabase();
    if (!db) return [];
    const docs = await db.collection('events').find({}).sort({ eventDate: 1 }).toArray();
    const events = docs.map((doc: any) => ({
      ...doc,
      id: doc.id || String(doc._id),
      eventDate: doc.eventDate ? new Date(doc.eventDate).toISOString() : doc.eventDate,
      createdAt: doc.createdAt ? new Date(doc.createdAt).toISOString() : new Date().toISOString(),
    })) as EventItem[];

    // Add live registrations on top of the admin-set seed number — never drops below it.
    const countMap = await getAttendeeCountMap(events.map((e) => e.id));
    events.forEach((e) => { e.attendees = String(combineAttendeeCount(e.attendees, countMap[e.id] || 0)); });

    return events;
  } catch {
    return [];
  }
}

export default async function Home() {
  const events = await fetchEvents();
  return (
    <main className="relative min-h-screen overflow-x-hidden noise-overlay">
      <Navigation />
      <HeroSection />
      <FeaturesSection />
      <EventsSection initialEvents={events} />
      <InfrastructureSection />
      <MetricsSection />
      <SpeakersSection />
      <GallerySection />
      <TestimonialsSection />
      <CtaSection />
    </main>
  );
}
