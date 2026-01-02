// tests/holeMachining/execution.test.ts
import { describe, it, expect } from "vitest";
import {
  startExecution,
  computeNextTarget,
  registerMeasurement
} from "@core";

import { createPlanFromN } from "@core";

describe("Hole machining execution", () => {

  it("starts execution correctly", () => {
    const plan = createPlanFromN({ D_start: 10, D_target: 20, N: 5 });
    const state = startExecution(plan);

    expect(state.step).toBe(0);
    expect(state.lastDiameter).toBe(10);
    expect(state.finished).toBe(false);
    expect(state.log).toHaveLength(0);
  });

  it("computes next target correctly", () => {
    const plan = createPlanFromN({ D_start: 10, D_target: 20, N: 5 });
    const state = startExecution(plan);

    const next = computeNextTarget(state);
    expect(next?.nextDiameter).toBe(12);
    expect(next?.deltaD).toBe(2);
    expect(next?.ae).toBe(1);
  });

  it("updates state when registering measurement", () => {
    const plan = createPlanFromN({ D_start: 10, D_target: 20, N: 5 });
    let state = startExecution(plan);

    // Simulate user cutting and measuring 12.1 mm
    state = registerMeasurement(state, 12.1);

    expect(state.step).toBe(1);
    expect(state.lastDiameter).toBe(12.1);
    expect(state.log).toHaveLength(1);
    expect(state.log[0]).toMatchObject({
      step: 1,
      measured: 12.1,
      deltaD: 2,
      ae: 1,
    });
  });

  it("recalculates next step based on measurement deviation", () => {
    const plan = createPlanFromN({ D_start: 10, D_target: 20, N: 5 });
    let state = startExecution(plan);

    // F.eks. operatør tar litt for mye (12.4)
    state = registerMeasurement(state, 12.4);

    const next = computeNextTarget(state);

    // remainingSteps = 4
    // remainingDelta = 20 - 12.4 = 7.6
    expect(next?.deltaD).toBeCloseTo(7.6 / 4, 6);
    expect(next?.nextDiameter).toBeCloseTo(12.4 + 7.6 / 4, 6);
  });

  it("marks execution as finished after last step", () => {
    const plan = createPlanFromN({ D_start: 10, D_target: 20, N: 2 });
    let state = startExecution(plan);

    state = registerMeasurement(state, 15); // step 1
    state = registerMeasurement(state, 20); // step 2 → finished

    expect(state.finished).toBe(true);
    expect(computeNextTarget(state)).toBeNull();
  });
});
