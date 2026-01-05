// src/core/helix/rules/validateHelixInput.ts

import type { HelixInput } from "../types";
import { FieldValidationError } from "../../errors";

function isPos(x: unknown): x is number {
  return typeof x === "number" && Number.isFinite(x) && x > 0;
}

export function validateHelixInput(input: HelixInput) {
  const { mode, diameter, toolDiameter, pitch, angle } = input;
  const errors: Record<string, string> = {};

  // --------------------------------------------------
  // 1. Grunnleggende tall
  // --------------------------------------------------
  if (!mode) {
    errors.mode = "Modus mangler";
  }

  if (!isPos(diameter)) {
    errors.diameter = "Diameter må være > 0";
  }

  if (!isPos(toolDiameter)) {
    errors.toolDiameter = "Verktøydiameter må være > 0";
  }

  // --------------------------------------------------
  // 2. Fysisk gyldighet
  // --------------------------------------------------
  if (
    mode === "inner" &&
    isPos(diameter) &&
    isPos(toolDiameter) &&
    toolDiameter >= diameter
  ) {
    errors.toolDiameter =
      "Verktøydiameter må være mindre enn diameter ved indre helix";
  }

  // --------------------------------------------------
  // 3. Entydighet (driver-regel)
  // --------------------------------------------------
  const hasPitch = isPos(pitch);
  const hasAngle = isPos(angle);

  if (hasPitch && hasAngle) {
    errors.pitch = "Oppgi enten pitch eller vinkel – ikke begge";
    errors.angle = "Oppgi enten pitch eller vinkel – ikke begge";
  }

  if (!hasPitch && !hasAngle) {
    errors.pitch = "Oppgi enten pitch eller vinkel";
    errors.angle = "Oppgi enten pitch eller vinkel";
  }

  // --------------------------------------------------
  // 4. Gyldige intervaller
  // --------------------------------------------------
  if (hasAngle && (angle! <= 0 || angle! >= 90)) {
    errors.angle = "Vinkel må være mellom 0 og 90°";
  }

  if (hasPitch && pitch! <= 0) {
    errors.pitch = "Pitch må være > 0";
  }

  // --------------------------------------------------
  // 5. Avbryt hvis noe er galt
  // --------------------------------------------------
  if (Object.keys(errors).length > 0) {
    throw new FieldValidationError(errors);
  }
}
