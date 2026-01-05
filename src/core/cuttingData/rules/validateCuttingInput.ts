import type { CuttingDataInput } from "../types";
import { FieldValidationError } from "../../errors";
import { getCuttingAvailability } from "./availability";

const EPS = 1e-3;

export function validateCuttingInput(input: CuttingDataInput) {
  const { has, hasNEffective } = getCuttingAvailability(input);
  const errors: Record<string, string> = {};

  // ----------------------------
  // 1. SPEED: Vc ⇄ n
  // ----------------------------

  // Minst én av Vc / n
  if (!has.Vc && !has.n) {
    errors.Vc = "Skjærehastighet eller turtall må oppgis";
    errors.n  = "Skjærehastighet eller turtall må oppgis";
  }

  // Diameter kreves for å koble Vc ↔ n
  if (has.Vc !== has.n && !has.D) {
    errors.D = "Diameter kreves for å beregne mellom Vc og n";
  }

  // Konsistens: Vc = π·D·n / 1000
  if (has.Vc && has.n && has.D) {
    const expected =
      (Math.PI * input.D! * input.n!) / 1000;

    if (Math.abs(expected - input.Vc!) > EPS) {
      errors.Vc =
        "Skjærehastighet stemmer ikke med diameter og turtall";
      errors.n =
        "Turtall stemmer ikke med diameter og skjærehastighet";
    }
  }

  // ----------------------------
  // 2. FEED: F ⇄ fz
  // ----------------------------

  // Minst én av F / fz
  if (!has.F && !has.fz) {
    errors.F  = "Matning eller matning per tann må oppgis";
    errors.fz = "Matning eller matning per tann må oppgis";
  }

  // Antall tenner og turtall kreves
  if (has.F !== has.fz) {
    if (!has.z) {
      errors.z = "Antall tenner kreves for mating";
    }
    if (!hasNEffective) {
      errors.n = "Turtall kreves for mating";
    }
  }

  // Konsistens: F = fz · z · n
  if (has.F && has.fz && has.z && hasNEffective) {
    const nEffective =
      has.n
        ? input.n!
        : (1000 * input.Vc!) / (Math.PI * input.D!);

    const expected =
      input.fz! * input.z! * nEffective;

    if (Math.abs(expected - input.F!) > EPS) {
      errors.F =
        "Matning stemmer ikke med fz, z og turtall";
      errors.fz =
        "Matning per tann stemmer ikke med F, z og turtall";
    }
  }

  // ----------------------------
  // 3. Avbryt ved feil
  // ----------------------------
  if (Object.keys(errors).length > 0) {
    throw new FieldValidationError(errors);
  }
}
