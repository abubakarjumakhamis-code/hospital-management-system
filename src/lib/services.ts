export interface PublicService {
  id: string;
  title: string;
  swTitle: string;
  icon: string;
  desc: string;
  points: string[];
}

export const PUBLIC_SERVICES: PublicService[] = [
  {
    id: "registration",
    title: "Patient Registration",
    swTitle: "Usajili wa Mgonjwa",
    icon: "🪪",
    desc: "Fast check-in and digital patient records from the moment you arrive.",
    points: [
      "Search existing records to avoid duplicates",
      "Capture personal, emergency and allergy details",
      "Unique Patient ID generated instantly",
      "One record shared across every department",
    ],
  },
  {
    id: "appointments",
    title: "Appointments",
    swTitle: "Miadi",
    icon: "🗓️",
    desc: "Book, confirm and track appointments with your preferred doctor.",
    points: [
      "Choose department, doctor, date and time",
      "Status moves from Pending to Confirmed",
      "Reminders and queue numbers on arrival",
      "Book from reception or the patient portal",
    ],
  },
  {
    id: "nurse",
    title: "Nurse Care & Vitals",
    swTitle: "Wauguzi na Vipimo",
    icon: "🩺",
    desc: "Nurses record blood pressure, temperature, pulse and weight every visit.",
    points: [
      "Blood pressure, temperature, heart rate, weight, oxygen",
      "Nursing notes attached to the visit",
      "Vitals visible to the doctor in real time",
      "Queue-based, orderly patient flow",
    ],
  },
  {
    id: "consultation",
    title: "Doctor Consultation",
    swTitle: "Ushauri wa Daktari",
    icon: "👨‍⚕️",
    desc: "Diagnosis, treatment plans, follow-ups and full medical history.",
    points: [
      "Full history and vitals on one screen",
      "Symptoms, diagnosis, notes and treatment",
      "Order lab tests or prescriptions directly",
      "Follow-up scheduling built in",
    ],
  },
  {
    id: "laboratory",
    title: "Laboratory",
    swTitle: "Maabara",
    icon: "🔬",
    desc: "Sample collection, testing and results delivered to your record.",
    points: [
      "Doctor requests arrive instantly",
      "Sample collection tracked by status",
      "Results filed on the patient record",
      "Doctor reviews results before treatment",
    ],
  },
  {
    id: "pharmacy",
    title: "Pharmacy",
    swTitle: "Famasia",
    icon: "💊",
    desc: "Prescriptions checked, stocked and dispensed the same day.",
    points: [
      "Prescriptions flow straight from the doctor",
      "Stock checked before dispensing",
      "Out-of-stock escalated to admin",
      "Inventory updated automatically",
    ],
  },
  {
    id: "billing",
    title: "Billing & Payments",
    swTitle: "Malipo na Bili",
    icon: "🧾",
    desc: "Transparent invoices, receipts and balance tracking.",
    points: [
      "Invoice covers every service received",
      "PAID, PARTIAL and PENDING tracking",
      "Receipts, balances and reminders",
      "Insurance and final discharge bills",
    ],
  },
  {
    id: "emergency",
    title: "Emergency & Admissions",
    swTitle: "Dharura na Kulazwa",
    icon: "🚑",
    desc: "24/7 triage, emergency care, ward admission and discharge.",
    points: [
      "Open 24 hours, separate emergency entrance",
      "Immediate triage and vitals",
      "Bed assignment and ward monitoring",
      "Discharge summary and follow-up",
    ],
  },
];
