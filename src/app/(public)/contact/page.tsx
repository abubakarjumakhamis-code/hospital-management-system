import Link from "next/link";
import ContactForm from "@/components/ContactForm";
import HospitalMap from "@/components/HospitalMap";
import { HOSPITAL_LOCATION } from "@/lib/location";

export const metadata = {
  title: "Contact | Northstar Health",
  description:
    "Contact Northstar Health — address, phone, emergency line, email, opening hours and directions.",
};

const cards: {
  label: string;
  value: string;
  sub: string;
  icon: string;
  tone: string;
  href?: string;
}[] = [
  {
    label: "Address",
    value: HOSPITAL_LOCATION.address,
    sub: HOSPITAL_LOCATION.city,
    icon: "⚲",
    tone: "bg-emerald-100 text-emerald-700",
  },
  {
    label: "Reception",
    value: HOSPITAL_LOCATION.phone,
    sub: "General enquiries",
    icon: "☎",
    tone: "bg-sky-100 text-sky-700",
    href: `tel:${HOSPITAL_LOCATION.phone.replace(/\s/g, "")}`,
  },
  {
    label: "Emergency",
    value: HOSPITAL_LOCATION.emergencyPhone,
    sub: "Available 24/7",
    icon: "✚",
    tone: "bg-red-100 text-red-700",
    href: `tel:${HOSPITAL_LOCATION.emergencyPhone.replace(/\s/g, "")}`,
  },
  {
    label: "Email",
    value: HOSPITAL_LOCATION.email,
    sub: "We reply in 1 business day",
    icon: "✉",
    tone: "bg-violet-100 text-violet-700",
    href: `mailto:${HOSPITAL_LOCATION.email}`,
  },
];

export default function ContactPage() {
  return (
    <main>
      <section className="bg-gradient-to-br from-[#18263a] to-[#24435e] text-white">
        <div className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-20">
          <p className="text-[11px] font-bold tracking-[2px] text-[#61d2ab]">CONTACT</p>
          <h1 className="mt-3 text-3xl font-extrabold leading-tight md:text-4xl">
            We&apos;re here to help.
          </h1>
          <p className="mt-4 max-w-2xl text-[14px] leading-relaxed text-slate-300">
            Reach the {HOSPITAL_LOCATION.name} team by phone, email or in person.
            Our emergency line is always open.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 md:px-6">
        <div className="grid gap-3.5 sm:grid-cols-2 xl:grid-cols-4">
          {cards.map((c) => {
            const inner = (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold text-slate-500">{c.label}</span>
                  <span className={`grid h-8 w-8 place-items-center rounded-lg ${c.tone}`}>
                    {c.icon}
                  </span>
                </div>
                <p className="mt-1.5 break-words text-[13px] font-bold text-slate-800">{c.value}</p>
                <p className="text-[9px] text-slate-500">{c.sub}</p>
              </>
            );
            return c.href ? (
              <a
                key={c.label}
                href={c.href}
                className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                {inner}
              </a>
            ) : (
              <article key={c.label} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                {inner}
              </article>
            );
          })}
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1.2fr]">
          <ContactForm />

          <div className="grid gap-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-[16px] font-extrabold text-slate-800">Opening hours</h2>
              <ul className="mt-3 grid gap-2 text-[13px] text-slate-600">
                <li className="flex justify-between border-b border-slate-100 pb-2">
                  <span>Emergency</span>
                  <span className="font-bold text-emerald-700">Open 24 hours</span>
                </li>
                <li className="flex justify-between border-b border-slate-100 pb-2">
                  <span>Outpatient clinics</span>
                  <span className="font-semibold">Mon–Sat, 8:00–18:00</span>
                </li>
                <li className="flex justify-between border-b border-slate-100 pb-2">
                  <span>Laboratory</span>
                  <span className="font-semibold">Mon–Sat, 7:30–19:00</span>
                </li>
                <li className="flex justify-between">
                  <span>Pharmacy</span>
                  <span className="font-semibold">Daily, 8:00–20:00</span>
                </li>
              </ul>
              <Link href="/visit" className="mt-4 inline-block text-[12px] font-bold text-[#2f9e78]">
                See the full visitor guide →
              </Link>
            </div>

            <HospitalMap hospital={HOSPITAL_LOCATION} height={320} />
          </div>
        </div>
      </section>
    </main>
  );
}
