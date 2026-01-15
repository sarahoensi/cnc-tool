// src/core/triangleSolver/rules/availability.ts
import type { TriangleSolverInput } from "../types";

function isPos(x: unknown): x is number {
  return typeof x === "number" && Number.isFinite(x) && x > 0;
}

export function getTriangleAvailability(input: TriangleSolverInput) {
  const has = {
    a: isPos(input.a),
    b: isPos(input.b),
    c: isPos(input.c),
    alpha: isPos(input.alpha),
    beta: isPos(input.beta),
  };

  const canDerive = {
    a: (has.c && has.alpha) || (has.b && has.beta),
    b: (has.c && has.beta) || (has.a && has.alpha),
    c: (has.a && has.b), //||(has.a && has.alpha) || (has.b && has.beta),
    alpha: has.a && has.b || has.a && has.c || has.b && has.c,
    beta: has.alpha,
  };

  return { has, canDerive };
}
