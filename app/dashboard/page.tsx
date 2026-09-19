'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowLeft, CalendarCheck, MapPin, Clock, Ticket, ArrowRight, Sparkles,
  Award, Users2, MessageSquare, LineChart, LogOut, Linkedin,
} from 'lucide-react';
import { getUserIdentity, clearUserIdentity, UserIdentity } from '@/lib/user-identity';
import { getEvents, EventItem, resolveEventStatus } from '@/lib/events-store';
import { getLinkedInShareUrl } from '@/components/events/event-pass';

interface MyRegistration {
  id: string;
  eventId: string;
  eventTitle: string;
  email: string;
  token?: string;
  createdAt: string;
}

const UPCOMING_FEATURES = [
  { icon: Award, label: 'Attendance Certificates' },
  { icon: Users2, label: 'Community Points & Badges' },
  { icon: MessageSquare, label: 'Event Discussion Threads' },
  { icon: LineChart, label: 'Research Grant Tracker' },
];

export default function DashboardPage() {
  const [identity, setIdentity] = useState<UserIdentity | null>(null);
  const [lookupEmail, setLookupEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [myRegs, setMyRegs] = useState<MyRegistration[]>([]);
  const [allEvents, setAllEvents] = useState<EventItem[]>([]);

  useEffect(() => {
    const local = getUserIdentity();
    const urlEmail = new URLSearchParams(window.location.search).get('email');
    const email = (local?.email || urlEmail || '').trim().toLowerCase();

    setIdentity(local);
    setLookupEmail(email || null);

    (async () => {
      const [regsJson, events] = await Promise.all([
        fetch('/api/register').then((r) => r.json()).catch(() => null),
        getEvents(),
      ]);
      setAllEvents(events);
      if (email && regsJson?.success && Array.isArray(regsJson.data)) {
        setMyRegs(
          regsJson.data.filter((r: any) => (r.email || '').trim().toLowerCase() === email)
        );
      }
      setIsLoading(false);
    })();
  }, []);

  const registeredEventIds = new Set(myRegs.map((r) => r.eventId));
  const registeredEvents = allEvents.filter((e) => registeredEventIds.has(e.id));
  const attendedEvents = registeredEvents.filter((e) => resolveEventStatus(e) === 'past');
  const upcomingRegistered = registeredEvents.filter((e) => resolveEventStatus(e) === 'upcoming');
  const suggestions = allEvents
    .filter((e) => !registeredEventIds.has(e.id) && resolveEventStatus(e) === 'upcoming')
    .slice(0, 3);

  const displayName = identity?.name || 'there';
  const firstName = displayName.trim().split(/\s+/)[0];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Top Header */}
      <header className="sticky top-0 z-50 border-b border-foreground/10 bg-background/90 backdrop-blur-md px-6 lg:px-12 py-4">
        <div className="max-w-[1200px] mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center group">
            <Image src="/logo-mark.png" alt="QNexus" width={789} height={302} className="h-10 w-auto" />
          </Link>
          <div className="flex items-center gap-4">
            {identity && (
              <button
                onClick={clearUserIdentity}
                className="hidden sm:flex items-center gap-1.5 text-xs text-foreground/50 hover:text-foreground transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" /> Sign out
              </button>
            )}
            <Link href="/" className="flex items-center gap-2 text-sm text-foreground/60 hover:text-foreground transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to home
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-[1200px] mx-auto px-6 lg:px-12 py-10 lg:py-14">
        {!lookupEmail && !isLoading ? (
          // No identity yet — nothing to show
          <div className="text-center py-24 max-w-md mx-auto">
            <div className="w-14 h-14 rounded-2xl bg-foreground/5 border border-foreground/10 flex items-center justify-center mx-auto mb-6">
              <Ticket className="w-6 h-6 text-foreground/40" />
            </div>
            <h1 className="text-2xl font-display font-bold mb-2">No dashboard yet</h1>
            <p className="text-sm text-muted-foreground mb-8 leading-relaxed">
              Join the community or register for an event and your personal dashboard — attended
              events, upcoming picks, and your event pass — will show up here.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/join" className="px-6 py-3 bg-foreground text-background rounded-xl font-medium hover:bg-foreground/90 transition-colors">
                Join Us
              </Link>
              <Link href="/events" className="px-6 py-3 border border-foreground/15 rounded-xl text-foreground hover:bg-foreground/5 transition-colors">
                Browse Events
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Greeting */}
            <div className="mb-10">
              <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest">Your Dashboard</span>
              <h1 className="text-3xl lg:text-4xl font-display font-bold mt-1">
                Welcome back, {firstName}
              </h1>
            </div>

            {/* Stat Cards */}
            <div className="grid sm:grid-cols-3 gap-4 mb-12">
              <div className="p-5 rounded-2xl border border-foreground/10 bg-foreground/[0.02]">
                <div className="flex items-center justify-between text-muted-foreground mb-2">
                  <span className="text-xs font-mono uppercase tracking-wider">Attended</span>
                  <CalendarCheck className="w-4 h-4 text-emerald-500" />
                </div>
                <p className="text-3xl font-display font-bold">{attendedEvents.length}</p>
              </div>
              <div className="p-5 rounded-2xl border border-foreground/10 bg-foreground/[0.02]">
                <div className="flex items-center justify-between text-muted-foreground mb-2">
                  <span className="text-xs font-mono uppercase tracking-wider">Upcoming</span>
                  <Clock className="w-4 h-4 text-cyan-500" />
                </div>
                <p className="text-3xl font-display font-bold">{upcomingRegistered.length}</p>
              </div>
              <div className="p-5 rounded-2xl border border-foreground/10 bg-foreground/[0.02]">
                <div className="flex items-center justify-between text-muted-foreground mb-2">
                  <span className="text-xs font-mono uppercase tracking-wider">Member Since</span>
                  <Sparkles className="w-4 h-4 text-amber-500" />
                </div>
                <p className="text-sm font-medium pt-1.5">
                  {identity ? new Date(identity.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '—'}
                </p>
              </div>
            </div>

            {/* Upcoming Registrations */}
            {upcomingRegistered.length > 0 && (
              <section className="mb-12">
                <h2 className="text-lg font-display font-bold mb-4">Your Upcoming Registrations</h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {upcomingRegistered.map((event) => (
                    <div
                      key={event.id}
                      className="group p-5 rounded-2xl border border-foreground/10 bg-foreground/[0.02] hover:border-cyan-500/40 transition-all flex flex-col"
                    >
                      <Link href={`/events/${event.id}`} className="flex-1">
                        <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full border border-cyan-300 text-cyan-700 bg-cyan-100">
                          {event.category}
                        </span>
                        <h3 className="text-base font-medium mt-3 mb-2 leading-snug group-hover:text-cyan-700 transition-colors">
                          {event.title}
                        </h3>
                        <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                          <MapPin className="w-3 h-3" /> {event.location}
                        </p>
                      </Link>
                      <a
                        href={getLinkedInShareUrl(event.id)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 pt-3 border-t border-foreground/10 inline-flex items-center gap-1.5 text-xs font-semibold text-[#0A66C2] hover:underline w-fit"
                      >
                        <Linkedin className="w-3.5 h-3.5" /> Share on LinkedIn
                      </a>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Attended Events */}
            <section className="mb-12">
              <h2 className="text-lg font-display font-bold mb-4">Attended Events</h2>
              {attendedEvents.length === 0 ? (
                <p className="text-sm text-muted-foreground p-5 rounded-2xl border border-foreground/10 bg-foreground/[0.02]">
                  No attended events yet — they'll appear here once a registered event has passed.
                </p>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {attendedEvents.map((event) => (
                    <Link
                      key={event.id}
                      href={`/events/${event.id}`}
                      className="group p-5 rounded-2xl border border-foreground/10 bg-foreground/[0.02] hover:border-foreground/30 transition-all opacity-80"
                    >
                      <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-foreground/10 text-foreground/60">
                        Attended
                      </span>
                      <h3 className="text-base font-medium mt-3 leading-snug">{event.title}</h3>
                    </Link>
                  ))}
                </div>
              )}
            </section>

            {/* Suggestions */}
            {suggestions.length > 0 && (
              <section className="mb-12">
                <h2 className="text-lg font-display font-bold mb-4">Recommended For You</h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {suggestions.map((event) => (
                    <div
                      key={event.id}
                      className="p-5 rounded-2xl border border-foreground/10 bg-foreground/[0.02] flex flex-col"
                    >
                      <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full border border-cyan-500/40 text-cyan-400 bg-cyan-950/20 self-start">
                        {event.category}
                      </span>
                      <h3 className="text-base font-medium mt-3 mb-4 leading-snug flex-1">{event.title}</h3>
                      <Link
                        href={`/events/${event.id}/register`}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-foreground hover:text-cyan-400 transition-colors"
                      >
                        Register <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Coming Soon */}
            <section>
              <h2 className="text-lg font-display font-bold mb-1">More on the way</h2>
              <p className="text-xs text-muted-foreground mb-4">These dashboard features are coming soon.</p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {UPCOMING_FEATURES.map(({ icon: Icon, label }) => (
                  <div
                    key={label}
                    className="p-5 rounded-2xl border border-dashed border-foreground/15 bg-foreground/[0.01] text-center"
                  >
                    <Icon className="w-5 h-5 text-foreground/30 mx-auto mb-2" />
                    <p className="text-xs font-medium text-foreground/50">{label}</p>
                    <span className="text-[10px] font-mono uppercase text-foreground/30 tracking-wider">Coming Soon</span>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}
