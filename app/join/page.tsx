'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Mail, Phone, ArrowRight, CheckCircle2, Globe2, Award, Sparkles, ShieldCheck, Cpu, ArrowLeft, Users, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

import { saveJoin } from '@/lib/submissions-store';
import { getSettings, SiteSettings } from '@/lib/settings-store';
import { saveUserIdentity, generateToken } from '@/lib/user-identity';

export default function JoinPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    company: '',
    position: '',
    expertise: 'just-exploring',
    experience: 'Beginner',
    country: 'India',
    message: '',
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [memberToken, setMemberToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsVisible(true);
    getSettings().then(setSettings);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Save to Admin Store (local, for the admin dashboard)
      saveJoin({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone || 'N/A',
        company: formData.company,
        position: formData.position,
        expertise: formData.expertise,
        experience: formData.experience,
        country: formData.country,
        message: formData.message,
      });

      // Save to MongoDB + trigger welcome email
      await fetch('/api/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.fullName,
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          company: formData.company,
          position: formData.position,
          expertise: formData.expertise,
          experience: formData.experience,
          country: formData.country,
          message: formData.message,
        }),
      }).catch((err) => console.warn('API POST warn (fallback to local store):', err));

      // Identify this visitor on their own device — replaces the "Join Us" nav
      // button with their name and persists across future visits.
      const token = generateToken('QNI-MEMBER');
      saveUserIdentity({
        name: formData.fullName,
        email: formData.email,
        token,
        source: 'join',
        createdAt: new Date().toISOString(),
      });
      setMemberToken(token);

      setIsSubmitted(true);

      // Auto-join: send them straight into the WhatsApp community —
      // no link to hunt for, WhatsApp just opens with the group ready to join.
      const whatsappLink = settings?.whatsappGroupLink;
      if (whatsappLink) {
        window.open(whatsappLink, '_blank', 'noopener,noreferrer');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Top Header */}
      <header className="fixed z-50 top-0 left-0 right-0 px-4 sm:px-6 lg:px-12 py-3 sm:py-4 border-b border-foreground/10 bg-background/90 backdrop-blur-md">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center group shrink-0">
            <Image src="/logo-mark.png" alt="QNexus" width={789} height={302} className="h-9 sm:h-12 w-auto" />
          </Link>
          <Link
            href="/"
            className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-foreground/60 hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to home</span>
            <span className="sm:hidden">Back</span>
          </Link>
        </div>
      </header>

      {/* Main Content Container */}
      <div className="relative pt-20 sm:pt-28 pb-16 sm:pb-24">
        {/* Ambient background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[450px] bg-foreground/5 blur-[160px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12" ref={sectionRef}>
          {/* Header Banner */}
          <div className={`mb-10 sm:mb-16 text-center max-w-3xl mx-auto transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full border border-foreground/15 bg-foreground/5 text-[11px] sm:text-xs font-mono tracking-wider uppercase mb-5 sm:mb-6 text-foreground">
              <Globe2 className="w-4 h-4 text-sky-500 shrink-0" />
              <span>A Student-First Quantum Community</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-6xl font-display tracking-tight text-foreground mb-4 sm:mb-6 leading-[1.05]">
              Join the Community
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              Connect with researchers, industry leaders, and peers through free talks, mentorship, and workshops — regardless of your background or resources.
            </p>

            {/* Quick Metrics Bar */}
            <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-3 sm:gap-8 mt-7 sm:mt-10 pt-6 sm:pt-8 border-t border-foreground/10 text-[11px] sm:text-xs font-mono text-muted-foreground">
              <span className="flex items-center gap-2 text-foreground font-medium">
                <Users className="w-4 h-4 text-emerald-500" /> Free, Always
              </span>
              <span className="flex items-center gap-2 text-foreground font-medium">
                <Award className="w-4 h-4 text-amber-500" /> Student-First
              </span>
              <span className="flex items-center gap-2 text-foreground font-medium">
                <Cpu className="w-4 h-4 text-sky-500" /> Open Worldwide
              </span>
            </div>
          </div>

          {/* Form & Sidebar Grid */}
          <div className={`grid lg:grid-cols-12 gap-8 lg:gap-12 items-start transition-all duration-700 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>

            {/* Form Column */}
            <div className="lg:col-span-8">
              <div className="rounded-2xl sm:rounded-3xl border border-foreground/15 bg-background/80 backdrop-blur-xl p-5 sm:p-8 md:p-12 shadow-2xl relative">
                {isSubmitted ? (
                  <div className="flex flex-col items-center justify-center py-10 sm:py-16 text-center">
                    <div className="w-16 h-16 rounded-full bg-emerald-500/10 border-2 border-emerald-500 flex items-center justify-center mb-6">
                      <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-display text-foreground mb-3">You're In!</h3>
                    <p className="text-sm sm:text-base text-muted-foreground max-w-md mb-2 leading-relaxed">
                      Thank you for joining QNexus. We've emailed a confirmation to <strong>{formData.email}</strong> — we'll be in touch soon with details on upcoming talks, workshops, and how to get involved.
                    </p>
                    {memberToken && (
                      <p className="text-xs font-mono text-muted-foreground/70 mb-6">
                        Your member ID: <span className="text-foreground/70">{memberToken}</span>
                      </p>
                    )}

                    {settings?.whatsappGroupLink && (
                      <div className="w-full max-w-sm mb-8 p-5 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 space-y-3">
                        <p className="text-sm text-foreground font-medium flex items-center justify-center gap-2">
                          <MessageCircle className="w-4 h-4 text-emerald-500" />
                          Opening our WhatsApp community for you...
                        </p>
                        <p className="text-xs text-muted-foreground">
                          If it didn't open automatically, tap below to join.
                        </p>
                        <a
                          href={settings.whatsappGroupLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-2 w-full py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold transition-colors"
                        >
                          Join WhatsApp Community <ArrowRight className="w-4 h-4" />
                        </a>
                      </div>
                    )}

                    <Button
                      onClick={() => setIsSubmitted(false)}
                      variant="outline"
                      className="rounded-full px-8"
                    >
                      Submit Another Application
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
                    <div>
                      <h3 className="text-xl sm:text-2xl font-display text-foreground mb-1">Community Application</h3>
                      <p className="text-xs font-mono text-muted-foreground">Tell us a bit about yourself so we can get you involved.</p>
                    </div>

                    {/* Personal Info Grid */}
                    <div className="space-y-5 sm:space-y-6">
                      <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                        <div>
                          <label htmlFor="fullName" className="block text-xs font-mono text-foreground/70 uppercase tracking-wider mb-2">
                            Full Name *
                          </label>
                          <input
                            type="text"
                            id="fullName"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            required
                            placeholder="Dr. Eleanor Vance"
                            className="w-full px-4 py-3.5 rounded-2xl bg-foreground/5 border border-foreground/15 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground/50 transition-colors text-base sm:text-sm"
                          />
                        </div>
                        <div>
                          <label htmlFor="email" className="block text-xs font-mono text-foreground/70 uppercase tracking-wider mb-2">
                            Email *
                          </label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="you@example.com"
                            className="w-full px-4 py-3.5 rounded-2xl bg-foreground/5 border border-foreground/15 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground/50 transition-colors text-base sm:text-sm"
                          />
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                        <div>
                          <label htmlFor="phone" className="block text-xs font-mono text-foreground/70 uppercase tracking-wider mb-2">
                            Phone / WhatsApp (Optional)
                          </label>
                          <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="+1 555 123 4567"
                            className="w-full px-4 py-3.5 rounded-2xl bg-foreground/5 border border-foreground/15 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground/50 transition-colors text-base sm:text-sm"
                          />
                        </div>
                        <div>
                          <label htmlFor="company" className="block text-xs font-mono text-foreground/70 uppercase tracking-wider mb-2">
                            College / University (Optional)
                          </label>
                          <input
                            type="text"
                            id="company"
                            name="company"
                            value={formData.company}
                            onChange={handleChange}
                            placeholder="Your college or university"
                            className="w-full px-4 py-3.5 rounded-2xl bg-foreground/5 border border-foreground/15 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground/50 transition-colors text-base sm:text-sm"
                          />
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                        <div>
                          <label htmlFor="position" className="block text-xs font-mono text-foreground/70 uppercase tracking-wider mb-2">
                            Current Role *
                          </label>
                          <input
                            type="text"
                            id="position"
                            name="position"
                            value={formData.position}
                            onChange={handleChange}
                            required
                            placeholder="Student / Researcher / Engineer"
                            className="w-full px-4 py-3.5 rounded-2xl bg-foreground/5 border border-foreground/15 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground/50 transition-colors text-base sm:text-sm"
                          />
                        </div>
                        <div>
                          <label htmlFor="country" className="block text-xs font-mono text-foreground/70 uppercase tracking-wider mb-2">
                            Country / Region *
                          </label>
                          <input
                            type="text"
                            id="country"
                            name="country"
                            value={formData.country}
                            onChange={handleChange}
                            required
                            placeholder="India, USA, Germany..."
                            className="w-full px-4 py-3.5 rounded-2xl bg-foreground/5 border border-foreground/15 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground/50 transition-colors text-base sm:text-sm"
                          />
                        </div>
                      </div>

                      {/* Primary Quantum Focus */}
                      <div>
                        <label htmlFor="expertise" className="block text-xs font-mono text-foreground/70 uppercase tracking-wider mb-2">
                          Primary Area of Interest *
                        </label>
                        <select
                          id="expertise"
                          name="expertise"
                          value={formData.expertise}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3.5 rounded-2xl bg-foreground/5 border border-foreground/15 text-foreground focus:outline-none focus:border-foreground/50 transition-colors text-base sm:text-sm"
                        >
                          <option value="just-exploring">Just Exploring / New to Quantum</option>
                          <option value="quantum-algorithms">Quantum Algorithms & Computing</option>
                          <option value="quantum-ml">Quantum Machine Learning</option>
                          <option value="quantum-hardware">Quantum Hardware & Devices</option>
                          <option value="research-mentorship">Research & Mentorship</option>
                          <option value="career-guidance">Careers & Internships in Quantum</option>
                          <option value="community-building">Community Building & Events</option>
                        </select>
                      </div>

                      {/* Experience Level */}
                      <div>
                        <label className="block text-xs font-mono text-foreground/70 uppercase tracking-wider mb-2">
                          Quantum Computing Experience Level
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
                          {['Beginner', 'Intermediate', 'Advanced / Fellow'].map((lvl) => (
                            <button
                              key={lvl}
                              type="button"
                              onClick={() => setFormData({ ...formData, experience: lvl })}
                              className={`py-2.5 sm:py-3 px-2 rounded-xl text-xs font-mono font-semibold border transition-all ${
                                formData.experience === lvl
                                  ? 'bg-foreground text-background border-foreground shadow-md'
                                  : 'border-foreground/15 bg-foreground/5 text-foreground/70 hover:border-foreground/30'
                              }`}
                            >
                              {lvl}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Statement */}
                      <div>
                        <label htmlFor="message" className="block text-xs font-mono text-foreground/70 uppercase tracking-wider mb-2">
                          What draws you to quantum? (Optional)
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          placeholder="Tell us a bit about your background and what you're hoping to get out of the community..."
                          rows={4}
                          className="w-full px-4 py-3.5 rounded-2xl bg-foreground/5 border border-foreground/15 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground/50 transition-colors text-base sm:text-sm resize-none"
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      disabled={isLoading}
                      size="lg"
                      className="w-full h-14 rounded-full bg-foreground hover:bg-foreground/90 text-background text-base font-semibold shadow-xl group"
                    >
                      {isLoading ? (
                        <span className="flex items-center gap-2">
                          <span className="w-4 h-4 border-2 border-background border-t-transparent rounded-full animate-spin" />
                          Submitting...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          Join the Community
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </span>
                      )}
                    </Button>

                    <p className="text-[11px] font-mono text-muted-foreground text-center flex items-center justify-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                      Your data is kept private and never shared without your consent.
                    </p>
                  </form>
                )}
              </div>
            </div>

            {/* Sidebar Benefits Column */}
            <div className="lg:col-span-4 space-y-6 sm:space-y-8">
              {/* Member Privileges Card */}
              <div className="p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-foreground/15 bg-foreground/5 backdrop-blur-md space-y-5 sm:space-y-6">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-500" />
                  <h3 className="font-display text-xl text-foreground font-bold">Why Join?</h3>
                </div>

                <div className="space-y-4 text-sm">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-foreground">Free Talks & Workshops</p>
                      <p className="text-xs text-muted-foreground mt-0.5">Learn directly from researchers and industry professionals — always free.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-foreground">Mentorship & Guidance</p>
                      <p className="text-xs text-muted-foreground mt-0.5">Get matched with mentors for career guidance and research opportunities.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-foreground">Hackathons & Projects</p>
                      <p className="text-xs text-muted-foreground mt-0.5">Build real things through hackathons, research collaborations, and student-led projects.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-foreground">A Real Community</p>
                      <p className="text-xs text-muted-foreground mt-0.5">Connect with peers, researchers, and industry leaders — not just one-way lectures.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Direct Support Box */}
              <div className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-foreground/10 bg-background/60 backdrop-blur-md space-y-4">
                <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest">Need Direct Support?</p>
                <div className="space-y-3 text-sm">
                  <a href={`mailto:${settings?.mentorshipEmail || 'rajan.quantumnexusgobal@gmail.com'}`} className="flex items-center gap-3 text-foreground hover:text-emerald-500 transition-colors min-w-0">
                    <Mail className="w-4 h-4 text-foreground/60 shrink-0" />
                    <span className="break-all">{settings?.mentorshipEmail || 'rajan.quantumnexusgobal@gmail.com'}</span>
                  </a>
                  <a href={`tel:${settings?.phoneLink || '+15743866580'}`} className="flex items-center gap-3 text-foreground hover:text-emerald-500 transition-colors">
                    <Phone className="w-4 h-4 text-foreground/60" />
                    <span>{settings?.phoneDisplay || '+1 574 386 6580'}</span>
                  </a>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}
