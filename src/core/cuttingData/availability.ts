// core/cuttingData/availability.ts
function isPos(x: unknown): x is number {
  return typeof x === "number" && Number.isFinite(x) && x > 0;
}

export function getCuttingAvailability(input: {
  D?: number;
  Vc?: number;
  n?: number;
  F?: number;
  fz?: number;
  z?: number;
}) {
  const hasD = isPos(input.D);
  const hasVc = isPos(input.Vc);
  const hasN = isPos(input.n);
  const hasZ = isPos(input.z);
  const hasF = isPos(input.F);
  const hasFz = isPos(input.fz);

  const canDeriveN = hasVc && hasD;
  const hasNEffective = hasN || canDeriveN;

  const canDeriveFz = hasF && hasZ && hasNEffective;
  const canDeriveF = hasFz && hasZ && hasNEffective;

  return {
    hasD,
    hasVc,
    hasN,
    hasZ,
    hasF,
    hasFz,

    hasNEffective,
    canDeriveN,
    canDeriveFz,
    canDeriveF,
  };
}
