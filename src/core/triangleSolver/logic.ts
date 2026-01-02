// src/core/triangleSolver/solveTriangle.ts

import type {
  TriangleSolverInput,
  TriangleSolverSolution,
} from "./types";
import { sinDeg, atanDeg } from "../../utils/math";
import { FieldValidationError } from "../errors";
import { getTriangleAvailability } from "./availability";

function isPos(x: unknown): x is number {
  return typeof x === "number" && Number.isFinite(x) && x > 0;
}

export function solveTriangle(
  input: TriangleSolverInput
): TriangleSolverSolution {
  const { a, b, c, alpha, beta } = input;

  const availability = getTriangleAvailability(input);
  const errors: Record<string, string> = {};

  // ----------------------------------
  // GRUNNVALIDERING
  // ----------------------------------
  if (alpha !== undefined && (alpha <= 0 || alpha >= 90)) {
    errors.alpha = "Vinkel må være mellom 0 og 90°";
  }

  if (beta !== undefined && (beta <= 0 || beta >= 90)) {
    errors.beta = "Vinkel må være mellom 0 og 90°";
  }

  if (Object.keys(errors).length > 0) {
    throw new FieldValidationError(errors);
  }

  // ----------------------------------
  // MINIMUM: minst 2 uavhengige verdier
  // ----------------------------------
  const givenCount = [
    availability.hasA,
    availability.hasB,
    availability.hasC,
    availability.hasAlpha,
    availability.hasBeta,
  ].filter(Boolean).length;

  if (givenCount < 2) {
    throw new FieldValidationError({
      a: "Oppgi minst 2 verdier",
      b: "Oppgi minst 2 verdier",
      c: "Oppgi minst 2 verdier",
      alpha: "Oppgi minst 2 verdier",
      beta: "Oppgi minst 2 verdier",
    });
  }

  // ----------------------------------
  // BEREGNING (deterministisk)
  // ----------------------------------
  let aVal = a;
  let bVal = b;
  let cVal = c;
  let alphaVal = alpha;
  let betaVal = beta;

  // c
  if (!availability.hasC && availability.canDeriveC) {
    cVal = Math.sqrt(a! * a! + b! * b!);
  }

  // alpha
  if (!availability.hasAlpha && availability.canDeriveAlpha) {
    if (isPos(a) && isPos(b)) {
      alphaVal = atanDeg(a / b);
    } else if (isPos(a) && isPos(cVal)) {
      alphaVal = Math.asin(a / cVal!) * (180 / Math.PI);
    } else if (isPos(b) && isPos(cVal)) {
      alphaVal = Math.acos(b / cVal!) * (180 / Math.PI);
    }
  }

  // beta
  if (!availability.hasBeta && isPos(alphaVal)) {
    betaVal = 90 - alphaVal;
  }

  // a
  if (!availability.hasA && availability.canDeriveA) {
    if (isPos(cVal) && isPos(alphaVal)) {
      aVal = cVal * sinDeg(alphaVal);
    } else if (isPos(b) && isPos(beta)) {
      aVal = b * Math.tan(beta * Math.PI / 180);
    }
  }

  // b
  if (!availability.hasB && availability.canDeriveB) {
    if (isPos(cVal) && isPos(betaVal)) {
      bVal = cVal * sinDeg(betaVal);
    } else if (isPos(a) && isPos(alpha)) {
      bVal = a / Math.tan(alpha * Math.PI / 180);
    }
  }

  return {
    a: aVal!,
    b: bVal!,
    c: cVal!,
    alpha: alphaVal!,
    beta: betaVal!,
  };
}
