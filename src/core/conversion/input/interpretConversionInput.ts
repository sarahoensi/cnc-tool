import { ConversionInput } from "../types";

function isFiniteNumber(x: unknown): x is number {
  return typeof x === "number" && Number.isFinite(x);
}

export function interpretConversionInput(
  raw: ConversionInput
) {
  const has = {
    left: isFiniteNumber(raw.left),
    right: isFiniteNumber(raw.right),
  };

  const hasDriver = has.left !== has.right;

  return {
    raw,
    has,
    hasDriver,
  };
}
