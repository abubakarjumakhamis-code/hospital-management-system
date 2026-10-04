import Link from "next/link";
import { HOSPITAL_LOCATION } from "@/lib/location";
import { PUBLIC_SERVICES } from "@/lib/services";

const stats = [
  { value: "24/7", label: "Emergency care" },
  { value: "40+", label: "Care professionals" },
  { value: "8", label: "Clinical departments" },
  { value: "15 min", label: "Average triage" },
];

const workflow = [
  { step: "01", title: "Register", desc: "Reception creates or finds your patient record." },
  { step: "02", title: "Appointment", desc: "Book a department, doctor, date and time." },
  { step: "03", title: "Check-in & vitals", desc: "Queue number, then a nurse records your vitals." },
  { step: "04", title: "Consultation", desc: "The doctor reviews and treats, ordering lab or medicine." },
  { step: "05", title: "Lab & pharmacy", desc: "Tests and medicines flow through to your record." },
  { step: "06", title: "Billing & follow-up", desc: "Pay, get a receipt and book your next visit." },
];

export default function LandingPage() {
  return (
    <main>
      <section className="bg-gradient-to-br from-[#18263a] to-[#24435e] text-white">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-16 md:grid-cols-2 md:px-6 md:py-24">
          <div>
            <p className="mb-3 text-[11px] font-bold tracking-[2px] text-[#61d2ab]">
              {HOSPITAL_LOCATION.tagline.toUpperCase()}
            </p>
            <h1 className="text-4xl font-extrabold leading-tight md:text-5xl">
              Modern care, organized from registration to recovery.
            </h1>
            <p className="mt-4 max-w-lg text-[14px] leading-relaxed text-slate-300">
              {HOSPITAL_LOCATION.name} connects reception, nurses, doctors,
              laboratory, pharmacy and billing in one streamlined hospital
              management system — so patients get seen faster and staff work
              smarter.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/signup" className="rounded-xl bg-[#3cbd95] px-5 py-3 text-[13px] font-bold text-white hover:bg-[#35ad88]">
                Create patient account
              </Link>
              <Link href="/services" className="rounded-xl border border-white/20 px-5 py-3 text-[13px] font-bold text-white hover:bg-white/10">
                Explore services
              </Link>
              <Link href="/visit" className="rounded-xl border border-white/20 px-5 py-3 text-[13px] font-bold text-white hover:bg-white/10">
                Plan your visit
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 self-center">
            {stats.map((s) => (
              <div key={s.label} className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <strong className="block text-3xl font-extrabold text-[#61d2ab]">{s.value}</strong>
                <span className="text-[12px] text-slate-300">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="services" className="mx-auto max-w-6xl px-4 py-14 md:px-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-800">What we do</h2>
            <p className="mt-1 text-[13px] text-slate-500">
              Every department runs through one connected workflow.
            </p>
          </div>
          <Link href="/services" className="text-[12px] font-bold text-[#2f9e78]">
            View all services →
          </Link>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PUBLIC_SERVICES.map((s) => (
            <div key={s.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
              <span className="mb-3 grid h-9 w-9 place-items-center rounded-xl bg-emerald-50 text-lg">
                {s.icon}
              </span>
              <strong className="block text-[14px] font-bold text-slate-800">{s.title}</strong>
              <p className="mt-1 text-[12px] leading-relaxed text-slate-500">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-14 md:px-6">
          <h2 className="text-2xl font-extrabold text-slate-800">One journey, end to end</h2>
          <p className="mt-1 text-[13px] text-slate-500">
            From the front door to follow-up, every step is tracked.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {workflow.map((w) => (
              <div key={w.step} className="flex gap-3 rounded-2xl border border-slate-200 bg-[#f9fbfd] p-5">
                <span className="grid h-9 w-9 flex-none place-items-center rounded-xl bg-[#18263a] text-[11px] font-bold text-white">
                  {w.step}
                </span>
                <span>
                  <strong className="block text-[13px] font-bold text-slate-800">{w.title}</strong>
                  <span className="text-[12px] text-slate-500">{w.desc}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 md:px-6">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl bg-[#18263a] p-6 text-white">
            <strong className="block text-lg font-extrabold">For patients</strong>
            <p className="mt-2 text-[12px] leading-relaxed text-slate-300">
              Log in to view your profile, appointments, lab results,
              prescriptions, bills and discharge notes.
            </p>
            <Link href="/signup" className="mt-4 inline-block rounded-lg bg-[#3cbd95] px-4 py-2 text-[12px] font-bold">
              Open patient portal
            </Link>
          </div>
          <div className="rounded-2xl bg-[#18263a] p-6 text-white">
            <strong className="block text-lg font-extrabold">For staff</strong>
            <p className="mt-2 text-[12px] leading-relaxed text-slate-300">
              Doctors, nurses, receptionists, pharmacists and lab teams each
              get a focused workspace with live queues.
            </p>
            <Link href="/login" className="mt-4 inline-block rounded-lg bg-[#3cbd95] px-4 py-2 text-[12px] font-bold">
              Staff login
            </Link>
          </div>
          <div className="rounded-2xl bg-[#18263a] p-6 text-white">
            <strong className="block text-lg font-extrabold">Visiting us</strong>
            <p className="mt-2 text-[12px] leading-relaxed text-slate-300">
              Find our location on the map, opening hours and in-hospital
              wayfinding for first-time visitors.
            </p>
            <Link href="/visit" className="mt-4 inline-block rounded-lg bg-[#3cbd95] px-4 py-2 text-[12px] font-bold">
              Directions
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 md:px-6">
        <div className="flex flex-col items-start gap-5 rounded-3xl border border-emerald-100 bg-emerald-50/60 p-8 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-4">
            <span className="grid h-12 w-12 flex-none place-items-center rounded-2xl bg-[#25a67f] text-2xl text-white">
              ✦
            </span>
            <div>
              <h3 className="text-lg font-extrabold text-slate-800">
                Not sure where to start? Ask our assistant.
              </h3>
              <p className="mt-1 max-w-xl text-[13px] text-slate-600">
                Our built-in AI explains every service, the hospital workflow,
                location and contact details — in English or Kiswahili.
              </p>
            </div>
          </div>
          <Link href="/contact" className="rounded-xl bg-[#18263a] px-5 py-3 text-[13px] font-bold text-white hover:bg-[#22344c]">
            Get in touch
          </Link>
        </div>
      </section>
    </main>
  );
}
