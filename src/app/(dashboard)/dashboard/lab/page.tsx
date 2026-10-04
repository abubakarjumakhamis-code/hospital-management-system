"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import { useEffect, useState } from "react";
import Topbar from "@/components/Topbar";
import StatusPill, { Avatar, EmptyState, PageHeader, Toast, inputClass } from "@/components/ui";

interface LabRequest {
  id: string;
  patient: string;
  testName: string;
  status: string;
  result?: string | null;
}

export default function LabPage() {
  const [rows, setRows] = useState<LabRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/lab").then((r) => r.json());
      setRows(res.requests ?? []);
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
      const res = await fetch("/api/lab", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ patient: f.get("patient"), testName: f.get("testName") }),
      });
      const data = await res.json();
      if (!res.ok) {
        setToast(data.error ?? "Failed");
        return;
      }
      (e.target as HTMLFormElement).reset();
      await load();
      setToast("Lab request created");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <Topbar crumb="Laboratory" />
      <main className="mx-auto max-w-[1100px] px-4 py-7 md:px-9">
        <PageHeader
          title="Laboratory"
          subtitle="Doctor request → sample collected → test performed → results entered."
          badge={
            <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-600">
              {rows.length} requests
            </span>
          }
        />
        <div className="grid gap-4 lg:grid-cols-[1.6fr_1fr]">
          <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 p-4">
              <h2 className="text-[13px] font-bold text-slate-700">Test requests</h2>
              <p className="text-[11px] text-slate-500">Queue of laboratory work.</p>
            </div>
            {loading ? (
              <EmptyState message="Loading requests…" />
            ) : rows.length === 0 ? (
              <EmptyState message="No lab requests yet." />
            ) : (
              <div className="divide-y divide-slate-100">
                {rows.map((r, i) => (
                  <div key={r.id} className="flex items-center gap-3 p-4">
                    <Avatar name={r.patient} index={i} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13px] font-semibold text-slate-700">
                        {r.testName}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {r.patient}
                        {r.result ? ` · ${r.result}` : ""}
                      </p>
                    </div>
                    <StatusPill status={r.status} />
                  </div>
                ))}
              </div>
            )}
          </section>

          <form
            onSubmit={submit}
            className="h-fit rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <h2 className="text-[14px] font-bold text-slate-800">New lab request</h2>
            <p className="mb-4 text-[11px] text-slate-500">
              Raised by the doctor during consultation.
            </p>
            <div className="grid gap-3">
              <input name="patient" required placeholder="Patient name" className={inputClass} />
              <input name="testName" required placeholder="Test name (e.g. Full blood count)" className={inputClass} />
              <button
                disabled={saving}
                className="h-10 rounded-lg bg-[#25a67f] text-[13px] font-bold text-white hover:bg-[#218f6d] disabled:opacity-60"
              >
                {saving ? "Creating…" : "Create request"}
              </button>
            </div>
          </form>
        </div>
      </main>
      <Toast message={toast} />
    </>
  );
}
