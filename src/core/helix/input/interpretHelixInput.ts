// src/core/helix/input/interpretHelixInput.ts

import type { HelixInput } from "../types";

function isFiniteNumber(x: unknown): x is number {
  return typeof x === "number" && Number.isFinite(x);
}

export function interpretHelixInput(raw: HelixInput) {
  const has = {
    pitch: isFiniteNumber(raw.pitch),
    angle: isFiniteNumber(raw.angle),
  };

  return {
    raw,
    has,
  };
}
