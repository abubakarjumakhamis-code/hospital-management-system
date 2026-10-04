import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { asNumber, asOptionalString, asString } from "@/lib/body";

export async function GET() {
  const bills = await prisma.bill.findMany({
    include: { patient: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({
    bills: bills.map((b) => ({
      id: b.id,
      patient: b.patient.name,
      amount: b.amount,
      description: b.description,
      status: b.status,
      createdAt: b.createdAt.toISOString(),
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
  const created = await prisma.bill.create({
    data: {
      patientId: patient.id,
      amount: asNumber(body.amount),
      description: asOptionalString(body.description),
    },
  });
  return NextResponse.json({ bill: created }, { status: 201 });
}
