export function formatNumber(value: number, decimals: number): string {
  if (!Number.isFinite(value)) return "-";
  return value.toFixed(decimals);
}
