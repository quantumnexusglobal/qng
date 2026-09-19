"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2, Save, Mail, Phone, Linkedin, Twitter, Loader2, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getSettings, saveSettings, SiteSettings } from "@/lib/settings-store";

export default function AdminSettingsPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<SiteSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const auth = localStorage.getItem("qni_admin_authenticated");
      if (auth !== "true") {
        router.push("/admin");
      }
    }
  }, [router]);

  useEffect(() => {
    getSettings().then((s) => {
      setFormData(s);
      setIsLoading(false);
    });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => (prev ? { ...prev, [name]: value } : prev));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;
    setIsSaving(true);
    setSuccessMessage("");
    await saveSettings(formData);
    setSuccessMessage("Contact details updated — live on the site now.");
    setIsSaving(false);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-foreground/10 px-6 lg:px-12 py-4">
        <div className="max-w-[900px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/admin"
              className="p-2 rounded-full border border-foreground/15 hover:bg-foreground/10 text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <h1 className="font-display text-2xl font-bold flex items-center gap-2">
                Site Contact Settings
                <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Admin
                </span>
              </h1>
              <p className="text-xs text-muted-foreground font-mono">
                Update the email, phone & social links shown across the public site
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[900px] mx-auto px-6 lg:px-12 py-8 space-y-6">
        {successMessage && (
          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-mono flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {isLoading || !formData ? (
          <div className="flex items-center justify-center py-24 text-muted-foreground">
            <Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading current settings...
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="border border-foreground/15 bg-foreground/[0.03] rounded-3xl p-6 lg:p-8 space-y-5 shadow-xl">
            <div>
              <label className="flex items-center gap-1.5 text-xs font-mono uppercase text-muted-foreground mb-1">
                <Mail className="w-3.5 h-3.5" /> General Questions Email
              </label>
              <input
                type="email" name="generalEmail" required value={formData.generalEmail} onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-foreground/15 bg-background text-sm text-foreground focus:outline-none focus:border-foreground/50 transition-colors"
              />
            </div>

            <div>
              <label className="flex items-center gap-1.5 text-xs font-mono uppercase text-muted-foreground mb-1">
                <Mail className="w-3.5 h-3.5" /> Mentorship & Opportunities Email
              </label>
              <input
                type="email" name="mentorshipEmail" required value={formData.mentorshipEmail} onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-foreground/15 bg-background text-sm text-foreground focus:outline-none focus:border-foreground/50 transition-colors"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-1.5 text-xs font-mono uppercase text-muted-foreground mb-1">
                  <Phone className="w-3.5 h-3.5" /> Phone (Display)
                </label>
                <input
                  type="text" name="phoneDisplay" required value={formData.phoneDisplay} onChange={handleChange}
                  placeholder="+1 555 123 4567"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-foreground/15 bg-background text-sm text-foreground focus:outline-none focus:border-foreground/50 transition-colors"
                />
              </div>
              <div>
                <label className="flex items-center gap-1.5 text-xs font-mono uppercase text-muted-foreground mb-1">
                  <Phone className="w-3.5 h-3.5" /> Phone (tel: link, no spaces)
                </label>
                <input
                  type="text" name="phoneLink" required value={formData.phoneLink} onChange={handleChange}
                  placeholder="+15551234567"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-foreground/15 bg-background text-xs font-mono text-foreground focus:outline-none focus:border-foreground/50 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="flex items-center gap-1.5 text-xs font-mono uppercase text-muted-foreground mb-1">
                <Linkedin className="w-3.5 h-3.5" /> LinkedIn URL
              </label>
              <input
                type="url" name="linkedin" value={formData.linkedin} onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-foreground/15 bg-background text-xs font-mono text-foreground focus:outline-none focus:border-foreground/50 transition-colors"
              />
            </div>

            <div>
              <label className="flex items-center gap-1.5 text-xs font-mono uppercase text-muted-foreground mb-1">
                <Twitter className="w-3.5 h-3.5" /> Twitter / X URL
              </label>
              <input
                type="url" name="twitter" value={formData.twitter} onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-foreground/15 bg-background text-xs font-mono text-foreground focus:outline-none focus:border-foreground/50 transition-colors"
              />
            </div>

            <div>
              <label className="flex items-center gap-1.5 text-xs font-mono uppercase text-muted-foreground mb-1">
                <MessageCircle className="w-3.5 h-3.5" /> WhatsApp Community Invite Link
              </label>
              <input
                type="url" name="whatsappGroupLink" required value={formData.whatsappGroupLink} onChange={handleChange}
                placeholder="https://chat.whatsapp.com/xxxxxxxxxxxxxxxx"
                className="w-full px-3.5 py-2.5 rounded-xl border border-foreground/15 bg-background text-xs font-mono text-foreground focus:outline-none focus:border-foreground/50 transition-colors"
              />
              <p className="text-[11px] text-muted-foreground font-mono mt-1.5">
                Anyone who joins the community or registers for an event is auto-redirected here to join the group in one tap.
              </p>
            </div>

            <Button
              type="submit" disabled={isSaving}
              className="w-full h-11 rounded-xl bg-foreground text-background font-semibold text-sm flex items-center justify-center gap-2 hover:bg-foreground/90 transition-all shadow-md"
            >
              {isSaving ? <span>Saving...</span> : (<><Save className="w-4 h-4" /><span>Save Changes</span></>)}
            </Button>
          </form>
        )}
      </main>
    </div>
  );
}
