// src/core/cuttingData/input/interpretCuttingInput.ts

import type { CuttingDataInput } from "../types";

function isPos(x: unknown): x is number {
  return typeof x === "number" && Number.isFinite(x) && x > 0;
}

export function interpretCuttingInput(input: CuttingDataInput) {
  return {
    has: {
      D: isPos(input.D),
      Vc: isPos(input.Vc),
      n: isPos(input.n),
      F: isPos(input.F),
      fz: isPos(input.fz),
      z: isPos(input.z),
    },
  };
}
