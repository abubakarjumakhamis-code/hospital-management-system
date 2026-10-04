import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { asString } from "@/lib/body";

export async function GET() {
  const visits = await prisma.visit.findMany({
    where: { reason: { contains: "Emergency" } },
    include: { patient: true, vitals: true },
    orderBy: { startedAt: "desc" },
    take: 30,
  });
  return NextResponse.json({
    visits: visits.map((v) => ({
      id: v.id,
      patient: v.patient.name,
      triage: v.notes,
      condition: v.diagnosis,
      startedAt: v.startedAt,
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
  const name = asString(body.name).trim();
  if (name.length < 2) return NextResponse.json({ error: "Patient name is required." }, { status: 400 });
  let patient = await prisma.patient.findFirst({ where: { name } });
  if (!patient) {
    const dept = await prisma.department.findFirst();
    if (!dept) return NextResponse.json({ error: "No departments configured." }, { status: 400 });
    const count = await prisma.patient.count();
    const gender = asString(body.gender);
    patient = await prisma.patient.create({
      data: {
        patientCode: `ER-${1000 + count + 1}`,
        name,
        age: Number.isInteger(Number(body.age)) ? Number(body.age) : 0,
        gender: ["Female", "Male", "Other"].includes(gender) ? gender : "Other",
        departmentId: dept.id,
        status: "Admitted",
      },
    });
  }
  const visit = await prisma.visit.create({
    data: {
      patientId: patient.id,
      reason: "Emergency",
      notes: asString(body.triage) || null,
      diagnosis: asString(body.condition) === "CRITICAL" ? "Critical" : "Stable",
    },
  });
  return NextResponse.json({ visit }, { status: 201 });
}
