import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { asOptionalString, asString } from "@/lib/body";

export async function GET() {
  const admissions = await prisma.admission.findMany({
    include: { patient: true },
    orderBy: { admittedAt: "desc" },
  });
  return NextResponse.json({
    admissions: admissions.map((a) => ({
      id: a.id,
      patient: a.patient.name,
      bedNumber: a.bedNumber,
      ward: a.ward,
      status: a.status,
      admittedAt: a.admittedAt.toISOString(),
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
  const created = await prisma.admission.create({
    data: {
      patientId: patient.id,
      bedNumber: asOptionalString(body.bedNumber),
      ward: asOptionalString(body.ward),
    },
  });
  return NextResponse.json({ admission: created }, { status: 201 });
}
