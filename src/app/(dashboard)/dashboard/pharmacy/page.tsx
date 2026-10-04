"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import { useEffect, useState } from "react";
import Topbar from "@/components/Topbar";
import StatusPill, { Avatar, EmptyState, PageHeader, Toast, inputClass } from "@/components/ui";

interface Prescription {
  id: string;
  patient: string;
  doctor: string;
  medication: string;
  dosage?: string | null;
  status: string;
}

export default function PharmacyPage() {
  const [rows, setRows] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/prescriptions").then((r) => r.json());
      setRows(res.prescriptions ?? []);
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
      const res = await fetch("/api/prescriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patient: f.get("patient"),
          doctor: f.get("doctor"),
          medication: f.get("medication"),
          dosage: f.get("dosage"),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setToast(data.error ?? "Failed");
        return;
      }
      (e.target as HTMLFormElement).reset();
      await load();
      setToast("Prescription created");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <Topbar crumb="Pharmacy" />
      <main className="mx-auto max-w-[1100px] px-4 py-7 md:px-9">
        <PageHeader
          title="Pharmacy"
          subtitle="Prescription → check medicine → dispense → update stock."
          badge={
            <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-600">
              {rows.length} prescriptions
            </span>
          }
        />
        <div className="grid gap-4 lg:grid-cols-[1.6fr_1fr]">
          <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 p-4">
              <h2 className="text-[13px] font-bold text-slate-700">Prescriptions</h2>
              <p className="text-[11px] text-slate-500">Dispense and manage stock.</p>
            </div>
            {loading ? (
              <EmptyState message="Loading prescriptions…" />
            ) : rows.length === 0 ? (
              <EmptyState message="No prescriptions yet." />
            ) : (
              <div className="divide-y divide-slate-100">
                {rows.map((p, i) => (
                  <div key={p.id} className="flex items-center gap-3 p-4">
                    <Avatar name={p.patient} index={i} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13px] font-semibold text-slate-700">
                        {p.medication}
                        {p.dosage ? <span className="font-normal text-slate-400"> · {p.dosage}</span> : null}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {p.patient} · {p.doctor}
                      </p>
                    </div>
                    <StatusPill status={p.status} />
                  </div>
                ))}
              </div>
            )}
          </section>

          <form
            onSubmit={submit}
            className="h-fit rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <h2 className="text-[14px] font-bold text-slate-800">New prescription</h2>
            <p className="mb-4 text-[11px] text-slate-500">
              Created by the doctor after consultation.
            </p>
            <div className="grid gap-3">
              <input name="patient" required placeholder="Patient name" className={inputClass} />
              <input name="doctor" required placeholder="Doctor name" className={inputClass} />
              <input name="medication" required placeholder="Medication" className={inputClass} />
              <input name="dosage" placeholder="Dosage (e.g. 2x daily, 5 days)" className={inputClass} />
              <button
                disabled={saving}
                className="h-10 rounded-lg bg-[#25a67f] text-[13px] font-bold text-white hover:bg-[#218f6d] disabled:opacity-60"
              >
                {saving ? "Creating…" : "Create prescription"}
              </button>
            </div>
          </form>
        </div>
      </main>
      <Toast message={toast} />
    </>
  );
}
