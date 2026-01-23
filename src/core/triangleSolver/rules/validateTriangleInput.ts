// src/core/triangleSolver/rules/validateTriangleInput.ts

import type { TriangleSolverInput } from "../types";
import { FieldValidationError } from "../../errors";
import { getTriangleAvailability } from "./availability";

export type TriangleField =
  | "a"
  | "b"
  | "c"
  | "alpha"
  | "beta";

type ErrorMap = Partial<Record<TriangleField, string>>;

function addError(
  errors: ErrorMap,
  field: TriangleField,
  message: string
) {
  if (!errors[field]) {
    errors[field] = message;
  }
}

const EPS = 1e-6;

export function validateTriangleInput(input: TriangleSolverInput) {
  const availability = getTriangleAvailability(input);
  const { has } = availability;
  const errors: ErrorMap = {};

  const provided = Object.entries(has)
    .filter(([, v]) => v)
    .map(([k]) => k as TriangleField);

  // --------------------------------------------------
  // 1. Minimum: minst ett gyldig minimumssett
  // --------------------------------------------------
  const validMinimumSets: TriangleField[][] = [
    ["a", "b"],
    ["a", "alpha"],
    ["a", "beta"],
    ["b", "beta"],
    ["c", "alpha"],
    ["c", "beta"],
  ];

  const matchesMinimumSet = validMinimumSets.some(set =>
    set.every(k => has[k])
  );

  if (!matchesMinimumSet) {
    for (const key of provided) {
      addError(
        errors,
        key,
        "Denne kombinasjonen gir ikke en entydig rettvinklet trekant"
      );
    }
  }

  // --------------------------------------------------
  // 2. Gyldige vinkelgrenser
  // --------------------------------------------------
  if (has.alpha && (input.alpha! <= 0 || input.alpha! >= 90)) {
    addError(errors, "alpha", "Vinkel må være mellom 0 og 90°");
  }

  if (has.beta && (input.beta! <= 0 || input.beta! >= 90)) {
    addError(errors, "beta", "Vinkel må være mellom 0 og 90°");
  }

  // --------------------------------------------------
  // 3. Vinkelsum (α + β = 90)
  // --------------------------------------------------
  if (has.alpha && has.beta) {
    if (Math.abs(input.alpha! + input.beta! - 90) > EPS) {
      addError(errors, "alpha", "Summen av vinkler må være 90°");
      addError(errors, "beta", "Summen av vinkler må være 90°");
    }
  }

  // --------------------------------------------------
  // 4. Side–side–vinkel konsistens
  // --------------------------------------------------
  if (has.a && has.b && has.alpha) {
    const expected = Math.atan(input.a! / input.b!) * 180 / Math.PI;
    if (Math.abs(expected - input.alpha!) > 1e-3) {
      addError(errors, "alpha", "Vinkel stemmer ikke med sidene");
    }
  }

  if (has.a && has.b && has.beta) {
    const expected = Math.atan(input.b! / input.a!) * 180 / Math.PI;
    if (Math.abs(expected - input.beta!) > 1e-3) {
      addError(errors, "beta", "Vinkel stemmer ikke med sidene");
    }
  }

  // --------------------------------------------------
  // 5. Hypotenus-konsistens
  // --------------------------------------------------
  if (has.a && has.b && has.c) {
    const expected = Math.sqrt(input.a! ** 2 + input.b! ** 2);
    if (Math.abs(expected - input.c!) > 1e-3) {
      addError(errors, "c", "Hypotenusen stemmer ikke med katetene");
    }
  }

  // --------------------------------------------------
  // 6. Avbryt hvis noe er galt
  // --------------------------------------------------
  if (Object.keys(errors).length > 0) {
    throw new FieldValidationError(errors);
  }
}
