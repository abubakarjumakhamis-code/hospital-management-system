import Link from "next/link";
import { HOSPITAL_LOCATION } from "@/lib/location";
import AiAssistant from "@/components/AiAssistant";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/contact", label: "Contact" },
  { href: "/visit", label: "Visit us" },
];

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-[#f5f7fa]">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-[63px] max-w-6xl items-center justify-between gap-4 px-4 md:px-6">
          <Link href="/" className="flex flex-shrink-0 items-center gap-2.5 text-slate-800">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#3cbd95] text-xl font-bold text-white">
              +
            </span>
            <span className="flex flex-col leading-tight">
              <strong className="text-[16px] font-extrabold tracking-tight">northstar</strong>
              <small className="text-[8px] font-bold tracking-[1.45px] text-slate-400">
                HEALTH
              </small>
            </span>
          </Link>

          <nav className="hidden items-center gap-6 text-[12px] font-medium text-slate-600 lg:flex">
            {NAV.map((item) => (
              <Link key={item.href} href={item.href} className="transition hover:text-[#2f9e78]">
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/login"
              className="rounded-lg border border-slate-200 px-3 py-2 text-[12px] font-semibold text-slate-700 hover:bg-slate-50"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="rounded-lg bg-[#18263a] px-3 py-2 text-[12px] font-bold text-white hover:bg-[#22344c]"
            >
              Sign up
            </Link>
          </div>
        </div>

        <nav className="flex items-center gap-5 overflow-x-auto border-t border-slate-100 px-4 py-2 text-[12px] font-medium text-slate-600 lg:hidden">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} className="whitespace-nowrap hover:text-[#2f9e78]">
              {item.label}
            </Link>
          ))}
        </nav>
      </header>

      {children}

      <footer className="mt-16 border-t border-slate-200 bg-[#18263a] py-10 text-slate-300">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 md:grid-cols-4 md:px-6">
          <div>
            <div className="flex items-center gap-2.5 text-white">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#3cbd95] text-xl font-bold">
                +
              </span>
              <strong className="text-[16px] font-extrabold">northstar</strong>
            </div>
            <p className="mt-3 text-[12px] leading-relaxed text-slate-400">
              {HOSPITAL_LOCATION.tagline}. Modern care, organized from
              registration to recovery.
            </p>
          </div>
          <div>
            <strong className="text-[12px] font-bold text-white">Company</strong>
            <ul className="mt-3 grid gap-2 text-[12px]">
              {NAV.slice(0, 4).map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:text-[#61d2ab]">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <strong className="text-[12px] font-bold text-white">Contact</strong>
            <ul className="mt-3 grid gap-2 text-[12px] text-slate-400">
              <li>{HOSPITAL_LOCATION.address}</li>
              <li>{HOSPITAL_LOCATION.city}</li>
              <li>
                <a href={`tel:${HOSPITAL_LOCATION.phone.replace(/\s/g, "")}`} className="hover:text-[#61d2ab]">
                  {HOSPITAL_LOCATION.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${HOSPITAL_LOCATION.email}`} className="hover:text-[#61d2ab]">
                  {HOSPITAL_LOCATION.email}
                </a>
              </li>
            </ul>
          </div>
          <div>
            <strong className="text-[12px] font-bold text-white">Emergency</strong>
            <p className="mt-3 text-[12px] text-slate-400">
              {HOSPITAL_LOCATION.hours}
            </p>
            <a
              href={`tel:${HOSPITAL_LOCATION.emergencyPhone.replace(/\s/g, "")}`}
              className="mt-2 inline-block rounded-lg bg-red-500/90 px-3 py-2 text-[12px] font-bold text-white hover:bg-red-500"
            >
              {HOSPITAL_LOCATION.emergencyPhone}
            </a>
          </div>
        </div>
        <div className="mx-auto mt-8 flex max-w-6xl flex-col gap-2 border-t border-white/10 px-4 pt-6 text-[11px] text-slate-500 sm:flex-row sm:items-center sm:justify-between md:px-6">
          <span>© {new Date().getFullYear()} {HOSPITAL_LOCATION.name}. Made for better care.</span>
          <span>All systems operational ●</span>
        </div>
      </footer>

      <AiAssistant />
    </div>
  );
}
