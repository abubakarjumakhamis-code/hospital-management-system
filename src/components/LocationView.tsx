"use client";

import { useState, type FormEvent } from "react";
import HospitalMap from "@/components/HospitalMap";
import WayfindingMap from "@/components/WayfindingMap";
import { HOSPITAL_LOCATION } from "@/lib/location";

const CONTACT_CARDS = [
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
  },
  {
    label: "Emergency",
    value: HOSPITAL_LOCATION.emergencyPhone,
    sub: "Available 24/7",
    icon: "✚",
    tone: "bg-red-100 text-red-700",
  },
  {
    label: "Opening hours",
    value: "Open 24 hours",
    sub: "Emergency never closes",
    icon: "◔",
    tone: "bg-amber-100 text-amber-700",
  },
];

const ARRIVAL_STEPS = [
  { step: "01", title: "Arrive at Main Entrance", desc: "Use the drop-off zone; parking is to your right." },
  { step: "02", title: "Reception & Registration", desc: "Check in with your Patient ID or register as new." },
  { step: "03", title: "Get a queue number", desc: "Take a seat in the waiting area and watch the screen." },
  { step: "04", title: "See the nurse, then doctor", desc: "Vitals first, then your consultation room." },
];

export default function LocationView({ compact = false }: { compact?: boolean }) {
  const [gQuery, setGQuery] = useState("");
  const [gMapUrl, setGMapUrl] = useState(
    `https://maps.google.com/maps?q=${HOSPITAL_LOCATION.coords.lat},${HOSPITAL_LOCATION.coords.lng}&z=15&output=embed`,
  );

  function searchOnGoogle(e: FormEvent) {
    e.preventDefault();
    const q = gQuery.trim();
    if (!q) return;
    setGMapUrl(`https://maps.google.com/maps?q=${encodeURIComponent(q)}&z=14&output=embed`);
  }

  function useMyGps() {
    if (!("geolocation" in navigator)) return;
    navigator.geolocation.getCurrentPosition((pos) => {
      const { latitude, longitude } = pos.coords;
      setGQuery(`${latitude.toFixed(5)}, ${longitude.toFixed(5)}`);
      setGMapUrl(`https://maps.google.com/maps?q=${latitude},${longitude}&z=16&output=embed`);
    });
  }

  return (
    <div className="grid gap-5">
      <section className="grid gap-3.5 sm:grid-cols-2 xl:grid-cols-4">
        {CONTACT_CARDS.map((c) => (
          <article
            key={c.label}
            className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold text-slate-500">
                {c.label}
              </span>
              <span className={`grid h-8 w-8 place-items-center rounded-lg ${c.tone}`}>
                {c.icon}
              </span>
            </div>
            <p className="mt-1.5 text-[13px] font-bold text-slate-800">{c.value}</p>
            <p className="text-[9px] text-slate-500">{c.sub}</p>
          </article>
        ))}
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h2 className="text-[14px] font-bold text-slate-800">Find us on the map</h2>
            <p className="text-[11px] text-slate-500">
              Ramani inasoma mahali ulipo kwa sasa na kukuonyesha njia ya kufika hospitali.
            </p>
          </div>
        </div>
        <HospitalMap hospital={HOSPITAL_LOCATION} height={compact ? 340 : 440} />
      </section>

      <section>
        <h2 className="mb-1 text-[14px] font-bold text-slate-800">Search location with Google Maps</h2>
        <p className="mb-3 text-[11px] text-slate-500">
          Tafuta mahali lolote kupitia Google Maps, au tumia GPS yako kuona ulipo.
        </p>
        <form onSubmit={searchOnGoogle} className="mb-3 flex flex-wrap gap-2">
          <input
            value={gQuery}
            onChange={(e) => setGQuery(e.target.value)}
            placeholder="Search a place, e.g. Muhimbili, Upanga…"
            className="min-w-[220px] flex-1 rounded-lg border border-slate-200 px-3 py-2 text-[12px] outline-none focus:border-emerald-400"
          />
          <button className="rounded-lg bg-[#25a67f] px-4 py-2 text-[11px] font-bold text-white hover:bg-[#218f6d]">
            Search
          </button>
          <button
            type="button"
            onClick={useMyGps}
            className="rounded-lg border border-slate-200 px-4 py-2 text-[11px] font-bold text-slate-600 hover:bg-slate-50"
          >
            ◎ Use my GPS
          </button>
        </form>
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <iframe
            src={gMapUrl}
            className="h-[340px] w-full"
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            title="Google Maps search"
          />
        </div>
      </section>

      <WayfindingMap />

      <section className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-[14px] font-bold text-slate-800">
            Ukifika hospitalini
          </h2>
          <p className="mb-4 text-[11px] text-slate-500">
            Hatua rahisi kuanzia mlangoni hadi kuonana na daktari.
          </p>
          <ol className="grid gap-3">
            {ARRIVAL_STEPS.map((s) => (
              <li key={s.step} className="flex gap-3">
                <span className="grid h-8 w-8 flex-none place-items-center rounded-lg bg-[#18263a] text-[10px] font-bold text-white">
                  {s.step}
                </span>
                <span>
                  <strong className="block text-[11px] text-slate-700">
                    {s.title}
                  </strong>
                  <span className="text-[10px] text-slate-500">{s.desc}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-[14px] font-bold text-slate-800">Getting here</h2>
          <p className="mb-4 text-[11px] text-slate-500">
            Njia za kufika kwa usalama.
          </p>
          <ul className="grid gap-3 text-[11px] text-slate-600">
            <li className="flex gap-2">
              <span className="text-emerald-600">▸</span> Free patient parking next to
              the main entrance.
            </li>
            <li className="flex gap-2">
              <span className="text-emerald-600">▸</span> Wheelchair access and ramp at
              the Main Entrance.
            </li>
            <li className="flex gap-2">
              <span className="text-emerald-600">▸</span> Drop-off zone for taxis,
              bodaboda and ambulance.
            </li>
            <li className="flex gap-2">
              <span className="text-emerald-600">▸</span> Emergency entrance is separate
              and open 24 hours.
            </li>
          </ul>
          <a
            href={`mailto:${HOSPITAL_LOCATION.email}`}
            className="mt-4 inline-block text-[10px] font-bold text-emerald-700"
          >
            {HOSPITAL_LOCATION.email} ↗
          </a>
        </div>
      </section>
    </div>
  );
}
