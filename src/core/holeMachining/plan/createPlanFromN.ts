// src/core/holeMachining/plan/createPlanFromN.ts

import type { HolePlan, HolePlanFromNInput } from "../types";
import { FieldValidationError } from "../../errors";

function isPos(x: unknown): x is number {
  return typeof x === "number" && Number.isFinite(x) && x > 0;
}

export function createPlanFromN(
  input: HolePlanFromNInput
): HolePlan {
  const { mode, D_start, D_target, N } = input;
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

  if (!Number.isInteger(N) || N <= 0) {
    errors.N = "Antall kutt må være et heltall ≥ 1";
  }

  if (Object.keys(errors).length > 0) {
    throw new FieldValidationError(errors);
  }

  const totalProgress = Math.abs(D_target - D_start);
  const deltaProgress = totalProgress / N;
  const ae = deltaProgress / 2;

  const diameters = Array.from(
    { length: N + 1 },
    (_, i) =>
      mode === "ID"
        ? D_start + i * deltaProgress
        : D_start - i * deltaProgress
  );

  return {
    mode,
    D_start,
    D_target,
    N,

    diameters,
    deltaProgress,
    ae,
  };
}
