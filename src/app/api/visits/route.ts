import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { asOptionalString, asString } from "@/lib/body";

export async function GET() {
  const visits = await prisma.visit.findMany({
    include: { patient: true, vitals: true },
    orderBy: { startedAt: "desc" },
    take: 50,
  });
  return NextResponse.json({
    visits: visits.map((v) => ({
      id: v.id,
      patient: v.patient.name,
      patientId: v.patientId,
      reason: v.reason,
      diagnosis: v.diagnosis,
      notes: v.notes,
      startedAt: v.startedAt,
      endedAt: v.endedAt,
      vitalsCount: v.vitals.length,
    })),
  });
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const patient = await prisma.patient.findFirst({ where: { name: asString(body.patient) } });
  if (!patient) return NextResponse.json({ error: "Patient not found" }, { status: 400 });
  const visit = await prisma.visit.create({
    data: {
      patientId: patient.id,
      reason: asString(body.reason, "Consultation"),
      diagnosis: asOptionalString(body.diagnosis),
      notes: asOptionalString(body.notes),
    },
  });
  const apt = await prisma.appointment.findFirst({
    where: { patientId: patient.id, status: { in: ["Waiting", "Checked in", "In progress"] } },
    orderBy: { createdAt: "desc" },
  });
  if (apt) await prisma.appointment.update({ where: { id: apt.id }, data: { status: "Completed" } });
  return NextResponse.json({ visit }, { status: 201 });
}
