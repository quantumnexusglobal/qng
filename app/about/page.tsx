'use client';

import Link from "next/link";
import { ArrowRight, Zap, Users, Rocket, Globe, Target, BookOpen } from "lucide-react";

export default function AboutPage() {
  return (
    <main className="relative min-h-screen overflow-x-hidden">
      {/* Hero Section — full-width event image background, starts directly below fixed nav */}
      <section className="relative h-[70vh] min-h-[480px] flex items-end overflow-hidden">
        {/* Background event image from gallery */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1600&auto=format&fit=crop&q=80"
          alt="QNG Event"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        {/* Dark gradient — transparent at top, dark only at bottom for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/30 to-transparent" />

        {/* Content pinned to bottom */}
        <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12 pb-10 w-full">
          <span className="text-xs font-mono tracking-[0.25em] uppercase text-foreground/50 mb-3 block">
            QNexus
          </span>
          <h1 className="text-5xl lg:text-7xl font-display leading-tight mb-5">
            About QNexus
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mb-6">
            A student-first quantum community. We connect students with researchers, industry leaders, and peers through free talks, mentorship, workshops, and collaborative opportunities — regardless of their background or resources.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/join"
              className="px-7 py-3 bg-foreground hover:bg-foreground/90 text-background rounded-full font-medium transition-all inline-flex items-center gap-2"
            >
              Join the Community
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/contact"
              className="px-7 py-3 border border-foreground/20 hover:bg-foreground/5 text-foreground rounded-full font-medium transition-all"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="relative px-6 lg:px-12 py-10 lg:py-16 border-t border-foreground/10">
        <div className="max-w-[1400px] mx-auto">
          <h2 className="text-4xl lg:text-5xl font-display mb-10">Our Mission & Vision</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-7 border border-foreground/10 rounded-2xl hover:border-foreground/20 transition-all">
              <Target className="w-10 h-10 mb-5 text-foreground/60" />
              <h3 className="text-2xl font-display mb-3">Mission</h3>
              <p className="text-muted-foreground leading-relaxed">
                To make quantum education and opportunities accessible to students, regardless of their background or resources — connecting them with researchers, industry leaders, and peers through free talks, mentorship, workshops, and collaborative opportunities.
              </p>
            </div>
            <div className="p-7 border border-foreground/10 rounded-2xl hover:border-foreground/20 transition-all">
              <Rocket className="w-10 h-10 mb-5 text-foreground/60" />
              <h3 className="text-2xl font-display mb-3">Vision</h3>
              <p className="text-muted-foreground leading-relaxed">
                Don&apos;t try to be the biggest quantum community — try to be the most useful one. We&apos;re building a student-first quantum ecosystem, open to students everywhere.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="relative px-6 lg:px-12 py-10 lg:py-16 border-t border-foreground/10">
        <div className="max-w-[1400px] mx-auto">
          <h2 className="text-4xl lg:text-5xl font-display mb-10">Core Values</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Target, title: "Student-First", description: "Students are the primary beneficiaries of everything we build." },
              { icon: Zap, title: "Free-First", description: "We don't want financial barriers to prevent participation." },
              { icon: Rocket, title: "Access", description: "Bringing students closer to people actually working in quantum." },
              { icon: Users, title: "Community", description: "Not just one-way lectures — real relationships and collaboration." },
              { icon: BookOpen, title: "Practical Value", description: "Learning should lead to projects, mentorship, research, and opportunities." },
              { icon: Globe, title: "Global Community", description: "Open to every student, everywhere — no borders." },
            ].map((value, idx) => {
              const Icon = value.icon;
              return (
                <div key={idx} className="p-6 border border-foreground/10 rounded-2xl hover:border-foreground/20 transition-all group">
                  <Icon className="w-10 h-10 mb-4 text-foreground/60 group-hover:text-foreground transition-colors" />
                  <h3 className="text-xl font-display mb-2">{value.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* What We Do */}
      <section className="relative px-6 lg:px-12 py-10 lg:py-16 border-t border-foreground/10">
        <div className="max-w-[1400px] mx-auto">
          <h2 className="text-4xl lg:text-5xl font-display mb-10">What We Do</h2>
          <div className="grid md:grid-cols-2 gap-5">
            {[
              { title: "Expert Talks", description: "Free sessions with researchers, industry leaders, and quantum pioneers — no cost, ever." },
              { title: "Community Discussions", description: "Open conversations, reading groups, and technical discussions with peers on the same journey." },
              { title: "Student Networking", description: "Connect directly with fellow students exploring quantum, across campuses and backgrounds." },
              { title: "Workshops & Research Sessions", description: "Hands-on workshops and deep-dive sessions that go beyond the basics." },
              { title: "Mentorship", description: "One-on-one guidance from people actually working in quantum research and industry." },
              { title: "Student Projects & Hackathons", description: "Real projects, research collaborations, and student-led initiatives you can contribute to." },
            ].map((item, idx) => (
              <div key={idx} className="flex gap-5 p-6 border border-foreground/10 rounded-2xl hover:border-foreground/20 transition-all group">
                <div className="w-10 h-10 rounded-full bg-foreground/10 flex items-center justify-center flex-shrink-0 group-hover:bg-foreground/20 transition-colors">
                  <span className="text-sm font-display font-bold">{String(idx + 1).padStart(2, '0')}</span>
                </div>
                <div>
                  <h3 className="text-xl font-display mb-1">{item.title}</h3>
                  <p className="text-muted-foreground text-sm">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Highlight */}
      <section className="relative px-6 lg:px-12 py-10 lg:py-16 border-t border-foreground/10">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-20 items-center">
            <div>
              <h2 className="text-4xl lg:text-5xl font-display leading-tight mb-6">Meet Our Team</h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-7">
                We're students and early quantum enthusiasts ourselves, united by one goal: make the quantum journey easier and more accessible for the student who's just getting started.
              </p>
              <Link
                href="/team"
                className="px-7 py-3 bg-foreground hover:bg-foreground/90 text-background rounded-full font-medium transition-all inline-flex items-center gap-2"
              >
                View Our Team
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-7 bg-gradient-to-br from-foreground/10 to-foreground/5 rounded-2xl border border-foreground/10">
                <Users className="w-10 h-10 mb-4 text-foreground/40" />
                <p className="text-3xl font-display mb-1">8+</p>
                <p className="text-sm text-muted-foreground">Dedicated Team Members</p>
              </div>
              <div className="p-7 bg-gradient-to-br from-foreground/10 to-foreground/5 rounded-2xl border border-foreground/10">
                <Globe className="w-10 h-10 mb-4 text-foreground/40" />
                <p className="text-3xl font-display mb-1">Global</p>
                <p className="text-sm text-muted-foreground">Open to Students Everywhere</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative px-6 lg:px-12 py-10 lg:py-16 border-t border-foreground/10">
        <div className="max-w-[1400px] mx-auto">
          <div className="p-10 lg:p-16 rounded-3xl border border-foreground/20 bg-background/60 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-foreground/5 blur-3xl rounded-full pointer-events-none" />
            <div className="relative z-10">
              <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-foreground/20 bg-foreground/5 text-xs font-mono tracking-widest uppercase mb-6 text-foreground">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>Join QNexus</span>
              </span>
              <h2 className="text-4xl lg:text-6xl font-display tracking-tight mb-4 max-w-2xl text-foreground">
                Start Your <br />
                <span className="text-muted-foreground">Quantum Journey.</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl leading-relaxed">
                Free, always. Join a community of students, researchers, and industry leaders learning and building together — regardless of background or resources.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/join"
                  className="px-8 py-4 bg-foreground hover:bg-foreground/90 text-background rounded-full font-medium transition-all inline-flex items-center justify-center gap-2 shadow-xl hover:shadow-2xl group"
                >
                  <span>Join Our Community</span>
                  <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/events"
                  className="px-8 py-4 border border-foreground/20 hover:bg-foreground/10 text-foreground rounded-full font-medium transition-all inline-flex items-center justify-center gap-2"
                >
                  Attend Events
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="h-8" />
    </main>
  );
}
