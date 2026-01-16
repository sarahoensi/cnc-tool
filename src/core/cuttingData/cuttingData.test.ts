// src/core/cuttingData/cuttingData.test.ts
import { describe, it, expect } from "vitest";
import { solveCuttingData } from "./solve/solveCuttingData";

describe("cuttingData solver", () => {
  it("løser n fra Vc og D", () => {
    const res = solveCuttingData({
      D: 10,
      Vc: 200,
      ap: 2,
      z: 4,
      fz: 0.05,
    });

    // n = (1000 * Vc) / (PI * D)
    expect(res.n).toBeCloseTo(6366.2, 1);
  });

  it("løser Vc fra n og D", () => {
    const res = solveCuttingData({
      D: 10,
      n: 6000,
      ap: 2,
      z: 4,
      fz: 0.05,
    });

    expect(res.Vc).toBeCloseTo(188.5, 1);
  });

  it("løser F fra fz, z og n", () => {
    const res = solveCuttingData({
      D: 10,
      Vc: 200,
      ap: 2,
      z: 4,
      fz: 0.05,
    });

    // F = fz * z * n
    expect(res.F).toBeCloseTo(res.fz * res.z * res.n, 5);
  });

  it("løser fz fra F, z og n", () => {
    const res = solveCuttingData({
      D: 10,
      Vc: 200,
      ap: 2,
      z: 4,
      F: 1200,
    });

    expect(res.fz).toBeCloseTo(res.F / (res.z * res.n), 6);
  });

  it("støtter full input uten beregning", () => {
    const res = solveCuttingData({
      D: 12,
      Vc: 180,
      n: 4800,
      F: 900,
      fz: 0.0469,
      ap: 1.5,
      z: 4,
    });

    expect(res.D).toBe(12);
    expect(res.ap).toBe(1.5);
    expect(res.z).toBe(4);
  });

  it("kaster feil hvis F og fz ikke henger sammen", () => {
    expect(() =>
      solveCuttingData({
        D: 10,
        Vc: 200,
        n: 6000,
        ap: 2,
        z: 4,
        F: 1000, // forventet 1200 gitt fz = 0.05
        fz: 0.05,
      })
    ).toThrow();
  });

  it("kaster feil hvis D mangler", () => {
    expect(() =>
      solveCuttingData({
        Vc: 200,
        ap: 2,
        z: 4,
        fz: 0.05,
      })
    ).toThrow();
  });

  it("kaster feil hvis både Vc og n mangler", () => {
    expect(() =>
      solveCuttingData({
        D: 10,
        ap: 2,
        z: 4,
        fz: 0.05,
      })
    ).toThrow();
  });

  it("kaster feil hvis både F og fz mangler", () => {
    expect(() =>
      solveCuttingData({
        D: 10,
        Vc: 200,
        ap: 2,
        z: 4,
      })
    ).toThrow();
  });

  it("kaster feil hvis ap mangler", () => {
    expect(() =>
      solveCuttingData({
        D: 10,
        Vc: 200,
        z: 4,
        fz: 0.05,
      })
    ).toThrow();
  });

  it("kaster feil hvis z mangler", () => {
    expect(() =>
      solveCuttingData({
        D: 10,
        Vc: 200,
        ap: 2,
        fz: 0.05,
      })
    ).toThrow();
  });
});
