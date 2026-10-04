import Topbar from "@/components/Topbar";
import StatusPill, { Avatar, PageHeader } from "@/components/ui";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function DoctorsPage() {
  const doctors = await prisma.doctor.findMany({
    include: { department: true },
    orderBy: { name: "asc" },
  });

  const available = doctors.filter((d) => d.available).length;

  return (
    <>
      <Topbar crumb="Care team" />
      <main className="mx-auto max-w-[1100px] px-4 py-7 md:px-9">
        <PageHeader
          title="Care team"
          subtitle="Doctors by department — feeds the consultation and queue workflow."
          badge={
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-semibold text-emerald-700">
              {available} available now
            </span>
          }
        />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {doctors.map((d, i) => (
            <article
              key={d.id}
              className="flex flex-col rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex items-center gap-3">
                <Avatar name={d.name} index={i} />
                <div className="min-w-0">
                  <p className="truncate text-[13px] font-bold text-slate-700">{d.name}</p>
                  <p className="truncate text-[11px] text-slate-500">{d.specialty}</p>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                <span className="rounded-lg bg-slate-100 px-2 py-1 text-[10px] font-semibold text-slate-600">
                  {d.department.name}
                </span>
                <StatusPill status={d.available ? "Available" : "Off duty"} />
              </div>
            </article>
          ))}
          {doctors.length === 0 && (
            <p className="col-span-full rounded-xl border border-slate-200 bg-white p-8 text-center text-[12px] text-slate-400">
              No doctors added yet.
            </p>
          )}
        </div>
      </main>
    </>
  );
}
