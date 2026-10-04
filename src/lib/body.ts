export type JsonBody = Record<string, unknown>;

export function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

export function asOptionalString(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value : null;
}

export function asNumber(value: unknown, fallback = 0): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}
