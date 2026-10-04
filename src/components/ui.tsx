import type { ReactNode } from "react";

const tones: Record<string, string> = {
  admitted: "bg-emerald-50 text-emerald-700",
  outpatient: "bg-slate-100 text-slate-600",
  discharged: "bg-blue-50 text-blue-700",
  "checked-in": "bg-emerald-50 text-emerald-700",
  "in-progress": "bg-amber-50 text-amber-700",
  waiting: "bg-blue-50 text-blue-800",
  completed: "bg-emerald-50 text-emerald-700",
  cancelled: "bg-red-50 text-red-600",
  pending: "bg-amber-50 text-amber-700",
  requested: "bg-amber-50 text-amber-700",
  "sample-collected": "bg-sky-50 text-sky-700",
  dispensed: "bg-emerald-50 text-emerald-700",
  "out-of-stock": "bg-red-50 text-red-600",
  "in-stock": "bg-emerald-50 text-emerald-700",
  low: "bg-orange-50 text-orange-700",
  paid: "bg-emerald-50 text-emerald-700",
  partial: "bg-amber-50 text-amber-700",
  unpaid: "bg-red-50 text-red-600",
  available: "bg-emerald-50 text-emerald-700",
  occupied: "bg-red-50 text-red-600",
  active: "bg-emerald-50 text-emerald-700",
  inactive: "bg-slate-100 text-slate-600",
  stable: "bg-emerald-50 text-emerald-700",
  critical: "bg-red-50 text-red-600",
  confirmed: "bg-emerald-50 text-emerald-700",
};

const dots: Record<string, string> = {
  admitted: "bg-emerald-500",
  "checked-in": "bg-emerald-500",
  completed: "bg-emerald-500",
  "in-progress": "bg-amber-500",
  waiting: "bg-blue-400",
  outpatient: "bg-slate-400",
  discharged: "bg-blue-400",
  cancelled: "bg-red-400",
  pending: "bg-amber-500",
  requested: "bg-amber-500",
  "sample-collected": "bg-sky-500",
  dispensed: "bg-emerald-500",
  "out-of-stock": "bg-red-500",
  "in-stock": "bg-emerald-500",
  low: "bg-orange-500",
  paid: "bg-emerald-500",
  partial: "bg-amber-500",
  unpaid: "bg-red-500",
  available: "bg-emerald-500",
  occupied: "bg-red-500",
  active: "bg-emerald-500",
  inactive: "bg-slate-400",
  stable: "bg-emerald-500",
  critical: "bg-red-500",
  confirmed: "bg-emerald-500",
};

export default function StatusPill({ status }: { status: string }) {
  const key = status.toLowerCase().replaceAll(" ", "-");
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-[8px] font-semibold ${tones[key] ?? "bg-slate-100 text-slate-600"}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${dots[key] ?? "bg-slate-400"}`} />
      {status}
    </span>
  );
}

export function initials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();
}

const avatarTones = [
  "bg-violet-100 text-violet-700",
  "bg-emerald-100 text-emerald-700",
  "bg-orange-100 text-orange-700",
  "bg-blue-100 text-blue-700",
];

export function Avatar({ name, index = 0 }: { name: string; index?: number }) {
  return (
    <span
      aria-hidden
      className={`grid h-[25px] w-[25px] flex-none place-items-center rounded-lg text-[8px] font-bold ${avatarTones[index % avatarTones.length]}`}
    >
      {initials(name)}
    </span>
  );
}

export const inputClass =
  "h-10 w-full rounded-lg border border-slate-200 px-3 text-[13px] text-slate-700 outline-none transition focus:border-[#3cbd95] focus:ring-2 focus:ring-emerald-100";

export function PageHeader({
  title,
  subtitle,
  badge,
}: {
  title: string;
  subtitle?: string;
  badge?: ReactNode;
}) {
  return (
    <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-800">{title}</h1>
        {subtitle && <p className="mt-1 text-[11px] text-slate-500">{subtitle}</p>}
      </div>
      {badge}
    </div>
  );
}

export function Toast({ message }: { message: string }) {
  if (!message) return null;
  return (
    <div className="fixed bottom-5 right-6 z-[950] rounded-lg bg-[#25364c] px-4 py-2.5 text-[12px] text-white shadow-xl">
      {message}
    </div>
  );
}

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="grid place-items-center gap-1 py-10 text-center">
      <span className="grid h-10 w-10 place-items-center rounded-xl bg-slate-100 text-lg text-slate-400">
        ◌
      </span>
      <p className="text-[12px] text-slate-400">{message}</p>
    </div>
  );
}
