import { HOSPITAL_LOCATION } from "./location";

export interface ServiceArticle {
  id: string;
  title: string;
  swTitle: string;
  keywords: string[];
  summary: string;
  details: string[];
  actions: { label: string; href: string }[];
}

/**
 * Knowledge base ya huduma za mfumo. AI ya ndani (bila API key) hutumia hii
 * kujibu maswali kwa Kiingereza au Kiswahili. Ukiona OPENAI_API_KEY kwenye
 * .env, maswali yanatumwa kwa OpenAI na maelezo haya yanatumika kama muktadha.
 */
export const SERVICE_KB: ServiceArticle[] = [
  {
    id: "registration",
    title: "Patient Registration",
    swTitle: "Usajili wa Mgonjwa",
    keywords: [
      "register", "registration", "new patient", "patient id", "check-in", "checkin", "reception",
      "usajili", "kujiandikisha", "mgonjwa mpya", "mapokezi", "kuingia",
    ],
    summary:
      "Reception registers a new patient or finds an existing record, then generates a unique Patient ID.",
    details: [
      "Search the patient first by name, phone or Patient ID so you do not create duplicates.",
      "If the patient is new, capture full name, gender, date of birth, phone, address, emergency contact, blood group, allergies and medical history.",
      "The system generates a unique Patient ID (e.g. PAT-1048) used everywhere else.",
      "Registration is step 3 of the workflow and the entry point to every other service.",
    ],
    actions: [
      { label: "Register a patient", href: "/dashboard/patients" },
      { label: "How to visit us", href: "/visit" },
    ],
  },
  {
    id: "appointments",
    title: "Appointments",
    swTitle: "Kuandaa Miadi",
    keywords: [
      "appointment", "book", "booking", "schedule", "queue number", "miadi", "kuweka miadi", "kuandaa",
    ],
    summary:
      "Patients or reception book an appointment by choosing department, doctor, date and time.",
    details: [
      "Flow: Patient/Reception → Book → Department → Doctor → Date & time → Confirm.",
      "A new appointment starts as PENDING and becomes CONFIRMED once the doctor confirms.",
      "On arrival the patient is checked in and given a queue number.",
    ],
    actions: [
      { label: "Open appointments", href: "/dashboard/appointments" },
      { label: "Plan a visit", href: "/visit" },
    ],
  },
  {
    id: "nurse",
    title: "Nurse Care & Vitals",
    swTitle: "Ushauri wa Wauguzi na Vipimo",
    keywords: [
      "nurse", "vitals", "vital signs", "blood pressure", "temperature", "pulse", "weight", "oxygen",
      "muuguzi", "wauguzi", "vipimo", "shinikizo", "joto", "mapigo", "uzito",
    ],
    summary:
      "Nurses call the patient from the queue, record vital signs and add nursing notes before sending them to the doctor.",
    details: [
      "Recorded vitals: blood pressure, temperature, heart rate, weight and oxygen level.",
      "Nursing notes are added to the same visit record.",
      "The patient is then sent to the doctor for consultation.",
    ],
    actions: [{ label: "Open nurse vitals", href: "/dashboard/nurse" }],
  },
  {
    id: "consultation",
    title: "Doctor Consultation",
    swTitle: "Kupatana na Daktari",
    keywords: [
      "doctor", "consultation", "diagnosis", "treatment", "symptoms", "follow-up", "follow up", "medical history",
      "daktari", "kushauriwa", "uchunguzi", "matibabu", "dalili", "ufuatiliaji",
    ],
    summary:
      "The doctor reviews history and vitals, records symptoms, diagnosis, notes and treatment, then requests lab or a prescription.",
    details: [
      "The doctor sees the patient's medical history and the vitals the nurse recorded.",
      "Records symptoms, diagnosis, doctor notes, treatment and any follow-up.",
      "If a test is needed a Laboratory request is created; otherwise a prescription goes to Pharmacy.",
    ],
    actions: [
      { label: "Open consultations", href: "/dashboard/consultation" },
      { label: "Care team", href: "/dashboard/doctors" },
    ],
  },
  {
    id: "laboratory",
    title: "Laboratory",
    swTitle: "Maabara",
    keywords: [
      "lab", "laboratory", "test", "sample", "results", "blood test", "maabara", "kipimo", "sampuli", "matokeo", "damu",
    ],
    summary:
      "Lab receives the doctor's request, collects a sample, performs the test and files the results on the patient record.",
    details: [
      "Flow: Doctor request → Lab receives → Sample collected → Test performed → Results entered.",
      "The doctor reviews results and the patient record is updated.",
    ],
    actions: [{ label: "Open laboratory", href: "/dashboard/lab" }],
  },
  {
    id: "pharmacy",
    title: "Pharmacy",
    swTitle: "Famasia",
    keywords: [
      "pharmacy", "medicine", "medicine stock", "prescription", "dispense", "inventory", "drug", "famasia", "dawa", "kuandikiwa dawa", "akiba ya dawa",
    ],
    summary:
      "Pharmacy checks the prescription, confirms stock, dispenses medicine and updates inventory.",
    details: [
      "Flow: Doctor creates prescription → Pharmacy receives → Check medicine → Dispense.",
      "If a medicine is out of stock the admin is notified and the prescription stays pending.",
      "Dispensing updates stock and marks the prescription COMPLETED.",
    ],
    actions: [{ label: "Open pharmacy", href: "/dashboard/pharmacy" }],
  },
  {
    id: "billing",
    title: "Billing & Payments",
    swTitle: "Malipo na Bili",
    keywords: [
      "bill", "billing", "payment", "invoice", "receipt", "insurance", "balance", "price", "cost", "malipo", "bili", "ankara", "risiti", "bima", "gharama",
    ],
    summary:
      "The system generates an invoice, totals services and tracks payment as PAID, PARTIAL or PENDING.",
    details: [
      "Invoice covers registration, consultation, laboratory, pharmacy and other services.",
      "Payment status is PAID, PARTIAL or PENDING — each triggers a receipt, balance or reminder.",
      "Final bill is generated before discharge for admitted patients.",
    ],
    actions: [{ label: "Open billing", href: "/dashboard/billing" }],
  },
  {
    id: "emergency",
    title: "Emergency & Triage",
    swTitle: "Dharura",
    keywords: [
      "emergency", "triage", "accident", "critical", "24/7", "dharura", "ajali", "hatari", "haraka",
    ],
    summary:
      "Emergency patients are registered, triaged immediately, their vitals taken and an emergency doctor assigned.",
    details: [
      "Open 24 hours — the emergency entrance is separate from the main entrance.",
      "Patient condition is marked STABLE or CRITICAL: stable patients may be discharged, critical patients admitted.",
      "Emergency phone: " + HOSPITAL_LOCATION.emergencyPhone + ".",
    ],
    actions: [
      { label: "Open emergency", href: "/dashboard/emergency" },
      { label: "Directions", href: "/visit" },
    ],
  },
  {
    id: "admissions",
    title: "Admission, Ward & Discharge",
    swTitle: "Kulazwa, Wodi na Kuruhusiwa",
    keywords: [
      "admission", "admit", "ward", "bed", "discharge", "inpatient", "icu", "kulazwa", "wodi", "kutoka hospitalini", "kuruhusiwa",
    ],
    summary:
      "A doctor recommends admission, a bed is assigned, the nurse monitors the patient, then a final bill is raised and the patient discharged.",
    details: [
      "Check bed availability; if full the patient joins a waiting list.",
      "Nurses monitor medication and lab tests; the doctor reviews progress.",
      "Discharge includes final diagnosis, discharge summary, final prescription, final bill and a follow-up appointment.",
    ],
    actions: [{ label: "Open admissions", href: "/dashboard/admissions" }],
  },
  {
    id: "records",
    title: "Medical Records & Patient Portal",
    swTitle: "Kumbukumbu za Matibabu na Portal ya Mgonjwa",
    keywords: [
      "records", "medical record", "history", "portal", "my appointments", "results", "kumbukumbu", "historia", "portal", "akaunti yangu",
    ],
    summary:
      "Every patient has one record with personal info, appointments, visits, vitals, diagnoses, prescriptions, lab results, allergies and billing history.",
    details: [
      "Staff view the full history from the patient profile.",
      "Patients log in to the portal to see appointments, visits, vitals, prescriptions, lab results, bills and admissions.",
    ],
    actions: [
      { label: "Patient records", href: "/dashboard/patients" },
      { label: "Open my portal", href: "/portal" },
    ],
  },
  {
    id: "location",
    title: "Location & Directions",
    swTitle: "Mahali na Maelekezo",
    keywords: [
      "location", "directions", "map", "where", "address", "parking", "hours", "find us", "mahali", "ramani", "maelekezo", "tulipo", "anwani", "masaa",
    ],
    summary:
      `${HOSPITAL_LOCATION.name} is at ${HOSPITAL_LOCATION.address}, ${HOSPITAL_LOCATION.city}.`,
    details: [
      "The location page reads your device location and shows a live distance to the hospital.",
      "You can search for any place on the map and get one-tap directions.",
      "Opening hours: " + HOSPITAL_LOCATION.hours + ".",
    ],
    actions: [
      { label: "Open map & directions", href: "/visit" },
      { label: "Contact us", href: "/contact" },
    ],
  },
  {
    id: "contact",
    title: "Contact & Support",
    swTitle: "Mawasiliano na Msaada",
    keywords: [
      "contact", "phone", "email", "support", "call", "help", "mawasiliano", "simu", "barua pepe", "msaada", "kuwasiliana",
    ],
    summary:
      `Reach us on ${HOSPITAL_LOCATION.phone} or ${HOSPITAL_LOCATION.email}.`,
    details: [
      "Reception: " + HOSPITAL_LOCATION.phone + " (general enquiries).",
      "Emergency: " + HOSPITAL_LOCATION.emergencyPhone + " — available 24/7.",
      "Email: " + HOSPITAL_LOCATION.email + ".",
    ],
    actions: [
      { label: "Contact page", href: "/contact" },
      { label: "Visit us", href: "/visit" },
    ],
  },
];

const GREETINGS = [
  "hi", "hello", "hey", "habari", "hujambo", "mambo", "salamu", "vipi", "shikamoo", "good morning", "good evening",
];

const THANKS = ["thanks", "thank you", "asante", "ahsante", "nice", "goodbye", "kwaheri"];

function normalize(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9\s/]/g, " ").replace(/\s+/g, " ").trim();
}

function scoreArticle(text: string, article: ServiceArticle): number {
  let score = 0;
  for (const keyword of article.keywords) {
    const k = normalize(keyword);
    if (!k) continue;
    if (text.includes(` ${k} `) || text.startsWith(`${k} `) || text.endsWith(` ${k}`) || text === k) {
      score += k.includes(" ") ? 4 : 3;
    } else if (text.includes(k)) {
      score += 1;
    }
  }
  return score;
}

export interface AiReply {
  reply: string;
  source: "builtin" | "openai";
  articles: { id: string; title: string }[];
  actions: { label: string; href: string }[];
  suggestions: string[];
}

const DEFAULT_SUGGESTIONS = [
  "How do I register a patient?",
  "What services does the hospital offer?",
  "How do I book an appointment?",
  "Where are you located?",
  "Jinsi ya kulipia bili?",
];

export function matchServices(question: string): ServiceArticle[] {
  const text = ` ${normalize(question)} `;
  return SERVICE_KB.map((a) => ({ a, s: scoreArticle(text, a) }))
    .filter((x) => x.s > 0)
    .sort((x, y) => y.s - x.s)
    .slice(0, 3)
    .map((x) => x.a);
}

function formatArticle(article: ServiceArticle): string {
  const points = article.details.map((d) => `• ${d}`).join("\n");
  const links = article.actions.map((a) => `${a.label} (${a.href})`).join(" · ");
  return `**${article.title}** — ${article.summary}\n${points}${links ? `\n${links}` : ""}`;
}

/**
 * AI ya ndani: haitaji API key. Hutumia maneno muhimu na knowledge base.
 */
export function builtinAnswer(question: string): AiReply {
  const text = normalize(question);
  const articles = matchServices(question);

  if (!text) {
    return {
      reply: "Ask me anything about the hospital services and I'll explain how they work.",
      source: "builtin",
      articles: [],
      actions: [{ label: "Services", href: "/services" }],
      suggestions: DEFAULT_SUGGESTIONS,
    };
  }

  if (GREETINGS.some((g) => text === g || text.startsWith(`${g} `))) {
    return {
      reply:
        "Hello! 👋 I'm the Northstar Health assistant. I can explain any of our services, how the hospital workflow works, location and contact details. What would you like to know?",
      source: "builtin",
      articles: [],
      actions: [{ label: "All services", href: "/services" }],
      suggestions: DEFAULT_SUGGESTIONS,
    };
  }

  if (THANKS.some((t) => text.includes(t))) {
    return {
      reply: `You're welcome! If you need anything else, ${HOSPITAL_LOCATION.name} is here 24/7.`,
      source: "builtin",
      articles: [],
      actions: [{ label: "Contact us", href: "/contact" }],
      suggestions: DEFAULT_SUGGESTIONS,
    };
  }

  const wantsAll = /(all services|everything|what do you offer|services offer|huduma zote|huduma gani|mnafanya nini|nyie ni nani)/.test(
    text,
  );
  if (wantsAll || articles.length === 0) {
    if (wantsAll) {
      const list = SERVICE_KB.map((a) => `• **${a.title}** — ${a.summary}`).join("\n");
      return {
        reply: `${HOSPITAL_LOCATION.name} provides a connected set of services:\n${list}`,
        source: "builtin",
        articles: SERVICE_KB.map((a) => ({ id: a.id, title: a.title })),
        actions: [{ label: "See services", href: "/services" }],
        suggestions: DEFAULT_SUGGESTIONS,
      };
    }
    return {
      reply:
        "Sina uhakika na swali hilo, lakini naweza kueleza huduma zetu: usajili wa mgonjwa, miadi, wauguzi na vipimo, ushauri wa daktari, maabara, famasia, malipo, dharura, kulazwa na kuruhusiwa. Una swali kuhusu ipi?",
      source: "builtin",
      articles: [],
      actions: [{ label: "All services", href: "/services" }],
      suggestions: DEFAULT_SUGGESTIONS,
    };
  }

  const primary = articles[0];
  let reply = formatArticle(primary);
  if (articles.length > 1) {
    reply += `\n\nRelated: ${articles.slice(1).map((a) => a.title).join(", ")}.`;
  }

  const seen = new Set<string>();
  const actions = articles
    .flatMap((a) => a.actions)
    .filter((a) => {
      if (seen.has(a.href)) return false;
      seen.add(a.href);
      return true;
    })
    .slice(0, 3);

  return {
    reply,
    source: "builtin",
    articles: articles.map((a) => ({ id: a.id, title: a.title })),
    actions,
    suggestions: DEFAULT_SUGGESTIONS,
  };
}

export function buildKnowledgePrompt(): string {
  const services = SERVICE_KB.map(
    (a) =>
      `### ${a.title} (${a.swTitle})\n${a.summary}\n${a.details.map((d) => `- ${d}`).join("\n")}\nLinks: ${a.actions
        .map((x) => `${x.label} ${x.href}`)
        .join(", ")}`,
  ).join("\n\n");

  return `You are the official AI assistant for ${HOSPITAL_LOCATION.name}, a hospital management system.
Answer only questions about the hospital services, workflow, location and contact details below.
Be concise, friendly and clear. Respond in the same language the user writes in (English or Kiswahili).
If the answer is not in the knowledge base, say so and suggest contacting ${HOSPITAL_LOCATION.phone}.
Never give medical advice or diagnoses.

Hospital: ${HOSPITAL_LOCATION.name}, ${HOSPITAL_LOCATION.address}, ${HOSPITAL_LOCATION.city}
Phone: ${HOSPITAL_LOCATION.phone} | Emergency: ${HOSPITAL_LOCATION.emergencyPhone} | Email: ${HOSPITAL_LOCATION.email}
Hours: ${HOSPITAL_LOCATION.hours}

## KNOWLEDGE BASE
${services}`;
}

/** Ikiwa OPENAI_API_KEY imewekwa, tumia OpenAI; vinginevyo tumia AI ya ndani. */
export async function askAi(
  question: string,
  history: { role: "user" | "assistant"; content: string }[] = [],
): Promise<AiReply> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return builtinAnswer(question);

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
        temperature: 0.4,
        max_tokens: 500,
        messages: [
          { role: "system", content: buildKnowledgePrompt() },
          ...history.slice(-6),
          { role: "user", content: question },
        ],
      }),
    });
    if (!res.ok) return builtinAnswer(question);
    const data = await res.json();
    const reply: string | undefined = data?.choices?.[0]?.message?.content;
    if (!reply) return builtinAnswer(question);

    const articles = matchServices(question);
    const seen = new Set<string>();
    const actions = articles
      .flatMap((a) => a.actions)
      .filter((a) => {
        if (seen.has(a.href)) return false;
        seen.add(a.href);
        return true;
      })
      .slice(0, 3);

    return {
      reply,
      source: "openai",
      articles: articles.map((a) => ({ id: a.id, title: a.title })),
      actions,
      suggestions: DEFAULT_SUGGESTIONS,
    };
  } catch {
    return builtinAnswer(question);
  }
}
