import type {
  HoleExecutionState,
  NextTargetInfo,
} from "../types";

/**
 * Beregner neste mål-diameter basert på gjeldende execution-state.
 * Returnerer null hvis utførelsen er ferdig.
 */
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
    const deltaD = remainingDelta;
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
