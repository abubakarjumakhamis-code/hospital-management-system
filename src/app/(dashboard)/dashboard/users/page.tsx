"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import { useEffect, useState } from "react";
import Topbar from "@/components/Topbar";
import { Avatar, EmptyState, PageHeader, Toast, inputClass } from "@/components/ui";

const ROLES = ["ADMIN", "DOCTOR", "NURSE", "RECEPTIONIST", "PHARMACIST", "LAB", "PATIENT"];

const roleTone: Record<string, string> = {
  ADMIN: "bg-violet-50 text-violet-700",
  DOCTOR: "bg-sky-50 text-sky-700",
  NURSE: "bg-emerald-50 text-emerald-700",
  RECEPTIONIST: "bg-amber-50 text-amber-700",
  PHARMACIST: "bg-fuchsia-50 text-fuchsia-700",
  LAB: "bg-cyan-50 text-cyan-700",
  PATIENT: "bg-slate-100 text-slate-600",
};

interface Staff {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function UsersPage() {
  const [rows, setRows] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/users").then((r) => r.json());
      setRows(res.users ?? []);
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
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: f.get("name"),
          email: f.get("email"),
          password: f.get("password"),
          role: f.get("role"),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setToast(data.error ?? "Failed");
        return;
      }
      (e.target as HTMLFormElement).reset();
      await load();
      setToast("Staff account created");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <Topbar crumb="Staff" />
      <main className="mx-auto max-w-[1100px] px-4 py-7 md:px-9">
        <PageHeader
          title="Staff & roles"
          subtitle="Admin manages Doctor, Nurse, Receptionist, Pharmacist and Lab accounts."
          badge={
            <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-600">
              {rows.length} accounts
            </span>
          }
        />
        <div className="grid gap-4 lg:grid-cols-[1.6fr_1fr]">
          <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 p-4">
              <h2 className="text-[13px] font-bold text-slate-700">Team accounts</h2>
              <p className="text-[11px] text-slate-500">Role-based access across the system.</p>
            </div>
            {loading ? (
              <EmptyState message="Loading accounts…" />
            ) : rows.length === 0 ? (
              <EmptyState message="No staff accounts." />
            ) : (
              <div className="divide-y divide-slate-100">
                {rows.map((u, i) => (
                  <div key={u.id} className="flex items-center gap-3 p-4">
                    <Avatar name={u.name} index={i} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13px] font-semibold text-slate-700">{u.name}</p>
                      <p className="truncate text-[11px] text-slate-500">{u.email}</p>
                    </div>
                    <span
                      className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                        roleTone[u.role] ?? "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {u.role}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>

          <form
            onSubmit={submit}
            className="h-fit rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <h2 className="text-[14px] font-bold text-slate-800">Add staff member</h2>
            <p className="mb-4 text-[11px] text-slate-500">Passwords are hashed before saving.</p>
            <div className="grid gap-3">
              <input name="name" required placeholder="Full name" className={inputClass} />
              <input name="email" required type="email" placeholder="Email" className={inputClass} />
              <input name="password" required type="password" minLength={6} placeholder="Password (6+)" className={inputClass} />
              <select name="role" className={inputClass} defaultValue="DOCTOR">
                {ROLES.map((r) => (
                  <option key={r}>{r}</option>
                ))}
              </select>
              <button
                disabled={saving}
                className="h-10 rounded-lg bg-[#25a67f] text-[13px] font-bold text-white hover:bg-[#218f6d] disabled:opacity-60"
              >
                {saving ? "Creating…" : "Create account"}
              </button>
            </div>
          </form>
        </div>
      </main>
      <Toast message={toast} />
    </>
  );
}
