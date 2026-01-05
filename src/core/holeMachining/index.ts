// src/core/holeMachining/index.ts

export type {
  HolePlan,
  HoleExecutionState,
  HoleLogEntry,
  NextTargetInfo,
  HolePlanFromNInput,
  HolePlanFromAeInput,
  HolePlanFromNoStartInput,
} from "./types";

// ---------- Planlegging ----------
export { createHolePlan } from "./plan/createHolePlan";

// ---------- Utførelse ----------
export {
  startExecution,
  computeNextTarget,
  registerMeasurement,
} from "./execution";
