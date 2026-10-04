import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { asString } from "@/lib/body";

export async function GET() {
  const requests = await prisma.labRequest.findMany({
    include: { patient: true },
    orderBy: { requestedAt: "desc" },
  });
  return NextResponse.json({
    requests: requests.map((r) => ({
      id: r.id,
      patient: r.patient.name,
      testName: r.testName,
      status: r.status,
      result: r.result,
      requestedAt: r.requestedAt.toISOString(),
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
  const created = await prisma.labRequest.create({
    data: { patientId: patient.id, testName: asString(body.testName, "General panel") },
  });
  return NextResponse.json({ request: created }, { status: 201 });
}
