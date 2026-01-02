import { FieldValidationError } from "../errors";

import type {
  HolePlan,
  HolePlanFromNInput,
  HolePlanFromAeInput,
  HolePlanFromNoStartInput,
} from "./types";

/**
 * Gyldige felt i UI
 */
type HoleFieldKey = "D_start" | "D_target" | "N" | "ae";

/**
 * Hjelper
 */
function isPos(x: unknown): x is number {
  return typeof x === "number" && Number.isFinite(x) && x > 0;
}

/**
 * --------------------------------------
 * PLAN FROM N
 * --------------------------------------
 */
export function createPlanFromN(
  input: HolePlanFromNInput
): HolePlan {
  const { D_start, D_target, N } = input;

  const errors: Partial<Record<HoleFieldKey, string>> = {};

  if (!isPos(D_start)) {
    errors.D_start = "Start Ø må være > 0";
  }

  if (!isPos(D_target)) {
    errors.D_target = "Target Ø må være > 0";
  }

  if (
    isPos(D_start) &&
    isPos(D_target) &&
    D_target <= D_start
  ) {
    errors.D_target = "Target Ø må være større enn Start Ø";
  }

  if (!Number.isInteger(N) || N <= 0) {
    errors.N = "Antall kutt må være et heltall ≥ 1";
  }

  if (Object.keys(errors).length > 0) {
    throw new FieldValidationError(errors);
  }

  const deltaD = (D_target - D_start) / N;
  const ae = deltaD / 2;

  const diameters = Array.from({ length: N + 1 }, (_, i) =>
    D_start + i * deltaD
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

/**
 * --------------------------------------
 * PLAN FROM ae (radialt inngrep)
 * --------------------------------------
 */
export function createPlanFromAe(
  input: HolePlanFromAeInput
): HolePlan {
  const { D_start, D_target, ae } = input;

  const errors: Partial<Record<HoleFieldKey, string>> = {};

  if (!isPos(D_start)) {
    errors.D_start = "Start Ø må være > 0";
  }

  if (!isPos(D_target)) {
    errors.D_target = "Target Ø må være > 0";
  }

  if (
    isPos(D_start) &&
    isPos(D_target) &&
    D_target <= D_start
  ) {
    errors.D_target = "Target Ø må være større enn Start Ø";
  }

  if (!isPos(ae)) {
    errors.ae = "Radialt inngrep må være > 0";
  }

  if (Object.keys(errors).length > 0) {
    throw new FieldValidationError(errors);
  }

  const totalDeltaD = D_target - D_start;
  const N = Math.max(1, Math.ceil(totalDeltaD / (2 * ae)));

  const deltaD = totalDeltaD / N;
  const aeEff = deltaD / 2;

  const diameters = Array.from({ length: N + 1 }, (_, i) =>
    D_start + i * deltaD
  );

  return {
    D_start,
    D_target,
    N,
    diameters,
    deltaD,
    ae: aeEff,
  };
}

/**
 * --------------------------------------
 * PLAN: Target + N + ae → beregn start
 * --------------------------------------
 */
export function createPlanFromNoStart(
  input: HolePlanFromNoStartInput
): HolePlan {
  const { D_target, N, ae } = input;

  const errors: Partial<Record<HoleFieldKey, string>> = {};

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
      ae: "Kombinasjonen N og ae gir Start Ø ≤ 0",
    });
  }

  const deltaD = totalDeltaD / N;

  const diameters = Array.from({ length: N + 1 }, (_, i) =>
    D_start + i * deltaD
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
