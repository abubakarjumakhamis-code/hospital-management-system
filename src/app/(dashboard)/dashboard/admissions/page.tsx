"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import { useEffect, useState } from "react";
import Topbar from "@/components/Topbar";
import StatusPill, { Avatar, EmptyState, PageHeader, Toast, inputClass } from "@/components/ui";

interface Admission {
  id: string;
  patient: string;
  bedNumber?: string | null;
  ward?: string | null;
  status: string;
}

export default function AdmissionsPage() {
  const [rows, setRows] = useState<Admission[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/admissions").then((r) => r.json());
      setRows(res.admissions ?? []);
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
      const res = await fetch("/api/admissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patient: f.get("patient"),
          bedNumber: f.get("bedNumber"),
          ward: f.get("ward"),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setToast(data.error ?? "Failed");
        return;
      }
      (e.target as HTMLFormElement).reset();
      await load();
      setToast("Admission recorded");
    } finally {
      setSaving(false);
    }
  }

  const active = rows.filter((r) => r.status?.toUpperCase() !== "DISCHARGED").length;

  return (
    <>
      <Topbar crumb="Admissions" />
      <main className="mx-auto max-w-[1100px] px-4 py-7 md:px-9">
        <PageHeader
          title="Admissions"
          subtitle="Admit → assign bed/ward → treatment → discharge."
          badge={
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-semibold text-emerald-700">
              {active} currently admitted
            </span>
          }
        />
        <div className="grid gap-4 lg:grid-cols-[1.6fr_1fr]">
          <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 p-4">
              <h2 className="text-[13px] font-bold text-slate-700">Inpatients</h2>
              <p className="text-[11px] text-slate-500">Ward and bed assignments.</p>
            </div>
            {loading ? (
              <EmptyState message="Loading admissions…" />
            ) : rows.length === 0 ? (
              <EmptyState message="No admissions yet." />
            ) : (
              <div className="divide-y divide-slate-100">
                {rows.map((a, i) => (
                  <div key={a.id} className="flex items-center gap-3 p-4">
                    <Avatar name={a.patient} index={i} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13px] font-semibold text-slate-700">{a.patient}</p>
                      <p className="text-[11px] text-slate-500">
                        {a.ward ?? "No ward"} · Bed {a.bedNumber ?? "—"}
                      </p>
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
            <h2 className="text-[14px] font-bold text-slate-800">New admission</h2>
            <p className="mb-4 text-[11px] text-slate-500">
              Recommended by a doctor after assessment.
            </p>
            <div className="grid gap-3">
              <input name="patient" required placeholder="Patient name" className={inputClass} />
              <input name="bedNumber" placeholder="Bed number (e.g. B-12)" className={inputClass} />
              <input name="ward" placeholder="Ward (e.g. Wards A & B)" className={inputClass} />
              <button
                disabled={saving}
                className="h-10 rounded-lg bg-[#25a67f] text-[13px] font-bold text-white hover:bg-[#218f6d] disabled:opacity-60"
              >
                {saving ? "Admitting…" : "Admit patient"}
              </button>
            </div>
          </form>
        </div>
      </main>
      <Toast message={toast} />
    </>
  );
}
