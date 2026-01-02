// src/core/holeMachining/execution.ts

import type {
  HoleExecutionState,
  HolePlan,
  HoleLogEntry,
  NextTargetInfo
} from "./types";

//
// Start execution session
//
export function startExecution(plan: HolePlan): HoleExecutionState {
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

//
// Compute next machining target
//
export function computeNextTarget(
  state: HoleExecutionState
): NextTargetInfo | null {
  if (state.finished) return null;
  if (state.step >= state.N) return null;

  const remainingSteps = state.N - state.step;
  const remainingDelta = state.D_target - state.lastDiameter;

  if (remainingDelta <= 0) return null;

  // Siste steg → eksakt mål
  if (remainingSteps === 1) {
    const deltaD = state.D_target - state.lastDiameter;
    return {
      nextDiameter: state.D_target,
      deltaD,
      ae: deltaD / 2,
    };
  }

  const deltaD = remainingDelta / remainingSteps;
  return {
    nextDiameter: state.lastDiameter + deltaD,
    deltaD,
    ae: deltaD / 2,
  };
}

//
// Register new measurement
//
export function registerMeasurement(
  state: HoleExecutionState,
  measured: number
): HoleExecutionState {

  const next = computeNextTarget(state);
  if (!next) {
    return { ...state, finished: true };
  }

  const logEntry: HoleLogEntry = {
    step: state.step + 1,
    measured,
    deltaD: next.deltaD,
    ae: next.ae,
  };

  const step = state.step + 1;
  const finished = step >= state.N;

  return {
    ...state,
    step,
    lastDiameter: measured,
    finished,
    log: [...state.log, logEntry]
  };
}
