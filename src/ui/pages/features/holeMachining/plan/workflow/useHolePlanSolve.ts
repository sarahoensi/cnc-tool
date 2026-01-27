import {
  createHolePlan,
  startExecution,
} from "@core/holeMachining";
import { FieldValidationError } from "@core/errors";
import { toNumber } from "@utils/number";

import type { HoleFields } from "../../model/holeFields";
import type { HolePlan, HoleExecutionState } from "@core/holeMachining";
import { DiameterMode } from "@core/holeMachining/types";

type FieldKeys = keyof HoleFields;

type Params = {
  mode: DiameterMode;
  fields: HoleFields;

  clearAllFieldErrors: () => void;
  setFieldErrors: (errors: Partial<Record<FieldKeys, string>>) => void;

  setPlan: (plan: HolePlan | null) => void;
  setState: (state: HoleExecutionState | null) => void;
  setMeasurements: (m: Record<number, string>) => void;

  setError: (error: string | null) => void;
};

export function useHolePlanSolve({
  mode,
  fields,
  clearAllFieldErrors,
  setFieldErrors,
  setPlan,
  setState,
  setMeasurements,
  setError,
}: Params) {
  function solve() {
    clearAllFieldErrors();
    setError(null);

    try {
      const input = {
        mode,
        D_start: toNumber(fields.D_start.value),
        D_target: toNumber(fields.D_target.value),
        N: toNumber(fields.N.value),
        ae: toNumber(fields.ae.value),
      };

      const plan = createHolePlan(input);

      setPlan(plan);
      setState(startExecution(plan));
      setMeasurements({});
    } catch (e) {
      if (e instanceof FieldValidationError) {
        setFieldErrors(e.fieldErrors);
        return;
      }

      setError(e instanceof Error ? e.message : "Ukjent feil");
    }
  }

  return { solve };
}
