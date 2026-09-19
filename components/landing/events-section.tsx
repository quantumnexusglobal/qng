"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { X, Calendar, MapPin, Clock, Users, User, ArrowRight, ExternalLink, ChevronRight, Share2, Check } from "lucide-react";

import { EventItem, resolveEventStatus, isRegistrationOpen } from "@/lib/events-store";
import { getEventShareUrl } from "@/components/events/event-pass";

export function EventsSection({ initialEvents }: { initialEvents: EventItem[] }) {
  const [eventsList, setEventsList] = useState<EventItem[]>(initialEvents);
  const [isVisible, setIsVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  const handleShare = async (event: EventItem) => {
    const url = getEventShareUrl(event.id);
    if (typeof navigator !== "undefined" && navigator.share) {
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
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (selectedEvent) {
      setTimeout(() => setPanelOpen(true), 10);
      document.body.style.overflow = "hidden";
    } else {
      setPanelOpen(false);
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedEvent]);

  const closePanel = () => {
    setPanelOpen(false);
    setTimeout(() => setSelectedEvent(null), 300);
  };

  return (
    <section
      id="events"
      ref={sectionRef}
      className="relative py-24 lg:py-32 border-t border-foreground/10 bg-background text-foreground"
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="mb-16 lg:mb-20">
          <span className="inline-flex items-center gap-3 text-sm font-mono text-muted-foreground mb-6">
            <span className="w-8 h-px bg-foreground/30" />
            Events
          </span>
          <h2
            className={`text-4xl lg:text-6xl font-display tracking-tight transition-all duration-700 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            Join our events.
            <br />
            <span className="text-muted-foreground">Connect with the community.</span>
          </h2>
        </div>


        <div className="divide-y divide-foreground/10 border-t border-b border-foreground/10">
          {eventsList.map((event, index) => {
            const isUpcoming = resolveEventStatus(event) === "upcoming";
            return (
            <div
              key={event.id}
              onClick={() => setSelectedEvent(event)}
              className={`group flex flex-col md:flex-row items-start md:items-center gap-6 py-7 cursor-pointer transition-all duration-300 hover:px-4 hover:-mx-4 hover:bg-foreground/[0.02] ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${index * 80}ms` }}
            >
              {/* Date column */}
              <div className="w-16 shrink-0 text-left select-none hidden sm:block">
                <div className="font-mono text-xs text-foreground/40 uppercase tracking-widest leading-none">
                  {event.month}
                </div>
                <div className="font-display text-3xl lg:text-4xl font-bold text-foreground leading-tight tracking-tight my-1">
                  {event.day}
                </div>
                <div className="font-mono text-[11px] text-foreground/45 leading-none">
                  {event.dayLabel}
                </div>
              </div>

              {/* Session Image Thumbnail */}
              {event.imageUrl && (
                <div className="relative w-full sm:w-32 md:w-36 h-28 sm:h-40 md:h-44 rounded-2xl overflow-hidden shrink-0 border border-foreground/10 bg-foreground/5 shadow-sm group-hover:border-cyan-500/40 transition-all flex items-center justify-center">
                  <img
                    src={event.imageUrl}
                    alt={event.title}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent sm:hidden" />
                  <div className="absolute bottom-2 left-2 sm:hidden text-white font-mono text-[11px] font-bold">
                    {event.month} {event.day} • {event.dayLabel}
                  </div>
                </div>
              )}

              {/* Title & description in the center */}
              <div className="flex-1 min-w-0 py-0.5">
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  <span
                    className={`text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full border font-semibold ${
                      isUpcoming
                        ? "border-emerald-300 text-emerald-700 bg-emerald-100"
                        : "border-foreground/15 text-foreground/50 bg-foreground/5"
                    }`}
                  >
                    {isUpcoming ? "Upcoming" : "Past"}
                  </span>
                  <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full border border-cyan-300 text-cyan-700 bg-cyan-100">
                    {event.badge || "Online Masterclass"}
                  </span>
                  <span className="text-xs font-mono text-foreground/40">
                    {event.time}
                  </span>
                </div>
                <h3 className="text-lg lg:text-xl font-medium leading-snug text-foreground group-hover:text-cyan-700 dark:group-hover:text-cyan-400 transition-colors">
                  {event.title}
                </h3>
                <p className="text-sm text-foreground/50 leading-relaxed mt-1 line-clamp-2">
                  {event.description}
                </p>
              </div>

              {/* Action on the right */}
              <div className="shrink-0 flex items-center gap-3 pt-1 self-end md:self-center">
                <span className="text-xs font-mono text-foreground/60 hidden lg:inline-block">
                  {event.price}
                </span>
                <div className="w-9 h-9 rounded-full border border-foreground/15 flex items-center justify-center group-hover:border-cyan-500/40 group-hover:bg-cyan-500/10 transition-all">
                  <ChevronRight className="w-4 h-4 text-foreground/40 group-hover:text-cyan-700 dark:group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all duration-200" />
                </div>
              </div>
            </div>
            );
          })}
        </div>


      </div>

      {/* Slide-in detail panel overlay */}
      {selectedEvent && (
        <>
          {/* Backdrop */}
          <div
            className={`fixed inset-0 z-45 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
              panelOpen ? "opacity-100" : "opacity-0"
            }`}
            onClick={closePanel}
          />

          {/* Panel */}
          <div
            className={`fixed top-0 right-0 bottom-0 z-50 w-full max-w-[500px] bg-background border-l border-foreground/10 shadow-2xl overflow-y-auto transition-transform duration-300 ease-out ${
              panelOpen ? "translate-x-0" : "translate-x-full"
            }`}
          >
            {/* Header */}
            <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-foreground/10 px-8 py-5 flex items-center justify-between">
              <span className="font-mono text-xs text-foreground/40 uppercase tracking-widest">
                Event Overview
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleShare(selectedEvent)}
                  aria-label="Share this event"
                  title={shareCopied ? "Link copied!" : "Share this event"}
                  className="w-9 h-9 rounded-full border border-foreground/15 flex items-center justify-center hover:bg-foreground/10 transition-colors"
                >
                  {shareCopied ? (
                    <Check className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <Share2 className="w-4 h-4 text-foreground/60" />
                  )}
                </button>
                <button
                  onClick={closePanel}
                  aria-label="Close event details"
                  className="w-9 h-9 rounded-full border border-foreground/15 flex items-center justify-center hover:bg-foreground/10 transition-colors"
                >
                  <X className="w-4 h-4 text-foreground/60" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="px-8 py-8 space-y-8">
              {/* Date & Badge */}
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-mono text-xs text-foreground/40 uppercase tracking-wider">
                    {selectedEvent.month} {selectedEvent.day}, 2026
                  </div>
                  <div className="font-mono text-xs text-foreground/50 mt-0.5">
                    {selectedEvent.dayLabel}
                  </div>
                </div>
                <span className="text-xs font-mono text-cyan-700 border border-cyan-300 bg-cyan-100 px-3 py-1 rounded-full">
                  {selectedEvent.badge}
                </span>
              </div>

              {/* Cover Image */}
              {selectedEvent.imageUrl && (
                <div className="w-full rounded-2xl overflow-hidden border border-foreground/15 bg-foreground/5 shadow-inner flex items-center justify-center">
                  <img
                    src={selectedEvent.imageUrl}
                    alt={selectedEvent.title}
                    className="w-full h-auto max-h-[60vh] object-contain"
                  />
                </div>
              )}

              {/* Title & Description */}
              <div>
                <h2 className="text-2xl lg:text-3xl font-display leading-tight text-foreground mb-4">
                  {selectedEvent.title}
                </h2>
                <p className="text-foreground/60 leading-relaxed text-sm whitespace-pre-line">
                  {selectedEvent.fullDescription}
                </p>
              </div>

              {/* Info grid */}
              <div className="grid grid-cols-1 min-[420px]:grid-cols-2 gap-3">
                {[
                  { icon: MapPin, label: "Location", value: selectedEvent.location },
                  { icon: Clock, label: "Time", value: selectedEvent.time },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="p-4 rounded-2xl border border-foreground/10 bg-foreground/[0.015]">
                    <div className="flex items-center gap-1.5 text-foreground/45 mb-1.5">
                      <Icon className="w-3.5 h-3.5" />
                      <span className="font-mono text-[10px] uppercase tracking-widest">{label}</span>
                    </div>
                    <p className="text-foreground text-sm font-medium leading-snug">{value}</p>
                  </div>
                ))}

                {/* Attendees — with stacked person icons */}
                <div className="p-4 rounded-2xl border border-foreground/10 bg-foreground/[0.015]">
                  <div className="flex items-center gap-1.5 text-foreground/45 mb-1.5">
                    <Users className="w-3.5 h-3.5" />
                    <span className="font-mono text-[10px] uppercase tracking-widest">Attendees</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center -space-x-1.5" aria-hidden="true">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <div
                          key={i}
                          className="w-5 h-5 rounded-full flex items-center justify-center border-2 border-background bg-cyan-500"
                          style={{ opacity: 1 - i * 0.18 }}
                        >
                          <User className="w-2.5 h-2.5 text-white" />
                        </div>
                      ))}
                    </div>
                    <p className="text-foreground text-sm font-medium leading-snug">{selectedEvent.attendees} attending</p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl border border-foreground/10 bg-foreground/[0.015]">
                  <div className="flex items-center gap-1.5 text-foreground/45 mb-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    <span className="font-mono text-[10px] uppercase tracking-widest">Tickets</span>
                  </div>
                  <p className="text-foreground text-sm font-medium leading-snug">{selectedEvent.price}</p>
                </div>
              </div>

              {/* Agenda */}
              {selectedEvent.schedule && selectedEvent.schedule.length > 0 && (
                <div>
                  <h3 className="font-display text-lg mb-4 text-foreground">Agenda</h3>
                  <div className="border-l border-foreground/15 pl-5 space-y-4">
                    {selectedEvent.schedule.map((item, idx) => (
                      <div key={idx} className="relative">
                        <div className="absolute -left-[21px] top-1.5 w-2 h-2 rounded-full bg-foreground/20 border-2 border-background" />
                        <div className="font-mono text-[10px] text-foreground/30 uppercase tracking-wider mb-0.5">
                          {item.time}
                        </div>
                        <div className="text-foreground text-sm font-medium">{item.title}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* CTA Register Button */}
              <div className="pt-2 space-y-3">
                {isRegistrationOpen(selectedEvent) ? (
                  <Link href={`/events/${selectedEvent.id}/register`}>
                    <button className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-foreground text-background rounded-2xl font-semibold text-sm hover:bg-foreground/90 transition-colors group">
                      Register for This Event
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </Link>
                ) : (
                  <button
                    className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-foreground/30 text-background rounded-2xl font-semibold text-sm cursor-not-allowed"
                    disabled
                    aria-label="Registration closed"
                  >
                    Registration Closed
                  </button>
                )}
                <button className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-2xl border border-foreground/12 text-foreground/50 hover:text-foreground hover:border-foreground/25 text-sm font-medium transition-colors">
                  <ExternalLink className="w-3.5 h-3.5" />
                  Add to Calendar
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
