"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Menu, X, Sparkles, ArrowRight, User, LogOut } from "lucide-react";
import SpecularButton from "@/components/ui/SpecularButton";
import { getUserIdentity, clearUserIdentity, IDENTITY_EVENT, UserIdentity } from "@/lib/user-identity";

const navLinks = [
  { name: "Events", href: "/events" },
  { name: "Research", href: "/research" },
  { name: "Blog", href: "/blog" },
  { name: "Team", href: "/team" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [identity, setIdentity] = useState<UserIdentity | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const refreshIdentity = () => setIdentity(getUserIdentity());
    refreshIdentity();
    window.addEventListener(IDENTITY_EVENT, refreshIdentity);
    window.addEventListener("storage", refreshIdentity);
    return () => {
      window.removeEventListener(IDENTITY_EVENT, refreshIdentity);
      window.removeEventListener("storage", refreshIdentity);
    };
  }, []);

  const firstName = identity?.name?.trim().split(/\s+/)[0] || "";

  return (
    <header
      className={`fixed z-50 transition-all duration-500 ${
        isScrolled 
          ? "top-4 left-4 right-4" 
          : "top-0 left-0 right-0"
      }`}
    >
      <nav 
        className={`mx-auto transition-all duration-500 ${
          isScrolled || isMobileMenuOpen
            ? "bg-background/80 backdrop-blur-xl border border-foreground/10 rounded-2xl shadow-lg max-w-[1200px]"
            : "bg-transparent max-w-[1400px]"
        }`}
      >
        <div 
          className={`flex items-center justify-between transition-all duration-500 px-6 lg:px-8 ${
            isScrolled ? "h-14" : "h-20"
          }`}
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <Image
              src="/logo-mark.png"
              alt="QNexus"
              width={789}
              height={302}
              priority
              className={`w-auto transition-all duration-500 ${isScrolled ? "h-11" : "h-14"}`}
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-12">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm text-foreground/70 hover:text-foreground transition-colors duration-300 relative group"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-foreground transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </div>

          {/* Desktop CTA - Join Us button, or the visitor's name once identified */}
          <div className="hidden md:flex items-center gap-4">
            {identity ? (
              <div className="group relative flex items-center gap-2 pl-1.5 pr-2 py-1.5 rounded-full border border-foreground/15 bg-foreground/5 text-foreground">
                <Link href="/dashboard" className="flex items-center gap-2" title="Go to my dashboard">
                  <div className="w-7 h-7 rounded-full bg-foreground text-background flex items-center justify-center shrink-0">
                    <User className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-sm font-medium">Hi, {firstName}</span>
                </Link>
                <button
                  onClick={clearUserIdentity}
                  aria-label="Sign out"
                  title="Sign out"
                  className="ml-1 p-1 rounded-full text-foreground/40 opacity-0 group-hover:opacity-100 hover:text-foreground hover:bg-foreground/10 transition-all"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <Link href="/join">
                <SpecularButton
                  size={isScrolled ? "sm" : "md"}
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
                  <span>Join Us</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </SpecularButton>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

      </nav>
      
      {/* Mobile Menu - Full Screen Overlay */}
      <div
        className={`md:hidden fixed inset-0 z-[45] transition-all duration-500 ease-in-out ${
          isMobileMenuOpen 
            ? "opacity-100 pointer-events-auto" 
            : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Animated Background Blur */}
        <div 
          className={`absolute inset-0 bg-background/95 backdrop-blur-2xl transition-all duration-700 ${
            isMobileMenuOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setIsMobileMenuOpen(false)}
        />
        
        {/* Menu Content */}
        <div 
          className={`relative h-full w-full max-w-md ml-auto bg-background/50 border-l border-foreground/10 flex flex-col px-8 pt-28 pb-10 transition-transform duration-700 cubic-bezier(0.16, 1, 0.3, 1) ${
            isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* Top subtle decoration */}
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-foreground/5 to-transparent pointer-events-none" />

          {/* Close Button */}
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            aria-label="Close menu"
            className="absolute top-6 right-6 z-20 w-11 h-11 rounded-full border border-foreground/15 bg-background/80 backdrop-blur-md flex items-center justify-center hover:bg-foreground/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Navigation Links */}
          <div className="flex-1 flex flex-col justify-start gap-8 mt-4 relative z-10">
            {navLinks.map((link, i) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`text-4xl font-display font-medium text-foreground hover:text-muted-foreground transition-all duration-500 flex items-center justify-between group ${
                  isMobileMenuOpen 
                    ? "opacity-100 translate-y-0" 
                    : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: isMobileMenuOpen ? `${100 + i * 100}ms` : "0ms" }}
              >
                {link.name}
                <ArrowRight className="w-6 h-6 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
              </Link>
            ))}
          </div>
          
          {/* Bottom CTA */}
          <div className={`pt-10 transition-all duration-700 relative z-10 ${
            isMobileMenuOpen 
              ? "opacity-100 translate-y-0" 
              : "opacity-0 translate-y-8"
          }`}
          style={{ transitionDelay: isMobileMenuOpen ? "600ms" : "0ms" }}
          >
            {identity ? (
              <>
                <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-4 text-center">
                  Signed in as
                </p>
                <Link
                  href="/dashboard"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full bg-foreground/5 border border-foreground/15 rounded-full h-14 text-lg font-semibold flex items-center justify-center gap-3 text-foreground hover:bg-foreground/10 transition-colors"
                >
                  <User className="w-5 h-5" />
                  <span>{firstName}</span>
                </Link>
                <button
                  onClick={() => { clearUserIdentity(); setIsMobileMenuOpen(false); }}
                  className="w-full mt-3 flex items-center justify-center gap-2 text-sm text-foreground/50 hover:text-foreground transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" /> Sign out
                </button>
              </>
            ) : (
              <>
                <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-4 text-center">
                  Ready to start?
                </p>
                <Link
                  href="/join"
                  className="w-full bg-foreground text-background rounded-full h-14 text-lg font-semibold flex items-center justify-center hover:bg-foreground/90 transition-all shadow-xl shadow-foreground/10"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Join Us
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
