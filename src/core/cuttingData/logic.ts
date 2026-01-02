import { PI } from "../../utils/math";
import type { CuttingDataInput, CuttingDataSolution } from "./types";
import { FieldValidationError } from "../errors";
import { getCuttingAvailability } from "./availability";

export function solveCuttingData(
  input: CuttingDataInput
): CuttingDataSolution {
  const { D, Vc, n, F, fz, z } = input;
  const errors: Record<string, string> = {};

  const availability = getCuttingAvailability(input);

  // --------------------------------
  // SPEED: Vc ⇄ n
  // --------------------------------
  if (!availability.hasVc && !availability.hasN) {
    errors.Vc = "Oppgi enten Vc eller n";
    errors.n = "Oppgi enten Vc eller n";
  }

  if (
    availability.hasVc !== availability.hasN &&
    !availability.hasD
  ) {
    errors.D = "Diameter kreves for å beregne mellom Vc og n";
  }

  // --------------------------------
  // FEED: F ⇄ fz
  // --------------------------------
  if (!availability.hasF && !availability.hasFz) {
    errors.F = "Oppgi enten F eller fz";
    errors.fz = "Oppgi enten F eller fz";
  }

  if (availability.hasF !== availability.hasFz) {
    if (!availability.hasZ) {
      errors.z = "Antall tenner kreves for mating";
    }
    if (!availability.hasNEffective) {
      errors.n = "Omdreininger n kreves for mating";
    }
  }

  if (Object.keys(errors).length > 0) {
    throw new FieldValidationError(errors);
  }

  // --------------------------------
  // CALCULATION
  // --------------------------------
  let nVal = n;
  let VcVal = Vc;
  let FVal = F;
  let fzVal = fz;

  if (!availability.hasN && availability.canDeriveN) {
    nVal = (1000 * Vc!) / (PI * D!);
  }

  if (!availability.hasVc && availability.hasN) {
    VcVal = (PI * D! * nVal!) / 1000;
  }

  if (availability.hasF && !availability.hasFz) {
    fzVal = F! / (z! * nVal!);
  }

  if (!availability.hasF && availability.hasFz) {
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
