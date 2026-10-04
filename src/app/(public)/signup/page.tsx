"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const roles = ["PATIENT", "DOCTOR", "NURSE", "RECEPTIONIST", "PHARMACIST", "LAB", "ADMIN"];

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "PATIENT",
    age: "",
    gender: "Female",
    phone: "",
    department: "General Medicine",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function set(key: string, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Signup failed.");
        return;
      }
      router.push(data.user.role === "PATIENT" ? "/portal" : "/dashboard");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto grid max-w-6xl place-items-center px-4 py-16">
      <form
        onSubmit={submit}
        className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm"
      >
        <h1 className="text-2xl font-extrabold text-slate-800">Create your account</h1>
        <p className="mt-1 text-[13px] text-slate-500">
          Join Northstar Health as a patient or staff member.
        </p>
        <div className="mt-6 grid gap-4">
          <label className="text-[12px] font-semibold text-slate-600">
            Full name
            <input required value={form.name} onChange={(e) => set("name", e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-[13px]" />
          </label>
          <label className="text-[12px] font-semibold text-slate-600">
            Email
            <input required type="email" value={form.email} onChange={(e) => set("email", e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-[13px]" />
          </label>
          <label className="text-[12px] font-semibold text-slate-600">
            Password
            <input required type="password" minLength={6} value={form.password} onChange={(e) => set("password", e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-[13px]" />
          </label>
          <label className="text-[12px] font-semibold text-slate-600">
            I am a...
            <select value={form.role} onChange={(e) => set("role", e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-[13px]">
              {roles.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </label>
          {form.role === "PATIENT" && (
            <div className="grid grid-cols-2 gap-4">
              <label className="text-[12px] font-semibold text-slate-600">
                Age
                <input type="number" value={form.age} onChange={(e) => set("age", e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-[13px]" />
              </label>
              <label className="text-[12px] font-semibold text-slate-600">
                Gender
                <select value={form.gender} onChange={(e) => set("gender", e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-[13px]">
                  <option>Female</option><option>Male</option><option>Other</option>
                </select>
              </label>
              <label className="text-[12px] font-semibold text-slate-600">
                Phone
                <input value={form.phone} onChange={(e) => set("phone", e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-[13px]" />
              </label>
              <label className="text-[12px] font-semibold text-slate-600">
                Department
                <select value={form.department} onChange={(e) => set("department", e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-[13px]">
                  <option>Cardiology</option>
                  <option>General Medicine</option>
                  <option>Neurology</option>
                  <option>Pediatrics</option>
                </select>
              </label>
            </div>
          )}
        </div>
        {error && <p className="mt-4 text-[12px] font-semibold text-red-600">{error}</p>}
        <button disabled={loading}
          className="mt-6 w-full rounded-xl bg-[#3cbd95] py-3 text-[13px] font-bold text-white disabled:opacity-60">
          {loading ? "Creating account..." : "Create account"}
        </button>
        <p className="mt-4 text-center text-[12px] text-slate-500">
          Already have one?{" "}
          <Link href="/login" className="font-bold text-[#2f9e78]">Sign in</Link>
        </p>
      </form>
    </main>
  );
}
