import type {
  HolePlanFromNInput,
  HolePlanFromAeInput,
  HolePlanFromNoStartInput,
} from "../types";

/**
 * Samlet input-type.
 * Alle felter er valgfrie – dette er rå brukerinput.
 */
export type HolePlanInput =
  Partial<
    HolePlanFromNInput &
    HolePlanFromAeInput &
    HolePlanFromNoStartInput
  >;

/**
 * Hjelpefunksjoner
 */
function isPos(x: unknown): x is number {
  return typeof x === "number" && Number.isFinite(x) && x > 0;
}

function isPositiveInt(x: unknown): x is number {
  return Number.isInteger(x) && (x as number) > 0;
}

/**
 * Tolker input:
 * – sier KUN hvilke felter som er gyldig tilstede
 * – ingen regler
 * – ingen feilmeldinger
 */
export function interpretHolePlanInput(input: HolePlanInput) {
  const has = {
    D_start: isPos(input.D_start),
    D_target: isPos(input.D_target),
    N: isPositiveInt(input.N),
    ae: isPos(input.ae),
  };

  return { has };
}
