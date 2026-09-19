"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft, RefreshCw, CheckCircle2, XCircle, Trash2, Loader2, Star, ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface TeamApplication {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  role: string;
  currentStatus?: string;
  contributionAreas?: string[];
  skills?: string;
  portfolioUrl?: string;
  availability?: string;
  message?: string;
  status: "Pending" | "Shortlisted" | "Rejected" | "Hired";
  createdAt: string;
}

export default function AdminTeamApplicationsPage() {
  const router = useRouter();
  const [items, setItems] = useState<TeamApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "Pending" | "Shortlisted" | "Rejected" | "Hired">("Pending");
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const auth = localStorage.getItem("qni_admin_authenticated");
      if (auth !== "true") router.push("/admin");
    }
  }, [router]);

  const loadItems = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/team-applications");
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

  const updateStatus = async (id: string, status: TeamApplication["status"]) => {
    setBusyId(id);
    try {
      await fetch("/api/team-applications", {
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
    if (!confirm("Permanently delete this application?")) return;
    setBusyId(id);
    try {
      await fetch(`/api/team-applications?id=${id}`, { method: "DELETE" });
      await loadItems();
    } finally {
      setBusyId(null);
    }
  };

  const filtered = filter === "all" ? items : items.filter((i) => i.status === filter);
  const pendingCount = items.filter((i) => i.status === "Pending").length;

  const statusStyle: Record<string, string> = {
    Pending: "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30",
    Shortlisted: "bg-cyan-500/15 text-cyan-700 dark:text-cyan-400 border-cyan-500/30",
    Hired: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30",
    Rejected: "bg-foreground/10 text-foreground/50 border-foreground/15",
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-foreground/10 px-6 lg:px-12 py-4">
        <div className="max-w-[1100px] mx-auto flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="p-2 rounded-full border border-foreground/15 hover:bg-foreground/10 text-foreground transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <h1 className="font-display text-2xl font-bold flex items-center gap-2">
                Team Applications
                <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                  Admin
                </span>
              </h1>
              <p className="text-xs text-muted-foreground font-mono">
                Review applications submitted via /careers
              </p>
            </div>
          </div>
          <Button size="sm" variant="outline" onClick={loadItems} className="rounded-full text-xs gap-1.5">
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </Button>
        </div>
      </header>

      <main className="max-w-[1100px] mx-auto px-6 lg:px-12 py-8 space-y-6">
        <div className="flex items-center gap-2 flex-wrap">
          {(["Pending", "Shortlisted", "Hired", "Rejected", "all"] as const).map((f) => (
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
              {f === "Pending" && pendingCount > 0 ? ` (${pendingCount})` : ""}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-24 text-muted-foreground">
            <Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading applications...
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground font-mono text-sm">
            No {filter !== "all" ? filter.toLowerCase() : ""} applications.
          </div>
        ) : (
          <div className="grid gap-4">
            {filtered.map((item) => (
              <div key={item.id} className="p-5 rounded-2xl border border-foreground/15 bg-background flex flex-col gap-3 shadow-sm">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className={`text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full font-semibold border ${statusStyle[item.status]}`}>
                        {item.status}
                      </span>
                      <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-foreground/10 text-foreground font-semibold">
                        {item.role}
                      </span>
                      <span className="text-[11px] font-mono text-muted-foreground">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="font-display font-bold text-foreground">{item.fullName}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.email}{item.phone ? ` · ${item.phone}` : ""}
                    </p>
                    {item.availability && (
                      <p className="text-xs text-muted-foreground mt-0.5">Availability: {item.availability}</p>
                    )}
                    {item.currentStatus && (
                      <p className="text-xs text-muted-foreground mt-0.5">Current status: {item.currentStatus}</p>
                    )}
                    {item.portfolioUrl && (
                      <a href={item.portfolioUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-cyan-600 dark:text-cyan-400 hover:underline mt-1">
                        <ExternalLink className="w-3 h-3" /> Portfolio / LinkedIn
                      </a>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {item.status !== "Shortlisted" && (
                      <Button
                        size="sm" variant="outline" disabled={busyId === item.id}
                        onClick={() => updateStatus(item.id, "Shortlisted")}
                        className="rounded-full h-8 px-3 gap-1 text-xs hover:border-cyan-500/40 hover:text-cyan-600"
                      >
                        <Star className="w-3.5 h-3.5" /> Shortlist
                      </Button>
                    )}
                    {item.status !== "Hired" && (
                      <Button
                        size="sm" variant="outline" disabled={busyId === item.id}
                        onClick={() => updateStatus(item.id, "Hired")}
                        className="rounded-full h-8 px-3 gap-1 text-xs hover:border-emerald-500/40 hover:text-emerald-600"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" /> Hire
                      </Button>
                    )}
                    {item.status !== "Rejected" && (
                      <Button
                        size="sm" variant="outline" disabled={busyId === item.id}
                        onClick={() => updateStatus(item.id, "Rejected")}
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

                {item.message && (
                  <p className="text-sm text-foreground/80 leading-relaxed border-t border-foreground/10 pt-3">
                    {item.message}
                  </p>
                )}
                {item.contributionAreas && item.contributionAreas.length > 0 && (
                  <div className="border-t border-foreground/10 pt-3">
                    <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-2">Contribution areas</p>
                    <div className="flex flex-wrap gap-1.5">
                      {item.contributionAreas.map((area) => (
                        <span key={area} className="rounded-full bg-foreground/5 border border-foreground/10 px-2.5 py-1 text-xs text-foreground/70">{area}</span>
                      ))}
                    </div>
                  </div>
                )}
                {item.skills && (
                  <p className="text-sm text-foreground/80 leading-relaxed border-t border-foreground/10 pt-3">
                    <span className="font-semibold">Relevant skills:</span> {item.skills}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
