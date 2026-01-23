// src/core/holeMachining/plan/createPlanFromAe.ts

import type { HolePlan, HolePlanFromAeInput } from "../types";
import { FieldValidationError } from "../../errors";

function isPos(x: unknown): x is number {
  return typeof x === "number" && Number.isFinite(x) && x > 0;
}

export function createPlanFromAe(
  input: HolePlanFromAeInput
): HolePlan {
  const { mode, D_start, D_target, ae } = input;
  const errors: Record<string, string> = {};

  if (!isPos(D_start)) {
    errors.D_start = "Start Ø må være > 0";
  }

  if (!isPos(D_target)) {
    errors.D_target = "Target Ø må være > 0";
  }

  if (isPos(D_start) && isPos(D_target) && D_start === D_target) {
    errors.D_target =
      "Start Ø og Target Ø kan ikke være like";
  }

  if (!isPos(ae)) {
    errors.ae = "Radialt inngrep må være > 0";
  }

  if (Object.keys(errors).length > 0) {
    throw new FieldValidationError(errors);
  }

  const totalProgress = Math.abs(D_target - D_start);

  // Minst 1 steg
  const N = Math.max(
    1,
    Math.ceil(totalProgress  / (2 * ae))
  );

  const deltaProgress = totalProgress  / N;
  const aeEff = deltaProgress / 2;

  const diameters = Array.from(
    { length: N + 1 },
    (_, i) => D_start + i * deltaProgress
  );

  return {
    mode,
    D_start,
    D_target,
    N,
    diameters,
    deltaProgress,
    ae: aeEff,
  };
}
