"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Topbar from "@/components/Topbar";
import StatusPill, { Avatar } from "@/components/ui";
import type { Patient } from "@/lib/hospital";

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [departments, setDepartments] = useState<string[]>([]);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState("");

  async function load() {
    setLoading(true);
    try {
      const [pRes, dRes] = await Promise.all([
        fetch("/api/patients").then((r) => r.json()),
        fetch("/api/dashboard").then((r) => r.json()),
      ]);
      setPatients(pRes.patients ?? []);
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

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return patients.filter((p) => {
      const matchesQuery =
        !q ||
        [p.name, p.id, p.department, p.status].some((v) =>
          v.toLowerCase().includes(q),
        );
      const matchesStatus = statusFilter === "All" || p.status === statusFilter;
      return matchesQuery && matchesStatus;
    });
  }, [patients, query, statusFilter]);

  async function createPatient(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
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
    if (!res.ok) {
      setToast(result.error ?? "Failed to create patient");
      return;
    }
    (e.target as HTMLFormElement).reset();
    await load();
    setToast(`Created ${result.patient.id} — ${result.patient.name}`);
  }

  return (
    <>
      <Topbar crumb="Patients" />
      <main className="mx-auto max-w-[1200px] px-4 py-7 md:px-9">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-800">
              Patients
            </h1>
            <p className="text-[11px] text-slate-500">
              Register, search and manage patient records.
            </p>
          </div>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-600">
            {filtered.length} records
          </span>
        </div>

        <div className="mb-4 grid gap-4 lg:grid-cols-[1.6fr_1fr]">
          <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="mb-3 flex flex-wrap gap-2">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search name, ID, department…"
                className="h-9 flex-1 min-w-[200px] rounded-lg border border-slate-200 px-3 text-[12px] outline-none focus:border-emerald-500"
              />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-9 rounded-lg border border-slate-200 px-3 text-[12px] outline-none"
              >
                {["All", "Admitted", "Outpatient", "Discharged"].map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>
            <div className="table-scroll overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 text-[10px] text-slate-500">
                    <th className="px-3 py-2">PATIENT</th>
                    <th className="px-3 py-2">ID</th>
                    <th className="px-3 py-2">AGE/GENDER</th>
                    <th className="px-3 py-2">DEPT</th>
                    <th className="px-3 py-2">STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="px-3 py-8 text-center text-slate-400">
                        Loading…
                      </td>
                    </tr>
                  ) : filtered.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-3 py-8 text-center text-slate-400">
                        No patients match your search.
                      </td>
                    </tr>
                  ) : (
                    filtered.map((p, i) => (
                      <tr key={p.id} className="border-t border-slate-100">
                        <td className="px-3 py-2.5">
                          <span className="flex items-center gap-2 text-[12px] font-semibold text-slate-700">
                            <Avatar name={p.name} index={i} />
                            <Link href={`/dashboard/patients/${p.id}`} className="hover:underline">
                              {p.name}
                            </Link>
                          </span>
                        </td>
                        <td className="px-3 py-2.5 text-[11px] text-slate-500">{p.id}</td>
                        <td className="px-3 py-2.5 text-[11px] text-slate-500">
                          {p.age} / {p.gender}
                        </td>
                        <td className="px-3 py-2.5 text-[11px] text-slate-500">
                          {p.department}
                        </td>
                        <td className="px-3 py-2.5">
                          <StatusPill status={p.status} />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <section className="h-fit rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-[14px] font-bold text-slate-800">
              Register patient
            </h2>
            <p className="mb-4 text-[11px] text-slate-500">
              Follows Patient Registration workflow: search → register →
              generate ID → book appointment.
            </p>
            <form onSubmit={createPatient} className="grid gap-3">
              <input
                name="name"
                required
                minLength={2}
                placeholder="Full name"
                className="h-10 rounded-lg border border-slate-200 px-3 text-[13px] outline-none focus:border-emerald-500"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  name="age"
                  type="number"
                  min={0}
                  max={125}
                  required
                  placeholder="Age"
                  className="h-10 rounded-lg border border-slate-200 px-3 text-[13px] outline-none focus:border-emerald-500"
                />
                <select
                  name="gender"
                  required
                  className="h-10 rounded-lg border border-slate-200 px-3 text-[13px] outline-none"
                  defaultValue=""
                >
                  <option value="" disabled>
                    Gender
                  </option>
                  <option>Female</option>
                  <option>Male</option>
                  <option>Other</option>
                </select>
              </div>
              <select
                name="department"
                required
                className="h-10 rounded-lg border border-slate-200 px-3 text-[13px] outline-none"
                defaultValue=""
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
              <button className="h-10 rounded-lg bg-[#25a67f] text-[13px] font-bold text-white hover:bg-[#218f6d]">
                Create patient
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
