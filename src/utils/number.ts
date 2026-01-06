// src/utils/number.ts

/**
 * Konverterer streng med både komma og punktum til tall.
 * Returnerer NaN dersom verdien ikke er numerisk.
 */
export function toNumber(value: string | number): number {
  if (typeof value === "number") return value;
  if (typeof value !== "string") return NaN;
  if (!value.trim()) return NaN;

  return parseFloat(value.replace(/,/g, "."));
}

/**
 * Formater tall til ønsket antall desimaler, default 3.
 */
export function formatNumber(value: number, decimals: number): string {
  if (!Number.isFinite(value)) return "";
  return value.toFixed(decimals);
}
