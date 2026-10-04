"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import { useEffect, useState } from "react";
import Topbar from "@/components/Topbar";
import StatusPill, { Avatar, EmptyState, PageHeader, Toast, inputClass } from "@/components/ui";

interface QueueItem {
  id: string;
  patient: string;
  doctor: string;
  time: string;
  status: string;
}

export default function NursePage() {
  const [rows, setRows] = useState<QueueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/appointments").then((r) => r.json());
      const appts = (res.appointments ?? res ?? []) as QueueItem[];
      setRows(Array.isArray(appts) ? appts : []);
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
      const res = await fetch("/api/vitals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patient: f.get("patient"),
          bloodPressure: f.get("bloodPressure"),
          temperature: f.get("temperature"),
          pulse: f.get("pulse"),
          weight: f.get("weight"),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setToast(data.error ?? "Failed");
        return;
      }
      (e.target as HTMLFormElement).reset();
      setToast("Vitals recorded and sent to the doctor");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <Topbar crumb="Nurse" />
      <main className="mx-auto max-w-[1100px] px-4 py-7 md:px-9">
        <PageHeader
          title="Nurse — vital signs"
          subtitle="Call patient → record vitals → add nursing notes → send to doctor."
          badge={
            <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-600">
              {rows.length} in queue
            </span>
          }
        />
        <div className="grid gap-4 lg:grid-cols-[1.6fr_1fr]">
          <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 p-4">
              <h2 className="text-[13px] font-bold text-slate-700">Patient queue</h2>
              <p className="text-[11px] text-slate-500">Waiting to be seen by the nurse.</p>
            </div>
            {loading ? (
              <EmptyState message="Loading queue…" />
            ) : rows.length === 0 ? (
              <EmptyState message="No patients in the queue." />
            ) : (
              <div className="divide-y divide-slate-100">
                {rows.map((a, i) => (
                  <div key={a.id} className="flex items-center gap-3 p-4">
                    <Avatar name={a.patient} index={i} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13px] font-semibold text-slate-700">
                        {a.patient} <span className="font-normal text-slate-400">→ {a.doctor}</span>
                      </p>
                      <p className="text-[11px] text-slate-500">{a.time}</p>
                    </div>
                    <StatusPill status={a.status} />
                  </div>
                ))}
              </div>
            )}
          </section>

          <form
            onSubmit={submit}
            className="h-fit rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <h2 className="text-[14px] font-bold text-slate-800">Record vitals</h2>
            <p className="mb-4 text-[11px] text-slate-500">
              Vitals are visible to the doctor immediately.
            </p>
            <div className="grid gap-3">
              <input name="patient" required placeholder="Patient name" className={inputClass} />
              <input name="bloodPressure" placeholder="Blood pressure (e.g. 120/80)" className={inputClass} />
              <div className="grid grid-cols-2 gap-3">
                <input name="temperature" type="number" step="0.1" placeholder="Temp °C" className={inputClass} />
                <input name="pulse" type="number" placeholder="Pulse bpm" className={inputClass} />
              </div>
              <input name="weight" type="number" step="0.1" placeholder="Weight kg" className={inputClass} />
              <button
                disabled={saving}
                className="h-10 rounded-lg bg-[#25a67f] text-[13px] font-bold text-white hover:bg-[#218f6d] disabled:opacity-60"
              >
                {saving ? "Saving…" : "Save vitals"}
              </button>
            </div>
          </form>
        </div>
      </main>
      <Toast message={toast} />
    </>
  );
}
