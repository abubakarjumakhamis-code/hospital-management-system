"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useMemo, useState } from "react";
import Topbar from "@/components/Topbar";
import { EmptyState, PageHeader } from "@/components/ui";

interface ReportData {
  patients: number;
  appointments: number;
  admitted: number;
  bills: number;
  revenue: number;
  lab: number;
  prescriptions: number;
  departments: { name: string; count: number }[];
  appointmentStatus: Record<string, number>;
}

const EMPTY: ReportData = {
  patients: 0,
  appointments: 0,
  admitted: 0,
  bills: 0,
  revenue: 0,
  lab: 0,
  prescriptions: 0,
  departments: [],
  appointmentStatus: {},
};

export default function ReportsPage() {
  const [data, setData] = useState<ReportData>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const [dash, bills, lab, rx] = await Promise.all([
          fetch("/api/dashboard").then((r) => r.json()),
          fetch("/api/billing").then((r) => r.json()),
          fetch("/api/lab").then((r) => r.json()),
          fetch("/api/prescriptions").then((r) => r.json()),
        ]);

        const patients: any[] = dash.patients ?? [];
        const appointments: any[] = dash.appointments ?? [];
        const billsList: any[] = bills.bills ?? [];

        const deptCounts = new Map<string, number>();
        for (const d of dash.departments ?? []) deptCounts.set(d, 0);
        for (const p of patients) {
          deptCounts.set(p.department, (deptCounts.get(p.department) ?? 0) + 1);
        }

        const appointmentStatus: Record<string, number> = {};
        for (const a of appointments) {
          appointmentStatus[a.status] = (appointmentStatus[a.status] ?? 0) + 1;
        }

        setData({
          patients: dash.stats?.totalPatients ?? patients.length,
          appointments: appointments.length,
          admitted: dash.stats?.admitted ?? 0,
          bills: billsList.length,
          revenue: billsList.reduce((acc, b) => acc + Number(b.amount || 0), 0),
          lab: (lab.requests ?? []).length,
          prescriptions: (rx.prescriptions ?? []).length,
          departments: [...deptCounts.entries()]
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count),
          appointmentStatus,
        });
      } catch {
        setError("Could not load reports.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const cards = [
    { label: "Patients", value: data.patients, tone: "bg-violet-100 text-violet-700", icon: "◉" },
    { label: "Appointments", value: data.appointments, tone: "bg-orange-100 text-orange-700", icon: "▦" },
    { label: "Admitted", value: data.admitted, tone: "bg-emerald-100 text-emerald-700", icon: "▣" },
    { label: "Lab requests", value: data.lab, tone: "bg-cyan-100 text-cyan-700", icon: "⚗" },
    { label: "Prescriptions", value: data.prescriptions, tone: "bg-fuchsia-100 text-fuchsia-700", icon: "✚" },
    { label: "Invoices", value: data.bills, tone: "bg-sky-100 text-sky-700", icon: "▤" },
  ];

  const maxDept = Math.max(1, ...data.departments.map((d) => d.count));
  const statusEntries = useMemo(
    () => Object.entries(data.appointmentStatus).sort((a, b) => b[1] - a[1]),
    [data.appointmentStatus],
  );
  const maxStatus = Math.max(1, ...statusEntries.map(([, v]) => v));

  return (
    <>
      <Topbar crumb="Reports" />
      <main className="mx-auto max-w-[1200px] px-4 py-7 md:px-9">
        <PageHeader
          title="Reports & analytics"
          subtitle="Patient, appointment, laboratory, pharmacy and revenue overview."
          badge={
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-semibold text-emerald-700">
              Revenue: {new Intl.NumberFormat().format(data.revenue)} TSh
            </span>
          }
        />

        {error && (
          <p className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-[12px] text-red-700">{error}</p>
        )}

        <section className="mb-4 grid gap-3.5 sm:grid-cols-2 xl:grid-cols-3">
          {cards.map((c) => (
            <article key={c.label} className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <span className={`grid h-11 w-11 place-items-center rounded-xl text-[17px] ${c.tone}`}>
                {c.icon}
              </span>
              <div>
                <p className="text-[10px] font-semibold text-slate-500">{c.label}</p>
                <p className="text-[22px] font-bold text-slate-800">
                  {loading ? "—" : new Intl.NumberFormat().format(c.value)}
                </p>
              </div>
            </article>
          ))}
        </section>

        <div className="grid gap-4 lg:grid-cols-2">
          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-[13px] font-bold text-slate-800">Patients by department</h2>
            <p className="mb-4 text-[11px] text-slate-500">Distribution across the hospital.</p>
            {data.departments.length === 0 ? (
              <EmptyState message="No department data yet." />
            ) : (
              <div className="grid gap-3">
                {data.departments.map((d) => (
                  <div key={d.name}>
                    <div className="mb-1 flex justify-between text-[11px] text-slate-600">
                      <span className="font-semibold">{d.name}</span>
                      <span>{d.count}</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                      <span
                        className="block h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600"
                        style={{ width: `${(d.count / maxDept) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-[13px] font-bold text-slate-800">Appointments by status</h2>
            <p className="mb-4 text-[11px] text-slate-500">Live workflow pipeline.</p>
            {statusEntries.length === 0 ? (
              <EmptyState message="No appointments yet." />
            ) : (
              <div className="grid gap-3">
                {statusEntries.map(([status, count]) => (
                  <div key={status}>
                    <div className="mb-1 flex justify-between text-[11px] text-slate-600">
                      <span className="font-semibold">{status}</span>
                      <span>{count}</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                      <span
                        className="block h-full rounded-full bg-gradient-to-r from-sky-400 to-sky-600"
                        style={{ width: `${(count / maxStatus) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </>
  );
}
