import Link from "next/link";
import { ArrowLeft, GraduationCap, Clock } from "lucide-react";

export default function ResearchPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Top Nav */}
      <div className="fixed top-0 left-0 right-0 z-50 border-b border-foreground/10 bg-background/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-foreground/70 hover:text-foreground transition-colors font-mono"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <span className="font-mono text-xs text-foreground/40 uppercase tracking-widest">
            QNI / Research & Student Support
          </span>
        </div>
      </div>

      {/* Full-Width Seamless Hero Header with No Box / No Borders */}
      <div className="relative w-full min-h-[500px] sm:min-h-[580px] lg:min-h-[640px] flex flex-col justify-end pt-32 pb-16 overflow-hidden">
        {/* Full-Width Background Image */}
        <img
          src="/fe526f_a94fcf924c0f4efc8ea8a0e21663d499~mv2.avif"
          alt="Quantum Research Center"
          className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
        />
        {/* Natural gradient overlay to keep text readable without fading the image */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-black/40 to-black/20" />

        {/* Content Container */}
        <div className="relative z-10 max-w-6xl mx-auto px-6 w-full space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/30 bg-black/60 backdrop-blur-md text-white font-mono text-xs">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>QNexus Academic & Research Support Initiative</span>
          </div>
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display font-bold tracking-tight text-white leading-tight">
            Empowering Quantum Research <br />
            <span className="text-white/70">For Students & Academics in India.</span>
          </h1>
          <p className="text-base sm:text-lg text-gray-200 leading-relaxed font-sans max-w-3xl">
            Democratizing access to quantum computing infrastructure. We provide cloud QPU hardware credits, 1-on-1 PhD mentorship, and open-access publication grants to ensure your research reaches the global stage.
          </p>
        </div>
      </div>

      {/* Coming Soon notice */}
      <div className="w-full flex justify-center py-24">
        <div className="flex flex-col items-center gap-3 text-center max-w-md px-6">
          <div className="w-12 h-12 rounded-xl bg-foreground/10 border border-foreground/15 flex items-center justify-center text-foreground/70">
            <Clock className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-display font-bold text-foreground">Coming Soon</h2>
          <p className="text-sm text-foreground/60 leading-relaxed">
            We're putting together the full Research Support Program — hardware credits, mentorship, and publication support. Check back soon.
          </p>
        </div>
      </div>
    </div>
  );
}
