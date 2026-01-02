// src/core/triangleSolver/availability.ts

function isPos(x: unknown): x is number {
  return typeof x === "number" && Number.isFinite(x) && x > 0;
}

export function getTriangleAvailability(input: {
  a?: number;
  b?: number;
  c?: number;
  alpha?: number;
  beta?: number;
}) {
  const hasA = isPos(input.a);
  const hasB = isPos(input.b);
  const hasC = isPos(input.c);
  const hasAlpha = isPos(input.alpha);
  const hasBeta = isPos(input.beta);

  const canDeriveC = hasA && hasB;

  const canDeriveA =
    (hasC && hasAlpha) ||
    (hasB && hasBeta);

  const canDeriveB =
    (hasC && hasBeta) ||
    (hasA && hasAlpha);

  const canDeriveAlpha =
    (hasA && hasB) ||
    (hasA && hasC) ||
    (hasB && hasC);

  const canDeriveBeta = hasAlpha;

  return {
    hasA,
    hasB,
    hasC,
    hasAlpha,
    hasBeta,

    canDeriveA,
    canDeriveB,
    canDeriveC,
    canDeriveAlpha,
    canDeriveBeta,
  };
}
