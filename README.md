# Northstar Health — Hospital Management System (Next.js + Tailwind)

Modern full-stack rebuild of the vanilla starter in `../hospial management system`,
using **Next.js 16 (App Router) + React 19 + TypeScript + Tailwind CSS v4**.

Implements the first 5 steps of `Hospital_Management_System_Complete_Workflow.pdf`:
Hospital setup → Patient Registration → Appointment Management → Reception/Check-in
foundation, with UI matching the Figma-style sidebar/topbar/stats/tables layout.

## Run locally

Requires Node.js 18+.

```powershell
cd "C:\Users\UK\OneDrive\Documents\hospital-management-system"
npm install
npm run dev
```

Open http://127.0.0.1:3000.

Production check:

```powershell
npm run build
npm run start -- --port 3100 --hostname 127.0.0.1
```

## What is included

- `/` Overview dashboard — stats, today's appointments, departments, recent patients
- `/patients` — search/filter + register patient (POST /api/patients)
- `/appointments` — schedule list + book appointment (POST /api/appointments)
- `/doctors`, `/departments`, `/reports`, `/settings` — starter screens for next workflow steps
- `/location` — hospital map, live "you are here" geolocation, directions + in-hospital wayfinding (staff view)
- `/visit` — public patient/visitor guide with the same map, open to anyone (no sidebar)
- APIs: `GET /api/health`, `GET /api/dashboard`, `GET+POST /api/patients`, `GET+POST /api/appointments`
- Local JSON persistence in `data/hospital.json` (auto-created with sample data)

### Routes & layout

- `src/app/layout.tsx` — root shell only
- `src/app/(public)/` — public marketing site: `/` (home), `/about`, `/services`, `/contact`, plus `/login` and `/signup`
- `src/app/(dashboard)/` — staff area (adds the sidebar)
- `src/app/(portal)/` — public patient portal (own header, no sidebar), e.g. `/visit` and `/portal`
- Routes use groups `(...)` so URLs stay clean (`/location`, not `/dashboard/location`)

### AI assistant

A built-in assistant explains hospital services in English or Kiswahili. It is
available as a floating widget on the public site, dashboard and portal, and as
an API.

- `GET /api/ai` — lists the knowledge base and current mode
- `POST /api/ai` — `{ "message": "...", "history": [...] }` → `{ reply, actions, ... }`
- Knowledge base: `src/lib/ai.ts` (`SERVICE_KB`)
- Works with **no API key** using local keyword matching. Set `OPENAI_API_KEY`
  (and optionally `OPENAI_MODEL`, default `gpt-4o-mini`) in `.env` to route
  answers through OpenAI; the knowledge base is used as the system prompt.
- Widget: `src/components/AiAssistant.tsx`

### Hospital map

The map supports place search (OpenStreetMap Nominatim via `GET /api/geo/search`),
fullscreen, scale bar and click-to-enable scroll zoom, on top of the original
"you are here" geolocation and directions. Set the real hospital coordinates in
`src/lib/location.ts` (`HOSPITAL_LOCATION.coords`) and the contact details in the
same file. Geolocation needs `localhost` or HTTPS. The internal wayfinding plan
lives in `src/components/WayfindingMap.tsx` and its zones in `src/lib/location.ts`.

## Figma note

The Figma Make link you sent (`figma.com/make/...`) still requires login (403),
so I rebuilt from your existing Northstar UI + the Complete Workflow PDF.
To match your Figma pixel-for-pixel:

1. In Figma: Share → General access → **Anyone with the link can view**, resend link, or
2. Export the screens as PNG and paste them here.

Then I can align colors, spacing, and components exactly.

## Next steps (workflow order)

1. Auth + roles (Admin/Doctor/Nurse/Receptionist/Pharmacist/Lab/Patient)
2. Nurse vitals + Doctor consultation + Medical records
3. Lab → Pharmacy → Billing → Admission/Discharge
4. Replace `data/hospital.json` with Postgres + Prisma + audit trail before real patient data.

> Not a clinical system. No auth, encryption-at-rest, or audit yet. Do not use with real PHI.
