'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { X, ArrowLeft, ZoomIn, Sparkles, ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';

export interface GalleryItem {
  id: string | number;
  src: string;
  alt: string;
  event: string;
  date: string;
  location: string;
  span?: string;
  featured?: boolean;
}

interface Props {
  detectedImages: string[];
}

export default function GalleryPageClient({ detectedImages }: Props) {
  const [isVisible, setIsVisible] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [isLooping, setIsLooping] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    if (lightboxIndex !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setIsLooping(false);
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [lightboxIndex]);

  // Convert auto-detected folder images into Gallery Items
  const autoDetectedItems: GalleryItem[] = detectedImages.map((imgPath, idx) => {
    return {
      id: `auto-${idx}`,
      src: imgPath,
      alt: '',
      event: '',
      date: '',
      location: '',
      span: idx % 5 === 0 ? 'col-span-2 row-span-2' : idx % 3 === 0 ? 'col-span-2' : '',
      featured: idx % 5 === 0,
    };
  });

  // Only show real images uploaded to the public gallery folder.
  const allImages = autoDetectedItems;
  const lightboxImg = lightboxIndex !== null ? allImages[lightboxIndex] : null;

  const goNext = useCallback(() => {
    setLightboxIndex((prev) => (prev === null ? null : (prev + 1) % allImages.length));
  }, [allImages.length]);

  const goPrev = useCallback(() => {
    setLightboxIndex((prev) => (prev === null ? null : (prev - 1 + allImages.length) % allImages.length));
  }, [allImages.length]);

  // Auto-advance in an infinite loop through the gallery when enabled
  useEffect(() => {
    if (!isLooping || lightboxIndex === null) return;
    const timer = setInterval(goNext, 3500);
    return () => clearInterval(timer);
  }, [isLooping, lightboxIndex, goNext]);

  // Arrow-key navigation while the lightbox is open
  useEffect(() => {
    if (lightboxIndex === null) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') goNext();
      else if (e.key === 'ArrowLeft') goPrev();
      else if (e.key === 'Escape') setLightboxIndex(null);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [lightboxIndex, goNext, goPrev]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <div className="fixed top-0 left-0 right-0 z-50 border-b border-foreground/10 bg-background/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-sm text-foreground/60 hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to home
          </Link>
          <span className="font-mono text-xs text-foreground/40 tracking-widest uppercase">QNexus Global / Gallery</span>
        </div>
      </div>

      {/* Header */}
      <div className={`pt-32 pb-16 px-6 max-w-7xl mx-auto transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
        <span className="inline-flex items-center gap-3 text-xs font-mono text-muted-foreground uppercase tracking-widest mb-4">
          <span className="w-8 h-px bg-foreground/30" /> Our Moments
        </span>
        <h1 className="text-5xl lg:text-8xl font-display tracking-tight mb-4 leading-[0.95]">Gallery</h1>
        <p className="text-lg text-foreground/55 max-w-xl">
          Highlights from Quantum Nexus Global events, research workshops, hackathons, and community gatherings worldwide.
        </p>

        {/* Auto Detection Status Banner */}
        <div className="mt-6 flex flex-wrap items-center gap-4 text-xs font-mono text-foreground/60 bg-foreground/5 p-4 rounded-2xl border border-foreground/10">
          <div className="flex items-center gap-2 text-emerald-400 font-bold">
            <Sparkles className="w-4 h-4" /> Auto Image Detection Active
          </div>
          <span>•</span>
          <span>{allImages.length} Total Photos</span>
          <span>•</span>
          <span>{autoDetectedItems.length} Auto-Detected Local Files</span>
          <span>•</span>
          <span className="text-muted-foreground">Place new photos in <code>/public/gallery</code> or <code>/public/speakers</code></span>
        </div>
      </div>

      {/* Masonry-style Grid */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 pb-24">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[220px]">
          {allImages.map((img, idx) => (
            <div
              key={img.id}
              onClick={() => setLightboxIndex(idx)}
              className={`relative group overflow-hidden rounded-2xl cursor-pointer ${img.span} ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              } transition-all duration-500`}
              style={{ transitionDelay: `${idx * 30}ms` }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                <ZoomIn className="absolute top-4 right-4 w-5 h-5 text-white/80" />
              </div>
              {img.featured && (
                <div className="absolute top-3 left-3 px-2.5 py-1 bg-amber-500 text-black text-[10px] font-mono font-bold rounded-full shadow-md">
                  FEATURED
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox — loops through every photo, forward and back */}
      {lightboxImg && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setLightboxIndex(null)}
        >
          <button
            onClick={() => setLightboxIndex(null)}
            className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Loop / autoplay toggle */}
          <button
            onClick={(e) => { e.stopPropagation(); setIsLooping((v) => !v); }}
            className="absolute top-5 left-5 flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-mono transition-colors"
            title={isLooping ? 'Pause slideshow' : 'Auto-loop through gallery'}
          >
            {isLooping ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            {isLooping ? 'Looping…' : 'Auto-loop'}
          </button>

          {/* Prev / Next — wrap around infinitely */}
          <button
            onClick={(e) => { e.stopPropagation(); goPrev(); }}
            className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            aria-label="Previous photo"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); goNext(); }}
            className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            aria-label="Next photo"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <div
            className="max-w-5xl w-full max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              key={lightboxImg.id}
              src={lightboxImg.src}
              alt={lightboxImg.alt}
              className="rounded-2xl object-contain max-h-[75vh] w-full"
            />
          </div>
        </div>
      )}
    </div>
  );
}
