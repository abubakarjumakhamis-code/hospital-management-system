import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const doctors = await prisma.doctor.findMany({
    include: { department: true },
    orderBy: { name: "asc" },
  });
  return NextResponse.json({
    doctors: doctors.map((d) => ({
      id: d.id,
      name: d.name,
      specialty: d.specialty,
      available: d.available,
      department: d.department.name,
    })),
  });
}
