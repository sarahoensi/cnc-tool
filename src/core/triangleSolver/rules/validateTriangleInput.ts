import { FieldValidationError } from "../../errors";
import { getTriangleAvailability } from "./availability";
import type { TriangleSolverInput } from "../types";

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

export function validateTriangleInput(input: TriangleSolverInput) {
  const availability = getTriangleAvailability(input);
  const errors: ErrorMap = {};

  const givenCount = Object.values(availability.has).filter(Boolean).length;

  if (givenCount === 0) {
    addError(errors, "a", "Oppgi minst to verdier");
  }

  if (availability.has.alpha && (input.alpha! <= 0 || input.alpha! >= 90)) {
    addError(errors, "alpha", "Vinkel må være mellom 0 og 90°");
  }

  if (availability.has.beta && (input.beta! <= 0 || input.beta! >= 90)) {
    addError(errors, "beta", "Vinkel må være mellom 0 og 90°");
  }

  if (Object.keys(errors).length > 0) {
    throw new FieldValidationError(errors);
  }
}
