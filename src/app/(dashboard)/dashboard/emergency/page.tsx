"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import { useEffect, useState } from "react";
import Topbar from "@/components/Topbar";
import StatusPill, { Avatar, EmptyState, PageHeader, Toast, inputClass } from "@/components/ui";

interface EmergencyVisit {
  id: string;
  patient: string;
  condition?: string | null;
  triage?: string | null;
  vitalsCount?: number;
}

export default function EmergencyPage() {
  const [rows, setRows] = useState<EmergencyVisit[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/emergency").then((r) => r.json());
      setRows(res.visits ?? []);
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
      const res = await fetch("/api/emergency", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: f.get("name"),
          age: f.get("age"),
          gender: f.get("gender"),
          triage: f.get("triage"),
          condition: f.get("condition"),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setToast(data.error ?? "Failed");
        return;
      }
      (e.target as HTMLFormElement).reset();
      await load();
      setToast("Emergency registered");
    } finally {
      setSaving(false);
    }
  }

  const critical = rows.filter((r) => r.condition?.toUpperCase() === "CRITICAL").length;

  return (
    <>
      <Topbar crumb="Emergency" />
      <main className="mx-auto max-w-[1100px] px-4 py-7 md:px-9">
        <PageHeader
          title="Emergency & triage"
          subtitle="Register → immediate triage → vitals → emergency doctor."
          badge={
            critical > 0 ? (
              <span className="rounded-full bg-red-50 px-3 py-1 text-[11px] font-semibold text-red-600">
                {critical} critical
              </span>
            ) : (
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-semibold text-emerald-700">
                All stable
              </span>
            )
          }
        />
        <div className="grid gap-4 lg:grid-cols-[1.6fr_1fr]">
          <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 p-4">
              <h2 className="text-[13px] font-bold text-slate-700">Active triage</h2>
              <p className="text-[11px] text-slate-500">Patients currently in emergency.</p>
            </div>
            {loading ? (
              <EmptyState message="Loading emergencies…" />
            ) : rows.length === 0 ? (
              <EmptyState message="No active emergencies." />
            ) : (
              <div className="divide-y divide-slate-100">
                {rows.map((v, i) => (
                  <div key={v.id} className="flex items-center gap-3 p-4">
                    <Avatar name={v.patient} index={i} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13px] font-semibold text-slate-700">{v.patient}</p>
                      <p className="truncate text-[11px] text-slate-500">
                        {v.triage ?? "No triage notes"} · {v.vitalsCount ?? 0} vitals
                      </p>
                    </div>
                    <StatusPill status={v.condition?.toUpperCase() === "CRITICAL" ? "Critical" : "Stable"} />
                  </div>
                ))}
              </div>
            )}
          </section>

          <form
            onSubmit={submit}
            className="h-fit rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <h2 className="text-[14px] font-bold text-slate-800">Register emergency</h2>
            <p className="mb-4 text-[11px] text-slate-500">Fast-track registration and triage.</p>
            <div className="grid gap-3">
              <input name="name" required placeholder="Patient name" className={inputClass} />
              <div className="grid grid-cols-2 gap-3">
                <input name="age" type="number" min="0" max="125" placeholder="Age" className={inputClass} />
                <select name="gender" className={inputClass} defaultValue="Female">
                  <option>Female</option>
                  <option>Male</option>
                  <option>Other</option>
                </select>
              </div>
              <input name="triage" placeholder="Triage notes" className={inputClass} />
              <select name="condition" className={inputClass} defaultValue="STABLE">
                <option value="STABLE">Stable</option>
                <option value="CRITICAL">Critical</option>
              </select>
              <button
                disabled={saving}
                className="h-10 rounded-lg bg-red-500 text-[13px] font-bold text-white hover:bg-red-600 disabled:opacity-60"
              >
                {saving ? "Registering…" : "Register emergency"}
              </button>
            </div>
          </form>
        </div>
      </main>
      <Toast message={toast} />
    </>
  );
}
