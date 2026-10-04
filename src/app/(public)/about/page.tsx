import Link from "next/link";
import { HOSPITAL_LOCATION } from "@/lib/location";

export const metadata = {
  title: "About | Northstar Health",
  description:
    "Learn about Northstar Health, our mission, values and the connected hospital workflow that puts patients first.",
};

const values = [
  {
    icon: "❤️",
    title: "Patients first",
    desc: "Every screen, form and queue is designed to get patients seen faster and treated with dignity.",
  },
  {
    icon: "🔗",
    title: "One connected record",
    desc: "Reception, nursing, doctors, lab, pharmacy and billing all work from the same patient record.",
  },
  {
    icon: "🛡️",
    title: "Clear and accountable",
    desc: "Transparent statuses, audit-friendly histories and no more lost paper files.",
  },
  {
    icon: "⚡",
    title: "Efficient by design",
    desc: "Live queues, automatic stock updates and instant results keep care moving.",
  },
];

const milestones = [
  { value: "8", label: "Clinical departments" },
  { value: "40+", label: "Care professionals" },
  { value: "24/7", label: "Emergency service" },
  { value: "100%", label: "Digital records" },
];

export default function AboutPage() {
  return (
    <main>
      <section className="bg-[#18263a] text-white">
        <div className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-20">
          <p className="text-[11px] font-bold tracking-[2px] text-[#61d2ab]">ABOUT US</p>
          <h1 className="mt-3 max-w-2xl text-3xl font-extrabold leading-tight md:text-4xl">
            A modern hospital, organized around the patient journey.
          </h1>
          <p className="mt-4 max-w-2xl text-[14px] leading-relaxed text-slate-300">
            {HOSPITAL_LOCATION.name} is a fully connected hospital management
            system and care provider. We replace fragmented paper processes with
            one clear, end-to-end workflow — from the moment a patient arrives
            to their follow-up appointment.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 md:px-6">
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-800">Our mission</h2>
            <p className="mt-3 text-[13px] leading-relaxed text-slate-600">
              To make hospital care faster, clearer and more humane by connecting
              every department through one reliable digital record. We believe no
              patient should repeat their story at every desk, and no clinician
              should work without the full picture.
            </p>
            <p className="mt-3 text-[13px] leading-relaxed text-slate-600">
              Our system follows the complete hospital workflow: registration,
              appointments, nursing and vitals, doctor consultation, laboratory,
              pharmacy, billing, emergency, admission and discharge.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/services" className="rounded-xl bg-[#25a67f] px-5 py-3 text-[13px] font-bold text-white hover:bg-[#218f6d]">
                Our services
              </Link>
              <Link href="/contact" className="rounded-xl border border-slate-200 px-5 py-3 text-[13px] font-bold text-slate-700 hover:bg-slate-50">
                Contact us
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 self-center">
            {milestones.map((m) => (
              <div key={m.label} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <strong className="block text-3xl font-extrabold text-[#25a67f]">{m.value}</strong>
                <span className="text-[12px] text-slate-500">{m.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-14 md:px-6">
          <h2 className="text-2xl font-extrabold text-slate-800">What we stand for</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {values.map((v) => (
              <div key={v.title} className="flex gap-4 rounded-2xl border border-slate-200 bg-[#f9fbfd] p-5">
                <span className="grid h-11 w-11 flex-none place-items-center rounded-xl bg-emerald-50 text-xl">
                  {v.icon}
                </span>
                <div>
                  <strong className="block text-[14px] font-bold text-slate-800">{v.title}</strong>
                  <p className="mt-1 text-[12px] leading-relaxed text-slate-500">{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 md:px-6">
        <div className="grid gap-6 rounded-3xl border border-slate-200 bg-white p-8 md:grid-cols-[1.4fr_1fr] md:items-center">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-800">Visit us</h2>
            <p className="mt-2 text-[13px] text-slate-600">
              {HOSPITAL_LOCATION.address}, {HOSPITAL_LOCATION.city}
            </p>
            <p className="mt-1 text-[13px] text-slate-600">{HOSPITAL_LOCATION.hours}</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link href="/visit" className="rounded-xl bg-[#18263a] px-5 py-3 text-[13px] font-bold text-white">
                Map &amp; directions
              </Link>
              <a href={`tel:${HOSPITAL_LOCATION.phone.replace(/\s/g, "")}`} className="rounded-xl border border-slate-200 px-5 py-3 text-[13px] font-bold text-slate-700">
                {HOSPITAL_LOCATION.phone}
              </a>
            </div>
          </div>
          <div className="rounded-2xl bg-[#18263a] p-6 text-white">
            <strong className="block text-[13px] font-bold">Emergency</strong>
            <p className="mt-1 text-[12px] text-slate-300">
              Our emergency department never closes.
            </p>
            <a
              href={`tel:${HOSPITAL_LOCATION.emergencyPhone.replace(/\s/g, "")}`}
              className="mt-3 inline-block rounded-lg bg-red-500/90 px-4 py-2.5 text-[13px] font-bold text-white"
            >
              {HOSPITAL_LOCATION.emergencyPhone}
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
