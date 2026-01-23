export type Decimals = 0 | 1 | 2 | 3 | 4 | 5 | 6;

const DECIMALS_KEY = "ui.decimals";
const DEFAULT_DECIMALS: Decimals = 3;

export function setDecimals(decimals: Decimals) {
  localStorage.setItem(DECIMALS_KEY, String(decimals));
  window.dispatchEvent(new Event("decimals-changed"));
}


export function getDecimals(): Decimals {
    const raw = localStorage.getItem(DECIMALS_KEY);

if (raw === null) {
    localStorage.setItem(DECIMALS_KEY, String(DEFAULT_DECIMALS));
    return DEFAULT_DECIMALS;
  }

  const value = Number(raw);

  if (Number.isInteger(value) && value >= 0 && value <= 6) {
    return value as Decimals;
  }

  return DEFAULT_DECIMALS; // ← 3
}
