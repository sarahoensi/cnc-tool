// src/core/helix/logic.ts

import type { HelixInput, HelixSolution } from "./types";
import { PI, tanDeg, atanDeg } from "../../utils/math";
import { FieldValidationError } from "../errors";

function isFiniteNumber(x: unknown): x is number {
  return typeof x === "number" && Number.isFinite(x);
}

/**
 * Løser helix enten fra:
 *  - pitch → vinkel
 *  - vinkel → pitch
 */
export function solveHelix(input: HelixInput): HelixSolution {
  const { mode, diameter, toolDiameter, pitch, angle } = input;

  const errors: Record<string, string> = {};

  if (!mode) {
    errors.mode = ("Helix-modus (inner/outer) mangler");
  }

  if (!isFiniteNumber(diameter) || diameter <= 0) {
    errors.diameter = ("Ugyldig diameter");
  }

   if (!isFiniteNumber(toolDiameter) || toolDiameter <= 0) {
    errors.toolDiameter = ("Diameter må settes og være > 0");
  }

    if (
    mode === "inner" &&
    isFiniteNumber(diameter) &&
    isFiniteNumber(toolDiameter) &&
    toolDiameter >= diameter
  ) {
    errors.toolDiameter =
      "Verktøydiameter må være mindre enn diameter ved indre helix";
  }

  const hasPitch = isFiniteNumber(pitch);
  const hasAngle = isFiniteNumber(angle);

  if (hasPitch && hasAngle) {
    errors.pitch = ("Oppgi enten pitch eller vinkel – ikke begge");
    errors.angle = ("Oppgi enten pitch eller vinkel – ikke begge");
  }

  if (!hasPitch && !hasAngle) {
    errors.pitch = ("Oppgi enten pitch eller vinkel");
    errors.angle = ("Oppgi enten pitch eller vinkel");

  }

  if (Object.keys(errors).length > 0) {
    throw new FieldValidationError(errors);
  }

  // --------- Validering ferdig ---------

 const effectiveDiameter =
    mode === "inner"
      ? diameter - toolDiameter!
      : diameter + toolDiameter!;

  // ✅ CASE 1: Pitch → Vinkel
  if (hasPitch) {
    const value = pitch!;
    if (value <= 0) throw new Error("Pitch må være > 0");

    const angleDeg = atanDeg(value / (PI * effectiveDiameter));

    return {
      mode,
      diameter,
      toolDiameter,
      effectiveDiameter,
      pitch: value,
      angle: angleDeg,
    };
  }

  // ✅ CASE 2: Vinkel → Pitch
  if (hasAngle) {
    const value = angle!;
    if (value <= 0 || value >= 90) {
      throw new Error("Vinkel må være mellom 0 og 90 grader");
    }

    const pitchVal = tanDeg(value) * PI * effectiveDiameter;

    return {
      mode,
      diameter,
      toolDiameter,
      effectiveDiameter,
      pitch: pitchVal,
      angle: value,
    };
  }

  throw new Error("Ugyldig helix-input");
}
