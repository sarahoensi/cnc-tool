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
  const { mode, D_target, N, ae } = input;
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

  // total bearbeiding i diameter (alltid positiv)
  const totalProgress = 2 * ae * N;

  // beregn startdiameter basert på ID / OD
  const D_start =
    mode === "ID"
      ? D_target - totalProgress
      : D_target + totalProgress;

  if (D_start <= 0) {
    throw new FieldValidationError({
      ae:
        "Kombinasjonen av N og ae gir Start Ø ≤ 0",
    });
  }

  const deltaProgress = totalProgress / N;
  const aeEff = deltaProgress / 2;

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
    ae: aeEff,
  };
}
