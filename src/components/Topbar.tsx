"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

function formatToday() {
  try {
    return new Intl.DateTimeFormat(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date());
  } catch {
    return "Today";
  }
}

export default function Topbar({ crumb }: { crumb: string }) {
  const [today] = useState(formatToday);
  const router = useRouter();
  const [me, setMe] = useState<{ name: string; role: string; photoUrl?: string | null } | null>(null);

  useEffect(() => {
    function load() {
      fetch("/api/auth/me")
        .then((r) => (r.ok ? r.json() : null))
        .then((d) => setMe(d?.user ?? null))
        .catch(() => setMe(null));
    }
    load();
    window.addEventListener("profile-updated", load);
    return () => window.removeEventListener("profile-updated", load);
  }, []);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
  }

  const initials = me
    ? me.name.split(/\s+/).map((p) => p[0]).slice(0, 2).join("").toUpperCase()
    : "?";

  return (
    <header className="sticky top-0 z-10 flex h-[63px] items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur md:px-9">
      <div className="flex items-center gap-2.5 text-[11px] text-slate-500">
        <span>Workspace</span>
        <span className="text-slate-300">/</span>
        <strong className="font-semibold text-slate-700">{crumb}</strong>
      </div>
      <div className="flex items-center gap-4">
        <span className="hidden text-[11px] text-slate-500 sm:block">{today}</span>
        <button
          type="button"
          aria-label="Notifications"
          className="relative grid h-8 w-8 place-items-center rounded-lg hover:bg-slate-100"
        >
          <span className="text-[16px]">🔔</span>
          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full border border-white bg-red-400" />
        </button>
        <button
          type="button"
          onClick={logout}
          title={`Logout (${me?.name ?? ""})`}
          className="flex items-center gap-2 rounded-lg border border-slate-200 px-2 py-1 text-[11px] font-bold text-slate-600 hover:bg-slate-50"
        >
          {me?.photoUrl ? (
            <img src={me.photoUrl} alt="Your photo" className="h-[26px] w-[26px] rounded-full object-cover" />
          ) : (
            <span className="grid h-[26px] w-[26px] place-items-center rounded-full bg-indigo-100 text-[9px] font-bold text-indigo-800">
              {initials}
            </span>
          )}
          Logout
        </button>
      </div>
    </header>
  );
}
