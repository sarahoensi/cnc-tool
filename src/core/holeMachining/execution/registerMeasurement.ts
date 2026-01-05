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
    log: [...state.log, logEntry],
  };
}
