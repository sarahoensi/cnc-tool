// src/core/helix/solve/solveHelix.ts

import type { HelixInput, HelixSolution } from "../types";
import { validateHelixInput } from "../rules/validateHelixInput";
import { PI, tanDeg, atanDeg } from "../../../utils/math";

export function solveHelix(input: HelixInput): HelixSolution {
  validateHelixInput(input);

  const { mode, diameter, toolDiameter, pitch, angle } = input;

  const effectiveDiameter =
    mode === "inner"
      ? diameter - toolDiameter!
      : diameter + toolDiameter!;

  if (pitch !== undefined) {
    const angleDeg = atanDeg(
      pitch / (PI * effectiveDiameter)
    );

    return {
      mode,
      diameter,
      toolDiameter,
      effectiveDiameter,
      pitch,
      angle: angleDeg,
    };
  }

  // angle !== undefined (garantert av validering)
  const pitchVal =
    tanDeg(angle!) * PI * effectiveDiameter;

  return {
    mode,
    diameter,
    toolDiameter,
    effectiveDiameter,
    pitch: pitchVal,
    angle: angle!,
  };
}
