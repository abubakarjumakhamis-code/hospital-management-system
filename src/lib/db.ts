import { prisma } from "./prisma";

export type PatientStatus = "Admitted" | "Outpatient" | "Discharged";
export type AppointmentStatus =
  | "Waiting"
  | "Checked in"
  | "In progress"
  | "Completed"
  | "Cancelled";

export interface PatientDTO {
  id: string;
  name: string;
  age: number;
  gender: "Female" | "Male" | "Other";
  department: string;
  status: PatientStatus;
  phone?: string;
  registeredAt: string;
}

export interface AppointmentDTO {
  id: string;
  time: string;
  patient: string;
  doctor: string;
  department: string;
  status: AppointmentStatus;
}

export async function getDepartments() {
  const rows = await prisma.department.findMany({ orderBy: { name: "asc" } });
  return rows.map((d) => d.name);
}

export async function listPatients() {
  const rows = await prisma.patient.findMany({
    include: { department: true },
    orderBy: { registeredAt: "desc" },
  });
  return rows.map(mapPatient);
}

export async function listRecentPatients(limit = 5) {
  const rows = await prisma.patient.findMany({
    include: { department: true },
    orderBy: { registeredAt: "desc" },
    take: limit,
  });
  return rows.map(mapPatient);
}

export async function createPatient(input: {
  name: string;
  age: number;
  gender: string;
  department: string;
  phone?: string;
}) {
  const dept = await prisma.department.findUnique({ where: { name: input.department } });
  if (!dept) throw new Error("Unknown department");
  const count = await prisma.patient.count();
  const patient = await prisma.patient.create({
    data: {
      patientCode: `PAT-${1048 + count}`,
      name: input.name,
      age: input.age,
      gender: input.gender,
      phone: input.phone,
      status: "Outpatient",
      departmentId: dept.id,
    },
    include: { department: true },
  });
  return mapPatient(patient);
}

export async function listAppointments() {
  const rows = await prisma.appointment.findMany({
    include: { patient: true, doctor: true, department: true },
    orderBy: { createdAt: "asc" },
  });
  return rows.map(mapAppointment);
}

export async function createAppointment(input: {
  time: string;
  patient: string;
  doctor: string;
  department: string;
}) {
  const [dept, patient, doctor] = await Promise.all([
    prisma.department.findUnique({ where: { name: input.department } }),
    prisma.patient.findFirst({ where: { name: input.patient } }),
    prisma.doctor.findFirst({ where: { name: input.doctor } }),
  ]);
  if (!dept) throw new Error("Unknown department");
  if (!patient) throw new Error("Patient not found. Register the patient first.");
  if (!doctor) throw new Error("Doctor not found");
  const count = await prisma.appointment.count();
  const appt = await prisma.appointment.create({
    data: {
      aptCode: `APT-${String(21 + count).padStart(3, "0")}`,
      time: input.time,
      patientId: patient.id,
      doctorId: doctor.id,
      departmentId: dept.id,
      status: "Waiting",
    },
    include: { patient: true, doctor: true, department: true },
  });
  return mapAppointment(appt);
}

export async function getDashboardData() {
  const [totalPatients, admitted, outpatient, appointmentsToday, departments, patients, appointments] =
    await Promise.all([
      prisma.patient.count(),
      prisma.patient.count({ where: { status: "Admitted" } }),
      prisma.patient.count({ where: { status: "Outpatient" } }),
      prisma.appointment.count(),
      prisma.department.count(),
      listRecentPatients(5),
      listAppointments(),
    ]);

  const departmentNames = await getDepartments();
  return {
    stats: { totalPatients, admitted, outpatient, appointmentsToday, departments, bedOccupancy: 72 },
    appointments,
    patients,
    departments: departmentNames,
  };
}

interface PatientRow {
  patientCode: string;
  name: string;
  age: number;
  gender: string;
  status: string;
  phone: string | null;
  registeredAt: Date;
  department?: { name: string } | null;
}

interface AppointmentRow {
  aptCode: string;
  time: string;
  status: string;
  patient?: { name: string } | null;
  doctor?: { name: string } | null;
  department?: { name: string } | null;
}

function mapPatient(p: PatientRow): PatientDTO {
  return {
    id: p.patientCode,
    name: p.name,
    age: p.age,
    gender: p.gender as PatientDTO["gender"],
    department: p.department?.name ?? "Unknown",
    status: p.status as PatientStatus,
    phone: p.phone ?? undefined,
    registeredAt: p.registeredAt.toISOString(),
  };
}

function mapAppointment(a: AppointmentRow): AppointmentDTO {
  return {
    id: a.aptCode,
    time: a.time,
    patient: a.patient?.name ?? "Unknown",
    doctor: a.doctor?.name ?? "Unknown",
    department: a.department?.name ?? "Unknown",
    status: a.status as AppointmentStatus,
  };
}
