import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Login required." }, { status: 401 });
  const patient = await prisma.patient.findFirst({
    where: { userId: user.id },
    include: {
      department: true,
      appointments: { include: { doctor: true, department: true }, orderBy: { createdAt: "desc" } },
      visits: { include: { vitals: true }, orderBy: { startedAt: "desc" } },
      labRequests: { orderBy: { requestedAt: "desc" } },
      prescriptions: { include: { doctor: true }, orderBy: { createdAt: "desc" } },
      bills: { orderBy: { createdAt: "desc" } },
      admissions: { orderBy: { admittedAt: "desc" } },
    },
  });
  if (!patient) {
    return NextResponse.json({ user: { name: user.name, email: user.email, role: user.role, photoUrl: user.photoUrl }, patient: null });
  }
  return NextResponse.json({
user: { name: user.name, email: user.email, role: user.role, photoUrl: user.photoUrl },
    patient: {
      ...patient,
      appointments: patient.appointments.map((a) => ({
        id: a.id,
        aptCode: a.aptCode,
        time: a.time,
        status: a.status,
        doctor: a.doctor.name,
        department: a.department.name,
      })),
      visits: patient.visits.map((v) => ({
        id: v.id,
        reason: v.reason,
        diagnosis: v.diagnosis,
        notes: v.notes,
        startedAt: v.startedAt,
        vitals: v.vitals,
      })),
      labRequests: patient.labRequests,
      prescriptions: patient.prescriptions.map((p) => ({
        id: p.id,
        medication: p.medication,
        dosage: p.dosage,
        status: p.status,
        doctor: p.doctor.name,
        createdAt: p.createdAt,
      })),
      bills: patient.bills,
      admissions: patient.admissions,
    },
  });
}
