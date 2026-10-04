"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

interface ChatAction {
  label: string;
  href: string;
}

interface ChatMessage {
  id: number;
  role: "user" | "assistant";
  content: string;
  actions?: ChatAction[];
  source?: string;
}

const DEFAULT_SUGGESTIONS = [
  "What services do you offer?",
  "How do I book an appointment?",
  "Where are you located?",
  "Jinsi ya kulipia bili?",
];

/** Hugawanya maandishi kuwa HTML salama kwa **bold**, bullets na mistari. */
function renderContent(text: string) {
  const lines = text.split("\n");
  return lines.map((line, i) => {
    const bullet = line.trimStart().startsWith("•");
    const clean = bullet ? line.trimStart().slice(1).trim() : line;
    return (
      <p
        key={i}
        className={bullet ? "flex gap-1.5 pl-0.5" : undefined}
        style={{ marginTop: i === 0 ? 0 : 6 }}
      >
        {bullet && <span className="text-[#3cbd95]">•</span>}
        <span>{renderInline(clean)}</span>
      </p>
    );
  });
}

function renderInline(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-bold text-slate-800">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

export default function AiAssistant() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>(DEFAULT_SUGGESTIONS);
  const [loading, setLoading] = useState(false);
  const [configured, setConfigured] = useState(true);
  const listRef = useRef<HTMLDivElement | null>(null);
  const idRef = useRef(0);

  useEffect(() => {
    if (!open || messages.length > 0) return;
    setMessages([
      {
        id: idRef.current++,
        role: "assistant",
        content:
          "Hello! 👋 I'm the Northstar Health assistant. Ask me about our services, appointments, laboratory, pharmacy, billing, location or contact details.",
      },
    ]);
  }, [open, messages.length]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  async function send(question: string) {
    const text = question.trim();
    if (!text || loading) return;
    setInput("");
    const history = messages.map((m) => ({ role: m.role, content: m.content }));
    setMessages((prev) => [...prev, { id: idRef.current++, role: "user", content: text }]);
    setLoading(true);
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Request failed");
      setMessages((prev) => [
        ...prev,
        {
          id: idRef.current++,
          role: "assistant",
          content: data.reply,
          actions: data.actions,
          source: data.source,
        },
      ]);
      if (Array.isArray(data.suggestions) && data.suggestions.length) {
        setSuggestions(data.suggestions);
      }
    } catch {
      setConfigured(false);
      setMessages((prev) => [
        ...prev,
        {
          id: idRef.current++,
          role: "assistant",
          content:
            "Sorry, I could not answer right now. Please try again, or contact us on +255 22 000 0000.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Open AI assistant"
        className="fixed bottom-5 right-5 z-[900] flex h-14 items-center gap-2 rounded-full bg-[#25a67f] px-5 text-[13px] font-bold text-white shadow-[0_10px_30px_rgba(37,166,127,0.45)] transition hover:bg-[#218f6d]"
      >
        <span className="text-[18px] leading-none">{open ? "×" : "✦"}</span>
        <span className="hidden sm:inline">{open ? "Close" : "Ask AI"}</span>
      </button>

      {open && (
        <div className="fixed bottom-24 right-4 z-[900] flex h-[min(560px,75vh)] w-[min(380px,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
          <div className="flex items-center gap-3 bg-[#18263a] px-4 py-3 text-white">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#3cbd95] text-lg font-bold">
              ✦
            </span>
            <div className="leading-tight">
              <strong className="block text-[13px] font-extrabold">
                Northstar Assistant
              </strong>
              <small className="text-[9px] text-slate-300">
                {configured ? "Online · answers about our services" : "Having trouble connecting"}
              </small>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="ml-auto grid h-7 w-7 place-items-center rounded-lg text-slate-300 hover:bg-white/10"
              aria-label="Close"
            >
              ×
            </button>
          </div>

          <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto bg-[#f7f9fb] p-4">
            {messages.map((m) => (
              <div
                key={m.id}
                className={m.role === "user" ? "flex justify-end" : "flex justify-start"}
              >
                <div
                  className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 text-[12px] leading-relaxed ${
                    m.role === "user"
                      ? "rounded-br-sm bg-[#18263a] text-white"
                      : "rounded-bl-sm border border-slate-200 bg-white text-slate-600"
                  }`}
                >
                  {renderContent(m.content)}
                  {m.actions && m.actions.length > 0 && (
                    <div className="mt-2.5 flex flex-wrap gap-1.5">
                      {m.actions.map((a) => (
                        <Link
                          key={a.href}
                          href={a.href}
                          className="rounded-lg bg-emerald-50 px-2.5 py-1.5 text-[10px] font-bold text-emerald-700 hover:bg-emerald-100"
                        >
                          {a.label} →
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="flex gap-1 rounded-2xl rounded-bl-sm border border-slate-200 bg-white px-4 py-3">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.3s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.15s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400" />
                </div>
              </div>
            )}
          </div>

          {messages.length <= 1 && (
            <div className="flex flex-wrap gap-1.5 border-t border-slate-100 bg-white px-3 pt-3">
              {suggestions.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => send(s)}
                  className="rounded-full border border-slate-200 px-2.5 py-1 text-[10px] font-semibold text-slate-600 hover:border-emerald-300 hover:text-emerald-700"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex items-center gap-2 border-t border-slate-100 bg-white p-3"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about a service…"
              maxLength={600}
              className="h-10 flex-1 rounded-xl border border-slate-200 px-3 text-[12px] outline-none focus:border-[#3cbd95]"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="grid h-10 w-10 place-items-center rounded-xl bg-[#25a67f] text-white disabled:opacity-50"
              aria-label="Send"
            >
              ➤
            </button>
          </form>
        </div>
      )}
    </>
  );
}
