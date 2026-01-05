// src/core/cuttingData/solve/solveCuttingData.ts

import { PI } from "../../../utils/math";
import type {
  CuttingDataInput,
  CuttingDataSolution,
} from "../types";

import { validateCuttingInput } from "../rules/validateCuttingInput";
import { getCuttingAvailability } from "../rules/availability";

export function solveCuttingData(
  input: CuttingDataInput
): CuttingDataSolution {
  validateCuttingInput(input);

  const { D, Vc, n, F, fz, z } = input;
  const availability = getCuttingAvailability(input);

  let nVal = n;
  let VcVal = Vc;
  let FVal = F;
  let fzVal = fz;

  // ----------------------------
  // SPEED
  // ----------------------------
  if (!availability.has.n && availability.canDerive.n) {
    nVal = (1000 * Vc!) / (PI * D!);
  }

  if (!availability.has.Vc && availability.has.n) {
    VcVal = (PI * D! * nVal!) / 1000;
  }

  // ----------------------------
  // FEED
  // ----------------------------
  if (availability.has.F && !availability.has.fz) {
    fzVal = F! / (z! * nVal!);
  }

  if (!availability.has.F && availability.has.fz) {
    FVal = fz! * z! * nVal!;
  }

  return {
    D,
    z,
    Vc: VcVal!,
    n: nVal!,
    F: FVal!,
    fz: fzVal!,
  };
}
