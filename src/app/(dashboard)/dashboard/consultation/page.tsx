"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import { useEffect, useState } from "react";
import Topbar from "@/components/Topbar";
import { Avatar, EmptyState, PageHeader, Toast, inputClass } from "@/components/ui";

interface Visit {
  id: string;
  patient: string;
  reason?: string | null;
  diagnosis?: string | null;
  vitalsCount?: number;
}

export default function ConsultationPage() {
  const [visits, setVisits] = useState<Visit[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/visits").then((r) => r.json());
      setVisits(res.visits ?? []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 2500);
    return () => clearTimeout(t);
  }, [toast]);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    const f = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/visits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patient: f.get("patient"),
          reason: f.get("symptoms") ? `Consultation — ${f.get("symptoms")}` : "Consultation",
          diagnosis: f.get("diagnosis"),
          notes: [f.get("treatment"), f.get("followup") ? `Follow-up: ${f.get("followup")}` : ""]
            .filter(Boolean)
            .join(" | "),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setToast(data.error ?? "Failed");
        return;
      }
      (e.target as HTMLFormElement).reset();
      await load();
      setToast("Consultation recorded");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <Topbar crumb="Consultation" />
      <main className="mx-auto max-w-[1100px] px-4 py-7 md:px-9">
        <PageHeader
          title="Doctor consultation"
          subtitle="Review history & vitals → symptoms, diagnosis, treatment, follow-up."
        />
        <div className="grid gap-4 lg:grid-cols-[1.6fr_1fr]">
          <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 p-4">
              <h2 className="text-[13px] font-bold text-slate-700">Recent visits</h2>
              <p className="text-[11px] text-slate-500">Latest consultations and diagnoses.</p>
            </div>
            {loading ? (
              <EmptyState message="Loading visits…" />
            ) : visits.length === 0 ? (
              <EmptyState message="No consultations yet." />
            ) : (
              <div className="divide-y divide-slate-100">
                {visits.map((v, i) => (
                  <div key={v.id} className="flex items-center gap-3 p-4">
                    <Avatar name={v.patient} index={i} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13px] font-semibold text-slate-700">
                        {v.patient}
                      </p>
                      <p className="truncate text-[11px] text-slate-500">
                        {v.reason ?? "Visit"} · {v.diagnosis ?? "No diagnosis"}
                      </p>
                    </div>
                    <span className="rounded-full bg-sky-50 px-2.5 py-1 text-[10px] font-semibold text-sky-700">
                      {v.vitalsCount ?? 0} vitals
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>

          <form
            onSubmit={submit}
            className="h-fit rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <h2 className="text-[14px] font-bold text-slate-800">New consultation</h2>
            <p className="mb-4 text-[11px] text-slate-500">
              Request lab or create a prescription from the workflow.
            </p>
            <div className="grid gap-3">
              <input name="patient" required placeholder="Patient name" className={inputClass} />
              <input name="symptoms" placeholder="Symptoms" className={inputClass} />
              <input name="diagnosis" placeholder="Diagnosis" className={inputClass} />
              <input name="treatment" placeholder="Treatment plan" className={inputClass} />
              <input name="followup" placeholder="Follow-up (e.g. in 2 weeks)" className={inputClass} />
              <button
                disabled={saving}
                className="h-10 rounded-lg bg-[#25a67f] text-[13px] font-bold text-white hover:bg-[#218f6d] disabled:opacity-60"
              >
                {saving ? "Saving…" : "Save consultation"}
              </button>
            </div>
          </form>
        </div>
      </main>
      <Toast message={toast} />
    </>
  );
}
