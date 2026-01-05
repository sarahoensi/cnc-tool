import type {
  HoleExecutionState,
  HolePlan,
} from "../types";

/**
 * Starter en ny utførelsesøkt basert på en ferdig plan.
 */
export function startExecution(
  plan: HolePlan
): HoleExecutionState {
  return {
    D_start: plan.D_start,
    D_target: plan.D_target,
    N: plan.N,

    step: 0,
    lastDiameter: plan.D_start,
    finished: false,

    log: [],
  };
}
