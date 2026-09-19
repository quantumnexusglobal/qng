'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Mail, Linkedin, Twitter, Send, CheckCircle2, Globe2, ShieldCheck, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { saveContact } from '@/lib/submissions-store';
import { getSettings, SiteSettings } from '@/lib/settings-store';

export default function ContactPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    inquiryType: 'General Question',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsVisible(true);
    getSettings().then(setSettings);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Save to Admin Store (local, for the admin dashboard)
    saveContact({
      name: formData.name,
      email: formData.email,
      company: formData.company || 'Individual / N/A',
      inquiryType: formData.inquiryType,
      subject: formData.subject,
      message: formData.message,
    });

    // Save to MongoDB + notify admin by email
    await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: formData.name,
        email: formData.email,
        company: formData.company || 'Individual / N/A',
        organization: formData.company,
        inquiryType: formData.inquiryType,
        subject: formData.subject,
        message: formData.message,
      }),
    }).catch((err) => console.warn('API POST warn (fallback to local store):', err));

    setSubmitSuccess(true);
    setFormData({ name: '', email: '', company: '', inquiryType: 'General Question', subject: '', message: '' });

    setTimeout(() => {
      setSubmitSuccess(false);
    }, 4000);

    setIsSubmitting(false);
  };

  const contactChannels = settings
    ? [
        {
          icon: Mail,
          title: 'General Questions',
          content: settings.generalEmail,
          link: `mailto:${settings.generalEmail}`,
        },
        {
          icon: Mail,
          title: 'Mentorship & Opportunities',
          content: settings.mentorshipEmail,
          link: `mailto:${settings.mentorshipEmail}`,
        },
      ]
    : [];

  return (
    <div ref={pageRef} className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Navigation Bar */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-foreground/10 bg-background/90 backdrop-blur-md px-6 lg:px-12 py-4">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center group">
            <Image src="/logo-mark.png" alt="QNexus" width={789} height={302} className="h-12 w-auto" />
          </Link>
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-foreground/60 hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Link>
        </div>
      </header>

      {/* Main Header Banner */}
      <div className="pt-32 pb-20 border-b border-foreground/10 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-foreground/5 blur-[140px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
          <div
            className={`transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-foreground/15 bg-foreground/5 text-xs font-mono tracking-wider uppercase mb-6 text-foreground">
              <Globe2 className="w-3.5 h-3.5 text-sky-500" />
              <span>We'd Love to Hear From You</span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-display tracking-tight text-foreground mb-6 leading-[1.05]">
              Get in Touch
            </h1>

            <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
              Questions about joining, mentorship, speaking at an event, or partnering with us? We're a student-first community — reach out, we're happy to help.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            
            {/* Left Contact Info & Channels */}
            <div className="lg:col-span-4 space-y-8">
              <div>
                <h3 className="text-2xl font-display font-bold text-foreground mb-6">Direct Channels</h3>
                <div className="space-y-4">
                  {contactChannels.map((channel) => {
                    const Icon = channel.icon;
                    return (
                      <a
                        key={channel.title}
                        href={channel.link}
                        className="group block p-5 rounded-2xl border border-foreground/15 bg-foreground/5 hover:border-foreground/30 hover:bg-foreground/10 transition-all duration-300"
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-xl bg-foreground text-background flex items-center justify-center font-bold shrink-0 shadow-md">
                            <Icon className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
                              {channel.title}
                            </p>
                            <p className="text-foreground font-semibold text-sm mt-0.5 group-hover:text-emerald-500 transition-colors">
                              {channel.content}
                            </p>
                          </div>
                        </div>
                      </a>
                    );
                  })}
                </div>
              </div>

              {/* Social Channels */}
              <div className="p-6 rounded-3xl border border-foreground/10 bg-background/60 backdrop-blur-md">
                <h4 className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-4">
                  Follow QNexus Research
                </h4>
                <div className="flex items-center gap-3">
                  <a
                    href={settings?.linkedin || 'https://www.linkedin.com/company/quantumnexusglobal/'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-3 rounded-2xl border border-foreground/15 bg-foreground/5 hover:bg-foreground/10 flex items-center justify-center gap-2 text-xs font-mono text-foreground font-medium transition-colors"
                  >
                    <Linkedin className="w-4 h-4 text-blue-500" />
                    <span>LinkedIn</span>
                  </a>
                  <a
                    href={settings?.twitter || 'https://x.com'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-3 rounded-2xl border border-foreground/15 bg-foreground/5 hover:bg-foreground/10 flex items-center justify-center gap-2 text-xs font-mono text-foreground font-medium transition-colors"
                  >
                    <Twitter className="w-4 h-4" />
                    <span>Twitter / X</span>
                  </a>
                </div>
              </div>

              {/* Credibility Note */}
              <div className="p-6 rounded-3xl border border-foreground/10 bg-foreground/5 space-y-3">
                <div className="flex items-center gap-2 text-xs font-mono text-foreground font-bold">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span>Quick Response, Kept Private</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  We typically respond within 24 hours. Your information is never shared without your consent.
                </p>
              </div>
            </div>

            {/* Right Contact Form */}
            <div className="lg:col-span-8">
              <div className="p-8 md:p-12 rounded-3xl border border-foreground/15 bg-background/80 backdrop-blur-xl shadow-2xl">
                <h3 className="text-2xl font-display font-bold text-foreground mb-2">Send us a Message</h3>
                <p className="text-xs font-mono text-muted-foreground mb-8">Let us know what you need help with and we'll route it to the right person.</p>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-mono text-foreground/70 uppercase tracking-wider mb-2">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3.5 bg-foreground/5 border border-foreground/15 rounded-2xl focus:border-foreground/50 focus:outline-none transition-colors text-foreground text-sm placeholder:text-muted-foreground"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-foreground/70 uppercase tracking-wider mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3.5 bg-foreground/5 border border-foreground/15 rounded-2xl focus:border-foreground/50 focus:outline-none transition-colors text-foreground text-sm placeholder:text-muted-foreground"
                        placeholder="you@example.com"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-mono text-foreground/70 uppercase tracking-wider mb-2">
                        College / Company (Optional)
                      </label>
                      <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        className="w-full px-4 py-3.5 bg-foreground/5 border border-foreground/15 rounded-2xl focus:border-foreground/50 focus:outline-none transition-colors text-foreground text-sm placeholder:text-muted-foreground"
                        placeholder="Your college or company"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-foreground/70 uppercase tracking-wider mb-2">
                        Inquiry Category *
                      </label>
                      <select
                        name="inquiryType"
                        value={formData.inquiryType}
                        onChange={handleChange}
                        className="w-full px-4 py-3.5 bg-foreground/5 border border-foreground/15 rounded-2xl focus:border-foreground/50 focus:outline-none transition-colors text-foreground text-sm"
                      >
                        <option value="General Question">General Question</option>
                        <option value="Joining the Community">Joining the Community</option>
                        <option value="Mentorship">Mentorship</option>
                        <option value="Speaking or Volunteering">Speaking or Volunteering</option>
                        <option value="Partnerships">Partnerships</option>
                        <option value="Press & Media">Press & Media</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-foreground/70 uppercase tracking-wider mb-2">
                      Subject *
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3.5 bg-foreground/5 border border-foreground/15 rounded-2xl focus:border-foreground/50 focus:outline-none transition-colors text-foreground text-sm placeholder:text-muted-foreground"
                      placeholder="How can we help?"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-foreground/70 uppercase tracking-wider mb-2">
                      Detailed Message *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="w-full px-4 py-3.5 bg-foreground/5 border border-foreground/15 rounded-2xl focus:border-foreground/50 focus:outline-none transition-colors text-foreground text-sm placeholder:text-muted-foreground resize-none"
                      placeholder="Tell us more about your question or what you'd like help with..."
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting || submitSuccess}
                    size="lg"
                    className="w-full h-14 rounded-full bg-foreground hover:bg-foreground/90 text-background text-base font-semibold shadow-xl group"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-background border-t-transparent rounded-full animate-spin" />
                        Sending...
                      </span>
                    ) : submitSuccess ? (
                      <span className="flex items-center gap-2 text-emerald-400">
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" /> Message Sent Successfully!
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Send className="w-4 h-4" />
                        Send Message
                      </span>
                    )}
                  </Button>
                </form>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
