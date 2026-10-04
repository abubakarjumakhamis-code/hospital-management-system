"use client";

import { useEffect, useState, type FormEvent } from "react";
import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import StatusPill from "@/components/ui";

interface VitalRow {
  bloodPressure?: string | null;
  temperature?: number | null;
  pulse?: number | null;
  weight?: number | null;
}

interface AppointmentRow {
  id: string;
  doctor: string;
  department: string;
  time: string;
  status: string;
}

interface VisitRow {
  id: string;
  reason?: string | null;
  diagnosis?: string | null;
  startedAt: string;
  vitals: VitalRow[];
}

interface PrescriptionRow {
  id: string;
  medication: string;
  dosage?: string | null;
  doctor: string;
  status: string;
}

interface LabRow {
  id: string;
  testName: string;
  status: string;
  result?: string | null;
}

interface BillRow {
  id: string;
  amount: number;
  description?: string | null;
  status: string;
}

interface AdmissionRow {
  id: string;
  ward?: string | null;
  bedNumber?: string | null;
  status: string;
}

interface PatientDetail {
  patientCode: string;
  name: string;
  age: number;
  gender: string;
  status: string;
  phone?: string | null;
  department?: { name: string } | null;
  appointments: AppointmentRow[];
  visits: VisitRow[];
  prescriptions: PrescriptionRow[];
  labRequests: LabRow[];
  bills: BillRow[];
  admissions: AdmissionRow[];
}

interface PortalData {
  user: { name: string; email: string; role: string; photoUrl?: string | null };
  patient: PatientDetail | null;
}

function money(value: number) {
  return new Intl.NumberFormat().format(Number(value || 0));
}

function Card({
  title,
  count,
  children,
  id,
}: {
  title: string;
  count?: number;
  children: ReactNode;
  id?: string;
}) {
  return (
    <section id={id} className="scroll-mt-20 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-[15px] font-extrabold text-slate-800">{title}</h2>
        {typeof count === "number" && (
          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold text-slate-600">
            {count}
          </span>
        )}
      </div>
      {children}
    </section>
  );
}

export default function PatientPortalPage() {
  const router = useRouter();
  const [data, setData] = useState<PortalData | null>(null);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("Other");
  const [phone, setPhone] = useState("");
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState("");

  useEffect(() => {
    fetch("/api/portal")
      .then((r) => {
        if (r.status === 401) {
          router.push("/login");
          return null;
        }
        return r.json();
      })
      .then((d) => {
        if (!d) return;
        setData(d);
        setName(d.patient?.name ?? d.user.name);
        setAge(d.patient?.age ? String(d.patient.age) : "");
        setGender(d.patient?.gender ?? "Other");
        setPhone(d.patient?.phone ?? "");
        setPhotoUrl(d.user.photoUrl ?? null);
      })
      .catch(() => setError("Could not load your portal."));
  }, [router]);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
  }

  function pickPhoto(file: File | null) {
    if (!file) return;
    if (file.size > 900_000) {
      setSaved("Photo too large (max 900KB). Compress the image and try again.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setPhotoUrl(typeof reader.result === "string" ? reader.result : null);
    reader.readAsDataURL(file);
  }

  async function saveDetails(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaved("");
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, age, gender, phone, photoUrl }),
      });
      const d = await res.json();
      if (!res.ok) {
        setSaved(d.error ?? "Could not save.");
      } else {
        setSaved("Details saved ✓");
        window.dispatchEvent(new Event("profile-updated"));
        setData((prev) =>
          prev
            ? {
                ...prev,
                user: { ...prev.user, name: d.user.name, photoUrl: d.user.photoUrl },
                patient: prev.patient
                  ? { ...prev.patient, name, age: Number(age) || prev.patient.age, gender, phone }
                  : prev.patient,
              }
            : prev,
        );
      }
    } catch {
      setSaved("Could not save.");
    } finally {
      setSaving(false);
    }
  }

  if (error) return <p className="p-8 text-red-600">{error}</p>;
  if (!data) return <p className="p-8 text-slate-500">Loading your portal…</p>;

  const p = data.patient;

  return (
    <main className="mx-auto flex max-w-6xl gap-8 px-4 py-10 md:px-6">
      <aside className="hidden w-44 flex-none md:block">
        <nav className="sticky top-20 grid gap-1 text-[12px]">
          <p className="mb-2 text-[9px] font-bold tracking-[1.5px] text-slate-400">
            MY ACCOUNT
          </p>
          {[
            ["My details", "#details"],
            ["Profile", "#profile"],
            ["Appointments", "#appointments"],
            ["Visits & vitals", "#visits"],
            ["Prescriptions", "#prescriptions"],
            ["Lab results", "#lab"],
            ["Bills", "#bills"],
            ["Admissions", "#admissions"],
          ].map(([label, href]) => (
            <a
              key={href}
              href={href}
              className="rounded-lg px-3 py-2 font-semibold text-slate-600 hover:bg-slate-100"
            >
              {label}
            </a>
          ))}
        </nav>
      </aside>
      <div className="min-w-0 flex-1">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-[11px] font-bold tracking-[2px] text-[#2f9e78]">MY PORTAL</p>
          <h1 className="text-3xl font-extrabold text-slate-800">
            Hujambo, {data.user.name.split(" ")[0]}
          </h1>
          <p className="text-[13px] text-slate-500">{data.user.email}</p>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-1.5 text-[12px] font-bold text-slate-600 hover:bg-slate-50"
        >
          {data.user.photoUrl ? (
            <img src={data.user.photoUrl} alt="Your photo" className="h-7 w-7 rounded-full object-cover" />
          ) : (
            <span className="grid h-7 w-7 place-items-center rounded-full bg-indigo-100 text-[10px] font-bold text-indigo-800">
              {data.user.name.split(/\s+/).map((p) => p[0]).slice(0, 2).join("").toUpperCase()}
            </span>
          )}
          Logout
        </button>
      </div>

      <section id="details" className="mt-8 scroll-mt-20 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-[15px] font-extrabold text-slate-800">Complete your details</h2>
        <p className="mb-4 text-[12px] text-slate-500">Jaza taarifa zako na weka picha yako.</p>
        <form onSubmit={saveDetails} className="grid gap-4 md:grid-cols-[140px_1fr]">
          <label className="flex flex-col items-center gap-2">
            {photoUrl ? (
              <img src={photoUrl} alt="Your photo" className="h-24 w-24 rounded-full object-cover" />
            ) : (
              <span className="grid h-24 w-24 place-items-center rounded-full bg-slate-100 text-[11px] text-slate-400">No photo</span>
            )}
            <span className="cursor-pointer rounded-lg border border-slate-200 px-3 py-1 text-[11px] font-bold text-slate-600 hover:bg-slate-50">
              Upload photo
              <input type="file" accept="image/*" className="hidden" onChange={(e) => pickPhoto(e.target.files?.[0] ?? null)} />
            </span>
          </label>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="grid gap-1 text-[12px] text-slate-600">
              Full name
              <input value={name} onChange={(e) => setName(e.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 text-[13px] outline-none focus:border-emerald-400" />
            </label>
            <label className="grid gap-1 text-[12px] text-slate-600">
              Age
              <input value={age} onChange={(e) => setAge(e.target.value)} inputMode="numeric" className="rounded-lg border border-slate-200 px-3 py-2 text-[13px] outline-none focus:border-emerald-400" />
            </label>
            <label className="grid gap-1 text-[12px] text-slate-600">
              Gender
              <select value={gender} onChange={(e) => setGender(e.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 text-[13px] outline-none">
                <option>Female</option>
                <option>Male</option>
                <option>Other</option>
              </select>
            </label>
            <label className="grid gap-1 text-[12px] text-slate-600">
              Phone
              <input value={phone} onChange={(e) => setPhone(e.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 text-[13px] outline-none focus:border-emerald-400" />
            </label>
            <div className="flex items-end gap-3">
              <button disabled={saving} className="rounded-lg bg-[#2f9e78] px-4 py-2 text-[12px] font-bold text-white hover:bg-[#268a66] disabled:opacity-60">
                {saving ? "Saving…" : "Save details"}
              </button>
              {saved && <span className="text-[12px] text-slate-500">{saved}</span>}
            </div>
          </div>
        </form>
      </section>

      {!p ? (
        <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-8 text-slate-500">
          No patient record is linked to this account yet. Please visit reception.
        </div>
      ) : (
        <div className="mt-8 grid gap-6">
          <section id="profile" className="scroll-mt-20 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-center gap-3">
              {photoUrl ? (
                <img src={photoUrl} alt="Patient photo" className="h-12 w-12 rounded-full object-cover" />
              ) : (
                <span className="grid h-12 w-12 place-items-center rounded-full bg-slate-100 text-[11px] text-slate-400">No photo</span>
              )}
              <h2 className="text-[15px] font-extrabold text-slate-800">Profile</h2>
              <div className="ml-auto">
                <StatusPill status={p.status} />
              </div>
            </div>
            <dl className="mt-3 grid grid-cols-2 gap-3 text-[13px] md:grid-cols-3">
              <div><dt className="text-slate-400">Patient ID</dt><dd className="font-bold text-slate-700">{p.patientCode}</dd></div>
              <div><dt className="text-slate-400">Age</dt><dd className="font-bold text-slate-700">{p.age}</dd></div>
              <div><dt className="text-slate-400">Gender</dt><dd className="font-bold text-slate-700">{p.gender}</dd></div>
              <div><dt className="text-slate-400">Department</dt><dd className="font-bold text-slate-700">{p.department?.name ?? "—"}</dd></div>
              <div><dt className="text-slate-400">Phone</dt><dd className="font-bold text-slate-700">{p.phone ?? "—"}</dd></div>
            </dl>
          </section>

          <Card title="Appointments" count={p.appointments.length} id="appointments">
            {p.appointments.length === 0 ? (
              <p className="text-[13px] text-slate-400">No appointments yet.</p>
            ) : (
              <ul className="divide-y divide-slate-100 text-[13px]">
                {p.appointments.map((a) => (
                  <li key={a.id} className="flex items-center justify-between gap-3 py-2.5">
                    <span className="min-w-0">
                      <strong className="block truncate text-slate-700">{a.doctor}</strong>
                      <span className="text-[11px] text-slate-500">{a.department} · {a.time}</span>
                    </span>
                    <StatusPill status={a.status} />
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card title="Visits & vital signs" count={p.visits.length} id="visits">
            {p.visits.length === 0 ? (
              <p className="text-[13px] text-slate-400">No recorded visits.</p>
            ) : (
              <ul className="grid gap-3 text-[13px]">
                {p.visits.map((v) => (
                  <li key={v.id} className="rounded-lg border border-slate-100 bg-slate-50/60 p-3">
                    <div className="flex justify-between">
                      <strong className="text-slate-700">{v.reason ?? "Visit"}</strong>
                      <span className="text-slate-400">{new Date(v.startedAt).toLocaleDateString()}</span>
                    </div>
                    {v.diagnosis && <p className="text-slate-600">Diagnosis: {v.diagnosis}</p>}
                    {v.vitals?.length > 0 && (
                      <p className="text-[11px] text-slate-500">
                        BP {v.vitals[0].bloodPressure ?? "—"} · Temp {v.vitals[0].temperature ?? "—"}°C ·
                        Pulse {v.vitals[0].pulse ?? "—"} · Weight {v.vitals[0].weight ?? "—"}kg
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <div className="grid gap-6 md:grid-cols-3">
            <Card title="Prescriptions" count={p.prescriptions.length} id="prescriptions">
              {p.prescriptions.length === 0 ? (
                <p className="text-[13px] text-slate-400">None.</p>
              ) : (
                <ul className="divide-y divide-slate-100 text-[13px]">
                  {p.prescriptions.map((x) => (
                    <li key={x.id} className="py-2">
                      <div className="flex items-center justify-between gap-2">
                        <strong className="text-slate-700">{x.medication} {x.dosage ?? ""}</strong>
                        <StatusPill status={x.status} />
                      </div>
                      <p className="text-[11px] text-slate-500">{x.doctor}</p>
                    </li>
                  ))}
                </ul>
              )}
            </Card>

            <Card title="Lab results" count={p.labRequests.length} id="lab">
              {p.labRequests.length === 0 ? (
                <p className="text-[13px] text-slate-400">None.</p>
              ) : (
                <ul className="divide-y divide-slate-100 text-[13px]">
                  {p.labRequests.map((x) => (
                    <li key={x.id} className="py-2">
                      <div className="flex items-center justify-between gap-2">
                        <strong className="text-slate-700">{x.testName}</strong>
                        <StatusPill status={x.status} />
                      </div>
                      {x.result && <p className="text-[11px] text-slate-500">{x.result}</p>}
                    </li>
                  ))}
                </ul>
              )}
            </Card>

            <Card title="Bills" count={p.bills.length} id="bills">
              {p.bills.length === 0 ? (
                <p className="text-[13px] text-slate-400">None.</p>
              ) : (
                <ul className="divide-y divide-slate-100 text-[13px]">
                  {p.bills.map((x) => (
                    <li key={x.id} className="py-2">
                      <div className="flex items-center justify-between gap-2">
                        <strong className="text-slate-700">{money(x.amount)} TSh</strong>
                        <StatusPill status={x.status} />
                      </div>
                      <p className="text-[11px] text-slate-500">{x.description ?? "Services"}</p>
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          </div>

          <Card title="Admissions" count={p.admissions.length} id="admissions">
            {p.admissions.length === 0 ? (
              <p className="text-[13px] text-slate-400">No admission history.</p>
            ) : (
              <ul className="divide-y divide-slate-100 text-[13px]">
                {p.admissions.map((x) => (
                  <li key={x.id} className="flex items-center justify-between gap-3 py-2">
                    <span className="text-slate-700">Ward {x.ward ?? "—"} · Bed {x.bedNumber ?? "—"}</span>
                    <StatusPill status={x.status} />
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>
      )}
      </div>
    </main>
  );
}
