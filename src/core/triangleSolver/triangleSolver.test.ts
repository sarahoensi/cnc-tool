// src/core/triangleSolver/triangleSolver.test.ts
import { describe, it, expect } from "vitest";
import { solveTriangle } from "./logic";

describe("CNC Right Triangle Solver", () => {
  // Hjelper for å sammenligne med toleranse
  function closeTo(a: number, b: number, tol = 1e-6) {
    expect(Math.abs(a - b)).toBeLessThan(tol);
  }

  it("løser a + b → c, α, β", () => {
    // Klassisk 3-4-5, skal gi c=5 og kjente vinkler
    const res = solveTriangle({ a: 3, b: 4 });

    closeTo(res.c, 5);
    closeTo(res.alpha, 36.86989765, 1e-5); // atan(3/4) i grader
    closeTo(res.beta, 53.13010235, 1e-5);  // 90 - alpha
  });

  it("løser a + alpha → b, c, beta", () => {
    // Konstruert slik at c = 20, alpha = 30°
    // => a = 10, b ≈ 17.3205, beta = 60°
    const res = solveTriangle({ a: 10, alpha: 30 });

    closeTo(res.c, 20, 1e-5);
    closeTo(res.b, 17.320508, 1e-5);
    closeTo(res.beta, 60, 1e-5);
  });

  it("løser b + beta → a, c, alpha", () => {
    // Symmetrisk case: beta = 30°, b = 10
    // => c = 20, a ≈ 17.3205, alpha = 60°
    const res = solveTriangle({ b: 10, beta: 30 });

    closeTo(res.c, 20, 1e-5);
    closeTo(res.a, 17.320508, 1e-5);
    closeTo(res.alpha, 60, 1e-5);
  });

  it("kaster feil hvis færre enn 2 verdier er gitt", () => {
    expect(() => solveTriangle({})).toThrow();
    expect(() => solveTriangle({ a: 10 })).toThrow();
    expect(() => solveTriangle({ alpha: 30 })).toThrow();
  });

  it("kaster feil hvis flere enn 2 verdier er gitt", () => {
    expect(() => solveTriangle({ a: 3, b: 4, alpha: 30 })).toThrow();
    expect(() => solveTriangle({ a: 3, b: 4, beta: 60 })).toThrow();
  });

  it("kaster feil for ikke-støttet kombinasjon (a + c)", () => {
    expect(() => solveTriangle({ a: 10, c: 20 })).toThrow();
  });

  it("kaster feil for ikke-støttet kombinasjon (alpha + beta)", () => {
    expect(() => solveTriangle({ alpha: 30, beta: 60 })).toThrow();
  });

  it("kaster feil for ugyldig vinkel (alpha >= 90)", () => {
    expect(() => solveTriangle({ a: 10, alpha: 90 })).toThrow();
    expect(() => solveTriangle({ a: 10, alpha: 120 })).toThrow();
  });

  it("kaster feil for ugyldig vinkel (beta >= 90)", () => {
    expect(() => solveTriangle({ b: 10, beta: 90 })).toThrow();
  });

  it("kaster feil for negative eller null sider", () => {
    expect(() => solveTriangle({ a: -3, b: 4 })).toThrow();
    expect(() => solveTriangle({ a: 0, alpha: 30 })).toThrow();
  });
});
