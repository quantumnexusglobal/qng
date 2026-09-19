'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { X, Calendar, MapPin, Clock, ArrowRight, ExternalLink, ArrowLeft, ChevronRight, Users, User, Share2, Check } from 'lucide-react';
import { EventItem, resolveEventStatus, isRegistrationOpen, getRegistrationCloseHours } from '@/lib/events-store';
import { getEventShareUrl } from '@/components/events/event-pass';
import { getSpeakerPhoto } from '@/lib/speaker-photos';

// ─── Category → Washi tape color mapping ───────────────────────────────────
const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
  Workshop:       { bg: 'rgba(232, 169, 61, 0.35)',  text: '#7a5a00' },
  Hackathon:      { bg: 'rgba(228, 87, 46, 0.28)',   text: '#8a2500' },
  Seminar:        { bg: 'rgba(107, 143, 113, 0.32)', text: '#2d5c35' },
  Panel:          { bg: 'rgba(139, 92, 246, 0.25)',  text: '#4c1d95' },
  Conference:     { bg: 'rgba(34, 211, 238, 0.25)',  text: '#0c4a6e' },
  Webinar:        { bg: 'rgba(232, 169, 61, 0.30)',  text: '#7a5a00' },
  'Reading Group':{ bg: 'rgba(107, 143, 113, 0.28)', text: '#2d5c35' },
};

// Gradient placeholders for events without images
const CATEGORY_GRADIENTS: Record<string, string> = {
  Workshop:        'linear-gradient(135deg, #E8A93D22, #E8A93D66)',
  Hackathon:       'linear-gradient(135deg, #E4572E22, #E4572E55)',
  Seminar:         'linear-gradient(135deg, #6B8F7122, #6B8F7155)',
  Panel:           'linear-gradient(135deg, #8B5CF622, #8B5CF655)',
  Conference:      'linear-gradient(135deg, #22D3EE22, #22D3EE44)',
  Webinar:         'linear-gradient(135deg, #E8A93D22, #E8A93D44)',
  'Reading Group': 'linear-gradient(135deg, #6B8F7122, #6B8F7144)',
};

// Washi tab colors
const TAB_COLORS = [
  { bg: 'rgba(232,169,61,0.38)',  text: '#7a5a00', rotate: '-2deg'  },
  { bg: 'rgba(107,143,113,0.38)', text: '#2d5c35', rotate: '1.5deg' },
  { bg: 'rgba(139,92,246,0.25)',  text: '#4c1d95', rotate: '-1.8deg'},
];

// Hand-drawn SVG ellipse for date circle
function HandCircle() {
  return (
    <svg
      viewBox="0 0 72 42"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden="true"
    >
      <ellipse
        cx="36" cy="21" rx="33" ry="18"
        stroke="#E4572E"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="4 2"
        opacity="0.55"
        style={{ transform: 'rotate(-3deg)', transformOrigin: 'center' }}
      />
    </svg>
  );
}

// Tally marks — decorative, one group per ~40 attendees, capped at 5
function TallyMarks({ count }: { count: string }) {
  const num = parseInt(count.replace(/\D/g, ''), 10) || 0;
  const groups = Math.min(Math.ceil(num / 40), 3);
  if (groups === 0) return null;
  return (
    <span className="inline-flex items-center -space-x-1.5" aria-hidden="true">
      {Array.from({ length: groups }).map((_, i) => (
        <span
          key={i}
          className="w-4 h-4 rounded-full flex items-center justify-center border"
          style={{ backgroundColor: 'var(--cork-mustard)', borderColor: '#fff', opacity: 1 - i * 0.18 }}
        >
          <User className="w-2.5 h-2.5 text-white" />
        </span>
      ))}
    </span>
  );
}

// Card rotation by index position in 3-cycle
const ROTATIONS = ['card-rot-0', 'card-rot-1', 'card-rot-2'];

// Filter tabs config
const FILTERS = [
  { label: 'all events', value: 'all' },
  { label: 'upcoming',   value: 'upcoming' },
  { label: 'past',       value: 'past' },
] as const;

type FilterValue = 'all' | 'upcoming' | 'past';

export default function EventsListClient({ initialEvents }: { initialEvents: EventItem[] }) {
  const [allEvents, setAllEvents] = useState<EventItem[]>(initialEvents);
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [filter, setFilter] = useState<FilterValue>('all');
  const [shareCopied, setShareCopied] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleShare = async (event: EventItem) => {
    const url = getEventShareUrl(event.id);
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ title: event.title, text: event.description, url });
        return;
      } catch {
        // user cancelled or share failed — fall through to clipboard
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2000);
    } catch {
      // ignore — clipboard unavailable
    }
  };

  useEffect(() => {
    if (selectedEvent) {
      setTimeout(() => setPanelOpen(true), 10);
      document.body.style.overflow = 'hidden';
    } else {
      setPanelOpen(false);
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [selectedEvent]);

  const closePanel = () => {
    setPanelOpen(false);
    setTimeout(() => setSelectedEvent(null), 350);
  };

  const filteredEvents = useMemo(() => {
    if (filter === 'all') return allEvents;
    return allEvents.filter(ev => resolveEventStatus(ev) === filter);
  }, [allEvents, filter]);

  return (
    <div
      className="min-h-screen text-[var(--cork-ink)]"
      style={{ backgroundColor: 'var(--cork-bg)', backgroundImage: 'radial-gradient(var(--cork-dot) 1.5px, transparent 1.5px)', backgroundSize: '22px 22px' }}
    >
      {/* ── Top nav ──────────────────────────────────────────────────────── */}
      <div className="fixed top-0 left-0 right-0 z-50 border-b border-[#1B1B1F]/10 bg-[#FAF7F0]/92 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-ibm-plex-mono text-[var(--cork-muted)] hover:text-[var(--cork-ink)] transition-colors focus-visible:outline-2 focus-visible:outline-[var(--cork-coral)]"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Link>
          <span className="font-ibm-plex-mono text-xs text-[var(--cork-muted)]/60 tracking-widest uppercase">QNI / Events</span>
        </div>
      </div>

      {/* ── Page header ───────────────────────────────────────────────────── */}
      <div className={`pt-28 pb-10 max-w-6xl mx-auto px-6 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <span className="font-ibm-plex-mono text-xs tracking-widest text-[var(--cork-muted)]/60 uppercase block mb-2">Community</span>
        <h1
          className="font-space-grotesk text-5xl lg:text-7xl font-bold tracking-tight mb-1"
          style={{ color: 'var(--cork-ink)' }}
        >
          Events
        </h1>
        <p className="font-caveat text-xl" style={{ color: 'var(--cork-muted)' }}>
          — join us, learn together, build the quantum future.
        </p>
      </div>

      {/* ── Filter tabs ───────────────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-6 mb-10">
        <div className="flex items-center gap-4 flex-wrap" role="group" aria-label="Filter events">
          {FILTERS.map(({ label, value }, i) => {
            const col = TAB_COLORS[i % TAB_COLORS.length];
            const isActive = filter === value;
            return (
              <button
                key={value}
                id={`filter-tab-${value}`}
                onClick={() => setFilter(value)}
                className={`washi-tab ${isActive ? 'active' : ''}`}
                style={{
                  backgroundColor: col.bg,
                  color: col.text,
                  ...(isActive ? { transform: 'rotate(0deg)' } : { transform: `rotate(${col.rotate})` }),
                }}
                aria-pressed={isActive}
              >
                {label}
              </button>
            );
          })}
          <span className="font-ibm-plex-mono text-xs ml-2" style={{ color: 'var(--cork-muted)' }}>
            {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* ── Corkboard grid ─────────────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-6 pb-28">
        {filteredEvents.length === 0 && (
          <div className="text-center py-20">
            <p className="font-caveat text-2xl" style={{ color: 'var(--cork-muted)' }}>
              No events found for this filter.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3" style={{ alignItems: 'start' }}>
          {filteredEvents.map((event, idx) => {
            const isPast = resolveEventStatus(event) === 'past';
            const rotClass = ROTATIONS[idx % 3];
            const catColor = CATEGORY_COLORS[event.category] || CATEGORY_COLORS['Workshop'];
            const catGradient = CATEGORY_GRADIENTS[event.category] || CATEGORY_GRADIENTS['Workshop'];
            const attendeeNum = parseInt(event.attendees?.replace(/\D/g, '') || '0', 10);

            return (
              <article
                key={event.id}
                role="button"
                tabIndex={0}
                aria-label={`${event.title} — ${event.month} ${event.day}. Click for details.`}
                onClick={() => setSelectedEvent(event)}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelectedEvent(event); } }}
                className={`event-card card-enter ${rotClass} bg-white rounded-sm cursor-pointer select-none focus-visible:outline-2 focus-visible:outline-[var(--cork-coral)] focus-visible:outline-offset-4 ${isPast ? 'opacity-75' : ''}`}
                style={{
                  boxShadow: '0 4px 18px rgba(27,27,31,0.10), 0 1px 4px rgba(27,27,31,0.07)',
                  animationDelay: `${idx * 65}ms`,
                  padding: 0,
                  overflow: 'visible',
                }}
              >
                {/* Pushpin */}
                <div className="cork-pin" aria-hidden="true" />

                {/* Washi tape label */}
                <div
                  className="washi-tape"
                  style={{ backgroundColor: catColor.bg, color: catColor.text }}
                  aria-hidden="true"
                >
                  {event.category.toLowerCase()}
                </div>

                {/* Stamp badge — sits on the card itself, not on the photo */}
                <div
                  className="stamp-badge"
                  style={{ color: isPast ? 'var(--cork-muted)' : 'var(--cork-stamp-green)' }}
                  aria-label={isPast ? 'Archived event' : 'RSVP Open'}
                >
                  {isPast ? 'ARCHIVED' : 'RSVP OPEN'}
                </div>

                <div style={{ padding: '28px 16px 0 16px' }}>
                  {/* Hand-circled date */}
                  <div className="relative inline-block mb-3" style={{ minWidth: 72, minHeight: 42 }}>
                    <div className="relative z-10 text-center" style={{ padding: '2px 8px' }}>
                      <span
                        className="font-caveat block leading-none"
                        style={{ fontSize: 28, fontWeight: 700, color: 'var(--cork-ink)', lineHeight: 1 }}
                      >
                        {event.day}
                      </span>
                      <span
                        className="font-caveat block leading-tight"
                        style={{ fontSize: 13, color: 'var(--cork-muted)' }}
                      >
                        {event.month}
                      </span>
                    </div>
                    <HandCircle />
                  </div>
                </div>

                {/* Polaroid image frame */}
                <div className="polaroid-frame mx-4 mb-0 relative">
                  {/* Image or gradient placeholder */}
                  {event.imageUrl ? (
                    <div
                      className="torn-paper-img aspect-[4/5]"
                      style={{ backgroundColor: '#fff', overflow: 'hidden' }}
                    >
                      {/* Reserve a bottom margin (~14% of the box) so the jagged
                          torn-paper clip below never eats into the photo itself. */}
                      <div style={{ height: '86%', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <img
                          src={event.imageUrl}
                          alt={event.title}
                          loading="lazy"
                          className={`w-full h-full object-contain ${isPast ? 'past-event-img' : ''}`}
                        />
                      </div>
                    </div>
                  ) : (
                    <div
                      className={`torn-paper-img ${isPast ? 'past-event-img' : ''}`}
                      style={{ height: 160, background: catGradient, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      aria-hidden="true"
                    >
                      <span
                        className="font-space-grotesk font-bold text-4xl opacity-20"
                        style={{ color: 'var(--cork-ink)' }}
                      >
                        {event.category.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Card body */}
                <div style={{ padding: '12px 16px 0 16px' }}>
                  {/* Attendee meta row */}
                  <div className="flex items-center gap-2 mb-2">
                    <TallyMarks count={event.attendees} />
                    <span className="font-ibm-plex-mono text-xs" style={{ color: 'var(--cork-muted)' }}>
                      {event.attendees} attending
                    </span>
                  </div>

                  {/* Title */}
                  <h2
                    className="font-space-grotesk font-bold leading-snug mb-1"
                    style={{ fontSize: 17, color: 'var(--cork-ink)' }}
                  >
                    {event.title}
                  </h2>

                  {/* Venue */}
                  <p
                    className="font-sans text-xs leading-relaxed mb-3"
                    style={{ color: 'var(--cork-muted)' }}
                  >
                    <MapPin className="inline w-3 h-3 mr-0.5 -mt-0.5" aria-hidden="true" />
                    {event.location}
                  </p>
                </div>

                {/* Dashed tear divider */}
                <div style={{ margin: '0 16px' }}>
                  <hr className="tear-divider" />
                </div>

                {/* Footer CTA */}
                <div style={{ padding: '8px 16px 14px 16px' }}>
                  <button
                    onClick={(e) => { e.stopPropagation(); setSelectedEvent(event); }}
                    className="font-ibm-plex-mono text-xs font-bold uppercase tracking-widest transition-colors focus-visible:outline-2 focus-visible:outline-[var(--cork-coral)] focus-visible:outline-offset-2"
                    style={{ color: isPast ? 'var(--cork-muted)' : 'var(--cork-coral)' }}
                    aria-label={`${isPast ? 'View recap' : 'View event'}: ${event.title}`}
                  >
                    {isPast ? 'View recap →' : 'View event →'}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {/* ── Slide-in detail panel ─────────────────────────────────────────── */}
      {selectedEvent && (
        <>
          {/* Backdrop */}
          <div
            className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-350 ${panelOpen ? 'opacity-100' : 'opacity-0'}`}
            onClick={closePanel}
            aria-hidden="true"
          />

          {/* Panel */}
          <div
            role="dialog"
            aria-modal="true"
            aria-label={`Event details: ${selectedEvent.title}`}
            className={`fixed top-0 right-0 bottom-0 z-50 w-full max-w-[520px] border-l border-[#1B1B1F]/10 shadow-2xl overflow-y-auto transition-transform duration-350 ease-out ${panelOpen ? 'translate-x-0' : 'translate-x-full'}`}
            style={{ backgroundColor: 'var(--cork-bg)' }}
          >
            {/* Panel header */}
            <div
              className="sticky top-0 z-10 border-b border-[#1B1B1F]/10 px-8 py-5 flex items-center justify-between backdrop-blur-sm"
              style={{ backgroundColor: 'rgba(250,247,240,0.95)' }}
            >
              <span className="font-ibm-plex-mono text-xs text-[var(--cork-muted)]/60 uppercase tracking-widest">
                Event Details
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleShare(selectedEvent)}
                  aria-label="Share this event"
                  title={shareCopied ? 'Link copied!' : 'Share this event'}
                  className="w-9 h-9 rounded-full border border-[#1B1B1F]/15 flex items-center justify-center hover:bg-[#1B1B1F]/8 transition-colors focus-visible:outline-2 focus-visible:outline-[var(--cork-coral)]"
                >
                  {shareCopied ? (
                    <Check className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Share2 className="w-4 h-4" style={{ color: 'var(--cork-muted)' }} />
                  )}
                </button>
                <button
                  onClick={closePanel}
                  aria-label="Close event details"
                  className="w-9 h-9 rounded-full border border-[#1B1B1F]/15 flex items-center justify-center hover:bg-[#1B1B1F]/8 transition-colors focus-visible:outline-2 focus-visible:outline-[var(--cork-coral)]"
                >
                  <X className="w-4 h-4" style={{ color: 'var(--cork-muted)' }} />
                </button>
              </div>
            </div>

            <div className="px-8 py-8 space-y-7">
              {/* Date + badge */}
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-ibm-plex-mono text-xs text-[var(--cork-muted)]/60 uppercase tracking-wider">
                    {selectedEvent.month} {selectedEvent.day}, 2026
                  </div>
                  <div className="font-caveat text-xl font-bold mt-0.5" style={{ color: 'var(--cork-ink)' }}>
                    {selectedEvent.dayLabel}
                  </div>
                </div>
                <span
                  className="font-ibm-plex-mono text-xs px-3 py-1 rounded-full border"
                  style={{
                    borderColor: 'var(--cork-ink)',
                    color: 'var(--cork-ink)',
                    opacity: 0.5,
                  }}
                >
                  {selectedEvent.badge}
                </span>
              </div>

              {/* Cover image */}
              {selectedEvent.imageUrl && (
                <div className="rounded-xl overflow-hidden flex items-center justify-center bg-[var(--cork-ink)]/5">
                  <img
                    src={selectedEvent.imageUrl}
                    alt={selectedEvent.title}
                    className={`w-full h-auto max-h-[60vh] object-contain ${resolveEventStatus(selectedEvent) === 'past' ? 'past-event-img' : ''}`}
                  />
                </div>
              )}

              {/* Title & description */}
              <div>
                <h2
                  className="font-space-grotesk font-bold text-2xl leading-tight mb-3"
                  style={{ color: 'var(--cork-ink)' }}
                >
                  {selectedEvent.title}
                </h2>
                <p className="font-sans text-sm leading-relaxed whitespace-pre-line" style={{ color: 'var(--cork-muted)' }}>
                  {selectedEvent.fullDescription || selectedEvent.description}
                </p>
              </div>

              {/* Info grid */}
              <div className="grid grid-cols-1 min-[420px]:grid-cols-2 gap-3">
                {[
                  { icon: MapPin, label: 'Location', value: selectedEvent.location },
                  { icon: Clock, label: 'Time', value: selectedEvent.time },
                ].map(({ icon: Icon, label, value }) => (
                  <div
                    key={label}
                    className="p-4 rounded-2xl border"
                    style={{ borderColor: 'rgba(27,27,31,0.08)', backgroundColor: 'rgba(255,255,255,0.6)' }}
                  >
                    <div className="flex items-center gap-1.5 mb-1.5" style={{ color: 'var(--cork-muted)' }}>
                      <Icon className="w-3 h-3" aria-hidden="true" />
                      <span className="font-ibm-plex-mono text-[10px] uppercase tracking-widest">{label}</span>
                    </div>
                    <p className="font-sans text-sm font-medium leading-snug" style={{ color: 'var(--cork-ink)' }}>
                      {value}
                    </p>
                  </div>
                ))}

                {/* Attendees — with stacked person icons */}
                <div
                  className="p-4 rounded-2xl border"
                  style={{ borderColor: 'rgba(27,27,31,0.08)', backgroundColor: 'rgba(255,255,255,0.6)' }}
                >
                  <div className="flex items-center gap-1.5 mb-1.5" style={{ color: 'var(--cork-muted)' }}>
                    <Users className="w-3 h-3" aria-hidden="true" />
                    <span className="font-ibm-plex-mono text-[10px] uppercase tracking-widest">Attendees</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center -space-x-1.5" aria-hidden="true">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <div
                          key={i}
                          className="w-5 h-5 rounded-full flex items-center justify-center border-2"
                          style={{ backgroundColor: 'var(--cork-mustard)', borderColor: 'rgba(255,255,255,0.9)', opacity: 1 - i * 0.18 }}
                        >
                          <User className="w-2.5 h-2.5 text-white" />
                        </div>
                      ))}
                    </div>
                    <p className="font-sans text-sm font-medium leading-snug" style={{ color: 'var(--cork-ink)' }}>
                      {selectedEvent.attendees} attending
                    </p>
                  </div>
                </div>

                <div
                  className="p-4 rounded-2xl border"
                  style={{ borderColor: 'rgba(27,27,31,0.08)', backgroundColor: 'rgba(255,255,255,0.6)' }}
                >
                  <div className="flex items-center gap-1.5 mb-1.5" style={{ color: 'var(--cork-muted)' }}>
                    <Calendar className="w-3 h-3" aria-hidden="true" />
                    <span className="font-ibm-plex-mono text-[10px] uppercase tracking-widest">Tickets</span>
                  </div>
                  <p className="font-sans text-sm font-medium leading-snug" style={{ color: 'var(--cork-ink)' }}>
                    {selectedEvent.price}
                  </p>
                </div>
              </div>

              {/* Agenda */}
              {selectedEvent.schedule && selectedEvent.schedule.length > 0 && (
                <div>
                  <h3 className="font-space-grotesk font-bold text-lg mb-4" style={{ color: 'var(--cork-ink)' }}>
                    Agenda
                  </h3>
                  <div className="pl-5 space-y-4" style={{ borderLeft: '2px solid rgba(27,27,31,0.12)' }}>
                    {selectedEvent.schedule.map((item, idx) => (
                      <div key={idx} className="relative">
                        <div
                          className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full border-2"
                          style={{ background: 'var(--cork-mustard)', borderColor: 'var(--cork-bg)' }}
                          aria-hidden="true"
                        />
                        <div className="font-ibm-plex-mono text-[10px] uppercase tracking-wider mb-0.5" style={{ color: 'var(--cork-muted)' }}>
                          {item.time}
                        </div>
                        <div className="font-sans text-sm font-medium" style={{ color: 'var(--cork-ink)' }}>
                          {item.title}
                        </div>
                        {item.speaker && (
                          <div className="font-caveat text-sm mt-0.5" style={{ color: 'var(--cork-muted)' }}>
                            {item.speaker}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Speakers */}
              {selectedEvent.speakers && selectedEvent.speakers.filter(Boolean).length > 0 && (
                <div>
                  <h3 className="font-space-grotesk font-bold text-lg mb-3" style={{ color: 'var(--cork-ink)' }}>
                    Speakers
                  </h3>
                  <div className="space-y-2">
                    {selectedEvent.speakers.filter(Boolean).map((s, idx) => {
                      const photo = getSpeakerPhoto(s);
                      return (
                        <div
                          key={idx}
                          className="flex items-center gap-3 p-3 rounded-xl border"
                          style={{ borderColor: 'rgba(27,27,31,0.08)', backgroundColor: 'rgba(255,255,255,0.6)' }}
                        >
                          {photo ? (
                            <img
                              src={photo}
                              alt={s}
                              className="w-8 h-8 rounded-full object-cover object-top shrink-0"
                            />
                          ) : (
                            <div
                              className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-space-grotesk font-bold text-xs"
                              style={{ backgroundColor: 'var(--cork-mustard)', color: '#fff' }}
                              aria-hidden="true"
                            >
                              {s.charAt(0)}
                            </div>
                          )}
                          <span className="font-sans text-sm" style={{ color: 'var(--cork-ink)' }}>{s}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Register CTA */}
              <div className="pt-2 space-y-3">
                {isRegistrationOpen(selectedEvent) ? (
                  <Link href={`/events/${selectedEvent.id}/register`} tabIndex={-1}>
                    <button
                      className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-space-grotesk font-semibold text-sm transition-colors group focus-visible:outline-2 focus-visible:outline-[var(--cork-coral)]"
                      style={{ backgroundColor: 'var(--cork-ink)', color: '#FAF7F0' }}
                    >
                      Register for This Event
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
                    </button>
                  </Link>
                ) : (
                  <button
                    className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-space-grotesk font-semibold text-sm cursor-not-allowed opacity-50"
                    style={{ backgroundColor: 'var(--cork-muted)', color: '#FAF7F0' }}
                    disabled
                    aria-label={resolveEventStatus(selectedEvent) === 'past' ? 'Registration closed — past event' : 'Registration closed — cutoff reached'}
                  >
                    {resolveEventStatus(selectedEvent) === 'past' ? 'Registration Closed' : `Registration Closed (${getRegistrationCloseHours(selectedEvent)}h cutoff)`}
                  </button>
                )}
                <button
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-2xl border text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-[var(--cork-coral)]"
                  style={{ borderColor: 'rgba(27,27,31,0.15)', color: 'var(--cork-muted)' }}
                  onClick={() => {/* calendar add logic */}}
                >
                  <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                  Add to Calendar
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
