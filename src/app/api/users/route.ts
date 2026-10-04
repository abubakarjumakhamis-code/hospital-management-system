import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser, hashPassword } from "@/lib/auth";

const ROLES = ["ADMIN", "DOCTOR", "NURSE", "RECEPTIONIST", "PHARMACIST", "LAB", "PATIENT"];

export async function GET() {
  const users = await prisma.user.findMany({ orderBy: { createdAt: "asc" } });
  return NextResponse.json({
    users: users.map((u) => ({ id: u.id, name: u.name, email: u.email, role: u.role, createdAt: u.createdAt })),
  });
}

export async function POST(request: Request) {
  const session = await getSessionUser();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Only admins can add staff." }, { status: 403 });
  }
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body.password === "string" ? body.password : "";
  const role = typeof body.role === "string" ? body.role.toUpperCase() : "";
  if (name.length < 2 || !email.includes("@") || password.length < 6 || !ROLES.includes(role)) {
    return NextResponse.json({ error: "Valid name, email, password (6+) and role are required." }, { status: 400 });
  }
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return NextResponse.json({ error: "Email already registered." }, { status: 409 });
  const user = await prisma.user.create({
    data: { name, email, role, passwordHash: hashPassword(password) },
  });
  return NextResponse.json({ user: { id: user.id, name, email, role } }, { status: 201 });
}
