"use client";

import { useState } from "react";
import {
  WAYFINDING_ZONES,
  ZONE_STYLES,
  type WayfindingZone,
  type ZoneCategory,
} from "@/lib/location";

const LEGEND: { category: ZoneCategory; label: string }[] = [
  { category: "entrance", label: "Entrance / Reception" },
  { category: "emergency", label: "Emergency" },
  { category: "clinical", label: "Clinical care" },
  { category: "diagnostics", label: "Diagnostics" },
  { category: "pharmacy", label: "Pharmacy" },
  { category: "admin", label: "Billing / Admin" },
  { category: "facility", label: "Facilities" },
];

export default function WayfindingMap() {
  const [activeId, setActiveId] = useState<string>("reception");
  const active = WAYFINDING_ZONES.find((z) => z.id === activeId) ?? null;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-6">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-[14px] font-bold text-slate-800">
            Inside the hospital
          </h2>
          <p className="text-[11px] text-slate-500">
            Gwiji la ndani — bofya eneo lolote kuona huduma inayopatikana.
          </p>
        </div>
        <span className="rounded-full bg-emerald-50 px-3 py-1 text-[9px] font-bold text-emerald-700">
          ● You are here — Main Entrance
        </span>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.6fr_1fr]">
        <div className="overflow-x-auto">
          <svg
            viewBox="0 0 800 540"
            className="mx-auto h-auto w-full min-w-[520px] max-w-[820px]"
            role="img"
            aria-label="Hospital floor plan"
          >
            <rect x="40" y="40" width="720" height="440" rx="18" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2" />
            <text x="400" y="72" textAnchor="middle" className="fill-slate-400" fontSize="11" fontWeight="700" letterSpacing="2">
              GROUND FLOOR — PATIENT SERVICES
            </text>

            {WAYFINDING_ZONES.map((zone) => (
              <ZoneShape
                key={zone.id}
                zone={zone}
                active={zone.id === activeId}
                onSelect={() => setActiveId(zone.id)}
              />
            ))}

            <g>
              <line x1="400" y1="452" x2="400" y2="480" stroke="#10b981" strokeWidth="3" />
              <polygon points="400,486 392,472 408,472" fill="#10b981" />
              <rect x="318" y="496" width="164" height="26" rx="13" fill="#10b981" />
              <text x="400" y="513" textAnchor="middle" fontSize="11" fontWeight="700" fill="#ffffff">
                YOU ARE HERE
              </text>
            </g>

            <g>
              <rect x="300" y="300" width="200" height="24" rx="6" fill="#ffffff" stroke="#e2e8f0" />
              <text x="400" y="316" textAnchor="middle" fontSize="10" fill="#94a3b8">
                ↕ Main corridor
              </text>
            </g>
          </svg>
        </div>

        <div className="flex flex-col gap-3">
          {active && (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <span className={`inline-flex rounded-full px-2.5 py-1 text-[9px] font-bold ${ZONE_STYLES[active.category].badge}`}>
                {active.label}
              </span>
              <p className="mt-2 text-[11px] leading-relaxed text-slate-600">
                {active.description}
              </p>
            </div>
          )}

          <div className="rounded-xl border border-slate-200 p-3">
            <p className="mb-2 text-[9px] font-bold tracking-widest text-slate-400">
              QUICK GUIDE
            </p>
            <ul className="grid gap-1.5">
              {WAYFINDING_ZONES.map((zone) => (
                <li key={zone.id}>
                  <button
                    type="button"
                    onClick={() => setActiveId(zone.id)}
                    className={`flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-[10px] transition ${
                      zone.id === activeId
                        ? "bg-slate-100 font-bold text-slate-700"
                        : "text-slate-500 hover:bg-slate-50"
                    }`}
                  >
                    <span
                      className="h-2.5 w-2.5 flex-none rounded-full"
                      style={{ background: ZONE_STYLES[zone.category].stroke }}
                    />
                    {zone.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {LEGEND.map((item) => (
              <span
                key={item.category}
                className="inline-flex items-center gap-1.5 rounded-full bg-slate-50 px-2 py-1 text-[8px] font-semibold text-slate-500"
              >
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ background: ZONE_STYLES[item.category].stroke }}
                />
                {item.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ZoneShape({
  zone,
  active,
  onSelect,
}: {
  zone: WayfindingZone;
  active: boolean;
  onSelect: () => void;
}) {
  const style = ZONE_STYLES[zone.category];
  return (
    <g
      onClick={onSelect}
      className="cursor-pointer"
      role="button"
      aria-label={zone.label}
    >
      <rect
        x={zone.x}
        y={zone.y}
        width={zone.w}
        height={zone.h}
        rx="12"
        fill={style.fill}
        stroke={active ? style.stroke : "#ffffff"}
        strokeWidth={active ? 3.5 : 2}
        style={{ transition: "all .18s ease" }}
      />
      <text
        x={zone.x + zone.w / 2}
        y={zone.y + zone.h / 2 + 4}
        textAnchor="middle"
        fontSize="12"
        fontWeight="700"
        fill={style.text}
        className="pointer-events-none select-none"
      >
        {zone.label}
      </text>
    </g>
  );
}
