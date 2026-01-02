// ui/triangleSolver/triangleAvailability.ts
import type { TriangleFields } from "./triangleTypes";

export function getTriangleAvailability(fields: TriangleFields) {
  const hasA = fields.a.value !== "";
  const hasB = fields.b.value !== "";
  const hasC = fields.c.value !== "";

  const hasAlpha = fields.alpha.value !== "";
  const hasBeta = fields.beta.value !== "";

  const sideCount = Number(hasA) + Number(hasB) + Number(hasC);

  const hasSide = sideCount >= 1;
  const hasTwoSides = sideCount >= 2;

  // ---- deriverbarhet (UI)
  const canDeriveC = hasA && hasB;
  const canDeriveAngles = hasTwoSides;

  const hasAngle = hasAlpha || hasBeta;

  return {
    // rå tilstedeværelse
    hasA,
    hasB,
    hasC,
    hasAlpha,
    hasBeta,

    // aggregert
    sideCount,
    hasSide,
    hasTwoSides,
    hasAngle,

    // 🔑 det UI faktisk trenger
    canDeriveC,
    canDeriveAngles,
  };
}
