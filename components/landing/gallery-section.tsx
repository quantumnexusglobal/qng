"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, ZoomIn, X } from "lucide-react";

const galleryImages = [
  {
    id: 1,
    src: "/gallery/event-photo-01.jpg",
    alt: "",
    cols: "col-span-2",
    rows: "row-span-2",
  },
  {
    id: 2,
    src: "/gallery/event-photo-02.jpg",
    alt: "",
    cols: "",
    rows: "",
  },
  {
    id: 3,
    src: "/gallery/event-photo-03.jpg",
    alt: "",
    cols: "",
    rows: "",
  },
  {
    id: 4,
    src: "/gallery/event-photo-04.jpg",
    alt: "",
    cols: "col-span-2",
    rows: "",
  },
  {
    id: 5,
    src: "/gallery/event-photo-05.jpg",
    alt: "",
    cols: "",
    rows: "",
  },
];

export function GallerySection() {
  const [isVisible, setIsVisible] = useState(false);
  const [lightboxImg, setLightboxImg] = useState<typeof galleryImages[0] | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (lightboxImg) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [lightboxImg]);

  return (
    <section ref={ref} className="relative py-28 lg:py-36 border-t border-foreground/10 overflow-hidden bg-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div
          className={`flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <div>
            <span className="inline-flex items-center gap-3 text-xs font-mono text-muted-foreground uppercase tracking-widest mb-3">
              <span className="w-6 h-px bg-foreground/30" />
              Our Moments
            </span>
            <h2 className="text-4xl md:text-6xl font-display tracking-tight text-foreground leading-[1.0]">
              Events in Pictures
            </h2>
            <p className="text-foreground/50 mt-3 text-base max-w-md leading-relaxed">
              Glimpses from workshops, hackathons, summits & community gatherings around the world.
            </p>
          </div>
          <Link
            href="/gallery"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-foreground/20 text-foreground/60 hover:text-foreground hover:border-foreground/40 text-sm font-medium transition-all duration-200 group whitespace-nowrap self-start md:self-auto"
          >
            View Full Gallery
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

      </div>

      {/* Infinite horizontal photo loop — moves left to right, pauses on hover */}
      <div
        className={`w-full overflow-hidden py-2 transition-all duration-700 delay-100 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <div className="flex gap-4 marquee-reverse whitespace-nowrap hover:[animation-play-state:paused] cursor-grab active:cursor-grabbing">
          {[...Array(2)].map((_, loopIdx) => (
            <div key={loopIdx} className="flex gap-4 shrink-0">
              {galleryImages.map((img) => (
                <div
                  key={`${loopIdx}-${img.id}`}
                  onClick={() => setLightboxImg(img)}
                  className="relative group overflow-hidden rounded-2xl cursor-pointer bg-foreground/5 w-[260px] md:w-[320px] h-[190px] md:h-[220px] shrink-0"
                >
                  <img
                    src={img.src}
                    alt={img.alt}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    draggable={false}
                  />
                  {/* Always-visible subtle bottom gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60" />

                  {/* Hover overlay content */}
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                    <ZoomIn className="absolute top-3 right-3 w-4 h-4 text-white/70" />
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Stats row */}
        <div
          className={`mt-10 pt-8 border-t border-foreground/10 grid grid-cols-2 md:grid-cols-4 gap-6 transition-all duration-700 delay-300 ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          {[
            { value: "Free", label: "To Attend" },
            { value: "2026", label: "Launch Year" },
            { value: "Global", label: "Open Community" },
            { value: "Student-Led", label: "Always" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="font-display text-2xl md:text-3xl font-bold text-foreground">{stat.value}</div>
              <div className="font-mono text-xs text-foreground/40 uppercase tracking-wider mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightboxImg && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setLightboxImg(null)}
        >
          <button
            onClick={() => setLightboxImg(null)}
            className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors z-10"
          >
            <X className="w-5 h-5" />
          </button>
          <div
            className="max-w-5xl w-full flex flex-col animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={lightboxImg.src}
              alt={lightboxImg.alt}
              className="rounded-2xl object-contain max-h-[75vh] w-full"
            />
          </div>
        </div>
      )}
    </section>
  );
}
