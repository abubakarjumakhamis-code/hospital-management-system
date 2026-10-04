import Link from "next/link";
import { redirect } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import AiAssistant from "@/components/AiAssistant";
import RoleWindow from "@/components/RoleWindow";
import { getSessionUser } from "@/lib/auth";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  if (user.role === "PATIENT") redirect("/portal");

  return (
    <div className="min-h-screen">
      <Sidebar />
      {/* mobile top brand */}
      <div className="flex items-center gap-2 bg-[#18263a] px-4 py-3 text-white md:hidden">
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#3cbd95] font-bold">
          +
        </span>
        <strong className="text-sm font-extrabold">northstar</strong>
        <span className="ml-auto flex gap-4 text-[12px] text-slate-300">
          <Link href="/dashboard">Overview</Link>
          <Link href="/dashboard/patients">Patients</Link>
          <Link href="/dashboard/location">Find us</Link>
        </span>
      </div>
      <div className="md:ml-[246px]">
        <RoleWindow>{children}</RoleWindow>
      </div>
      <AiAssistant />
    </div>
  );
}
