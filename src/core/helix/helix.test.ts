import { describe, test, expect } from "vitest";
import { solveHelix } from "./logic";

describe("helix solver", () => {
  test("beregner helix-vinkel fra pitch og diameter (indre)", () => {
    const res = solveHelix({
      mode: "inner",
      diameter: 20,
      pitch: 10,
    });

    // tan(angle) = pitch / (π * D)
    // angle = atan(10 / (π * 20)) ≈ 9.04°
    expect(res.angle).toBeCloseTo(9.04, 2);
    expect(res.pitch).toBeCloseTo(10, 6);
  });

  test("beregner helix-vinkel fra pitch og diameter (ytre)", () => {
    const res = solveHelix({
      mode: "outer",
      diameter: 20,
      toolDiameter: 6,
      pitch: 10,
    });

    // Effektiv diameter = 20 + 6 = 26
    // angle = atan(10 / (π * 26)) ≈ 6.99°
    expect(res.angle).toBeCloseTo(6.99, 1);
  });

  test("beregner pitch fra vinkel og diameter", () => {
    const res = solveHelix({
      mode: "inner",
      diameter: 20,
      angle: 10,
    });

    const expectedPitch = Math.tan((10 * Math.PI) / 180) * Math.PI * 20;
    expect(res.pitch).toBeCloseTo(expectedPitch, 6);
  });

  test("feil hvis både angle og pitch mangler", () => {
    expect(() =>
      solveHelix({
        mode: "inner",
        diameter: 20,
      })
    ).toThrow();
  });

  test("feil hvis diameter mangler", () => {
    expect(() =>
      solveHelix({
        mode: "inner",
        pitch: 5,
      } as any)
    ).toThrow();
  });

  test("feil for ikke-endelige tall", () => {
    expect(() =>
      solveHelix({
        mode: "inner",
        diameter: Infinity,
        pitch: 5,
      } as any)
    ).toThrow();

    expect(() =>
      solveHelix({
        mode: "inner",
        diameter: 20,
        pitch: Infinity,
      })
    ).toThrow();
  });
});
