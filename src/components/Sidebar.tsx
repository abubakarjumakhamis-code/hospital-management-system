"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

const workspaceNav = [
  { href: "/dashboard", label: "Overview", count: null, roles: null },
  { href: "/dashboard/patients", label: "Patients", count: null, roles: null },
  { href: "/dashboard/appointments", label: "Appointments", count: null, roles: ["ADMIN", "DOCTOR", "RECEPTIONIST"] },
  { href: "/dashboard/doctors", label: "Care team", count: null, roles: ["ADMIN", "DOCTOR"] },
  { href: "/dashboard/departments", label: "Departments", count: null, roles: ["ADMIN"] },
  { href: "/dashboard/nurse", label: "Nurse vitals", count: null, roles: ["ADMIN", "NURSE"] },
  { href: "/dashboard/consultation", label: "Consultations", count: null, roles: ["ADMIN", "DOCTOR"] },
  { href: "/dashboard/emergency", label: "Emergency", count: null, roles: ["ADMIN", "DOCTOR", "NURSE"] },
  { href: "/dashboard/lab", label: "Lab", count: null, roles: ["ADMIN", "LAB", "DOCTOR"] },
  { href: "/dashboard/pharmacy", label: "Pharmacy", count: null, roles: ["ADMIN", "PHARMACIST"] },
  { href: "/dashboard/billing", label: "Billing", count: null, roles: ["ADMIN", "RECEPTIONIST"] },
  { href: "/dashboard/admissions", label: "Admissions", count: null, roles: ["ADMIN", "NURSE", "RECEPTIONIST"] },
];

const managementNav = [
  { href: "/dashboard/users", label: "Staff & roles", roles: ["ADMIN"] },
  { href: "/dashboard/location", label: "Location", roles: null },
  { href: "/visit", label: "Patient visit", roles: ["ADMIN", "RECEPTIONIST", "NURSE"] },
  { href: "/dashboard/reports", label: "Reports", roles: ["ADMIN", "DOCTOR"] },
  { href: "/dashboard/settings", label: "Settings", roles: ["ADMIN"] },
];

function isActive(pathname: string, href: string) {
  if (href === "/dashboard") return pathname === "/dashboard";
  return pathname.startsWith(href);
}

export default function Sidebar() {
  const pathname = usePathname();
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

  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-[246px] flex-col bg-[#18263a] px-4 py-7 text-slate-300 md:flex">
      <Link href="/dashboard" className="mb-10 ml-2 flex items-center gap-3 text-white">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#3cbd95] text-xl font-bold">
          +
        </span>
        <span className="flex flex-col leading-tight">
          <strong className="text-[17px] font-extrabold tracking-tight">
            northstar
          </strong>
          <small className="text-[8px] font-bold tracking-[1.45px] text-slate-400">
            HEALTH SYSTEM
          </small>
        </span>
      </Link>

      <p className="mb-3 ml-3 text-[9px] font-bold tracking-[1.55px] text-slate-500">
        WORKSPACE
      </p>
      <nav className="grid gap-1.5">
        {workspaceNav.filter((i) => !i.roles || (me && i.roles.includes(me.role))).map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex min-h-[43px] items-center gap-3 rounded-lg px-3 text-[12px] font-medium transition ${
              isActive(pathname, item.href)
                ? "bg-[#2b3c53] text-white shadow-[inset_3px_0_#45c89c]"
                : "text-slate-300 hover:bg-[#23344c] hover:text-white"
            }`}
          >
            <span className="h-2 w-2 rounded-full bg-current opacity-60" />
            {item.label}
            {item.count && (
              <span className="ml-auto text-[10px] text-slate-500">
                {item.count}
              </span>
            )}
          </Link>
        ))}
      </nav>

      <p className="mb-3 ml-3 mt-8 text-[9px] font-bold tracking-[1.55px] text-slate-500">
        MANAGEMENT
      </p>
      <nav className="grid gap-1.5">
        {managementNav.filter((i) => !i.roles || (me && i.roles.includes(me.role))).map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex min-h-[43px] items-center gap-3 rounded-lg px-3 text-[12px] font-medium transition ${
              isActive(pathname, item.href)
                ? "bg-[#2b3c53] text-white shadow-[inset_3px_0_#45c89c]"
                : "text-slate-300 hover:bg-[#23344c] hover:text-white"
            }`}
          >
            <span className="h-2 w-2 rounded-full bg-current opacity-60" />
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="mt-auto">
        <div className="mb-4 grid gap-2 rounded-xl border border-[#34455b] bg-[#202f44] p-4">
          <span className="grid h-6 w-6 place-items-center rounded-lg border border-slate-500 text-[13px] text-slate-300">
            ?
          </span>
          <strong className="text-[12px] text-slate-100">Need a hand?</strong>
          <span className="text-[10px] leading-relaxed text-slate-400">
            Our support team is always here to help.
          </span>
          <a
            href="mailto:support@example.com"
            className="text-[10px] font-bold text-[#61d2ab]"
          >
            Get in touch ↗
          </a>
        </div>
        <div className="flex items-center gap-2.5 border-t border-[#344258] pt-3 text-white">
          {me?.photoUrl ? (
            <img src={me.photoUrl} alt="Your photo" className="h-8 w-8 rounded-full object-cover" />
          ) : (
            <span className="grid h-8 w-8 place-items-center rounded-full bg-indigo-100 text-[10px] font-bold text-indigo-800">
              {me ? me.name.split(/\s+/).map((p) => p[0]).slice(0, 2).join("").toUpperCase() : "?"}
            </span>
          )}
          <span className="grid">
            <strong className="text-[11px]">{me?.name ?? "—"}</strong>
            <small className="text-[9px] text-slate-400">{me?.role ?? ""}</small>
          </span>
          <button
            onClick={logout}
            className="ml-auto rounded-lg border border-[#34455b] px-2 py-1 text-[9px] font-bold text-slate-300 hover:bg-[#23344c]"
          >
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
}
