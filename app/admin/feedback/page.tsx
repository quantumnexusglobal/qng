"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft, RefreshCw, Star, CheckCircle2, XCircle, Trash2, Copy, Check, Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface FeedbackItem {
  id: string;
  name: string;
  email?: string;
  role?: string;
  organization?: string;
  message: string;
  rating?: number;
  photoUrl?: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

export default function AdminFeedbackPage() {
  const router = useRouter();
  const [items, setItems] = useState<FeedbackItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("pending");
  const [linkCopied, setLinkCopied] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [formUrl, setFormUrl] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const auth = localStorage.getItem("qni_admin_authenticated");
      if (auth !== "true") {
        router.push("/admin");
      }
      setFormUrl(`${window.location.origin}/feedback`);
    }
  }, [router]);

  const loadItems = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/feedback");
      const data = await res.json();
      if (data.success) setItems(data.data);
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const updateStatus = async (id: string, status: "approved" | "rejected" | "pending") => {
    setBusyId(id);
    try {
      await fetch("/api/feedback", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      await loadItems();
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Permanently delete this submission?")) return;
    setBusyId(id);
    try {
      await fetch(`/api/feedback?id=${id}`, { method: "DELETE" });
      await loadItems();
    } finally {
      setBusyId(null);
    }
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(formUrl);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  const filtered = filter === "all" ? items : items.filter((i) => i.status === filter);
  const pendingCount = items.filter((i) => i.status === "pending").length;

  const statusStyle: Record<string, string> = {
    pending: "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30",
    approved: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30",
    rejected: "bg-foreground/10 text-foreground/50 border-foreground/15",
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-foreground/10 px-6 lg:px-12 py-4">
        <div className="max-w-[1100px] mx-auto flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-4">
            <Link
              href="/admin"
              className="p-2 rounded-full border border-foreground/15 hover:bg-foreground/10 text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <h1 className="font-display text-2xl font-bold flex items-center gap-2">
                Feedback & Testimonials
                <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                  Admin
                </span>
              </h1>
              <p className="text-xs text-muted-foreground font-mono">
                Approve submissions to feature them on the homepage Testimonials section
              </p>
            </div>
          </div>
          <Button size="sm" variant="outline" onClick={loadItems} className="rounded-full text-xs gap-1.5">
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </Button>
        </div>
      </header>

      <main className="max-w-[1100px] mx-auto px-6 lg:px-12 py-8 space-y-6">
        {/* Shareable link */}
        <div className="p-5 rounded-2xl border border-foreground/15 bg-foreground/[0.03] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-mono uppercase text-muted-foreground mb-1">Feedback Form Link — share this with anyone</p>
            <p className="text-sm font-mono text-foreground truncate">{formUrl}</p>
          </div>
          <Button size="sm" onClick={copyLink} className="rounded-full text-xs gap-1.5 bg-foreground text-background shrink-0">
            {linkCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {linkCopied ? "Copied!" : "Copy Link"}
          </Button>
        </div>

        {/* Filter tabs */}
        <div className="flex items-center gap-2 flex-wrap">
          {(["pending", "approved", "rejected", "all"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-mono font-semibold uppercase border transition-all ${
                filter === f
                  ? "bg-foreground text-background border-foreground"
                  : "border-foreground/15 text-foreground/60 hover:border-foreground/30"
              }`}
            >
              {f}
              {f === "pending" && pendingCount > 0 ? ` (${pendingCount})` : ""}
            </button>
          ))}
        </div>

        {/* List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-24 text-muted-foreground">
            <Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading submissions...
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground font-mono text-sm">
            No {filter !== "all" ? filter : ""} submissions.
          </div>
        ) : (
          <div className="grid gap-4">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="p-5 rounded-2xl border border-foreground/15 bg-background flex flex-col gap-3 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className={`text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full font-semibold border ${statusStyle[item.status]}`}>
                        {item.status}
                      </span>
                      {item.rating && (
                        <span className="inline-flex items-center gap-0.5">
                          {Array.from({ length: item.rating }).map((_, i) => (
                            <Star key={i} className="w-3 h-3 text-amber-500 fill-amber-500" />
                          ))}
                        </span>
                      )}
                      <span className="text-[11px] font-mono text-muted-foreground">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="font-display font-bold text-foreground">{item.name}</p>
                    {(item.role || item.organization) && (
                      <p className="text-xs text-muted-foreground">
                        {[item.role, item.organization].filter(Boolean).join(" · ")}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {item.status !== "approved" && (
                      <Button
                        size="sm" variant="outline" disabled={busyId === item.id}
                        onClick={() => updateStatus(item.id, "approved")}
                        className="rounded-full h-8 px-3 gap-1 text-xs hover:border-emerald-500/40 hover:text-emerald-600"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                      </Button>
                    )}
                    {item.status !== "rejected" && (
                      <Button
                        size="sm" variant="outline" disabled={busyId === item.id}
                        onClick={() => updateStatus(item.id, "rejected")}
                        className="rounded-full h-8 px-3 gap-1 text-xs hover:border-rose-500/40 hover:text-rose-500"
                      >
                        <XCircle className="w-3.5 h-3.5" /> Reject
                      </Button>
                    )}
                    <Button
                      size="sm" variant="ghost" disabled={busyId === item.id}
                      onClick={() => handleDelete(item.id)}
                      className="rounded-full h-8 px-3 gap-1 text-xs text-rose-500 hover:text-rose-600 hover:bg-rose-500/10"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>

                <p className="text-sm text-foreground/80 leading-relaxed border-t border-foreground/10 pt-3">
                  "{item.message}"
                </p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
