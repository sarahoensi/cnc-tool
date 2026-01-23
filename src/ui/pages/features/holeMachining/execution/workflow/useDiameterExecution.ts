import {
  registerMeasurement,
  computeNextTarget,
  HoleExecutionState,
} from "@core/holeMachining";
import { toNumber } from "@utils/number";

type Params = {
  state: HoleExecutionState | null;
  setState: React.Dispatch<
    React.SetStateAction<HoleExecutionState | null>
  >;
  measurements: Record<number, string>;
};

export function useDiameterExecution({
  state,
  setState,
  measurements,
}: Params) {

  function submitMeasurement(step: number) {
    if (!state) return;

    const raw = measurements[step];
    const value = toNumber(raw);
    if (value == null) return;

    const updated = registerMeasurement(state, value);
    setState(updated);
  }

  function updateMeasurement(step: number, value: string) {
    if (!state) return;

    const num = toNumber(value);
    if (num == null) return;

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

    const updated = registerMeasurement(rewound, num);
    setState(updated);
  }

  const nextTarget = state
    ? computeNextTarget(state)
    : null;

  return {
    submitMeasurement,
    updateMeasurement,
    nextTarget,
  };
}
