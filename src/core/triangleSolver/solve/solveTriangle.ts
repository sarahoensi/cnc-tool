import type {
  TriangleSolverInput,
  TriangleSolverSolution,
} from "../types";

import { validateTriangleInput } from "../rules/validateTriangleInput";
import { getTriangleAvailability } from "../rules/availability";
import { sinDeg, atanDeg } from "../../utils/math";

function isPos(x: unknown): x is number {
  return typeof x === "number" && Number.isFinite(x) && x > 0;
}

export function solveTriangle(
  input: TriangleSolverInput
): TriangleSolverSolution {
  validateTriangleInput(input);

  const availability = getTriangleAvailability(input);

  let { a, b, c, alpha, beta } = input;

  if (!availability.has.c && availability.canDerive.c) {
    c = Math.sqrt(a! * a! + b! * b!);
  }

  if (!availability.has.alpha && availability.canDerive.alpha) {
    alpha = atanDeg(a! / b!);
  }

  if (!availability.has.beta && isPos(alpha)) {
    beta = 90 - alpha;
  }

  if (!availability.has.a && availability.canDerive.a) {
    a = c! * sinDeg(alpha!);
  }

  if (!availability.has.b && availability.canDerive.b) {
    b = c! * sinDeg(beta!);
  }

  return { a: a!, b: b!, c: c!, alpha: alpha!, beta: beta! };
}
