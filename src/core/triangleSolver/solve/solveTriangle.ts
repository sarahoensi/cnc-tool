// src/core/triangleSolver/solve/solveTriangle.ts

import type {
  TriangleSolverInput,
  TriangleSolverSolution,
} from "../types";

import { validateTriangleInput } from "../rules/validateTriangleInput";
import { sinDeg, atanDeg } from "@utils/math";

function isPos(x: unknown): x is number {
  return typeof x === "number" && Number.isFinite(x) && x > 0;
}

export function solveTriangle(
  input: TriangleSolverInput
): TriangleSolverSolution {
  // 0. Input må være gyldig og entydig
  validateTriangleInput(input);

  let a = input.a;
  let b = input.b;
  let c = input.c;
  let alpha = input.alpha;
  let beta = input.beta;

  // --------------------------------------------------
  // Iterer til stabil løsning
  // --------------------------------------------------
  let changed = true;

  while (changed) {
    changed = false;

    // beta
    if (!isPos(beta) && isPos(alpha)) {
      beta = 90 - alpha;
      changed = true;
    }

    // alpha
    if (!isPos(alpha)) {
      if (isPos(a) && isPos(b)) {
        alpha = atanDeg(a / b);
        changed = true;
      } else if (isPos(a) && isPos(c)) {
        alpha = Math.asin(a / c) * 180 / Math.PI;
        changed = true;
      } else if (isPos(b) && isPos(c)) {
        alpha = Math.acos(b / c) * 180 / Math.PI;
        changed = true;
      }
    }

    // b
    if (!isPos(b)) {
      if (isPos(a) && isPos(alpha)) {
        b = a / Math.tan(alpha * Math.PI / 180);
        changed = true;
      } else if (isPos(c) && isPos(beta)) {
        b = c * sinDeg(beta);
        changed = true;
      }
    }

    // a
    if (!isPos(a)) {
      if (isPos(b) && isPos(beta)) {
        a = b * Math.tan(beta * Math.PI / 180);
        changed = true;
      } else if (isPos(c) && isPos(alpha)) {
        a = c * sinDeg(alpha);
        changed = true;
      }
    }

    // c
    if (!isPos(c) && isPos(a) && isPos(b)) {
      c = Math.sqrt(a * a + b * b);
      changed = true;
    }
  }

  // --------------------------------------------------
  // Sikkerhet: alt må være beregnet
  // --------------------------------------------------
  const result = { a, b, c, alpha, beta };

  for (const [key, value] of Object.entries(result)) {
    if (!Number.isFinite(value)) {
      throw new Error(`Intern feil: ${key} kunne ikke beregnes`);
    }
  }

  return result as TriangleSolverSolution;
}
