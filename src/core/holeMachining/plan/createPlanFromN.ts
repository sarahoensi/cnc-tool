// src/core/holeMachining/plan/createPlanFromN.ts

import type { HolePlan, HolePlanFromNInput } from "../types";
import { FieldValidationError } from "../../errors";

function isPos(x: unknown): x is number {
  return typeof x === "number" && Number.isFinite(x) && x > 0;
}

export function createPlanFromN(
  input: HolePlanFromNInput
): HolePlan {
  const { D_start, D_target, N } = input;
  const errors: Record<string, string> = {};

  if (!isPos(D_start)) {
    errors.D_start = "Start Ø må være > 0";
  }

  if (!isPos(D_target)) {
    errors.D_target = "Target Ø må være > 0";
  }

  if (isPos(D_start) && isPos(D_target) && D_target <= D_start) {
    errors.D_target =
      "Target Ø må være større enn Start Ø";
  }

  if (!Number.isInteger(N) || N <= 0) {
    errors.N = "Antall kutt må være et heltall ≥ 1";
  }

  if (Object.keys(errors).length > 0) {
    throw new FieldValidationError(errors);
  }

  const deltaD = (D_target - D_start) / N;
  const ae = deltaD / 2;

  const diameters = Array.from(
    { length: N + 1 },
    (_, i) => D_start + i * deltaD
  );

  return {
    D_start,
    D_target,
    N,
    diameters,
    deltaD,
    ae,
  };
}
