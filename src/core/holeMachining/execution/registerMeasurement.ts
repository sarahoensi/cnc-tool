import { normalizeDiameterSpace } from "../normalizedDiameterSpace";
import type {
  HoleExecutionState,
  HoleLogEntry,
} from "../types";

import { computeNextTarget } from "./computeNextTarget";

/**
 * Registrerer en ny måling og oppdaterer execution-state.
 */
export function registerMeasurement(
  state: HoleExecutionState,
  measured: number
): HoleExecutionState {
  const next = computeNextTarget(state);

  // Ingen flere steg → avslutt
  if (!next) {
    return { ...state, finished: true };
  }

  const deltaDiameter =
    measured - state.lastDiameter;

  if (state.mode === "ID" && measured < state.lastDiameter) {
  throw new Error(
    `Målt Ø kan ikke være mindre enn forrige Ø (${state.lastDiameter})`
  );
}

if (state.mode === "OD" && measured > state.lastDiameter) {
  throw new Error(
    `Målt Ø kan ikke være større enn forrige Ø (${state.lastDiameter})`
  );
}

  const logEntry: HoleLogEntry = {
    step: state.step + 1,
    startDiameter: state.lastDiameter,
    measured,

    deltaProgress: next.deltaProgress,
    deltaDiameter,

    ae: next.ae,
  };

  const step = state.step + 1;
  const space = normalizeDiameterSpace(
  state.D_start,
  state.D_target,
  state.mode
);

const progress = Math.abs(measured - space.D_start);

const finished =
  progress >= space.progressTarget ||
  step >= state.N;

  return {
    ...state,
    step,
    lastDiameter: measured,
    finished,
    log: [...state.log, logEntry],
  };
}
