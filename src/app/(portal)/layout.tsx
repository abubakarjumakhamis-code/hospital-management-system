import Link from "next/link";
import { HOSPITAL_LOCATION } from "@/lib/location";
import AiAssistant from "@/components/AiAssistant";

export default function PortalLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-[#f5f7fa]">
      <header className="sticky top-0 z-20 flex h-[63px] items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur md:px-9">
        <Link href="/portal" className="flex items-center gap-2.5 text-slate-800">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#3cbd95] text-xl font-bold text-white">
            +
          </span>
          <span className="flex flex-col leading-tight">
            <strong className="text-[16px] font-extrabold tracking-tight">
              northstar
            </strong>
            <small className="text-[8px] font-bold tracking-[1.45px] text-slate-400">
              PATIENT PORTAL
            </small>
          </span>
        </Link>
        <nav className="flex items-center gap-3 text-[11px] text-slate-600 sm:gap-4 sm:text-[12px]">
          <Link href="/portal" className="font-semibold text-slate-700">
            My portal
          </Link>
          <Link href="/services" className="hidden font-semibold text-slate-700 sm:inline">
            Services
          </Link>
          <Link href="/visit" className="font-semibold text-slate-700">
            Visit us
          </Link>
          <a href={`tel:${HOSPITAL_LOCATION.phone.replace(/\s/g, "")}`} className="hidden sm:inline">
            Call {HOSPITAL_LOCATION.phone}
          </a>
          <Link
            href="/login"
            className="rounded-lg bg-[#18263a] px-3 py-2 text-[11px] font-bold text-white"
          >
            Staff login
          </Link>
        </nav>
      </header>
      {children}
      <AiAssistant />
    </div>
  );
}
