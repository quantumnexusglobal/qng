'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Star, CheckCircle2 } from 'lucide-react';

export default function FeedbackPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    role: '',
    organization: '',
    message: '',
  });
  const [rating, setRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, rating: rating || undefined }),
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
              Share Your Experience
            </div>
            <h1 className="text-3xl sm:text-5xl font-display font-bold tracking-tight mb-3">
              Tell us what QNexus meant to you
            </h1>
            <p className="text-foreground/60 text-sm sm:text-base max-w-lg mx-auto">
              Your feedback may be featured on our site to help other students discover the community.
            </p>
          </div>

          <div className="rounded-2xl sm:rounded-3xl border border-foreground/15 bg-background/80 backdrop-blur-xl p-5 sm:p-8 md:p-10 shadow-2xl">
            {submitted ? (
              <div className="flex flex-col items-center justify-center py-10 sm:py-16 text-center">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border-2 border-emerald-500 flex items-center justify-center mb-6">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-display text-foreground mb-3">Thank you!</h3>
                <p className="text-sm sm:text-base text-muted-foreground max-w-md leading-relaxed">
                  We've received your feedback. Our team reviews every submission — approved ones will appear on our Testimonials section.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono font-medium text-foreground/75 mb-1.5">Full Name *</label>
                    <input
                      type="text" required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Your full name"
                      className="w-full px-4 py-3 rounded-xl border border-foreground/25 bg-background text-foreground placeholder:text-foreground/40 text-sm focus:outline-none focus:border-foreground/60 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono font-medium text-foreground/75 mb-1.5">Email (not shown publicly)</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="you@example.com"
                      className="w-full px-4 py-3 rounded-xl border border-foreground/25 bg-background text-foreground placeholder:text-foreground/40 text-sm focus:outline-none focus:border-foreground/60 transition-colors"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono font-medium text-foreground/75 mb-1.5">Role / Title</label>
                    <input
                      type="text"
                      value={form.role}
                      onChange={(e) => setForm({ ...form, role: e.target.value })}
                      placeholder="Student / Researcher / Engineer"
                      className="w-full px-4 py-3 rounded-xl border border-foreground/25 bg-background text-foreground placeholder:text-foreground/40 text-sm focus:outline-none focus:border-foreground/60 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono font-medium text-foreground/75 mb-1.5">Organization</label>
                    <input
                      type="text"
                      value={form.organization}
                      onChange={(e) => setForm({ ...form, organization: e.target.value })}
                      placeholder="University / Company"
                      className="w-full px-4 py-3 rounded-xl border border-foreground/25 bg-background text-foreground placeholder:text-foreground/40 text-sm focus:outline-none focus:border-foreground/60 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono font-medium text-foreground/75 mb-1.5">Your Rating</label>
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setRating(n === rating ? 0 : n)}
                        aria-label={`Rate ${n} star${n > 1 ? 's' : ''}`}
                        className="p-1"
                      >
                        <Star
                          className={`w-6 h-6 transition-colors ${
                            n <= rating ? 'text-amber-500 fill-amber-500' : 'text-foreground/25'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono font-medium text-foreground/75 mb-1.5">Your Feedback *</label>
                  <textarea
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="What was your experience with QNexus? What helped you most?"
                    className="w-full px-4 py-3 rounded-xl border border-foreground/25 bg-background text-foreground placeholder:text-foreground/40 text-sm focus:outline-none focus:border-foreground/60 transition-colors resize-none"
                  />
                </div>

                {error && <p className="text-sm text-rose-500">{error}</p>}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 py-4 bg-foreground text-background rounded-2xl font-semibold text-sm hover:bg-foreground/90 transition-all disabled:opacity-50 shadow-lg"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
