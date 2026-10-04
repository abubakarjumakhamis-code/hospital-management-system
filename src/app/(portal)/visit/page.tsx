import LocationView from "@/components/LocationView";
import { HOSPITAL_LOCATION } from "@/lib/location";

export const metadata = {
  title: "Visit us | Northstar Health",
  description:
    "Directions to Northstar Health, opening hours, and an in-hospital map to help patients and visitors find their way.",
};

export default function VisitPage() {
  return (
    <main className="mx-auto max-w-[1280px] px-4 py-8 md:px-9">
      <section className="mb-6 rounded-2xl border border-slate-200 bg-[#18263a] p-6 text-white shadow-sm md:p-8">
        <span className="inline-flex rounded-full bg-white/10 px-3 py-1 text-[9px] font-bold tracking-widest text-emerald-300">
          PATIENT &amp; VISITOR GUIDE
        </span>
        <h1 className="mt-3 text-[clamp(22px,3vw,32px)] font-extrabold tracking-tight">
          Welcome to {HOSPITAL_LOCATION.name}
        </h1>
        <p className="mt-2 max-w-[560px] text-[12px] leading-relaxed text-slate-300">
          Karibu. Ukurasa huu unakuonyesha tulipo, jinsi ya kutufikia, na ramani ya
          ndani ya hospitali ili upate huduma mahali pazuri bila kuchanganyikiwa.
        </p>
        <div className="mt-4 flex flex-wrap gap-4 text-[11px] text-slate-300">
          <span className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400" /> Open 24 hours
          </span>
          <span className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-sky-400" /> Free patient parking
          </span>
          <span className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-amber-400" /> Emergency entrance
            available
          </span>
        </div>
      </section>

      <LocationView compact />
    </main>
  );
}
