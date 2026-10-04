import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export async function PATCH(request: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Login required." }, { status: 401 });

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const name = typeof body.name === "string" ? body.name.trim() : undefined;
  const photoUrl = typeof body.photoUrl === "string" ? body.photoUrl : undefined;
  const age = body.age === "" || body.age === null || body.age === undefined ? undefined : Number(body.age);
  const gender = typeof body.gender === "string" ? body.gender : undefined;
  const phone = typeof body.phone === "string" ? body.phone : undefined;

  if (photoUrl !== undefined && photoUrl.length > 2_000_000) {
    return NextResponse.json({ error: "Photo is too large." }, { status: 400 });
  }

  const updated = await prisma.user.update({
    where: { id: user.id },
    data: {
      ...(name && name.length >= 2 ? { name } : {}),
      ...(photoUrl !== undefined ? { photoUrl: photoUrl || null } : {}),
    },
  });

  if (user.role === "PATIENT") {
    const patient = await prisma.patient.findFirst({ where: { userId: user.id } });
    if (patient) {
      await prisma.patient.update({
        where: { id: patient.id },
        data: {
          ...(name && name.length >= 2 ? { name } : {}),
          ...(age !== undefined && Number.isInteger(age) && age > 0 && age < 130 ? { age } : {}),
          ...(gender && ["Female", "Male", "Other"].includes(gender) ? { gender } : {}),
          ...(phone !== undefined ? { phone: phone || null } : {}),
        },
      });
    }
  }

  return NextResponse.json({
    user: { id: updated.id, name: updated.name, email: updated.email, role: updated.role, photoUrl: updated.photoUrl },
  });
}
