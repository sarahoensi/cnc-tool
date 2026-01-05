// src/core/cuttingData/rules/availability.ts

import type { CuttingDataInput } from "../types";

function isPos(x: unknown): x is number {
  return typeof x === "number" && Number.isFinite(x) && x > 0;
}

export function getCuttingAvailability(input: CuttingDataInput) {
  const has = {
    D: isPos(input.D),
    Vc: isPos(input.Vc),
    n: isPos(input.n),
    F: isPos(input.F),
    fz: isPos(input.fz),
    z: isPos(input.z),
  };

  const canDeriveN = has.Vc && has.D;
  const hasNEffective = has.n || canDeriveN;

  const canDeriveF = has.fz && has.z && hasNEffective;
  const canDeriveFz = has.F && has.z && hasNEffective;

  return {
    has,
    canDerive: {
      n: canDeriveN,
      F: canDeriveF,
      fz: canDeriveFz,
    },
    hasNEffective,
  };
}
