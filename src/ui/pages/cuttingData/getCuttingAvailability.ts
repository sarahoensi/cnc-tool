// ui/cuttingData/cuttingAvailability.ts
import type { CuttingFields } from "./cuttingTypes";

export function getCuttingAvailability(fields: CuttingFields) {
  const hasD = fields.D.value !== "";
  const hasVc = fields.Vc.value !== "";
  const hasN = fields.n.value !== "";
  const hasZ = fields.z.value !== "";
  const hasF = fields.F.value !== "";
  const hasFz = fields.fz.value !== "";

  const canDeriveN = hasVc && hasD;
  const hasNEffective = hasN || canDeriveN;

  const canDeriveFz = hasF && hasZ && hasNEffective;
  const canDeriveF = hasFz && hasZ && hasNEffective;

  return {
    // grunnleggende
    hasD,
    hasVc,
    hasN,
    hasZ,
    hasF,
    hasFz,

    // effektiv tilgjengelighet
    n: hasNEffective,

    // deriverbarhet
    canDeriveN,
    canDeriveFz,
    canDeriveF,
  };
}
