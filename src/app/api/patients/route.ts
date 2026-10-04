import { NextResponse } from "next/server";
import { validatePatient } from "@/lib/hospital";
import { createPatient, listPatients } from "@/lib/db";

export async function GET() {
  const patients = await listPatients();
  return NextResponse.json({ patients });
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Request body must be valid JSON." },
      { status: 400 },
    );
  }

  const result = validatePatient(body);
  if (result.error || !result.value) {
    return NextResponse.json(
      { error: result.error ?? "Invalid patient data." },
      { status: 400 },
    );
  }

  try {
    const patient = await createPatient(result.value);
    return NextResponse.json({ patient }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not create patient.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
