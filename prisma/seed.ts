import "dotenv/config";
import { promises as fs } from "node:fs";
import path from "node:path";
import { PrismaSqlite } from "prisma-adapter-sqlite";
import { PrismaClient } from "../src/generated/prisma/client";
import { hashPassword } from "../src/lib/auth";

const prisma = new PrismaClient({
  adapter: new PrismaSqlite({
    url: process.env.DATABASE_URL ?? "file:./prisma/dev.db",
  }),
});

interface LegacyPatient {
  id: string;
  name: string;
  age: number;
  gender: string;
  department: string;
  status?: string;
  registeredAt?: string;
}

interface LegacyAppointment {
  id: string;
  patient: string;
  doctor: string;
  department: string;
  time: string;
  status?: string;
}

async function main() {
  const legacyPath = path.join(process.cwd(), "data", "hospital.json");
  let legacy: { patients?: LegacyPatient[]; appointments?: LegacyAppointment[] } = {
    patients: [],
    appointments: [],
  };
  try {
    legacy = JSON.parse(await fs.readFile(legacyPath, "utf8"));
  } catch {
    // keep defaults
  }

  const departmentNames = ["Cardiology", "General Medicine", "Neurology", "Pediatrics"];
  const departments = await Promise.all(
    departmentNames.map((name) =>
      prisma.department.upsert({
        where: { name },
        update: {},
        create: { name, description: `${name} department` },
      }),
    ),
  );

  const passwordHash = hashPassword("password123");
  const staffSeeds = [
    { email: "admin@northstar.local", name: "Alex Morgan", role: "ADMIN" },
    { email: "doctor@northstar.local", name: "Dr. Sarah Chen", role: "DOCTOR" },
    { email: "nurse@northstar.local", name: "Nadia Rehema", role: "NURSE" },
    { email: "reception@northstar.local", name: "Baraka John", role: "RECEPTIONIST" },
    { email: "pharmacy@northstar.local", name: "Zainab Ali", role: "PHARMACIST" },
    { email: "lab@northstar.local", name: "Kelvin Mwita", role: "LAB" },
    { email: "patient@northstar.local", name: "Amara Johnson", role: "PATIENT" },
  ];
  for (const u of staffSeeds) {
    await prisma.user.upsert({
      where: { email: u.email },
      update: { passwordHash },
      create: { ...u, passwordHash },
    });
  }

  const patientUser = await prisma.user.findUnique({ where: { email: "patient@northstar.local" } });
  const amara = await prisma.patient.findFirst({ where: { name: "Amara Johnson" } });
  if (patientUser && amara && !amara.userId) {
    await prisma.patient.update({ where: { id: amara.id }, data: { userId: patientUser.id } });
  }

  const doctorSeeds = [
    { name: "Dr. Sarah Chen", specialty: "Cardiology", department: "Cardiology" },
    { name: "Dr. James Okafor", specialty: "Internal Medicine", department: "General Medicine" },
    { name: "Dr. Priya Shah", specialty: "Neurology", department: "Neurology" },
    { name: "Dr. Emily Foster", specialty: "Pediatrics", department: "Pediatrics" },
  ];

  for (const d of doctorSeeds) {
    const dept = departments.find((x) => x.name === d.department)!;
    const existing = await prisma.doctor.findFirst({ where: { name: d.name } });
    if (!existing) {
      await prisma.doctor.create({ data: { name: d.name, specialty: d.specialty, departmentId: dept.id } });
    }
  }

  for (const p of legacy.patients ?? []) {
    const dept = departments.find((d) => d.name === p.department) ?? departments[0];
    await prisma.patient.upsert({
      where: { patientCode: p.id },
      update: {},
      create: {
        patientCode: p.id,
        name: p.name,
        age: p.age,
        gender: p.gender,
        departmentId: dept.id,
        status: p.status ?? "Outpatient",
        registeredAt: p.registeredAt ? new Date(p.registeredAt) : new Date(),
      },
    });
  }

  for (const a of legacy.appointments ?? []) {
    const dept = departments.find((d) => d.name === a.department) ?? departments[0];
    let patient = await prisma.patient.findFirst({ where: { name: a.patient } });
    if (!patient) {
      patient = await prisma.patient.create({
        data: {
          patientCode: `PAT-${2000 + Math.floor(Math.random() * 1000)}`,
          name: a.patient,
          age: 30,
          gender: "Other",
          departmentId: dept.id,
          status: "Outpatient",
        },
      });
    }
    const doctor = await prisma.doctor.findFirst({ where: { name: a.doctor } });
    if (!doctor) continue;
    await prisma.appointment.upsert({
      where: { aptCode: a.id },
      update: {},
      create: {
        aptCode: a.id,
        time: a.time,
        status: a.status ?? "Waiting",
        patientId: patient.id,
        doctorId: doctor.id,
        departmentId: dept.id,
      },
    });
  }

  console.log("Seed completed");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
