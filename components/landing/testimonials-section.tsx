"use client";

import { useState, useEffect } from "react";
import { Quote, Star, CheckCircle2, Linkedin, Twitter, Globe, ExternalLink, X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Testimonial {
  id: number | string;
  author: string;
  signature: string;
  role: string;
  company: string;
  organization: string;
  image: string;
  shortQuote: string;
  fullQuote: string;
  metric: string;
  stack: string;
  linkedin: string;
  twitter: string;
  website: string;
  featured?: boolean;
  rating?: number;
}

interface FeedbackItem {
  id: string;
  name: string;
  role?: string;
  organization?: string;
  message: string;
  rating?: number;
  photoUrl?: string;
}

function feedbackToTestimonial(fb: FeedbackItem): Testimonial {
  return {
    id: fb.id,
    author: fb.name,
    signature: fb.name,
    role: fb.role || "Community Member",
    company: fb.organization || "QNexus Community",
    organization: fb.organization || "",
    image: fb.photoUrl || "",
    shortQuote: fb.message,
    fullQuote: fb.message,
    metric: "TESTIMONIAL",
    stack: [fb.role, fb.organization].filter(Boolean).join(" · ") || "QNexus Community",
    linkedin: "#",
    twitter: "#",
    website: "#",
    featured: false,
    rating: fb.rating,
  };
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    author: "Student-First",
    signature: "Student-First",
    role: "Core Value",
    company: "QNexus",
    organization: "Students are the primary beneficiaries of everything we build",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&auto=format&fit=crop&q=80",
    shortQuote: "Every talk, workshop, and opportunity we build starts with one question: does this actually help a student?",
    fullQuote: "Students are the primary beneficiaries of everything we build. Talks, mentorship, workshops, and opportunities exist because they help someone learn, explore, and find their path in quantum — not the other way around.",
    metric: "STUDENT-FIRST",
    stack: "Learn • Connect • Build • Grow",
    linkedin: "https://linkedin.com",
    twitter: "https://x.com",
    website: "#",
    featured: false,
  },
  {
    id: 2,
    author: "Free-First",
    signature: "Free-First",
    role: "Core Value",
    company: "QNexus",
    organization: "We don't want financial barriers to prevent participation",
    image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&auto=format&fit=crop&q=80",
    shortQuote: "We don't want financial barriers to stand between a curious student and the quantum field.",
    fullQuote: "Cost should never be the reason a student can't attend a talk, join a workshop, or find a mentor. We start free and build sustainably from there — value first, always.",
    metric: "FREE, ALWAYS",
    stack: "No cost to join, ever",
    linkedin: "https://linkedin.com",
    twitter: "https://x.com",
    website: "#",
    featured: true,
  },
  {
    id: 3,
    author: "Access",
    signature: "Access",
    role: "Core Value",
    company: "QNexus",
    organization: "Bringing students closer to people actually working in quantum",
    image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=600&auto=format&fit=crop&q=80",
    shortQuote: "We bring students closer to the researchers, industry professionals, and mentors they normally wouldn't have access to.",
    fullQuote: "Access is the gap we exist to close. Through free talks, mentorship, and direct conversations, we connect students with researchers, industry leaders, and peers already working in the field.",
    metric: "REAL ACCESS",
    stack: "Researchers • Industry • Peers",
    linkedin: "https://linkedin.com",
    twitter: "https://x.com",
    website: "#",
    featured: false,
  },
  {
    id: 4,
    author: "Community",
    signature: "Community",
    role: "Core Value",
    company: "QNexus",
    organization: "Relationships and collaboration, not one-way lectures",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&auto=format&fit=crop&q=80",
    shortQuote: "We're not just another webinar community — this is about relationships and collaboration, not one-way lectures.",
    fullQuote: "A community for learning, collaboration, and exploration. Students connect with researchers, industry, educators, and each other — building real relationships, not just watching talks.",
    metric: "TOGETHER",
    stack: "Discussions • Networking • Projects",
    linkedin: "https://linkedin.com",
    twitter: "https://x.com",
    website: "#",
    featured: false,
  },
  {
    id: 5,
    author: "Practical Value",
    signature: "Practical Value",
    role: "Core Value",
    company: "QNexus",
    organization: "Learning should lead somewhere",
    image: "https://images.unsplash.com/photo-1528901166007-3784c7dd3653?w=600&auto=format&fit=crop&q=80",
    shortQuote: "Learning should lead to projects, mentorship, research, and opportunities — not stop at a talk.",
    fullQuote: "Practical value means learning doesn't end when the talk does. It should lead somewhere: a project, a mentor, a research collaboration, an internship, or a fellowship.",
    metric: "BEYOND TALKS",
    stack: "Mentorship • Research • Internships",
    linkedin: "https://linkedin.com",
    twitter: "https://x.com",
    website: "#",
    featured: false,
  },
  {
    id: 6,
    author: "Global Community",
    signature: "Global Community",
    role: "Core Value",
    company: "QNexus",
    organization: "Open to every student, everywhere",
    image: "https://images.unsplash.com/photo-1544531585-9847b68c8c86?w=600&auto=format&fit=crop&q=80",
    shortQuote: "We think beyond borders — every student, everywhere, has a place here.",
    fullQuote: "A global mindset means we don't think in borders. QNexus connects students across campuses, cities, and countries to the same researchers, mentors, and opportunities.",
    metric: "GLOBAL COMMUNITY",
    stack: "Open to every student, everywhere",
    linkedin: "https://linkedin.com",
    twitter: "https://x.com",
    website: "#",
    featured: false,
  },
];

export function TestimonialsSection() {
  const [selectedPartner, setSelectedPartner] = useState<Testimonial | null>(null);
  const [allTestimonials, setAllTestimonials] = useState<Testimonial[]>(testimonials);

  useEffect(() => {
    fetch("/api/feedback?status=approved")
      .then((r) => r.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          const real = (data.data as FeedbackItem[]).map(feedbackToTestimonial);
          setAllTestimonials([...testimonials, ...real]);
        }
      })
      .catch(() => {
        // keep the default core-values cards if the API is unavailable
      });
  }, []);

  return (
    <section className="relative py-28 lg:py-36 bg-background text-foreground border-t border-foreground/10 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Header matching user's design image */}
        <div className="mb-16">
          <span className="font-mono text-xs tracking-widest text-muted-foreground uppercase block mb-3">
            CORE VALUES
          </span>
          <h2 className="text-4xl md:text-6xl font-display tracking-tight text-foreground max-w-2xl leading-[1.05]">
            What we stand for.
            <br />
            The values that guide us.
          </h2>
        </div>
      </div>

      {/* Infinite Horizontal Carousel Loop Line */}
      <div className="w-full overflow-hidden py-4 group">
        <div className="flex gap-6 marquee-slow whitespace-nowrap hover:[animation-play-state:paused] cursor-grab active:cursor-grabbing">
          {[...Array(3)].map((_, loopIdx) => (
            <div key={loopIdx} className="flex gap-6 shrink-0 items-stretch">
              {allTestimonials.map((t) => (
                <div
                  key={`${loopIdx}-${t.id}`}
                  onClick={() => setSelectedPartner(t)}
                  className="w-[340px] md:w-[380px] h-[440px] shrink-0 rounded-3xl p-8 transition-all duration-300 cursor-pointer flex flex-col justify-between select-none relative text-white overflow-hidden shadow-2xl border border-white/20 hover:scale-[1.02] hover:border-white/40 group"
                  style={
                    t.image
                      ? {
                          backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.88)), url(${t.image})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                        }
                      : { background: "linear-gradient(135deg, #1e293b, #0f172a)" }
                  }
                >
                  {/* Top Avatar Circle */}
                  <div className="flex items-center justify-between mb-4 relative z-10">
                    {t.image ? (
                      <img
                        src={t.image}
                        alt={t.author}
                        className="w-12 h-12 rounded-full object-cover ring-2 ring-white/40 shadow-lg group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-white/15 ring-2 ring-white/40 shadow-lg flex items-center justify-center font-display font-bold text-white group-hover:scale-105 transition-transform">
                        {t.author.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span className="text-[11px] font-mono px-3 py-1 rounded-full font-semibold bg-white/20 text-white backdrop-blur-md border border-white/20">
                      {t.metric}
                    </span>
                  </div>

                  {/* Quote content */}
                  <div className="my-auto relative z-10">
                    <p className="text-sm md:text-base leading-relaxed text-white/95 font-medium line-clamp-4">
                      "{t.shortQuote}"
                    </p>
                  </div>

                  {/* Signature / Author info at bottom */}
                  <div className="pt-4 mt-2 border-t border-white/20 flex flex-col relative z-10">
                    <span className="font-serif italic text-2xl tracking-wide text-white font-medium">
                      {t.signature}
                    </span>
                    <span className="text-xs mt-1 text-white/80 font-sans">
                      {t.role}, {t.company}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="text-center mt-6">
        <p className="font-mono text-xs text-muted-foreground flex items-center justify-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          Hover to pause loop • Click any value to read more
        </p>
      </div>

      {/* Interactive Partner Profile Modal */}
      {selectedPartner && (
        <div
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200"
          onClick={() => setSelectedPartner(null)}
        >
          <div
            className="bg-card text-card-foreground border border-border w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedPartner(null)}
              className="absolute top-5 right-5 z-10 w-10 h-10 rounded-full bg-background/80 hover:bg-background border border-border text-foreground flex items-center justify-center transition-transform hover:scale-105"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header Banner */}
            <div className="relative h-48 sm:h-56 overflow-hidden">
              {selectedPartner.image ? (
                <img
                  src={selectedPartner.image}
                  alt={selectedPartner.author}
                  className="w-full h-full object-cover object-center filter brightness-90"
                />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg, #1e293b, #0f172a)" }}
                >
                  <span className="text-6xl font-display font-bold text-white/20">
                    {selectedPartner.author.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
              <div className="absolute bottom-4 left-6 sm:left-8 flex items-center gap-2">
                <span className="bg-foreground text-background font-mono text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-md">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  {selectedPartner.metric === "TESTIMONIAL" ? "TESTIMONIAL" : "CORE VALUE"}
                </span>
                {selectedPartner.rating && (
                  <span className="bg-background/90 backdrop-blur-md text-foreground font-mono text-xs font-bold px-3 py-1 rounded-full border border-border shadow-md flex items-center gap-1">
                    {selectedPartner.rating} <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                  </span>
                )}
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8">
              {/* Profile Details */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
                <div>
                  <h3 className="text-2xl sm:text-3xl font-display font-bold text-foreground">
                    {selectedPartner.author}
                  </h3>
                  <p className="text-sm font-medium text-muted-foreground mt-0.5">
                    {selectedPartner.role}
                  </p>
                  <p className="text-xs font-mono text-foreground/80 mt-1">
                    {selectedPartner.organization}
                  </p>
                </div>

                {/* Social Links Buttons — only shown when real links exist */}
                {(selectedPartner.linkedin !== "#" || selectedPartner.twitter !== "#" || selectedPartner.website !== "#") && (
                  <div className="flex items-center gap-2.5">
                    {selectedPartner.linkedin !== "#" && (
                      <a
                        href={selectedPartner.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-mono text-xs font-semibold shadow-md transition-transform hover:scale-105"
                      >
                        <Linkedin className="w-4 h-4" />
                        <span>LinkedIn</span>
                      </a>
                    )}
                    {selectedPartner.twitter !== "#" && (
                      <a
                        href={selectedPartner.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2.5 rounded-full bg-foreground/10 hover:bg-foreground/20 text-foreground transition-transform hover:scale-105"
                        title="Twitter / X Profile"
                      >
                        <Twitter className="w-4 h-4" />
                      </a>
                    )}
                    {selectedPartner.website !== "#" && (
                      <a
                        href={selectedPartner.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2.5 rounded-full bg-foreground/10 hover:bg-foreground/20 text-foreground transition-transform hover:scale-105"
                        title="Organization Website"
                      >
                        <Globe className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                )}
              </div>

              {/* Full Testimonial Quote */}
              <div className="py-6">
                <Quote className="w-8 h-8 text-foreground/20 mb-3" />
                <p className="text-base sm:text-lg leading-relaxed text-foreground font-sans">
                  "{selectedPartner.fullQuote}"
                </p>
              </div>

              {/* Tech Stack & Footer */}
              <div className="pt-4 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-mono text-muted-foreground">
                <div>
                  <span className="text-foreground/70">Applies to:</span>{" "}
                  <span className="text-foreground font-semibold">{selectedPartner.stack}</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full text-xs"
                  onClick={() => setSelectedPartner(null)}
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
