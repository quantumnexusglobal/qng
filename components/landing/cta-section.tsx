"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Globe, Cpu, Users, ShieldCheck } from "lucide-react";
import { AnimatedTetrahedron } from "./animated-tetrahedron";
import SpecularButton from "@/components/ui/SpecularButton";

export function CtaSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  return (
    <section ref={sectionRef} className="relative py-24 lg:py-32 overflow-hidden border-t border-foreground/10">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div
          className={`relative rounded-3xl border border-foreground/20 bg-background/60 backdrop-blur-2xl overflow-hidden shadow-2xl transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          }`}
          onMouseMove={handleMouseMove}
        >
          {/* Dynamic Interactive Spotlight */}
          <div
            className="absolute inset-0 pointer-events-none transition-opacity duration-300 z-0"
            style={{
              background: `radial-gradient(700px circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(255,255,255,0.08), transparent 60%)`,
            }}
          />

          {/* Ambient Corner Lighting */}
          <div className="absolute -top-32 -left-32 w-80 h-80 bg-foreground/10 blur-[120px] rounded-full pointer-events-none" />
          <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-foreground/10 blur-[120px] rounded-full pointer-events-none" />

          <div className="relative z-10 px-8 lg:px-20 py-16 lg:py-24">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">
              {/* Left Content */}
              <div className="flex-1 max-w-2xl">
                {/* Eyebrow Badge */}
                <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-foreground/20 bg-foreground/5 text-xs font-mono tracking-widest uppercase mb-8 text-foreground shadow-inner">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                  <span>Join QNexus</span>
                </div>

                {/* Spectacular Main Headline */}
                <h2 className="text-4xl sm:text-6xl lg:text-7xl font-display tracking-tight leading-[0.95] mb-6 text-foreground">
                  Start Your <br />
                  <span className="text-muted-foreground">Quantum Journey.</span>
                </h2>

                {/* Subtitle / Copy */}
                <p className="text-lg lg:text-xl text-muted-foreground leading-relaxed mb-10">
                  Free talks, mentorship, workshops, and a community of students, researchers, and industry leaders — regardless of your background or resources.
                </p>

                {/* CTA Action Buttons */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-10">
                  <Link href="/join">
                    <SpecularButton
                      size="lg"
                      radius={18}
                      tint="#ffffff"
                      tintOpacity={0}
                      blur={0}
                      textColor="#f5f5f5"
                      lineColor="#ffffff"
                      baseColor="#262626"
                      intensity={1}
                      shineSize={10}
                      shineFade={40}
                      thickness={1}
                      speed={0.35}
                      followMouse
                      proximity={250}
                      autoAnimate={false}
                    >
                      <span>Join Us Now</span>
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </SpecularButton>
                  </Link>

                  <Link href="/events">
                    <Button
                      size="lg"
                      variant="outline"
                      className="w-full sm:w-auto h-14 px-8 text-base rounded-full border-foreground/25 hover:bg-foreground/10 transition-all font-medium"
                    >
                      Explore Events
                    </Button>
                  </Link>
                </div>

                {/* Feature Tags / Trust Indicators */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-8 border-t border-foreground/10">
                  <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
                    <Globe className="w-4 h-4 text-foreground/60" />
                    <span>Free, Always</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
                    <Cpu className="w-4 h-4 text-foreground/60" />
                    <span>Student-First</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
                    <ShieldCheck className="w-4 h-4 text-foreground/60" />
                    <span>Mentorship & Access</span>
                  </div>
                </div>
              </div>

              {/* Right 3D Visual Element */}
              <div className="relative flex items-center justify-center w-full lg:w-[480px] h-[360px] lg:h-[480px] flex-shrink-0">
                <div className="absolute inset-0 bg-gradient-to-tr from-foreground/5 via-foreground/10 to-transparent rounded-full blur-3xl pointer-events-none" />
                <div className="relative w-full h-full">
                  <AnimatedTetrahedron />
                </div>
              </div>
            </div>
          </div>

          {/* Decorative Corner Accents */}
          <div className="absolute top-0 right-0 w-32 h-32 border-b border-l border-foreground/10 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-32 h-32 border-t border-r border-foreground/10 pointer-events-none" />
        </div>
      </div>
    </section>
  );
}
