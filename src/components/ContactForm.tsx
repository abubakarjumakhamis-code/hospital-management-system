"use client";

import { useState } from "react";
import { HOSPITAL_LOCATION } from "@/lib/location";

const SUBJECTS = [
  "General enquiry",
  "Appointments",
  "Billing question",
  "Laboratory",
  "Pharmacy",
  "Feedback",
];

export default function ContactForm() {
  const [sent, setSent] = useState(false);

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const name = String(form.get("name") ?? "");
    const email = String(form.get("email") ?? "");
    const subject = String(form.get("subject") ?? "General enquiry");
    const message = String(form.get("message") ?? "");

    const body = `Name: ${name}\nEmail: ${email}\n\n${message}`;
    window.location.href = `mailto:${HOSPITAL_LOCATION.email}?subject=${encodeURIComponent(
      `[${subject}] ${name}`,
    )}&body=${encodeURIComponent(body)}`;
    setSent(true);
  }

  return (
    <form onSubmit={submit} className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-[16px] font-extrabold text-slate-800">Send us a message</h2>
      <p className="mb-2 text-[12px] text-slate-500">
        We usually reply within one business day. For emergencies call{" "}
        {HOSPITAL_LOCATION.emergencyPhone}.
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="grid gap-1.5 text-[11px] font-semibold text-slate-600">
          Full name
          <input
            name="name"
            required
            minLength={2}
            placeholder="Your name"
            className="h-10 rounded-lg border border-slate-200 px-3 text-[13px] outline-none focus:border-[#3cbd95]"
          />
        </label>
        <label className="grid gap-1.5 text-[11px] font-semibold text-slate-600">
          Email
          <input
            name="email"
            type="email"
            required
            placeholder="you@example.com"
            className="h-10 rounded-lg border border-slate-200 px-3 text-[13px] outline-none focus:border-[#3cbd95]"
          />
        </label>
      </div>
      <label className="grid gap-1.5 text-[11px] font-semibold text-slate-600">
        Subject
        <select
          name="subject"
          className="h-10 rounded-lg border border-slate-200 px-3 text-[13px] outline-none focus:border-[#3cbd95]"
        >
          {SUBJECTS.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </label>
      <label className="grid gap-1.5 text-[11px] font-semibold text-slate-600">
        Message
        <textarea
          name="message"
          required
          rows={5}
          placeholder="How can we help?"
          className="rounded-lg border border-slate-200 px-3 py-2 text-[13px] outline-none focus:border-[#3cbd95]"
        />
      </label>
      <button className="mt-1 h-11 rounded-xl bg-[#25a67f] text-[13px] font-bold text-white hover:bg-[#218f6d]">
        Send message
      </button>
      {sent && (
        <p className="rounded-lg bg-emerald-50 px-3 py-2 text-[12px] font-semibold text-emerald-700">
          Your email app should now be open with the message ready to send.
        </p>
      )}
    </form>
  );
}
