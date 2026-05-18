/**
 * Trims and returns a string, or a fallback (default "").
 */
export function toStr(value: unknown, fallback = ""): string {
  return String(value ?? fallback).trim();
}

/**
 * Normalises an email address: trims and lowercases.
 */
export function normalizeEmail(value: unknown): string {
  return String(value ?? "").trim().toLowerCase();
}

/**
 * Normalises a tag name: trim, lowercase, collapse inner spaces.
 */
export function normalizeTagName(value: unknown): string {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

/**
 * Parses a numeric id from a string route param.
 * Returns NaN if the string is not a valid integer.
 */
export function parseIntId(value: string): number {
  return Number(value);
}

/**
 * Returns an optional string column value: trims if truthy, null otherwise.
 */
export function toNullableStr(value: unknown): string | null {
  const trimmed = String(value ?? "").trim();
  return trimmed.length > 0 ? trimmed : null;
}


export function toNullableInt(value: unknown): number | null {
  if (value === undefined || value === null || value === "" || value === false)
    return null;
  const n = Number(value);
  return Number.isNaN(n) ? null : n;
}
