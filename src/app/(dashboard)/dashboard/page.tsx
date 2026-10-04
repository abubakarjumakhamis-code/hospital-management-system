"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Topbar from "@/components/Topbar";
import StatusPill, { Avatar } from "@/components/ui";
import { useCurrentUser } from "@/lib/useCurrentUser";
import type { Appointment, Patient } from "@/lib/hospital";

interface DashboardResponse {
  stats: {
    totalPatients: number;
    admitted: number;
    appointmentsToday: number;
    departments: number;
    bedOccupancy: number;
  };
  appointments: Appointment[];
  patients: Patient[];
  departments: string[];
}

const sparkBars = {
  purple: [27, 43, 36, 52, 45, 72, 63, 88, 78, 100],
  green: [58, 42, 60, 48, 70, 55, 80, 66, 90, 82],
  orange: [34, 60, 46, 75, 57, 82, 68, 100, 72, 90],
};

function Sparkline({ values, color }: { values: number[]; color: string }) {
  return (
    <div className="absolute inset-x-4 bottom-3 flex h-[22px] items-end gap-1 opacity-90">
      {values.map((v, i) => (
        <i
          key={i}
          style={{ height: `${v}%` }}
          className={`flex-1 rounded-t ${color}`}
        />
      ))}
    </div>
  );
}

export default function OverviewPage() {
  const { user: me } = useCurrentUser();
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [allPatients, setAllPatients] = useState<Patient[]>([]);
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [toast, setToast] = useState("");

  const load = useCallback(async () => {
    try {
      const [dashRes, patRes] = await Promise.all([
        fetch("/api/dashboard").then((r) => r.json()),
        fetch("/api/patients").then((r) => r.json()),
      ]);
      setData(dashRes);
      setAllPatients(patRes.patients ?? []);
    } catch {
      setError("Could not load dashboard data.");
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 2800);
    return () => clearTimeout(t);
  }, [toast]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return allPatients.slice(0, 5);
    return allPatients
      .filter((p) =>
        [p.name, p.id, p.department, p.status].some((v) =>
          v.toLowerCase().includes(q),
        ),
      )
      .slice(0, 8);
  }, [allPatients, query]);

  async function createPatient(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setFormError("");
    const form = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/patients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.get("name"),
          age: form.get("age"),
          gender: form.get("gender"),
          department: form.get("department"),
        }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error ?? "Could not create patient.");
      setShowModal(false);
      (e.target as HTMLFormElement).reset();
      await load();
      setToast("Patient record created successfully.");
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Request failed.");
    } finally {
      setSaving(false);
    }
  }

  const stats = data?.stats;

  return (
    <>
      <Topbar crumb="Overview" />
      <main className="mx-auto max-w-[1560px] px-4 py-7 md:px-9">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <p className="mb-2 flex items-center gap-2 text-[9px] font-bold tracking-[1.15px] text-slate-500">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_0_3px_#e3f6ef]" />
              TODAY
            </p>
            <h1 className="text-[clamp(22px,2.2vw,29px)] font-bold tracking-tight text-slate-800">
              Good day, {me?.name?.split(" ")[0] ?? "there"}{" "}
              <span className="text-amber-500">✳</span>
            </h1>
            <p className="mt-1 text-[11px] text-slate-500">
              {me ? `Signed in as ${me.role}. Mungu akubariki.` : "Here's what's happening across your hospital today."}
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex min-h-[36px] items-center gap-2 rounded-lg bg-[#25a67f] px-3.5 text-[10px] font-bold text-white shadow hover:bg-[#218f6d]"
          >
            <span className="text-[17px] leading-none">+</span> Add new patient
          </button>
        </div>

        {error && (
          <p className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-[12px] text-red-700">
            {error}
          </p>
        )}

        <section className="mb-4 grid gap-3.5 sm:grid-cols-2 xl:grid-cols-4">
          <article className="relative min-h-[139px] overflow-hidden rounded-xl border border-slate-200 bg-white p-4 pb-10 shadow-sm">
            <div className="flex items-center justify-between text-[10px] text-slate-500">
              <span>Total patients</span>
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-violet-100 text-violet-700">
                ◉
              </span>
            </div>
            <div className="mt-1 text-[27px] font-bold text-slate-800">
              {stats?.totalPatients ?? "—"}
            </div>
            <div className="mt-1 flex gap-1.5 text-[9px] text-slate-500">
              <span className="font-bold text-emerald-600">↗ 8.2%</span>
              <span>vs. last month</span>
            </div>
            <Sparkline values={sparkBars.purple} color="bg-violet-200" />
          </article>

          <article className="relative min-h-[139px] overflow-hidden rounded-xl border border-slate-200 bg-white p-4 pb-10 shadow-sm">
            <div className="flex items-center justify-between text-[10px] text-slate-500">
              <span>Currently admitted</span>
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-100 text-emerald-700">
                ▣
              </span>
            </div>
            <div className="mt-1 text-[27px] font-bold text-slate-800">
              {stats?.admitted ?? "—"}
            </div>
            <div className="mt-1 flex gap-1.5 text-[9px] text-slate-500">
              <span className="text-slate-600">Inpatient care</span>
              <span className="text-slate-400">Across all wards</span>
            </div>
            <Sparkline values={sparkBars.green} color="bg-emerald-200" />
          </article>

          <article className="relative min-h-[139px] overflow-hidden rounded-xl border border-slate-200 bg-white p-4 pb-10 shadow-sm">
            <div className="flex items-center justify-between text-[10px] text-slate-500">
              <span>Appointments today</span>
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-orange-100 text-orange-700">
                ▦
              </span>
            </div>
            <div className="mt-1 text-[27px] font-bold text-slate-800">
              {stats?.appointmentsToday ?? "—"}
            </div>
            <div className="mt-1 flex gap-1.5 text-[9px] text-slate-500">
              <span className="text-slate-600">On the schedule</span>
              <span className="text-slate-400">Next at 9:00 AM</span>
            </div>
            <Sparkline values={sparkBars.orange} color="bg-orange-200" />
          </article>

          <article className="relative min-h-[139px] overflow-hidden rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between text-[10px] text-slate-500">
              <span>Bed occupancy</span>
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-sky-100 text-sky-700">
                ▤
              </span>
            </div>
            <div className="mt-1 text-[27px] font-bold text-slate-800">
              {stats?.bedOccupancy ?? "—"}
              <small className="pl-1 text-sm font-medium text-slate-400">%</small>
            </div>
            <div className="mt-1 flex gap-1.5 text-[9px] text-slate-500">
              <span className="text-emerald-700">Within capacity</span>
              <span>Hospital-wide</span>
            </div>
            <div className="mt-4 h-[5px] overflow-hidden rounded bg-slate-100">
              <span
                style={{ width: `${stats?.bedOccupancy ?? 0}%` }}
                className="block h-full rounded bg-gradient-to-r from-emerald-400 to-emerald-600 transition-all"
              />
            </div>
          </article>
        </section>

        <div className="mb-4 grid gap-4 lg:grid-cols-[1.85fr_0.9fr]">
          <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between p-4">
              <div>
                <h2 className="text-[12px] font-bold text-slate-800">
                  Today&apos;s appointments
                </h2>
                <p className="text-[9px] text-slate-500">
                  Your upcoming consultations at a glance.
                </p>
              </div>
              <Link
                href="/dashboard/appointments"
                className="text-[9px] font-bold text-emerald-700"
              >
                View schedule →
              </Link>
            </div>
            <div className="table-scroll overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 text-[8px] tracking-wider text-slate-400">
                    <th className="h-8 px-4">TIME</th>
                    <th className="h-8 px-3">PATIENT</th>
                    <th className="h-8 px-3">DOCTOR</th>
                    <th className="h-8 px-3">DEPARTMENT</th>
                    <th className="h-8 px-3">STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {(data?.appointments ?? []).map((a, i) => (
                    <tr key={a.id} className="border-t border-slate-100">
                      <td className="px-4 py-3 text-[9px] font-semibold text-slate-600">
                        {a.time}
                      </td>
                      <td className="px-3 py-3">
                        <span className="flex items-center gap-2 text-[9px] text-slate-600">
                          <Avatar name={a.patient} index={i} />
                          {a.patient}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-[9px] text-slate-600">{a.doctor}</td>
                      <td className="px-3 py-3 text-[9px] text-slate-500">
                        {a.department}
                      </td>
                      <td className="px-3 py-3">
                        <StatusPill status={a.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex items-center gap-2 border-t border-slate-100 px-4 py-2.5 text-[8px] text-slate-500">
              <span>▦</span>
              <span>
                {data
                  ? `${data.appointments.length} consultations scheduled for today`
                  : "Loading…"}
              </span>
              <Link href="/dashboard/appointments" className="ml-auto font-semibold text-slate-600">
                Open calendar ↗
              </Link>
            </div>
          </section>

          <section className="flex flex-col rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between p-4 pb-2">
              <div>
                <h2 className="text-[12px] font-bold text-slate-800">Departments</h2>
                <p className="text-[9px] text-slate-500">Care across the hospital.</p>
              </div>
              <button className="text-slate-400">···</button>
            </div>
            <div className="flex-1 px-4">
              {(data?.departments ?? []).map((d, i) => {
                const count = allPatients.filter((p) => p.department === d).length;
                return (
                  <div
                    key={d}
                    className="grid min-h-[47px] grid-cols-[31px_1fr_auto] items-center gap-2 border-b border-slate-100 last:border-0"
                  >
                    <span className="grid h-[29px] w-[29px] place-items-center rounded-lg bg-slate-100 text-[13px]">
                      {["♡", "✳", "⌘", "✚"][i % 4]}
                    </span>
                    <span className="grid text-[9px] font-semibold text-slate-600">
                      {d}
                      <small className="font-normal text-slate-400">
                        Care department
                      </small>
                    </span>
                    <span className="text-[9px] font-bold text-slate-600">
                      {String(count).padStart(2, "0")}
                    </span>
                  </div>
                );
              })}
            </div>
            <Link
              href="/dashboard/departments"
              className="flex min-h-[37px] items-center justify-center border-t border-slate-100 text-[8px] font-bold text-emerald-700"
            >
              View all departments →
            </Link>
          </section>
        </div>

        <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-[12px] font-bold text-slate-800">
                Recently registered patients
              </h2>
              <p className="text-[9px] text-slate-500">
                A quick look at your most recent patient records.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <label className="flex h-8 w-[164px] items-center gap-2 rounded-lg border border-slate-200 px-2.5">
                <span className="text-slate-400">⌕</span>
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search patients"
                  className="w-full bg-transparent text-[9px] text-slate-600 outline-none"
                />
              </label>
              <Link
                href="/dashboard/patients"
                className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-[9px] font-semibold text-slate-600"
              >
                View all
              </Link>
            </div>
          </div>
          <div className="table-scroll overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 text-[8px] tracking-wider text-slate-400">
                  <th className="h-8 px-4">PATIENT</th>
                  <th className="h-8 px-3">PATIENT ID</th>
                  <th className="h-8 px-3">AGE / GENDER</th>
                  <th className="h-8 px-3">DEPARTMENT</th>
                  <th className="h-8 px-3">STATUS</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p, i) => (
                  <tr key={p.id} className="border-t border-slate-100">
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-2 text-[9px] font-semibold text-slate-600">
                        <Avatar name={p.name} index={i} />
                        {p.name}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-[8px] text-slate-500">{p.id}</td>
                    <td className="px-3 py-3 text-[9px] text-slate-500">
                      {p.age} / {p.gender}
                    </td>
                    <td className="px-3 py-3 text-[9px] text-slate-500">
                      {p.department}
                    </td>
                    <td className="px-3 py-3">
                      <StatusPill status={p.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between border-t border-slate-100 px-4 py-2.5 text-[8px] text-slate-500">
            <span>Showing {filtered.length} of {allPatients.length} patients</span>
          </div>
        </section>

        <footer className="flex justify-between py-3 text-[8px] text-slate-400">
          <span>© 2026 Northstar Health. Made for better care.</span>
          <span>● All systems operational</span>
        </footer>
      </main>

      {showModal && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-[#15233870] p-4 backdrop-blur-[3px]">
          <form
            onSubmit={createPatient}
            className="w-full max-w-[440px] rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl"
          >
            <div className="mb-5 flex justify-between gap-4">
              <div>
                <p className="mb-1 text-[9px] font-bold tracking-widest text-slate-400">
                  PATIENT RECORD
                </p>
                <h2 className="text-[19px] font-bold text-slate-800">
                  Add a new patient
                </h2>
                <p className="text-[10px] text-slate-500">
                  Enter the basic details to create a patient record.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="h-7 w-7 rounded-lg bg-slate-100 text-slate-500"
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <label className="mb-3.5 grid gap-1.5 text-[10px] font-semibold text-slate-600">
              Full name
              <input
                name="name"
                required
                minLength={2}
                maxLength={80}
                placeholder="e.g. Amara Johnson"
                className="h-[39px] rounded-lg border border-slate-200 px-3 text-[11px] outline-none focus:border-emerald-500"
              />
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="mb-3.5 grid gap-1.5 text-[10px] font-semibold text-slate-600">
                Age
                <input
                  name="age"
                  type="number"
                  min={0}
                  max={125}
                  required
                  placeholder="Age"
                  className="h-[39px] rounded-lg border border-slate-200 px-3 text-[11px] outline-none focus:border-emerald-500"
                />
              </label>
              <label className="mb-3.5 grid gap-1.5 text-[10px] font-semibold text-slate-600">
                Gender
                <select
                  name="gender"
                  required
                  className="h-[39px] rounded-lg border border-slate-200 px-3 text-[11px] outline-none focus:border-emerald-500"
                >
                  <option value="">Select</option>
                  <option>Female</option>
                  <option>Male</option>
                  <option>Other</option>
                </select>
              </label>
            </div>
            <label className="grid gap-1.5 text-[10px] font-semibold text-slate-600">
              Department
              <select
                name="department"
                required
                className="h-[39px] rounded-lg border border-slate-200 px-3 text-[11px] outline-none focus:border-emerald-500"
              >
                <option value="">Select department</option>
                {(data?.departments ?? []).map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </label>
            {formError && (
              <p className="mt-2 text-[10px] text-red-600">{formError}</p>
            )}
            <div className="mt-5 flex justify-end gap-2 border-t border-slate-100 pt-4">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="rounded-lg border border-slate-200 px-3 py-2 text-[10px] font-bold text-slate-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-[#25a67f] px-3 py-2 text-[10px] font-bold text-white disabled:opacity-60"
              >
                {saving ? "Saving…" : "Create patient"}
              </button>
            </div>
          </form>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-5 right-6 z-50 rounded-lg bg-[#25364c] px-4 py-2.5 text-[11px] text-white shadow-xl">
          {toast}
        </div>
      )}
    </>
  );
}
