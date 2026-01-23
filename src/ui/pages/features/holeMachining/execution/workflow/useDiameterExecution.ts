import type {
  HoleExecutionState,
  NextTargetInfo,
} from "@core/holeMachining";
import { toNumber } from "@utils/number";

import type { DiameterMode } from "../../model/diameterMode";
import type { DiameterExecutionRules } from "../rules/diameterExecutionRules";
import { innerDiameterExecutionRules } from "../rules/innerDiameterExecutionRules";
import { outerDiameterExecutionRules } from "../rules/outerDiameterExecutionRules";

type Params = {
  modeRef: React.RefObject<DiameterMode>;
  state: HoleExecutionState | null;
  setState: React.Dispatch<
    React.SetStateAction<HoleExecutionState | null>
  >;
  measurements: Record<number, string>;
  setError: (err: string | null) => void;
};

function getRules(mode: DiameterMode): DiameterExecutionRules {
  switch (mode) {
    case "inner":
      return innerDiameterExecutionRules;
    case "outer":
      return outerDiameterExecutionRules;
  }
}

export function useDiameterExecution({
  modeRef,
  state,
  setState,
  measurements,
  setError,
}: Params) {

  function submitMeasurement(step: number) {
    if (!state) return;

    const raw = measurements[step];
    if (!raw) return;

    const rules = getRules(modeRef.current);

    try {
      const updated = rules.registerMeasurement(
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

    const rules = getRules(modeRef.current);

    try {
      const trimmed = state.log.filter(
        l => l.step < step
      );

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

      const updated = rules.registerMeasurement(
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

  const nextTarget: NextTargetInfo | null = state
    ? getRules(modeRef.current).computeNextTarget(state)
    : null;

  return {
    submitMeasurement,
    updateMeasurement,
    nextTarget,
  };
}

