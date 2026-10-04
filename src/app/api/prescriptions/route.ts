import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { asOptionalString, asString } from "@/lib/body";

export async function GET() {
  const prescriptions = await prisma.prescription.findMany({
    include: { patient: true, doctor: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({
    prescriptions: prescriptions.map((p) => ({
      id: p.id,
      patient: p.patient.name,
      doctor: p.doctor.name,
      medication: p.medication,
      dosage: p.dosage,
      status: p.status,
      createdAt: p.createdAt.toISOString(),
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
  const doctor = await prisma.doctor.findFirst({ where: { name: asString(body.doctor) } });
  if (!patient) return NextResponse.json({ error: "Patient not found" }, { status: 400 });
  if (!doctor) return NextResponse.json({ error: "Doctor not found" }, { status: 400 });
  const created = await prisma.prescription.create({
    data: {
      patientId: patient.id,
      doctorId: doctor.id,
      medication: asString(body.medication),
      dosage: asOptionalString(body.dosage),
    },
  });
  return NextResponse.json({ prescription: created }, { status: 201 });
}
