import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { asOptionalString, asString } from "@/lib/body";

function numOrNull(value: string | null): number | null {
  if (value === null) return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
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
  let visit = await prisma.visit.findFirst({
    where: { patientId: patient.id, endedAt: null },
    orderBy: { startedAt: "desc" },
  });
  if (!visit) {
    visit = await prisma.visit.create({
      data: { patientId: patient.id, reason: "Vitals check" },
    });
  }
  const vital = await prisma.vital.create({
    data: {
      visitId: visit.id,
      bloodPressure: asOptionalString(body.bloodPressure),
      temperature: numOrNull(asOptionalString(body.temperature)),
      pulse: numOrNull(asOptionalString(body.pulse)),
      weight: numOrNull(asOptionalString(body.weight)),
    },
  });
  return NextResponse.json({ vital, visitId: visit.id }, { status: 201 });
}
