export interface GeoPoint {
  lat: number;
  lng: number;
}

export interface HospitalLocation {
  name: string;
  tagline: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  hours: string;
  emergencyPhone: string;
  coords: GeoPoint;
}

/**
 * Badilisha `coords` hapa uweke mahali halisi pa hospitali yako
 * (fungua Google Maps -> right click kwenye jengo -> copy lat/lng).
 */
export const HOSPITAL_LOCATION: HospitalLocation = {
  name: "Northstar Health",
  tagline: "Main Hospital Campus",
  address: "12 Ocean Drive, Upanga",
  city: "Dar es Salaam, Tanzania",
  phone: "+255 22 000 0000",
  email: "care@northstar.health",
  hours: "Open 24 hours · Emergency never closes",
  emergencyPhone: "+255 22 000 9111",
  coords: { lat: -6.7924, lng: 39.2083 },
};

export const MAP_ZOOM = 15;

export type ZoneCategory =
  | "entrance"
  | "emergency"
  | "clinical"
  | "diagnostics"
  | "pharmacy"
  | "admin"
  | "facility";

export interface WayfindingZone {
  id: string;
  label: string;
  description: string;
  category: ZoneCategory;
  x: number;
  y: number;
  w: number;
  h: number;
}

export const ZONE_STYLES: Record<
  ZoneCategory,
  { fill: string; stroke: string; text: string; badge: string }
> = {
  entrance: { fill: "#d1fae5", stroke: "#10b981", text: "#065f46", badge: "bg-emerald-100 text-emerald-700" },
  emergency: { fill: "#fee2e2", stroke: "#ef4444", text: "#991b1b", badge: "bg-red-100 text-red-700" },
  clinical: { fill: "#e0f2fe", stroke: "#0ea5e9", text: "#075985", badge: "bg-sky-100 text-sky-700" },
  diagnostics: { fill: "#ede9fe", stroke: "#8b5cf6", text: "#5b21b6", badge: "bg-violet-100 text-violet-700" },
  pharmacy: { fill: "#f3e8ff", stroke: "#a855f7", text: "#6b21a8", badge: "bg-fuchsia-100 text-fuchsia-700" },
  admin: { fill: "#fef3c7", stroke: "#f59e0b", text: "#92400e", badge: "bg-amber-100 text-amber-700" },
  facility: { fill: "#e2e8f0", stroke: "#64748b", text: "#334155", badge: "bg-slate-100 text-slate-600" },
};

export const WAYFINDING_ZONES: WayfindingZone[] = [
  {
    id: "wards",
    label: "Wards A & B",
    description: "Inpatient beds, nurse station and patient monitoring.",
    category: "clinical",
    x: 60,
    y: 60,
    w: 210,
    h: 120,
  },
  {
    id: "maternity",
    label: "Maternity",
    description: "Maternity and newborn care unit.",
    category: "clinical",
    x: 290,
    y: 60,
    w: 200,
    h: 120,
  },
  {
    id: "icu",
    label: "ICU",
    description: "Intensive care — restricted access, visitors report to reception.",
    category: "emergency",
    x: 510,
    y: 60,
    w: 230,
    h: 120,
  },
  {
    id: "emergency",
    label: "Emergency",
    description: "Accident & emergency entrance. Open 24 hours.",
    category: "emergency",
    x: 60,
    y: 200,
    w: 210,
    h: 120,
  },
  {
    id: "clinics",
    label: "Consultation Rooms",
    description: "Outpatient clinics and doctor consultation rooms.",
    category: "clinical",
    x: 290,
    y: 200,
    w: 200,
    h: 120,
  },
  {
    id: "lab",
    label: "Laboratory",
    description: "Sample collection, tests and results.",
    category: "diagnostics",
    x: 510,
    y: 200,
    w: 110,
    h: 120,
  },
  {
    id: "radiology",
    label: "Radiology",
    description: "X-ray, ultrasound and imaging.",
    category: "diagnostics",
    x: 630,
    y: 200,
    w: 110,
    h: 120,
  },
  {
    id: "pharmacy",
    label: "Pharmacy",
    description: "Collect prescribed medicine here.",
    category: "pharmacy",
    x: 60,
    y: 340,
    w: 190,
    h: 110,
  },
  {
    id: "reception",
    label: "Reception & Registration",
    description: "Check-in, patient registration and queue numbers.",
    category: "entrance",
    x: 270,
    y: 340,
    w: 200,
    h: 110,
  },
  {
    id: "billing",
    label: "Billing & Cashier",
    description: "Invoices, payments, receipts and insurance.",
    category: "admin",
    x: 490,
    y: 340,
    w: 150,
    h: 110,
  },
  {
    id: "facilities",
    label: "Lifts & Restrooms",
    description: "Elevators, stairs and accessible washrooms.",
    category: "facility",
    x: 660,
    y: 340,
    w: 80,
    h: 110,
  },
];

export const YOU_ARE_HERE: GeoPoint & { x: number; y: number } = {
  lat: 0,
  lng: 0,
  x: 400,
  y: 486,
};

export function haversineKm(a: GeoPoint, b: GeoPoint): number {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

export function formatDistance(km: number): string {
  if (km < 1) return `${Math.round(km * 1000)} m`;
  return `${km.toFixed(1)} km`;
}

export function googleDirectionsUrl(from: GeoPoint | null, to: GeoPoint): string {
  const base = "https://www.google.com/maps/dir/?api=1";
  const dest = `&destination=${to.lat},${to.lng}`;
  if (!from) return `${base}${dest}`;
  return `${base}&origin=${from.lat},${from.lng}${dest}`;
}

export function osmDirectionsUrl(from: GeoPoint, to: GeoPoint): string {
  return `https://www.openstreetmap.org/directions?engine=fossgis_osrm_car&route=${from.lat},${from.lng};${to.lat},${to.lng}`;
}
