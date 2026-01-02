// tests/holeMachining/plan.test.ts
import { describe, it, expect } from "vitest";
import {
  createPlanFromN,
  createPlanFromAe,
  createPlanFromNoStart
} from "@core";

describe("Hole plan creation", () => {

  // -----------------------------
  // createPlanFromN
  // -----------------------------
  it("creates correct plan from N", () => {
    const plan = createPlanFromN({
      D_start: 10,
      D_target: 20,
      N: 5,
    });

    expect(plan.N).toBe(5);
    expect(plan.deltaD).toBe(2);
    expect(plan.ae).toBe(1);
    expect(plan.diameters).toEqual([10, 12, 14, 16, 18, 20]);
  });

  it("throws if N is invalid", () => {
    expect(() =>
      createPlanFromN({ D_start: 10, D_target: 20, N: 0 })
    ).toThrow();
  });

  // -----------------------------
  // createPlanFromAe
  // -----------------------------
  it("creates correct plan from ae", () => {
    const plan = createPlanFromAe({
      D_start: 10,
      D_target: 20,
      ae: 1,
    });

    // totalDelta = 10 → needs N = ceil(10 / (2*1)) = 5
    expect(plan.N).toBe(5);
    expect(plan.deltaD).toBe(2);
    expect(plan.ae).toBe(1); // effective ae
    //expect(plan.diameters.at(-1)).toBe(20);
  });

  it("throws if ae is invalid", () => {
    expect(() =>
      createPlanFromAe({ D_start: 10, D_target: 20, ae: 0 })
    ).toThrow();
  });

  // -----------------------------
  // createPlanFromNoStart
  // -----------------------------
  it("computes start diameter correctly from N + ae + target", () => {
    const plan = createPlanFromNoStart({
      D_target: 20,
      N: 5,
      ae: 1,
    });

    // totalDelta = 2*1*5 = 10 => start = 10
    expect(plan.D_start).toBe(10);
    expect(plan.deltaD).toBe(2);
    expect(plan.diameters).toEqual([10, 12, 14, 16, 18, 20]);
  });

  it("throws if calculated start diameter is <= 0", () => {
    expect(() =>
      createPlanFromNoStart({ D_target: 5, N: 5, ae: 1 })
    ).toThrow();
  });
});
