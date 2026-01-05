import type { HelixInput } from "../types";

function isPos(x: unknown): x is number {
  return typeof x === "number" && Number.isFinite(x) && x > 0;
}

export function getHelixAvailability(input: HelixInput) {
  const has = {
    mode: input.mode === "inner" || input.mode === "outer",
    diameter: isPos(input.diameter),
    toolDiameter: isPos(input.toolDiameter),
    pitch: isPos(input.pitch),
    angle: isPos(input.angle),
  };

  // Pitch og angle er gjensidig utelukkende drivere
  const hasDriver = has.pitch !== has.angle;

  // Effektiv diameter kan beregnes hvis grunnlag er til stede
  const canDeriveEffectiveDiameter =
    has.diameter &&
    (input.mode === "outer" || has.toolDiameter);

  // Kan løses hvis:
  // - eksakt én driver (pitch XOR angle)
  // - nødvendig geometri finnes
  const canSolve =
    hasDriver &&
    has.mode &&
    canDeriveEffectiveDiameter;

  // Hva kan avledes (rent beskrivende)
  const canDerive = {
    pitch: !has.pitch && has.angle && canDeriveEffectiveDiameter,
    angle: !has.angle && has.pitch && canDeriveEffectiveDiameter,
    effectiveDiameter: canDeriveEffectiveDiameter,
  };

  return {
    has,
    canDerive,
    canSolve,
  };
}
