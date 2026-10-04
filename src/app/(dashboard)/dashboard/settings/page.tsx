"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import { useEffect, useState } from "react";
import Topbar from "@/components/Topbar";
import { PageHeader, Toast, inputClass } from "@/components/ui";
import { HOSPITAL_LOCATION } from "@/lib/location";

const STORAGE_KEY = "northstar.settings";

interface Settings {
  name: string;
  tagline: string;
  phone: string;
  emergencyPhone: string;
  email: string;
  notifyAppointments: boolean;
  notifyLowStock: boolean;
  notifyLabResults: boolean;
}

const DEFAULTS: Settings = {
  name: HOSPITAL_LOCATION.name,
  tagline: HOSPITAL_LOCATION.tagline,
  phone: HOSPITAL_LOCATION.phone,
  emergencyPhone: HOSPITAL_LOCATION.emergencyPhone,
  email: HOSPITAL_LOCATION.email,
  notifyAppointments: true,
  notifyLowStock: true,
  notifyLabResults: true,
};

export default function SettingsPage() {
  const [form, setForm] = useState<Settings>(DEFAULTS);
  const [toast, setToast] = useState("");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setForm({ ...DEFAULTS, ...JSON.parse(raw) });
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 2500);
    return () => clearTimeout(t);
  }, [toast]);

  function update<K extends keyof Settings>(key: K, value: Settings[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function save(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(form));
      setToast("Settings saved on this device");
    } catch {
      setToast("Could not save settings");
    }
  }

  const toggles: { key: keyof Settings; label: string; desc: string }[] = [
    { key: "notifyAppointments", label: "Appointment reminders", desc: "Notify staff when appointments are booked or confirmed." },
    { key: "notifyLowStock", label: "Low stock alerts", desc: "Alert the admin when pharmacy medicine is running out." },
    { key: "notifyLabResults", label: "Lab result ready", desc: "Notify the doctor when laboratory results are entered." },
  ];

  return (
    <>
      <Topbar crumb="Settings" />
      <main className="mx-auto max-w-[900px] px-4 py-7 md:px-9">
        <PageHeader
          title="Settings"
          subtitle="Hospital profile, contact details and notification preferences."
        />

        <form onSubmit={save} className="grid gap-4">
          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-[14px] font-bold text-slate-800">Hospital profile</h2>
            <p className="mb-4 text-[11px] text-slate-500">
              Shown across the public site, portal and reports.
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="grid gap-1.5 text-[11px] font-semibold text-slate-600">
                Hospital name
                <input value={form.name} onChange={(e) => update("name", e.target.value)} className={inputClass} />
              </label>
              <label className="grid gap-1.5 text-[11px] font-semibold text-slate-600">
                Tagline
                <input value={form.tagline} onChange={(e) => update("tagline", e.target.value)} className={inputClass} />
              </label>
              <label className="grid gap-1.5 text-[11px] font-semibold text-slate-600">
                Reception phone
                <input value={form.phone} onChange={(e) => update("phone", e.target.value)} className={inputClass} />
              </label>
              <label className="grid gap-1.5 text-[11px] font-semibold text-slate-600">
                Emergency phone
                <input value={form.emergencyPhone} onChange={(e) => update("emergencyPhone", e.target.value)} className={inputClass} />
              </label>
              <label className="grid gap-1.5 text-[11px] font-semibold text-slate-600 sm:col-span-2">
                Email
                <input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} className={inputClass} />
              </label>
            </div>
          </section>

          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-[14px] font-bold text-slate-800">Notifications</h2>
            <p className="mb-4 text-[11px] text-slate-500">Choose which alerts the system raises.</p>
            <div className="grid gap-3">
              {toggles.map((t) => (
                <label
                  key={t.key}
                  className="flex items-center justify-between gap-4 rounded-lg border border-slate-100 bg-slate-50/60 px-4 py-3"
                >
                  <span>
                    <strong className="block text-[12px] font-semibold text-slate-700">{t.label}</strong>
                    <span className="text-[11px] text-slate-500">{t.desc}</span>
                  </span>
                  <input
                    type="checkbox"
                    checked={Boolean(form[t.key])}
                    onChange={(e) => update(t.key, e.target.checked as Settings[typeof t.key])}
                    className="h-5 w-5 accent-[#25a67f]"
                  />
                </label>
              ))}
            </div>
          </section>

          <section className="rounded-xl border border-amber-200 bg-amber-50 p-5">
            <h2 className="text-[14px] font-bold text-amber-900">Security &amp; data</h2>
            <ul className="mt-2 grid gap-2 text-[12px] text-amber-800">
              <li>• Passwords are hashed before storage; sessions use secure cookies.</li>
              <li>• Role-based access limits each staff member to their workflow.</li>
              <li>• Replace the local database with managed Postgres and enable backups before real patient data.</li>
              <li>• Enable an audit trail for all clinical record changes.</li>
            </ul>
          </section>

          <div className="flex justify-end">
            <button className="h-11 rounded-xl bg-[#25a67f] px-6 text-[13px] font-bold text-white hover:bg-[#218f6d]">
              Save settings
            </button>
          </div>
        </form>
      </main>
      <Toast message={toast} />
    </>
  );
}
