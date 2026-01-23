import {
  denormalizeDiameter,
  normalizeDiameterSpace,
} from "../normalizedDiameterSpace";
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

  const space = normalizeDiameterSpace(
    state.D_start,
    state.D_target,
    state.mode
  );

  const currentProgress = Math.abs(
    state.lastDiameter - state.D_start
  );

  const remainingSteps = state.N - state.step;
  const remainingProgress =
    space.progressTarget - currentProgress;

  if (remainingProgress <= 0) return null;

  const deltaProgress =
    remainingSteps === 1
      ? remainingProgress
      : remainingProgress / remainingSteps;

  const nextProgress =
    currentProgress + deltaProgress;

  const nextDiameter =
    denormalizeDiameter(space, nextProgress);

  const deltaDiameter =
    nextDiameter - state.lastDiameter;

  return {
    startDiameter: state.lastDiameter,
    nextDiameter,

    deltaProgress,
    deltaDiameter,

    ae: deltaProgress / 2,
  };
}
