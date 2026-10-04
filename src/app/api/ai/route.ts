import { NextResponse } from "next/server";
import { askAi, SERVICE_KB } from "@/lib/ai";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    ok: true,
    mode: process.env.OPENAI_API_KEY ? "openai" : "builtin",
    description:
      "Northstar Health AI assistant. POST a question to get an explanation of our hospital services.",
    services: SERVICE_KB.map((s) => ({
      id: s.id,
      title: s.title,
      summary: s.summary,
    })),
  });
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

  const { message, history } = (body ?? {}) as {
    message?: unknown;
    history?: unknown;
  };

  if (typeof message !== "string" || !message.trim()) {
    return NextResponse.json(
      { error: "Provide a non-empty 'message'." },
      { status: 400 },
    );
  }

  const trimmed = message.trim().slice(0, 600);

  const safeHistory = Array.isArray(history)
    ? (history as { role?: unknown; content?: unknown }[])
        .filter(
          (h) =>
            (h?.role === "user" || h?.role === "assistant") &&
            typeof h?.content === "string",
        )
        .map((h) => ({
          role: h.role as "user" | "assistant",
          content: (h.content as string).slice(0, 1000),
        }))
        .slice(-6)
    : [];

  try {
    const result = await askAi(trimmed, safeHistory);
    return NextResponse.json(result);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "The assistant is unavailable right now.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
