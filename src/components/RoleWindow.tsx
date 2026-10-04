"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCurrentUser } from "@/lib/useCurrentUser";

const PAGE_ROLES: Record<string, string[]> = {
  "/dashboard/users": ["ADMIN"],
  "/dashboard/departments": ["ADMIN"],
  "/dashboard/settings": ["ADMIN"],
  "/dashboard/billing": ["ADMIN", "RECEPTIONIST"],
  "/dashboard/reports": ["ADMIN", "DOCTOR"],
  "/dashboard/nurse": ["ADMIN", "NURSE"],
  "/dashboard/consultation": ["ADMIN", "DOCTOR"],
  "/dashboard/emergency": ["ADMIN", "DOCTOR", "NURSE"],
  "/dashboard/lab": ["ADMIN", "LAB", "DOCTOR"],
  "/dashboard/pharmacy": ["ADMIN", "PHARMACIST"],
  "/dashboard/admissions": ["ADMIN", "NURSE", "RECEPTIONIST"],
  "/dashboard/appointments": ["ADMIN", "DOCTOR", "RECEPTIONIST"],
  "/dashboard/doctors": ["ADMIN", "DOCTOR"],
};

export default function RoleWindow({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { user, loading } = useCurrentUser();

  const match = Object.keys(PAGE_ROLES).find((p) => pathname.startsWith(p));
  if (!match) return <>{children}</>;
  if (loading) return <p className="p-8 text-slate-400">Loading…</p>;
  if (user && !PAGE_ROLES[match].includes(user.role)) {
    return (
      <main className="mx-auto max-w-xl p-10 text-center">
        <h1 className="text-xl font-bold text-slate-800">Access restricted</h1>
        <p className="mt-2 text-[13px] text-slate-500">
          Ukurasa huu umefungwa kwa jukumu lako ({user.role}).
        </p>
        <Link href="/dashboard" className="mt-4 inline-block rounded-lg bg-[#25a67f] px-4 py-2 text-[12px] font-bold text-white">
          Back to overview
        </Link>
      </main>
    );
  }
  return <>{children}</>;
}
