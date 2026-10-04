import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, setSessionCookie } from "@/lib/auth";

const STAFF_ROLES = ["ADMIN", "DOCTOR", "NURSE", "RECEPTIONIST", "PHARMACIST", "LAB"];

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body.password === "string" ? body.password : "";
  const role = typeof body.role === "string" ? body.role.toUpperCase() : "PATIENT";
  if (name.length < 2) return NextResponse.json({ error: "Name is required." }, { status: 400 });
  if (!email.includes("@")) return NextResponse.json({ error: "Valid email is required." }, { status: 400 });
  if (password.length < 6) return NextResponse.json({ error: "Password must be at least 6 characters." }, { status: 400 });
  if (role !== "PATIENT" && !STAFF_ROLES.includes(role)) {
    return NextResponse.json({ error: "Invalid role." }, { status: 400 });
  }
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return NextResponse.json({ error: "Email already registered." }, { status: 409 });

  const user = await prisma.user.create({
    data: { name, email, role, passwordHash: hashPassword(password) },
  });

  if (role === "PATIENT") {
    const age = Number(body.age);
    const gender = typeof body.gender === "string" ? body.gender : "Other";
    const departmentName = typeof body.department === "string" ? body.department : "";
    const dept =
      (await prisma.department.findFirst({ where: { name: departmentName } })) ??
      (await prisma.department.findFirst());
    if (dept) {
      const count = await prisma.patient.count();
      await prisma.patient.create({
        data: {
          patientCode: `PAT-${1000 + count + 1}`,
          name,
          age: Number.isInteger(age) && age > 0 && age < 130 ? age : 0,
          gender: ["Female", "Male", "Other"].includes(gender) ? gender : "Other",
          phone: typeof body.phone === "string" ? body.phone : null,
          departmentId: dept.id,
          userId: user.id,
        },
      });
    }
  }

  await setSessionCookie(user.id, user.role);
  return NextResponse.json({ user: { id: user.id, name, email, role } }, { status: 201 });
}
