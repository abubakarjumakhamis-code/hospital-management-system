import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const patient = await prisma.patient.findFirst({
    where: { OR: [{ id }, { patientCode: id }] },
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
  if (!patient) return NextResponse.json({ error: "Patient not found" }, { status: 404 });
  return NextResponse.json({
    patient: {
      id: patient.id,
      patientCode: patient.patientCode,
      name: patient.name,
      age: patient.age,
      gender: patient.gender,
      phone: patient.phone,
      status: patient.status,
      department: patient.department.name,
      registeredAt: patient.registeredAt,
      appointments: patient.appointments.map((a) => ({
        id: a.id, aptCode: a.aptCode, time: a.time, status: a.status,
        doctor: a.doctor.name, department: a.department.name,
      })),
      visits: patient.visits.map((v) => ({
        id: v.id, reason: v.reason, diagnosis: v.diagnosis, notes: v.notes,
        startedAt: v.startedAt, endedAt: v.endedAt, vitals: v.vitals,
      })),
      labRequests: patient.labRequests,
      prescriptions: patient.prescriptions.map((p) => ({
        id: p.id, medication: p.medication, dosage: p.dosage, status: p.status,
        doctor: p.doctor.name, createdAt: p.createdAt,
      })),
      bills: patient.bills,
      admissions: patient.admissions,
    },
  });
}
