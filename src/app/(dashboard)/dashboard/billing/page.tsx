"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import { useEffect, useMemo, useState } from "react";
import Topbar from "@/components/Topbar";
import StatusPill, { EmptyState, PageHeader, Toast, inputClass } from "@/components/ui";

interface Bill {
  id: string;
  patient: string;
  amount: number;
  description?: string | null;
  status: string;
}

function money(value: number) {
  return new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 }).format(value);
}

export default function BillingPage() {
  const [rows, setRows] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/billing").then((r) => r.json());
      setRows(res.bills ?? []);
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

  const totals = useMemo(() => {
    const sum = (s: string) =>
      rows.filter((b) => b.status?.toUpperCase() === s).reduce((acc, b) => acc + Number(b.amount || 0), 0);
    const all = rows.reduce((acc, b) => acc + Number(b.amount || 0), 0);
    return { all, paid: sum("PAID"), pending: sum("PENDING"), partial: sum("PARTIAL") };
  }, [rows]);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    const f = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/billing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patient: f.get("patient"),
          amount: f.get("amount"),
          description: f.get("description"),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setToast(data.error ?? "Failed");
        return;
      }
      (e.target as HTMLFormElement).reset();
      await load();
      setToast("Bill created");
    } finally {
      setSaving(false);
    }
  }

  const cards = [
    { label: "Total billed", value: totals.all, tone: "text-slate-800" },
    { label: "Paid", value: totals.paid, tone: "text-emerald-700" },
    { label: "Pending", value: totals.pending, tone: "text-amber-700" },
    { label: "Partial", value: totals.partial, tone: "text-orange-700" },
  ];

  return (
    <>
      <Topbar crumb="Billing" />
      <main className="mx-auto max-w-[1100px] px-4 py-7 md:px-9">
        <PageHeader
          title="Billing"
          subtitle="Generate invoice → payment → mark PAID / PARTIAL / PENDING."
        />

        <section className="mb-4 grid gap-3.5 sm:grid-cols-2 xl:grid-cols-4">
          {cards.map((c) => (
            <article key={c.label} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-[10px] font-semibold text-slate-500">{c.label}</p>
              <p className={`mt-1 text-[22px] font-bold ${c.tone}`}>
                {money(c.value)} <small className="text-[11px] font-medium text-slate-400">TSh</small>
              </p>
            </article>
          ))}
        </section>

        <div className="grid gap-4 lg:grid-cols-[1.6fr_1fr]">
          <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 p-4">
              <h2 className="text-[13px] font-bold text-slate-700">Invoices</h2>
              <p className="text-[11px] text-slate-500">All bills and their payment status.</p>
            </div>
            {loading ? (
              <EmptyState message="Loading bills…" />
            ) : rows.length === 0 ? (
              <EmptyState message="No bills yet." />
            ) : (
              <div className="divide-y divide-slate-100">
                {rows.map((b) => (
                  <div key={b.id} className="flex items-center gap-3 p-4">
                    <span className="grid h-9 w-9 flex-none place-items-center rounded-lg bg-emerald-50 text-[13px] text-emerald-700">
                      ₵
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13px] font-semibold text-slate-700">
                        {b.patient} · {money(Number(b.amount || 0))} TSh
                      </p>
                      <p className="truncate text-[11px] text-slate-500">{b.description ?? "Services"}</p>
                    </div>
                    <StatusPill status={b.status} />
                  </div>
                ))}
              </div>
            )}
          </section>

          <form
            onSubmit={submit}
            className="h-fit rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <h2 className="text-[14px] font-bold text-slate-800">New invoice</h2>
            <p className="mb-4 text-[11px] text-slate-500">
              Add registration, consultation, lab or pharmacy charges.
            </p>
            <div className="grid gap-3">
              <input name="patient" required placeholder="Patient name" className={inputClass} />
              <input
                name="amount"
                type="number"
                step="0.01"
                min="0"
                required
                placeholder="Amount (TSh)"
                className={inputClass}
              />
              <input name="description" placeholder="Description (e.g. Consultation)" className={inputClass} />
              <button
                disabled={saving}
                className="h-10 rounded-lg bg-[#25a67f] text-[13px] font-bold text-white hover:bg-[#218f6d] disabled:opacity-60"
              >
                {saving ? "Creating…" : "Create bill"}
              </button>
            </div>
          </form>
        </div>
      </main>
      <Toast message={toast} />
    </>
  );
}
