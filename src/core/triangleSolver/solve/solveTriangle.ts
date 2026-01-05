// src/core/triangleSolver/solve/solveTriangle.ts

import type {
  TriangleSolverInput,
  TriangleSolverSolution,
} from "../types";

import { validateTriangleInput } from "../rules/validateTriangleInput";
import { getTriangleAvailability } from "../rules/availability";
import { sinDeg, atanDeg } from "@utils/math";

function isPos(x: unknown): x is number {
  return typeof x === "number" && Number.isFinite(x) && x > 0;
}

export function solveTriangle(
  input: TriangleSolverInput
): TriangleSolverSolution {
  // --------------------------------------------------
  // 0. Absolutt krav: input må være gyldig og entydig
  // --------------------------------------------------
  validateTriangleInput(input);

  // availability beskriver kun hva som var GITT
  const availability = getTriangleAvailability(input);
  const { has } = availability;

  // Arbeidskopi – her fyller vi ut løsningen
  let a = input.a;
  let b = input.b;
  let c = input.c;
  let alpha = input.alpha;
  let beta = input.beta;

  // --------------------------------------------------
  // 1. Hypotenus
  // --------------------------------------------------
  if (!has.c && isPos(a) && isPos(b)) {
    c = Math.sqrt(a * a + b * b);
  }

  // --------------------------------------------------
  // 2. Vinkel α
  // --------------------------------------------------
  if (!has.alpha) {
    if (isPos(a) && isPos(b)) {
      alpha = atanDeg(a / b);
    } else if (isPos(a) && isPos(c)) {
      alpha = Math.asin(a / c) * (180 / Math.PI);
    } else if (isPos(b) && isPos(c)) {
      alpha = Math.acos(b / c) * (180 / Math.PI);
    }
  }

  // --------------------------------------------------
  // 3. Vinkel β
  // --------------------------------------------------
  if (!has.beta) {
    if (isPos(alpha)) {
      beta = 90 - alpha;
    }
  }

  // --------------------------------------------------
  // 4. Katet a
  // --------------------------------------------------
  if (!has.a) {
    if (isPos(c) && isPos(alpha)) {
      a = c * sinDeg(alpha);
    } else if (isPos(b) && isPos(beta)) {
      a = b * Math.tan(beta * Math.PI / 180);
    }
  }

  // --------------------------------------------------
  // 5. Katet b
  // --------------------------------------------------
  if (!has.b) {
    if (isPos(c) && isPos(beta)) {
      b = c * sinDeg(beta);
    } else if (isPos(a) && isPos(alpha)) {
      b = a / Math.tan(alpha * Math.PI / 180);
    }
  }

  // --------------------------------------------------
  // 6. Sikkerhet: ingen NaN / undefined
  // --------------------------------------------------
  const result = { a, b, c, alpha, beta };

  for (const [key, value] of Object.entries(result)) {
    if (!Number.isFinite(value)) {
      throw new Error(
        `Intern feil: ${key} kunne ikke beregnes`
      );
    }
  }

  return result as TriangleSolverSolution;
}
