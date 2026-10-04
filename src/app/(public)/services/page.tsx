import Link from "next/link";
import { PUBLIC_SERVICES } from "@/lib/services";
import { SERVICE_KB } from "@/lib/ai";
import { HOSPITAL_LOCATION } from "@/lib/location";

export const metadata = {
  title: "Services | Northstar Health",
  description:
    "Explore every service at Northstar Health — registration, appointments, nursing, consultation, laboratory, pharmacy, billing, emergency and admissions.",
};

export default function ServicesPage() {
  return (
    <main>
      <section className="bg-gradient-to-br from-[#18263a] to-[#24435e] text-white">
        <div className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-20">
          <p className="text-[11px] font-bold tracking-[2px] text-[#61d2ab]">OUR SERVICES</p>
          <h1 className="mt-3 max-w-2xl text-3xl font-extrabold leading-tight md:text-4xl">
            Everything a patient needs, in one connected system.
          </h1>
          <p className="mt-4 max-w-2xl text-[14px] leading-relaxed text-slate-300">
            Each service below is part of one hospital workflow. Read the details
            or ask the assistant (bottom-right) to explain any of them.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 md:px-6">
        <div className="grid gap-5 md:grid-cols-2">
          {PUBLIC_SERVICES.map((s, i) => {
            const kb = SERVICE_KB.find((a) => a.id === s.id);
            return (
              <article
                key={s.id}
                id={s.id}
                className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-emerald-50 text-xl">
                    {s.icon}
                  </span>
                  <div>
                    <h2 className="text-[15px] font-bold text-slate-800">{s.title}</h2>
                    <p className="text-[11px] font-semibold text-[#2f9e78]">{s.swTitle}</p>
                  </div>
                  <span className="ml-auto text-[11px] font-bold text-slate-300">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <p className="mt-3 text-[12px] leading-relaxed text-slate-500">{s.desc}</p>
                <ul className="mt-4 grid gap-2 text-[12px] text-slate-600">
                  {s.points.map((p) => (
                    <li key={p} className="flex gap-2">
                      <span className="text-[#25a67f]">✓</span>
                      {p}
                    </li>
                  ))}
                </ul>
                {(kb?.actions?.length ?? 0) > 0 && (
                  <div className="mt-5 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
                    {kb!.actions.slice(0, 2).map((a) => (
                      <Link
                        key={a.href}
                        href={a.href}
                        className="rounded-lg bg-slate-100 px-3 py-1.5 text-[11px] font-bold text-slate-700 hover:bg-slate-200"
                      >
                        {a.label} →
                      </Link>
                    ))}
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-14 md:px-6">
          <div className="flex flex-col items-start gap-5 rounded-3xl border border-emerald-100 bg-emerald-50/60 p-8 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-lg font-extrabold text-slate-800">
                Need help choosing a service?
              </h2>
              <p className="mt-1 max-w-xl text-[13px] text-slate-600">
                Call reception on {HOSPITAL_LOCATION.phone} or ask the Northstar
                assistant — it explains each service in English or Kiswahili.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/contact" className="rounded-xl bg-[#25a67f] px-5 py-3 text-[13px] font-bold text-white hover:bg-[#218f6d]">
                Contact us
              </Link>
              <Link href="/visit" className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-[13px] font-bold text-slate-700">
                Plan your visit
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
