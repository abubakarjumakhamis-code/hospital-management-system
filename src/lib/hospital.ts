import { promises as fs } from "node:fs";
import path from "node:path";

export type PatientStatus = "Admitted" | "Outpatient" | "Discharged";
export type AppointmentStatus =
  | "Waiting"
  | "Checked in"
  | "In progress"
  | "Completed"
  | "Cancelled";

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: "Female" | "Male" | "Other";
  department: string;
  status: PatientStatus;
  phone?: string;
  registeredAt: string;
}

export interface Appointment {
  id: string;
  time: string;
  patient: string;
  doctor: string;
  department: string;
  status: AppointmentStatus;
}

export interface HospitalStore {
  patients: Patient[];
  appointments: Appointment[];
}

export const DEPARTMENTS = [
  "Cardiology",
  "General Medicine",
  "Neurology",
  "Pediatrics",
] as const;

export const DOCTORS = [
  { name: "Dr. Sarah Chen", department: "Cardiology" },
  { name: "Dr. James Okafor", department: "General Medicine" },
  { name: "Dr. Priya Shah", department: "Neurology" },
  { name: "Dr. Emily Foster", department: "Pediatrics" },
] as const;

const DATA_FILE = path.join(process.cwd(), "data", "hospital.json");

const initialData: HospitalStore = {
  patients: [
    {
      id: "PAT-1048",
      name: "Amara Johnson",
      age: 34,
      gender: "Female",
      department: "Cardiology",
      status: "Admitted",
      registeredAt: "2026-10-03T08:15:00.000Z",
    },
    {
      id: "PAT-1047",
      name: "Noah Williams",
      age: 52,
      gender: "Male",
      department: "General Medicine",
      status: "Outpatient",
      registeredAt: "2026-10-03T07:45:00.000Z",
    },
    {
      id: "PAT-1046",
      name: "Zuri Patel",
      age: 19,
      gender: "Female",
      department: "Neurology",
      status: "Admitted",
      registeredAt: "2026-10-02T15:20:00.000Z",
    },
    {
      id: "PAT-1045",
      name: "Ethan Chen",
      age: 8,
      gender: "Male",
      department: "Pediatrics",
      status: "Outpatient",
      registeredAt: "2026-10-02T12:05:00.000Z",
    },
    {
      id: "PAT-1044",
      name: "Maya Thompson",
      age: 67,
      gender: "Female",
      department: "Cardiology",
      status: "Discharged",
      registeredAt: "2026-10-01T10:30:00.000Z",
    },
  ],
  appointments: [
    {
      id: "APT-021",
      time: "09:00 AM",
      patient: "Olivia Martin",
      doctor: "Dr. Sarah Chen",
      department: "Cardiology",
      status: "Checked in",
    },
    {
      id: "APT-022",
      time: "09:30 AM",
      patient: "Liam Davis",
      doctor: "Dr. James Okafor",
      department: "General Medicine",
      status: "In progress",
    },
    {
      id: "APT-023",
      time: "10:15 AM",
      patient: "Sofia Garcia",
      doctor: "Dr. Priya Shah",
      department: "Neurology",
      status: "Waiting",
    },
    {
      id: "APT-024",
      time: "11:00 AM",
      patient: "Ethan Chen",
      doctor: "Dr. Emily Foster",
      department: "Pediatrics",
      status: "Waiting",
    },
  ],
};

export async function loadStore(): Promise<HospitalStore> {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf8");
    const parsed = JSON.parse(raw) as HospitalStore;
    if (!Array.isArray(parsed.patients) || !Array.isArray(parsed.appointments)) {
      throw new Error("Invalid hospital data");
    }
    return parsed;
  } catch (error: unknown) {
    if ((error as NodeJS.ErrnoException)?.code === "ENOENT") {
      await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
      await fs.writeFile(DATA_FILE, JSON.stringify(initialData, null, 2) + "\n", "utf8");
      return structuredClone(initialData);
    }
    throw error;
  }
}

export async function saveStore(store: HospitalStore): Promise<void> {
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
  const tmp = `${DATA_FILE}.${Date.now()}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(store, null, 2) + "\n", "utf8");
  await fs.rename(tmp, DATA_FILE);
}

export function validatePatient(input: unknown): {
  error?: string;
  value?: Omit<Patient, "id" | "status" | "registeredAt">;
} {
  const data = input as Record<string, unknown>;
  const name = typeof data.name === "string" ? data.name.trim() : "";
  const age = Number(data.age);
  const gender = typeof data.gender === "string" ? data.gender : "";
  const department = typeof data.department === "string" ? data.department : "";
  const phone = typeof data.phone === "string" ? data.phone.trim() : "";

  if (name.length < 2 || name.length > 80) {
    return { error: "Name must be between 2 and 80 characters." };
  }
  if (!Number.isInteger(age) || age < 0 || age > 125) {
    return { error: "Age must be a whole number between 0 and 125." };
  }
  if (!["Female", "Male", "Other"].includes(gender)) {
    return { error: "Choose a valid gender option." };
  }
  if (!(DEPARTMENTS as readonly string[]).includes(department)) {
    return { error: "Choose a valid department." };
  }
  return {
    value: {
      name,
      age,
      gender: gender as Patient["gender"],
      department,
      phone,
    },
  };
}

export function validateAppointment(input: unknown): {
  error?: string;
  value?: Omit<Appointment, "id" | "status"> & { status?: AppointmentStatus };
} {
  const data = input as Record<string, unknown>;
  const time = typeof data.time === "string" ? data.time.trim() : "";
  const patient = typeof data.patient === "string" ? data.patient.trim() : "";
  const doctor = typeof data.doctor === "string" ? data.doctor : "";
  const department = typeof data.department === "string" ? data.department : "";

  if (time.length < 3) return { error: "Appointment time is required." };
  if (patient.length < 2) return { error: "Patient name is required." };
  if (!doctor) return { error: "Choose a doctor." };
  if (!(DEPARTMENTS as readonly string[]).includes(department)) {
    return { error: "Choose a valid department." };
  }
  return { value: { time, patient, doctor, department } };
}

export function nextPatientId(patients: Patient[]): string {
  const max = patients.reduce((highest, p) => {
    const n = Number(p.id.replace("PAT-", ""));
    return Number.isInteger(n) ? Math.max(highest, n) : highest;
  }, 1000);
  return `PAT-${max + 1}`;
}

export function nextAppointmentId(appointments: Appointment[]): string {
  const max = appointments.reduce((highest, a) => {
    const n = Number(a.id.replace("APT-", ""));
    return Number.isInteger(n) ? Math.max(highest, n) : highest;
  }, 20);
  return `APT-${String(max + 1).padStart(3, "0")}`;
}
