// src/core/holeMachining/plan/createPlanFromNoStart.ts

import type {
  HolePlan,
  HolePlanFromNoStartInput,
} from "../types";
import { FieldValidationError } from "../../errors";

function isPos(x: unknown): x is number {
  return typeof x === "number" && Number.isFinite(x) && x > 0;
}

export function createPlanFromNoStart(
  input: HolePlanFromNoStartInput
): HolePlan {
  const { D_target, N, ae } = input;
  const errors: Record<string, string> = {};

  if (!isPos(D_target)) {
    errors.D_target = "Target Ø må være > 0";
  }

  if (!Number.isInteger(N) || N <= 0) {
    errors.N = "Antall kutt må være et heltall ≥ 1";
  }

  if (!isPos(ae)) {
    errors.ae = "Radialt inngrep må være > 0";
  }

  if (Object.keys(errors).length > 0) {
    throw new FieldValidationError(errors);
  }

  const totalDeltaD = 2 * ae * N;
  const D_start = D_target - totalDeltaD;

  if (D_start <= 0) {
    throw new FieldValidationError({
      ae:
        "Kombinasjonen av N og ae gir Start Ø ≤ 0",
    });
  }

  const deltaD = totalDeltaD / N;

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
