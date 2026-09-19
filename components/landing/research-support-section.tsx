"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Cpu,
  GraduationCap,
  Sparkles,
  BookOpen,
  Award,
  ArrowRight,
  CheckCircle2,
  X,
  Send,
  Loader2,
  Users,
  Terminal,
} from "lucide-react";
import { saveResearchApplication } from "@/lib/submissions-store";

export function ResearchSupportSection() {
  const [modalOpen, setModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    institution: "",
    programLevel: "PhD Scholar",
    researchDomain: "Quantum Algorithms & Optimization",
    projectTitle: "",
    projectAbstract: "",
    supportTypes: ["Cloud QPU Credits", "1-on-1 Mentorship"],
    currentPaperStatus: "Work In Progress",
    githubOrArxiv: "",
    computeHoursRequested: "50 QPU Hours",
  });

  const toggleSupportType = (type: string) => {
    setFormData((prev) => {
      const exists = prev.supportTypes.includes(type);
      return {
        ...prev,
        supportTypes: exists
          ? prev.supportTypes.filter((t) => t !== type)
          : [...prev.supportTypes, type],
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = {
      ...formData,
      status: "Under Review" as const,
    };

    // Save locally
    saveResearchApplication(payload);

    // Save to MongoDB
    try {
      await fetch("/api/research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch (err) {
      console.warn("MongoDB API error:", err);
    }

    setIsSubmitting(false);
    setSubmitted(true);
  };

  return (
    <section id="research" className="relative py-24 lg:py-32 border-t border-foreground/10 bg-background text-foreground overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-gradient-to-tr from-cyan-500/10 via-purple-500/10 to-transparent blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-950/20 text-cyan-400 font-mono text-xs mb-4">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Academic & Student Empowerment Initiative</span>
            </div>
            <h2 className="text-4xl lg:text-6xl font-display tracking-tight text-foreground">
              Fueling Quantum Research.
              <br />
              <span className="text-muted-foreground">For Students & Scholars across India.</span>
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={() => setModalOpen(true)}
              className="inline-flex items-center gap-2.5 px-6 py-3.5 bg-foreground text-background rounded-full font-semibold text-sm hover:bg-foreground/90 transition-all shadow-xl shadow-cyan-500/5 group"
            >
              <span>Apply for Research Grant</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
            <Link
              href="/research"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full border border-foreground/20 text-foreground/80 hover:text-foreground hover:border-foreground/40 text-sm font-medium transition-all"
            >
              Learn More
            </Link>
          </div>
        </div>

        {/* 4 Pillar Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {/* Card 1: Compute */}
          <div className="p-8 rounded-3xl border border-foreground/10 bg-foreground/[0.02] hover:border-cyan-500/40 hover:bg-foreground/[0.03] transition-all duration-300 group flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-6 group-hover:scale-110 transition-transform">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-display font-semibold mb-2">Cloud QPU Compute</h3>
              <p className="text-sm text-foreground/60 leading-relaxed">
                Free compute hours on real IBM Quantum superconducting QPUs and high-memory cloud state-vector simulators for paper experiments.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-foreground/10 flex items-center justify-between text-xs font-mono text-cyan-400">
              <span>Up to 100 QPU Hours</span>
              <span>100% Free</span>
            </div>
          </div>

          {/* Card 2: Mentorship */}
          <div className="p-8 rounded-3xl border border-foreground/10 bg-foreground/[0.02] hover:border-purple-500/40 hover:bg-foreground/[0.03] transition-all duration-300 group flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-6 group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-display font-semibold mb-2">1-on-1 PhD Mentorship</h3>
              <p className="text-sm text-foreground/60 leading-relaxed">
                Weekly office hours with senior quantum physicists, algorithm scientists, and postdoctoral researchers from IISc, IITs, and industry.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-foreground/10 flex items-center justify-between text-xs font-mono text-purple-400">
              <span>Dedicated Advisor</span>
              <span>Weekly Syncs</span>
            </div>
          </div>

          {/* Card 3: Publication & Travel */}
          <div className="p-8 rounded-3xl border border-foreground/10 bg-foreground/[0.02] hover:border-emerald-500/40 hover:bg-foreground/[0.03] transition-all duration-300 group flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-6 group-hover:scale-110 transition-transform">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-display font-semibold mb-2">Publication & Grants</h3>
              <p className="text-sm text-foreground/60 leading-relaxed">
                Financial sponsorship for open-access journal publication fees (IEEE, APS, arXiv) and travel grants to present at global quantum conferences.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-foreground/10 flex items-center justify-between text-xs font-mono text-emerald-400">
              <span>Grant Support</span>
              <span>Fast Review</span>
            </div>
          </div>

          {/* Card 4: Sandbox & Benchmarks */}
          <div className="p-8 rounded-3xl border border-foreground/10 bg-foreground/[0.02] hover:border-amber-500/40 hover:bg-foreground/[0.03] transition-all duration-300 group flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-6 group-hover:scale-110 transition-transform">
                <Terminal className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-display font-semibold mb-2">Open Sandbox Lab</h3>
              <p className="text-sm text-foreground/60 leading-relaxed">
                Pre-installed Jupyter environments with Qiskit 1.0, PennyLane, Cirq, Hamiltonian molecular datasets, and error mitigation suites.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-foreground/10 flex items-center justify-between text-xs font-mono text-amber-400">
              <span>Instant Launch</span>
              <span>GitHub Sync</span>
            </div>
          </div>
        </div>

        {/* Highlight Banner with Step-by-Step Flow */}
        <div className="p-8 lg:p-12 rounded-3xl border border-cyan-500/20 bg-gradient-to-r from-cyan-950/20 via-background to-purple-950/20 backdrop-blur-md relative overflow-hidden">
          <div className="grid lg:grid-cols-3 gap-8 items-center">
            <div>
              <span className="font-mono text-xs text-cyan-400 uppercase tracking-widest block mb-2">How It Works</span>
              <h3 className="text-2xl lg:text-3xl font-display font-bold mb-3">Simple 3-Step Grant Workflow</h3>
              <p className="text-foreground/60 text-sm leading-relaxed">
                We review applications within 48 hours and provision compute access directly to your QNexus academic account.
              </p>
            </div>

            <div className="lg:col-span-2 grid sm:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl border border-foreground/10 bg-background/50">
                <div className="font-mono text-2xl font-bold text-cyan-400 mb-2">01</div>
                <h4 className="font-semibold text-sm mb-1">Submit Proposal</h4>
                <p className="text-xs text-foreground/50">Share your research abstract, university affiliation, and estimated compute needs.</p>
              </div>

              <div className="p-5 rounded-2xl border border-foreground/10 bg-background/50">
                <div className="font-mono text-2xl font-bold text-purple-400 mb-2">02</div>
                <h4 className="font-semibold text-sm mb-1">Peer Review</h4>
                <p className="text-xs text-foreground/50">Our scientific committee reviews alignment within 48 hours and assigns a mentor.</p>
              </div>

              <div className="p-5 rounded-2xl border border-foreground/10 bg-background/50">
                <div className="font-mono text-2xl font-bold text-emerald-400 mb-2">03</div>
                <h4 className="font-semibold text-sm mb-1">Execute & Publish</h4>
                <p className="text-xs text-foreground/50">Run experiments on real QPUs, draft findings, and receive publication grant assistance.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Application Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/75 backdrop-blur-md" onClick={() => setModalOpen(false)} />
          
          <div className="relative z-10 w-full max-w-2xl bg-background border border-foreground/15 rounded-3xl p-6 sm:p-10 shadow-2xl max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-6 right-6 w-9 h-9 rounded-full border border-foreground/15 flex items-center justify-center hover:bg-foreground/10 transition-colors"
            >
              <X className="w-4 h-4 text-foreground/60" />
            </button>

            {submitted ? (
              <div className="text-center py-10">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border-2 border-emerald-500 flex items-center justify-center mx-auto mb-5">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                </div>
                <h3 className="text-2xl font-display font-bold mb-2">Application Submitted!</h3>
                <p className="text-foreground/60 text-sm mb-6 max-w-md mx-auto">
                  Thank you, <strong>{formData.fullName}</strong>. Your research support application has been sent to our scientific review team. We will contact you at <strong>{formData.email}</strong> within 48 hours.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setModalOpen(false);
                  }}
                  className="px-8 py-3 bg-foreground text-background rounded-full font-medium text-sm hover:bg-foreground/90 transition-colors"
                >
                  Done
                </button>
              </div>
            ) : (
              <div>
                <div className="mb-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-950/20 text-cyan-400 font-mono text-xs mb-2">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>QNexus Research Support Grant</span>
                  </div>
                  <h3 className="text-2xl font-display font-bold">Apply for Research Support</h3>
                  <p className="text-sm text-foreground/60 mt-1">
                    Direct QPU compute credits, PhD research mentorship, and publication grants.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-foreground/50 mb-1">Full Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        placeholder="e.g. Priya Sharma"
                        className="w-full px-4 py-2.5 rounded-xl border border-foreground/15 bg-background text-sm text-foreground focus:outline-none focus:border-foreground/40"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-foreground/50 mb-1">Institutional Email *</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="e.g. priya@iisc.ac.in"
                        className="w-full px-4 py-2.5 rounded-xl border border-foreground/15 bg-background text-sm text-foreground focus:outline-none focus:border-foreground/40"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-foreground/50 mb-1">University / Institute / Lab *</label>
                      <input
                        type="text"
                        required
                        value={formData.institution}
                        onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                        placeholder="e.g. IIT Madras / IISc / TIFR"
                        className="w-full px-4 py-2.5 rounded-xl border border-foreground/15 bg-background text-sm text-foreground focus:outline-none focus:border-foreground/40"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-foreground/50 mb-1">Program / Role *</label>
                      <select
                        value={formData.programLevel}
                        onChange={(e) => setFormData({ ...formData, programLevel: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-foreground/15 bg-background text-sm text-foreground focus:outline-none focus:border-foreground/40"
                      >
                        <option value="Undergraduate">Undergraduate Student</option>
                        <option value="Postgraduate">Postgraduate (M.Tech / M.Sc)</option>
                        <option value="PhD Scholar">PhD Scholar / Doctoral Fellow</option>
                        <option value="Postdoc">Postdoctoral Researcher</option>
                        <option value="Faculty">Faculty / PI</option>
                        <option value="Independent Researcher">Independent Quantum Researcher</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-foreground/50 mb-1">Research Domain *</label>
                    <select
                      value={formData.researchDomain}
                      onChange={(e) => setFormData({ ...formData, researchDomain: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-foreground/15 bg-background text-sm text-foreground focus:outline-none focus:border-foreground/40"
                    >
                      <option value="Quantum Algorithms & Optimization">Quantum Algorithms & Optimization (VQE, QAOA)</option>
                      <option value="Quantum Machine Learning">Quantum Machine Learning (QML & QNNs)</option>
                      <option value="Quantum Error Correction">Quantum Error Correction & Fault Tolerance</option>
                      <option value="Quantum Chemistry & Materials">Quantum Chemistry & Materials Simulation</option>
                      <option value="Quantum Hardware & Physics">Quantum Hardware, Superconducting Qubits & Optics</option>
                      <option value="Post-Quantum Cryptography">Post-Quantum Cryptography & Quantum Security</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-foreground/50 mb-1">Project Title / Thesis Topic *</label>
                    <input
                      type="text"
                      required
                      value={formData.projectTitle}
                      onChange={(e) => setFormData({ ...formData, projectTitle: e.target.value })}
                      placeholder="e.g. Error Mitigated VQE for 2D Molecular Hamiltonians"
                      className="w-full px-4 py-2.5 rounded-xl border border-foreground/15 bg-background text-sm text-foreground focus:outline-none focus:border-foreground/40"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-foreground/50 mb-1">Brief Abstract / Objectives *</label>
                    <textarea
                      required
                      rows={3}
                      value={formData.projectAbstract}
                      onChange={(e) => setFormData({ ...formData, projectAbstract: e.target.value })}
                      placeholder="Summarize your research goals, methodologies, and expected outcomes..."
                      className="w-full px-4 py-2.5 rounded-xl border border-foreground/15 bg-background text-sm text-foreground focus:outline-none focus:border-foreground/40 resize-none"
                    />
                  </div>

                  {/* Support Needed Multi-select */}
                  <div>
                    <label className="block text-xs font-mono text-foreground/50 mb-1.5">Support Needed (Select all that apply)</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[
                        "Cloud QPU Credits",
                        "1-on-1 Mentorship",
                        "Publication Grant",
                        "Sandbox Access",
                      ].map((type) => {
                        const isSelected = formData.supportTypes.includes(type);
                        return (
                          <button
                            key={type}
                            type="button"
                            onClick={() => toggleSupportType(type)}
                            className={`p-2 rounded-xl text-xs font-medium border transition-colors text-center ${
                              isSelected
                                ? "bg-cyan-500/15 border-cyan-500 text-cyan-400"
                                : "border-foreground/15 text-foreground/60 hover:border-foreground/30"
                            }`}
                          >
                            {type}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full mt-4 flex items-center justify-center gap-2 py-3.5 bg-foreground text-background rounded-xl font-semibold text-sm hover:bg-foreground/90 transition-all disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Submitting Application...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Submit Research Support Request</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
