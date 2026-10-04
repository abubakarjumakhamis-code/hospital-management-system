import Topbar from "@/components/Topbar";
import LocationView from "@/components/LocationView";
import { HOSPITAL_LOCATION } from "@/lib/location";

export const metadata = {
  title: "Location | Northstar Health",
  description: "Hospital map, directions and in-hospital wayfinding.",
};

export default function LocationPage() {
  return (
    <>
      <Topbar crumb="Location" />
      <main className="mx-auto max-w-[1560px] px-4 py-7 md:px-9">
        <header className="mb-6">
          <p className="mb-2 flex items-center gap-2 text-[9px] font-bold tracking-[1.15px] text-slate-500">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_0_3px_#e3f6ef]" />
            FIND US
          </p>
          <h1 className="text-[clamp(22px,2.2vw,29px)] font-bold tracking-tight text-slate-800">
            {HOSPITAL_LOCATION.name} location
            <span className="pl-1 text-amber-500">✳</span>
          </h1>
          <p className="mt-1 text-[11px] text-slate-500">
            Ramani ya hospitali, maelekezo ya kufika na ramani ya ndani kwa ajili ya
            wageni na wateja.
          </p>
        </header>
        <LocationView />
      </main>
    </>
  );
}
