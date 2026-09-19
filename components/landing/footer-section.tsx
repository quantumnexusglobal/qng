"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  ArrowUpRight,
  ArrowUp,
  Github,
  Linkedin,
  Twitter,
  Send,
  CheckCircle2,
  Sparkles,
  Heart,
  Mail,
  Loader2,
} from "lucide-react";
import { saveNewsletterSubscriber } from "@/lib/submissions-store";
import { Button } from "@/components/ui/button";
import { AnimatedWave } from "./animated-wave";

const footerLinks = {
  Explore: [
    { name: "Events", href: "/events" },
    { name: "Research Support", href: "/research" },
    { name: "Gallery", href: "/gallery" },
    { name: "Team", href: "/team" },
    { name: "Blog", href: "/blog" },
  ],
  Community: [
    { name: "About Us", href: "/about" },
    { name: "Join Us", href: "/join" },
    { name: "Contact", href: "/contact" },
  ],
  Legal: [
    { name: "Privacy Policy", href: "#" },
    { name: "Terms of Service", href: "#" },
  ],
};

const socialLinks = [
  { name: "GitHub", href: "https://github.com", icon: Github },
  { name: "LinkedIn", href: "https://www.linkedin.com/company/quantumnexusglobal/", icon: Linkedin },
  { name: "Twitter / X", href: "https://x.com", icon: Twitter },
];

const pillars = ["Learn", "Connect", "Build", "Grow"];

export function FooterSection() {
  const pathname = usePathname();
  const isLandingPage = pathname === "/";

  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState("");

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || isSubmitting) return;

    const submittedEmail = email.trim();
    setIsSubmitting(true);
    setFeedbackMsg("");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: submittedEmail }),
      });
      const data = await res.json();

      if (data.success) {
        saveNewsletterSubscriber(submittedEmail);
        setSubscribed(true);
        setFeedbackMsg(data.message || "You're subscribed! Check your inbox.");
        setEmail("");
        setTimeout(() => {
          setSubscribed(false);
          setFeedbackMsg("");
        }, 6000);
      } else {
        setFeedbackMsg(data.error || "Subscription failed. Please try again.");
      }
    } catch {
      setFeedbackMsg("Failed to subscribe. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative border-t border-foreground/10 bg-background text-foreground overflow-hidden">
      {/* SVG Wave Top Border Accent */}
      <div className="absolute top-0 left-0 right-0 h-16 pointer-events-none overflow-hidden -translate-y-full">
        <svg
          className="w-full h-full text-foreground/5 fill-current preserve-3d animate-pulse"
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
        >
          <path d="M0,32L48,42.7C96,53,192,75,288,80C384,85,480,75,576,58.7C672,43,768,21,864,21.3C960,21,1056,43,1152,53.3C1248,64,1344,64,1392,64L1440,64L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"></path>
        </svg>
      </div>

      {/* Interactive Canvas Quantum Wave Background */}
      <div className="absolute inset-0 opacity-60 dark:opacity-80 pointer-events-none overflow-hidden">
        <AnimatedWave />
      </div>

      {/* Giant faded wordmark, purely typographic texture */}
      <div className="absolute -bottom-[6vw] left-1/2 -translate-x-1/2 w-full pointer-events-none select-none overflow-hidden">
        <span className="block text-center font-display font-bold tracking-tight text-foreground/[0.035] text-[22vw] leading-none whitespace-nowrap">
          QNEXUS
        </span>
      </div>

      {/* Subtle overlay gradient to ensure text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/85 to-background pointer-events-none" />

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Top Newsletter Card — landing page only */}
        {isLandingPage && (
          <div className="pt-16 lg:pt-20">
            <div className="relative rounded-3xl border border-foreground/15 bg-foreground/[0.03] backdrop-blur-sm px-6 py-8 sm:px-10 sm:py-10 overflow-hidden">
              <div className="absolute -top-16 -right-16 w-56 h-56 bg-foreground/5 blur-3xl rounded-full pointer-events-none" />
              <div className="relative flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
                <div className="flex items-start gap-4">
                  <div className="hidden sm:flex w-12 h-12 rounded-2xl border border-foreground/15 bg-background items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-foreground/70" />
                  </div>
                  <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-foreground/15 bg-background text-xs font-mono tracking-wider uppercase mb-3">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      <span>Quantum Dispatch</span>
                    </div>
                    <h3 className="text-2xl md:text-3xl font-display font-bold tracking-tight text-foreground">
                      Never miss a free talk or workshop
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1.5 max-w-md">
                      Event invitations, mentorship opportunities, and community updates — straight to your inbox.
                    </p>
                  </div>
                </div>

                <div className="w-full lg:w-auto shrink-0 space-y-2">
                  <form onSubmit={handleSubscribe} className="flex items-center gap-2">
                    <div className="relative flex-1 lg:w-72">
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        disabled={isSubmitting || subscribed}
                        className="w-full px-4 py-3 rounded-full border border-foreground/20 bg-background text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:border-foreground/50 transition-colors disabled:opacity-60"
                      />
                    </div>
                    <Button
                      type="submit"
                      size="lg"
                      disabled={isSubmitting || subscribed}
                      className="bg-foreground hover:bg-foreground/90 text-background rounded-full px-6 h-11 text-sm font-semibold shrink-0 disabled:opacity-70"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center gap-1.5">
                          <Loader2 className="w-4 h-4 animate-spin" /> Sending...
                        </span>
                      ) : subscribed ? (
                        <span className="flex items-center gap-1.5 text-emerald-400">
                          <CheckCircle2 className="w-4 h-4" /> Done!
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5">
                          Subscribe <Send className="w-3.5 h-3.5 ml-1" />
                        </span>
                      )}
                    </Button>
                  </form>
                  {feedbackMsg && (
                    <p className={`text-xs font-mono pl-2 ${subscribed ? 'text-emerald-500' : 'text-rose-400'}`}>
                      {feedbackMsg}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Footer Grid */}
        <div className={`pb-12 lg:pb-16 ${isLandingPage ? 'pt-14 lg:pt-16' : 'pt-16 lg:pt-20'}`}>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-10 lg:gap-12">
            {/* Brand Column */}
            <div className="col-span-2 space-y-6">
              <Link href="/" className="inline-flex items-center group">
                <Image
                  src="/logo-mark.png"
                  alt="QNexus"
                  width={789}
                  height={302}
                  className="h-16 w-auto"
                />
              </Link>

              <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
                A student-first quantum community connecting students with researchers, industry leaders, and peers through free talks, mentorship, and workshops — open to students everywhere.
              </p>

              {/* Pillars strip */}
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 font-mono text-xs uppercase tracking-widest text-foreground/50">
                {pillars.map((p, i) => (
                  <span key={p} className="inline-flex items-center gap-3">
                    {i > 0 && <span className="w-1 h-1 rounded-full bg-foreground/30" />}
                    {p}
                  </span>
                ))}
              </div>

              {/* Social Links Badges */}
              <div className="flex flex-wrap gap-3">
                {socialLinks.map((s) => {
                  const Icon = s.icon;
                  return (
                    <a
                      key={s.name}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-foreground/15 bg-foreground/5 hover:bg-foreground/10 hover:border-foreground/30 text-xs font-mono text-foreground transition-all duration-300 group"
                    >
                      <Icon className="w-3.5 h-3.5 text-foreground/80 group-hover:scale-110 transition-transform" />
                      <span>{s.name}</span>
                      <ArrowUpRight className="w-3 h-3 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Navigation Link Columns */}
            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category} className="space-y-4">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-foreground">
                  {category}
                </h4>
                <ul className="space-y-2.5">
                  {links.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1.5 group"
                      >
                        <span className="group-hover:translate-x-1 transition-transform">
                          {link.name}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar & Status */}
        <div className="py-8 border-t border-foreground/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-muted-foreground">
          <p className="flex items-center gap-1.5">
            © 2026 QNexus (Quantum Nexus Global). Built with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" /> for the global quantum community.
          </p>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              Free to Join — Always
            </span>

            <button
              onClick={scrollToTop}
              aria-label="Back to top"
              className="w-8 h-8 rounded-full border border-foreground/15 bg-foreground/5 hover:bg-foreground/10 hover:border-foreground/30 flex items-center justify-center transition-all duration-300 group shrink-0"
            >
              <ArrowUp className="w-3.5 h-3.5 text-foreground/70 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
