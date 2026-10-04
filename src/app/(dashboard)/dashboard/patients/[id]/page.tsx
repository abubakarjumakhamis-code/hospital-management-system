"use client";

import { use, useEffect, useState } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import Topbar from "@/components/Topbar";
import StatusPill, { Avatar, EmptyState } from "@/components/ui";

/* eslint-disable @typescript-eslint/no-explicit-any */

function money(value: any) {
  return new Intl.NumberFormat().format(Number(value || 0));
}

function Section({
  title,
  count,
  children,
}: {
  title: string;
  count: number;
  children: ReactNode;
}) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 p-4">
        <h2 className="text-[13px] font-bold text-slate-700">{title}</h2>
        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold text-slate-600">
          {count}
        </span>
      </div>
      <div className="p-4">{children}</div>
    </section>
  );
}

export default function PatientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [p, setP] = useState<any | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/patients/${id}`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("Not found"))))
      .then((d) => setP(d.patient))
      .catch(() => setError("Patient not found."));
  }, [id]);

  return (
    <>
      <Topbar crumb="Patient record" />
      <main className="mx-auto max-w-[1100px] px-4 py-7 md:px-9">
        <Link href="/dashboard/patients" className="text-[11px] font-bold text-slate-500 hover:text-slate-700">
          ← Back to patients
        </Link>

        {error && (
          <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-[12px] text-red-700">{error}</p>
        )}
        {!p && !error && <p className="mt-4 text-slate-400">Loading record…</p>}

        {p && (
          <div className="mt-4 grid gap-5">
            <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-center gap-4">
                <Avatar name={p.name} />
                <div>
                  <h1 className="text-xl font-bold text-slate-800">{p.name}</h1>
                  <p className="text-[12px] text-slate-500">
                    {p.patientCode} · {p.age}y · {p.gender} · {p.department}
                  </p>
                </div>
                <div className="ml-auto flex items-center gap-3">
                  <StatusPill status={p.status} />
                </div>
              </div>
              <dl className="mt-4 grid grid-cols-2 gap-3 border-t border-slate-100 pt-4 text-[12px] md:grid-cols-4">
                <div>
                  <dt className="text-slate-400">Phone</dt>
                  <dd className="font-semibold text-slate-700">{p.phone ?? "—"}</dd>
                </div>
                <div>
                  <dt className="text-slate-400">Registered</dt>
                  <dd className="font-semibold text-slate-700">
                    {p.registeredAt ? new Date(p.registeredAt).toLocaleDateString() : "—"}
                  </dd>
                </div>
                <div>
                  <dt className="text-slate-400">Visits</dt>
                  <dd className="font-semibold text-slate-700">{p.visits.length}</dd>
                </div>
                <div>
                  <dt className="text-slate-400">Appointments</dt>
                  <dd className="font-semibold text-slate-700">{p.appointments.length}</dd>
                </div>
              </dl>
            </section>

            <Section title="Visits & diagnoses" count={p.visits.length}>
              {p.visits.length === 0 ? (
                <EmptyState message="No recorded visits." />
              ) : (
                <div className="grid gap-3">
                  {p.visits.map((v: any) => (
                    <div key={v.id} className="rounded-lg border border-slate-100 bg-slate-50/60 p-3">
                      <div className="flex justify-between text-[12px]">
                        <strong className="text-slate-700">{v.reason ?? "Visit"}</strong>
                        <span className="text-slate-400">
                          {new Date(v.startedAt).toLocaleDateString()}
                        </span>
                      </div>
                      {v.diagnosis && <p className="text-[11px] text-slate-600">Diagnosis: {v.diagnosis}</p>}
                      {v.vitals?.length > 0 && (
                        <p className="text-[11px] text-slate-500">
                          BP {v.vitals[0].bloodPressure ?? "—"} · Temp {v.vitals[0].temperature ?? "—"}°C ·
                          Pulse {v.vitals[0].pulse ?? "—"} · Weight {v.vitals[0].weight ?? "—"}kg
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </Section>

            <div className="grid gap-5 md:grid-cols-2">
              <Section title="Appointments" count={p.appointments.length}>
                {p.appointments.length === 0 ? (
                  <EmptyState message="No appointments." />
                ) : (
                  <ul className="grid gap-2 text-[12px]">
                    {p.appointments.map((a: any) => (
                      <li key={a.id} className="flex items-center justify-between gap-3 border-b border-slate-100 pb-2 last:border-0">
                        <span className="min-w-0">
                          <strong className="block truncate text-slate-700">{a.doctor}</strong>
                          <span className="text-[11px] text-slate-500">{a.aptCode} · {a.time} · {a.department}</span>
                        </span>
                        <StatusPill status={a.status} />
                      </li>
                    ))}
                  </ul>
                )}
              </Section>

              <Section title="Laboratory results" count={p.labRequests.length}>
                {p.labRequests.length === 0 ? (
                  <EmptyState message="No lab results." />
                ) : (
                  <ul className="grid gap-2 text-[12px]">
                    {p.labRequests.map((x: any) => (
                      <li key={x.id} className="flex items-center justify-between gap-3 border-b border-slate-100 pb-2 last:border-0">
                        <span className="min-w-0">
                          <strong className="block truncate text-slate-700">{x.testName}</strong>
                          {x.result && <span className="text-[11px] text-slate-500">{x.result}</span>}
                        </span>
                        <StatusPill status={x.status} />
                      </li>
                    ))}
                  </ul>
                )}
              </Section>

              <Section title="Prescriptions" count={p.prescriptions.length}>
                {p.prescriptions.length === 0 ? (
                  <EmptyState message="No prescriptions." />
                ) : (
                  <ul className="grid gap-2 text-[12px]">
                    {p.prescriptions.map((x: any) => (
                      <li key={x.id} className="flex items-center justify-between gap-3 border-b border-slate-100 pb-2 last:border-0">
                        <span className="min-w-0">
                          <strong className="block truncate text-slate-700">
                            {x.medication} {x.dosage ?? ""}
                          </strong>
                          <span className="text-[11px] text-slate-500">{x.doctor}</span>
                        </span>
                        <StatusPill status={x.status} />
                      </li>
                    ))}
                  </ul>
                )}
              </Section>

              <Section title="Billing & admissions" count={p.bills.length + p.admissions.length}>
                {p.bills.length === 0 && p.admissions.length === 0 ? (
                  <EmptyState message="No billing or admissions." />
                ) : (
                  <ul className="grid gap-2 text-[12px]">
                    {p.bills.map((x: any) => (
                      <li key={x.id} className="flex items-center justify-between gap-3 border-b border-slate-100 pb-2 last:border-0">
                        <span className="text-slate-700">Bill · {money(x.amount)} TSh</span>
                        <StatusPill status={x.status} />
                      </li>
                    ))}
                    {p.admissions.map((x: any) => (
                      <li key={x.id} className="flex items-center justify-between gap-3 border-b border-slate-100 pb-2 last:border-0">
                        <span className="text-slate-700">
                          Ward {x.ward ?? "—"} · Bed {x.bedNumber ?? "—"}
                        </span>
                        <StatusPill status={x.status} />
                      </li>
                    ))}
                  </ul>
                )}
              </Section>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
