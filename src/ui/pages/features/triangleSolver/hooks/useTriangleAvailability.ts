// src/ui/pages/triangleSolver/hooks/useTriangleAvailability.ts

import { getTriangleAvailability } from "@core/triangleSolver/rules/availability";
import type { TriangleFields } from "../types/triangleTypes";
import { toNumber } from "@utils/number";

export function useTriangleAvailability(fields: TriangleFields) {
  return getTriangleAvailability({
    a: toNumber(fields.a.value),
    b: toNumber(fields.b.value),
    c: toNumber(fields.c.value),
    alpha: toNumber(fields.alpha.value),
    beta: toNumber(fields.beta.value),
  });
}
