"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Login failed.");
        return;
      }
      const next = searchParams.get("next");
      if (next) {
        router.push(next);
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
        <h1 className="text-2xl font-extrabold text-slate-800">Welcome back</h1>
        <p className="mt-1 text-[13px] text-slate-500">
          Sign in to your Northstar Health account.
        </p>
        <label className="mt-6 block text-[12px] font-semibold text-slate-600">
          Email
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            required
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-[13px] outline-none focus:border-[#3cbd95]"
            placeholder="you@example.com"
          />
        </label>
        <label className="mt-4 block text-[12px] font-semibold text-slate-600">
          Password
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            required
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-[13px] outline-none focus:border-[#3cbd95]"
            placeholder="••••••••"
          />
        </label>
        {error && <p className="mt-4 text-[12px] font-semibold text-red-600">{error}</p>}
        <button
          disabled={loading}
          className="mt-6 w-full rounded-xl bg-[#18263a] py-3 text-[13px] font-bold text-white disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
        <p className="mt-4 text-center text-[12px] text-slate-500">
          No account?{" "}
          <Link href="/signup" className="font-bold text-[#2f9e78]">
            Create one
          </Link>{" "}
          · <Link href="/" className="font-bold text-slate-600">Home</Link>
        </p>
      </form>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
