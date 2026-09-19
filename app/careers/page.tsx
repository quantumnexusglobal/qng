'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';

const ROLES = [
  'Content Writer',
  'Event Coordinator',
  'Social Media Manager',
  'Technical Mentor / Speaker',
  'Community Manager',
  'Design & Creative',
  'Outreach & Partnerships',
  'Other',
];

export default function CareersPage() {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    role: ROLES[0],
    portfolioUrl: '',
    availability: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    try {
      const res = await fetch('/api/team-applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
      } else {
        setError(data.message || 'Something went wrong. Please try again.');
      }
    } catch {
      setError('Error connecting to the server.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-background text-foreground overflow-x-hidden">
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

      <div className="relative pt-24 sm:pt-28 pb-16 sm:pb-24">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[450px] bg-foreground/5 blur-[160px] rounded-full pointer-events-none" />

        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-12">
          <div className="mb-8 sm:mb-12 text-center">
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full border border-foreground/15 bg-foreground/5 text-[11px] sm:text-xs font-mono tracking-wider uppercase mb-5 text-foreground">
              Join the Team
            </div>
            <h1 className="text-3xl sm:text-5xl font-display font-bold tracking-tight mb-3">
              Help us build QNexus
            </h1>
            <p className="text-foreground/60 text-sm sm:text-base max-w-lg mx-auto">
              We're looking for people who want to contribute to the community — pick the area you'd like to help with and tell us a bit about yourself.
            </p>
            <Link
              href="/join-team"
              className="mt-5 inline-flex items-center rounded-full border border-foreground/20 px-4 py-2 text-xs font-semibold text-foreground/70 transition hover:border-foreground/40 hover:text-foreground"
            >
              Open the detailed team application
            </Link>
          </div>

          <div className="rounded-2xl sm:rounded-3xl border border-foreground/15 bg-background/80 backdrop-blur-xl p-5 sm:p-8 md:p-10 shadow-2xl">
            {submitted ? (
              <div className="flex flex-col items-center justify-center py-10 sm:py-16 text-center">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border-2 border-emerald-500 flex items-center justify-center mb-6">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-display text-foreground mb-3">Application received!</h3>
                <p className="text-sm sm:text-base text-muted-foreground max-w-md leading-relaxed">
                  Thanks for your interest in joining the QNexus team. We review applications on a rolling basis and will reach out if it's a fit.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono font-medium text-foreground/75 mb-1.5">Full Name *</label>
                    <input
                      type="text" required
                      value={form.fullName}
                      onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                      placeholder="Your full name"
                      className="w-full px-4 py-3 rounded-xl border border-foreground/25 bg-background text-foreground placeholder:text-foreground/40 text-sm focus:outline-none focus:border-foreground/60 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono font-medium text-foreground/75 mb-1.5">Email *</label>
                    <input
                      type="email" required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="you@example.com"
                      className="w-full px-4 py-3 rounded-xl border border-foreground/25 bg-background text-foreground placeholder:text-foreground/40 text-sm focus:outline-none focus:border-foreground/60 transition-colors"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono font-medium text-foreground/75 mb-1.5">Phone</label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="+1 555 123 4567"
                      className="w-full px-4 py-3 rounded-xl border border-foreground/25 bg-background text-foreground placeholder:text-foreground/40 text-sm focus:outline-none focus:border-foreground/60 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono font-medium text-foreground/75 mb-1.5">Area You'd Like to Help With *</label>
                    <select
                      required
                      value={form.role}
                      onChange={(e) => setForm({ ...form, role: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-foreground/25 bg-background text-foreground text-sm focus:outline-none focus:border-foreground/60 transition-colors"
                    >
                      {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono font-medium text-foreground/75 mb-1.5">LinkedIn / Portfolio Link</label>
                  <input
                    type="url"
                    value={form.portfolioUrl}
                    onChange={(e) => setForm({ ...form, portfolioUrl: e.target.value })}
                    placeholder="https://linkedin.com/in/yourprofile"
                    className="w-full px-4 py-3 rounded-xl border border-foreground/25 bg-background text-foreground placeholder:text-foreground/40 text-sm focus:outline-none focus:border-foreground/60 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-medium text-foreground/75 mb-1.5">Availability</label>
                  <input
                    type="text"
                    value={form.availability}
                    onChange={(e) => setForm({ ...form, availability: e.target.value })}
                    placeholder="e.g. 5 hours/week, weekends only"
                    className="w-full px-4 py-3 rounded-xl border border-foreground/25 bg-background text-foreground placeholder:text-foreground/40 text-sm focus:outline-none focus:border-foreground/60 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-medium text-foreground/75 mb-1.5">Tell us about yourself</label>
                  <textarea
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Relevant experience, why you want to join, anything you'd like us to know..."
                    className="w-full px-4 py-3 rounded-xl border border-foreground/25 bg-background text-foreground placeholder:text-foreground/40 text-sm focus:outline-none focus:border-foreground/60 transition-colors resize-none"
                  />
                </div>

                {error && <p className="text-sm text-rose-500">{error}</p>}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 py-4 bg-foreground text-background rounded-2xl font-semibold text-sm hover:bg-foreground/90 transition-all disabled:opacity-50 shadow-lg"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Application'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
