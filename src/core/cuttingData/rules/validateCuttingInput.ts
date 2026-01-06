import type { CuttingDataInput } from "../types";
import { FieldValidationError } from "../../errors";
import { getCuttingAvailability } from "./availability";

export function validateCuttingInput(input: CuttingDataInput) {
  const { has, hasNEffective } = getCuttingAvailability(input);

  const errors: Record<string, string> = {};

  //Basics
  if (!has.D) {
  errors.D = "Verktøydiameter må oppgis";
}

if (!has.z) {
  errors.z = "Antall tenner må oppgis";
}



  // ============================================================
  // 1. SPEED: Vc / n (XOR)
  // ============================================================

  if (has.Vc && has.n) {
    errors.Vc = "Du kan ikke fylle ut både skjærehastighet og turtall";
    errors.n  = "Du kan ikke fylle ut både skjærehastighet og turtall";
  }

  if (!has.Vc && !has.n) {
    errors.Vc = "Skjærehastighet eller turtall må oppgis";
    errors.n  = "Skjærehastighet eller turtall må oppgis";
  }

  // Diameter kreves hvis én av dem er satt
  if ((has.Vc || has.n) && !has.D) {
    errors.D = "Diameter kreves for å beregne turtall/skjærehastighet";
  }

  // ============================================================
  // 2. FEED: F / fz (XOR)
  // ============================================================

  if (has.F && has.fz) {
    errors.F  = "Du kan ikke fylle ut både matning og matning per tann";
    errors.fz = "Du kan ikke fylle ut både matning og matning per tann";
  }

  if (!has.F && !has.fz) {
    errors.F  = "Matning eller matning per tann må oppgis";
    errors.fz = "Matning eller matning per tann må oppgis";
  }

  // Antall tenner kreves hvis én av dem er satt
  if ((has.F || has.fz) && !has.z) {
    errors.z = "Antall tenner kreves for mating";
  }

  // Turtall (direkte eller via Vc) kreves hvis én av dem er satt
  if ((has.F || has.fz) && !hasNEffective) {
    errors.n = "Turtall eller skjærehastighet må oppgis for mating";
  }

  // ============================================================
  // 3. Avbryt ved feil
  // ============================================================

  if (Object.keys(errors).length > 0) {
    throw new FieldValidationError(errors);
  }
}
