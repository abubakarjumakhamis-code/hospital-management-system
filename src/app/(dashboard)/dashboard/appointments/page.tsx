"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import { useEffect, useState } from "react";
import Topbar from "@/components/Topbar";
import StatusPill, { Avatar } from "@/components/ui";
import type { Appointment } from "@/lib/hospital";

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [departments, setDepartments] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState("");

  async function load() {
    setLoading(true);
    try {
      const [aRes, dRes] = await Promise.all([
        fetch("/api/appointments").then((r) => r.json()),
        fetch("/api/dashboard").then((r) => r.json()),
      ]);
      setAppointments(aRes.appointments ?? []);
      setDepartments(dRes.departments ?? []);
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

  async function book(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/appointments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        time: form.get("time"),
        patient: form.get("patient"),
        doctor: form.get("doctor"),
        department: form.get("department"),
      }),
    });
    const result = await res.json();
    if (!res.ok) {
      setToast(result.error ?? "Failed to book appointment");
      return;
    }
    (e.target as HTMLFormElement).reset();
    await load();
    setToast(`Booked ${result.appointment.id} — status Pending/Waiting`);
  }

  return (
    <>
      <Topbar crumb="Appointments" />
      <main className="mx-auto max-w-[1200px] px-4 py-7 md:px-9">
        <h1 className="text-2xl font-bold tracking-tight text-slate-800">
          Appointments
        </h1>
        <p className="mb-5 text-[11px] text-slate-500">
          Book → select department → doctor → date/time → confirm (Pending →
          Confirmed workflow).
        </p>

        <div className="grid gap-4 lg:grid-cols-[1.6fr_1fr]">
          <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 p-4">
              <h2 className="text-[13px] font-bold">Today&apos;s schedule</h2>
              <p className="text-[11px] text-slate-500">
                {appointments.length} consultations
              </p>
            </div>
            <div className="divide-y divide-slate-100">
              {loading ? (
                <p className="p-6 text-center text-slate-400">Loading…</p>
              ) : (
                appointments.map((a, i) => (
                  <div key={a.id} className="flex items-center gap-3 p-4">
                    <Avatar name={a.patient} index={i} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13px] font-semibold text-slate-700">
                        {a.patient}{" "}
                        <span className="font-normal text-slate-400">
                          · {a.time} · {a.id}
                        </span>
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {a.doctor} — {a.department}
                      </p>
                    </div>
                    <StatusPill status={a.status} />
                  </div>
                ))
              )}
            </div>
          </section>

          <section className="h-fit rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-[14px] font-bold">Book appointment</h2>
            <p className="mb-4 text-[11px] text-slate-500">
              Reception / patient portal booking.
            </p>
            <form onSubmit={book} className="grid gap-3">
              <input
                name="patient"
                required
                minLength={2}
                placeholder="Patient name"
                className="h-10 rounded-lg border border-slate-200 px-3 text-[13px] outline-none focus:border-emerald-500"
              />
              <input
                name="time"
                required
                placeholder="e.g. 02:30 PM"
                className="h-10 rounded-lg border border-slate-200 px-3 text-[13px] outline-none focus:border-emerald-500"
              />
              <select
                name="department"
                required
                defaultValue=""
                className="h-10 rounded-lg border border-slate-200 px-3 text-[13px] outline-none"
              >
                <option value="" disabled>
                  Department
                </option>
                {departments.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
              <input
                name="doctor"
                required
                placeholder="e.g. Dr. Sarah Chen"
                className="h-10 rounded-lg border border-slate-200 px-3 text-[13px] outline-none focus:border-emerald-500"
              />
              <button className="h-10 rounded-lg bg-[#25a67f] text-[13px] font-bold text-white hover:bg-[#218f6d]">
                Confirm booking
              </button>
            </form>
          </section>
        </div>
      </main>
      {toast && (
        <div className="fixed bottom-5 right-6 z-50 rounded-lg bg-[#25364c] px-4 py-2.5 text-[12px] text-white shadow-xl">
          {toast}
        </div>
      )}
    </>
  );
}
