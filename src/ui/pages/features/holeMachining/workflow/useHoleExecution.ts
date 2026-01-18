import {
  registerMeasurement,
  computeNextTarget,
} from "@core/holeMachining";
import type { HoleExecutionState } from "@core/holeMachining";
import { toNumber } from "@utils/number";

type Params = {
  state: HoleExecutionState | null;
  setState: React.Dispatch<
    React.SetStateAction<HoleExecutionState | null>
  >;
  measurements: Record<number, string>;
  setError: (err: string | null) => void;
};

export function useHoleExecution({
  state,
  setState,
  measurements,
  setError,
}: Params) {
  function submitMeasurement(step: number) {
    if (!state) return;

    const raw = measurements[step];
    if (!raw) return;

    try {
      const updated = registerMeasurement(
        state,
        toNumber(raw)
      );
      setState(updated);
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Ukjent feil"
      );
    }
  }

  function updateMeasurement(step: number, value: string) {
    if (!state) return;

    try {
      const trimmed = state.log.filter(l => l.step < step);

      const rewound: HoleExecutionState = {
        ...state,
        log: trimmed,
        step: step - 1,
        lastDiameter:
          trimmed.length > 0
            ? trimmed[trimmed.length - 1].measured
            : state.D_start,
        finished: false,
      };

      const updated = registerMeasurement(
        rewound,
        toNumber(value)
      );

      setState(updated);
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Ukjent feil"
      );
    }
  }

  const nextTarget =
    state ? computeNextTarget(state) : null;

  return {
    submitMeasurement,
    updateMeasurement,
    nextTarget,
  };
}
