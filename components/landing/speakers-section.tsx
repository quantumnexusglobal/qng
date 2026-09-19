"use client";

import { useEffect, useRef, useState } from "react";
import { Mail, Linkedin, X } from "lucide-react";
import Image from "next/image";

const speakers = [
  {
    id: "1",
    name: "Emmanuel Umukoro",
    role: "AI & Quantum Computing Researcher",
    company: "University of North Dakota",
    bio: "Bridging quantum computing and practical AI applications",
    image: "/speakers/emmanuelumukoro.jpg",
    fullBio: "Emmanuel is a researcher specializing in quantum algorithms and their intersection with machine learning, working to unlock next-generation computational capabilities.",
    expertise: ["Quantum AI", "Research", "Machine Learning"],
    social: {
      twitter: "#",
      linkedin: "https://www.linkedin.com/in/emmanuel-umukoro-415373127",
      email: "#",
    },
  },
  {
    id: "2",
    name: "Sergey Grigorovich",
    role: "Senior Research Scientist",
    company: "Duke Engineering",
    bio: "Advancing state-of-the-art in neural architectures",
    image: "/speakers/sergeygrigorovich.jpg",
    fullBio: "Sergey brings deep expertise in neural network research and advanced engineering systems, contributing pioneering work in computational modeling at Duke Engineering.",
    expertise: ["Neural Networks", "Engineering", "Modeling"],
    social: {
      twitter: "#",
      linkedin: "https://www.linkedin.com/in/sergey-grigorovich",
      email: "#",
    },
  },
  {
    id: "3",
    name: "Smriti Bajaj",
    role: "Quantum Research Scientist",
    company: "Dell Technologies",
    bio: "Advancing quantum research and next-generation computing at Dell",
    image: "/speakers/smriti bajaj.jpg",
    fullBio: "Smriti is a Quantum Research Scientist at Dell Technologies, researching the fundamentals of quantum computation and helping the next generation of learners break into the field.",
    expertise: ["Quantum Computing", "Research", "Quantum Algorithms"],
    social: {
      twitter: "#",
      linkedin: "https://www.linkedin.com/in/smriti-bajaj",
      email: "#",
    },
  },
  {
    id: "4",
    name: "Srivathan",
    role: "Quantum Software Engineer",
    company: "QNexus",
    bio: "Building the software layer for quantum systems",
    image: "/speakers/srivathan.jpg",
    fullBio: "Srivathan is a quantum software pioneer developing the tools, SDKs, and frameworks that will make quantum computers accessible and practical for developers worldwide.",
    expertise: ["Quantum Software", "SDK Design", "Dev Tools"],
    social: {
      twitter: "#",
      linkedin: "https://www.linkedin.com/in/srivathsan-poyyapakkam-sundar-50545534",
      email: "#",
    },
  },
];

const orgLogos = [
  { name: "QNexus", image: "/our speaker from/1631348310705.jpg" },
  { name: "Dell Technologies", image: "/our speaker from/delltechnologies_logo.jpg" },
  { name: "Duke Engineering", image: "/our speaker from/duke_engineering_logo.jpg" },
  { name: "University of North Dakota", image: "/our speaker from/uofnorthdakota_logo.jpg" },
  { name: "Organisation", image: "/our speaker from/download (2).png" },
  { name: "University of Notre Dame", image: "/our speaker from/university_of_notre_dame_college_of_science_logo.jpg" },
  // Duplicated for seamless infinite scroll
  { name: "QNexus", image: "/our speaker from/1631348310705.jpg" },
  { name: "Dell Technologies", image: "/our speaker from/delltechnologies_logo.jpg" },
  { name: "Duke Engineering", image: "/our speaker from/duke_engineering_logo.jpg" },
  { name: "University of North Dakota", image: "/our speaker from/uofnorthdakota_logo.jpg" },
  { name: "Organisation", image: "/our speaker from/download (2).png" },
  { name: "University of Notre Dame", image: "/our speaker from/university_of_notre_dame_college_of_science_logo.jpg" },
];

const speakerAnimationStyles = `
  @keyframes logoScroll {
    0%   { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }

  .logo-track {
    display: flex;
    gap: 6rem;
    align-items: center;
    width: max-content;
    animation: logoScroll 22s linear infinite;
  }

  .logo-track:hover {
    animation-play-state: paused;
  }

  .logo-img {
    height: 72px;
    width: auto;
    max-width: 180px;
    object-fit: contain;
    filter: none;
    opacity: 0.9;
    transition: opacity 0.35s ease, transform 0.35s ease, filter 0.35s ease;
    cursor: default;
  }

  .logo-img:hover {
    opacity: 1;
    transform: scale(1.12);
    filter: drop-shadow(0 4px 18px rgba(255,255,255,0.18));
  }

  .logo-fade-left {
    position: absolute;
    left: 0; top: 0; bottom: 0;
    width: 140px;
    background: linear-gradient(to right, var(--background, #09090b) 0%, transparent 100%);
    pointer-events: none;
    z-index: 2;
  }

  .logo-fade-right {
    position: absolute;
    right: 0; top: 0; bottom: 0;
    width: 140px;
    background: linear-gradient(to left, var(--background, #09090b) 0%, transparent 100%);
    pointer-events: none;
    z-index: 2;
  }

  .speaker-card {
    position: relative;
    transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
  
  .speaker-card:hover {
    transform: translateY(-8px);
  }
  
  .speaker-image-container {
    position: relative;
    width: 100%;
    aspect-ratio: 3/4;
    overflow: hidden;
    border-radius: 0.75rem;
    cursor: pointer;
    margin-bottom: 1.5rem;
  }
  
  .speaker-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: top center;
    transition: transform 0.5s ease;
  }
  
  .speaker-card:hover .speaker-image {
    transform: scale(1.05);
  }
  
  .speaker-image-overlay {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.82);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.12);
    opacity: 0;
    transition: opacity 0.4s ease;
    display: flex;
    align-items: flex-end;
    padding: 1.5rem;
    border-radius: 0.75rem;
  }
  
  .speaker-card:hover .speaker-image-overlay {
    opacity: 1;
  }
  
  .speaker-overlay-content {
    width: 100%;
    color: white;
    font-size: 0.875rem;
    line-height: 1.5;
  }
  
  .expertise-badge {
    display: inline-block;
    font-size: 0.7rem;
    padding: 0.3rem 0.65rem;
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 999px;
    color: rgba(255, 255, 255, 0.5);
    letter-spacing: 0.04em;
    transition: all 0.3s ease;
    background: rgba(255,255,255,0.03);
  }
  
  .speaker-card:hover .expertise-badge {
    border-color: rgba(255, 255, 255, 0.3);
    color: rgba(255, 255, 255, 0.85);
  }
  
  .social-icon {
    width: 1.25rem;
    height: 1.25rem;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    opacity: 0.5;
  }
  
  .social-icon:hover {
    opacity: 1;
  }
`;

export function SpeakersSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [selectedSpeaker, setSelectedSpeaker] = useState<typeof speakers[0] | null>(null);

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

  return (
    <section
      id="speakers"
      ref={sectionRef}
      className="relative py-24 lg:py-32 overflow-hidden border-t border-foreground/10"
    >
      <style dangerouslySetInnerHTML={{ __html: speakerAnimationStyles }} />

      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <div className="mb-16">
          <div
            className={`transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
          >
            <span className="inline-flex items-center gap-3 text-sm font-mono text-muted-foreground mb-6">
              <span className="w-8 h-px bg-foreground/30" />
              Featured speakers
            </span>
            <h2 className="text-4xl lg:text-6xl font-display tracking-tight mb-6">
              Meet our
              <br />
              <span className="text-muted-foreground">expert speakers</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed">
              Researchers, engineers, and industry leaders who give their time for free — sharing what a career and a life in quantum actually looks like.
            </p>
          </div>
        </div>

        {/* ── Our Speakers From – infinite logo scroll ── */}
        <div
          className={`mb-16 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          style={{ transitionDelay: "150ms" }}
        >
          <div className="text-center mb-8">
            <p className="text-xs font-mono tracking-[0.28em] uppercase text-muted-foreground/50">
              Our speakers from
            </p>
          </div>

          <div className="relative overflow-hidden py-4">
            <div className="logo-fade-left" />
            <div className="logo-fade-right" />
            <div className="logo-track">
              {orgLogos.map((org, i) => (
                <div
                  key={`${org.name}-${i}`}
                  className="flex-shrink-0 flex items-center justify-center"
                  title={org.name}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={org.image}
                    alt={org.name}
                    className="logo-img"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Speakers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {speakers.map((speaker, index) => (
            <div
              key={speaker.id}
              onClick={() => setSelectedSpeaker(speaker)}
              className={`speaker-card cursor-pointer transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
              style={{ transitionDelay: `${index * 100}ms` }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Speaker Image with Hover Overlay */}
              <div className="speaker-image-container">
                <Image
                  src={speaker.image}
                  alt={speaker.name}
                  fill
                  className="speaker-image"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                />
                <div className="speaker-image-overlay">
                  <div className="speaker-overlay-content">
                    <p className="font-medium mb-2">{speaker.fullBio}</p>
                    <span className="text-xs font-mono text-amber-300 underline">Click to view profile →</span>
                  </div>
                </div>
              </div>

              {/* Speaker Info */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-foreground leading-tight flex items-center justify-between">
                    <span>{speaker.name}</span>
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">{speaker.role}</p>
                  <p className="text-xs text-muted-foreground/50 mt-0.5 font-mono tracking-wide">{speaker.company}</p>
                </div>

                {/* Bio */}
                <p className="text-sm text-muted-foreground italic">
                  &quot;{speaker.bio}&quot;
                </p>

                {/* Expertise Badges */}
                <div className="flex flex-wrap gap-2">
                  {speaker.expertise.map((skill) => (
                    <span key={skill} className="expertise-badge">
                      {skill}
                    </span>
                  ))}
                </div>

                {/* Social Links */}
                <div className="flex items-center gap-3 pt-4 border-t border-foreground/10">
                  <a
                    href={speaker.social.email}
                    onClick={(e) => e.stopPropagation()}
                    className="social-icon hover:text-foreground"
                    aria-label="Email"
                  >
                    <Mail className="w-5 h-5" />
                  </a>
                  <a
                    href={speaker.social.linkedin}
                    onClick={(e) => e.stopPropagation()}
                    className="social-icon hover:text-foreground"
                    aria-label="LinkedIn"
                  >
                    <Linkedin className="w-5 h-5" />
                  </a>
                  <a
                    href={speaker.social.twitter}
                    onClick={(e) => e.stopPropagation()}
                    className="social-icon hover:text-foreground"
                    aria-label="Twitter"
                  >
                    <X className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SPEAKER PROFILE POPUP MODAL (Testimonial Style) */}
      {selectedSpeaker && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setSelectedSpeaker(null)}
        >
          <div
            className="bg-card text-card-foreground border border-border w-full max-w-xl rounded-3xl overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedSpeaker(null)}
              className="absolute top-5 right-5 z-10 w-10 h-10 rounded-full bg-background/80 hover:bg-background border border-border text-foreground flex items-center justify-center transition-transform hover:scale-105"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header Banner */}
            <div className="relative h-60 sm:h-72 overflow-hidden">
              <img
                src={selectedSpeaker.image}
                alt={selectedSpeaker.name}
                className="w-full h-full object-cover object-top filter brightness-95"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />
              <div className="absolute bottom-4 left-6 sm:left-8 flex items-center gap-2">
                <span className="bg-foreground text-background font-mono text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-md uppercase">
                  FEATURED SPEAKER
                </span>
                <span className="bg-background/90 backdrop-blur-md text-foreground font-mono text-xs font-bold px-3 py-1 rounded-full border border-border shadow-md">
                  {selectedSpeaker.company}
                </span>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 space-y-6">
              {/* Profile Details */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
                <div>
                  <h3 className="text-2xl sm:text-3xl font-display font-bold text-foreground">
                    {selectedSpeaker.name}
                  </h3>
                  <p className="text-sm font-medium text-muted-foreground mt-0.5">
                    {selectedSpeaker.role}
                  </p>
                  <p className="text-xs font-mono text-foreground/80 mt-1">
                    {selectedSpeaker.company}
                  </p>
                </div>

                {/* Social Links Buttons */}
                <div className="flex items-center gap-2.5">
                  <a
                    href={selectedSpeaker.social.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-mono text-xs font-semibold shadow-md transition-transform hover:scale-105"
                  >
                    <Linkedin className="w-4 h-4" />
                    <span>LinkedIn</span>
                  </a>
                  <a
                    href={selectedSpeaker.social.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-full bg-foreground/10 hover:bg-foreground/20 text-foreground transition-transform hover:scale-105"
                    title="Twitter / X Profile"
                  >
                    <X className="w-4 h-4" />
                  </a>
                  <a
                    href={selectedSpeaker.social.email}
                    className="p-2.5 rounded-full bg-foreground/10 hover:bg-foreground/20 text-foreground transition-transform hover:scale-105"
                    title="Email"
                  >
                    <Mail className="w-4 h-4" />
                  </a>
                </div>
              </div>

              {/* Bio & Details */}
              <div className="space-y-3">
                <h4 className="text-xs font-mono uppercase tracking-widest text-muted-foreground">About & Biography</h4>
                <p className="text-base leading-relaxed text-foreground font-sans">
                  {selectedSpeaker.fullBio}
                </p>
              </div>

              {/* Expertise Badges */}
              <div className="pt-4 border-t border-border space-y-2">
                <h4 className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Key Expertise</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedSpeaker.expertise.map((skill) => (
                    <span
                      key={skill}
                      className="text-xs font-mono px-3 py-1 rounded-full bg-foreground/10 text-foreground border border-foreground/10"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
