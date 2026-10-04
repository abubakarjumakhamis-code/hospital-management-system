import Topbar from "@/components/Topbar";
import { PageHeader } from "@/components/ui";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const ICONS = ["♡", "✳", "⌘", "✚", "◈", "⬡", "✦", "◐"];

export default async function DepartmentsPage() {
  const departments = await prisma.department.findMany({
    include: { _count: { select: { patients: true, doctors: true } } },
    orderBy: { name: "asc" },
  });

  return (
    <>
      <Topbar crumb="Departments" />
      <main className="mx-auto max-w-[1100px] px-4 py-7 md:px-9">
        <PageHeader
          title="Departments"
          subtitle="Hospital & department setup — the backbone of registration and appointments."
          badge={
            <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-600">
              {departments.length} departments
            </span>
          }
        />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {departments.map((d, i) => (
            <article
              key={d.id}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-50 text-[17px] text-emerald-700">
                {ICONS[i % ICONS.length]}
              </span>
              <p className="mt-3 text-[14px] font-bold text-slate-700">{d.name}</p>
              <div className="mt-3 flex gap-4 border-t border-slate-100 pt-3 text-[11px] text-slate-500">
                <span>
                  <strong className="text-slate-700">{d._count.patients}</strong> patients
                </span>
                <span>
                  <strong className="text-slate-700">{d._count.doctors}</strong> doctors
                </span>
              </div>
            </article>
          ))}
        </div>
      </main>
    </>
  );
}
