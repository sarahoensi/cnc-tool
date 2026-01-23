import { HoleExecutionState, NextTargetInfo } from "@core/holeMachining";

export type DiameterExecutionRules = {
  registerMeasurement(
    state: HoleExecutionState,
    value: number
  ): HoleExecutionState;

  computeNextTarget(
    state: HoleExecutionState
  ): NextTargetInfo | null;
};
