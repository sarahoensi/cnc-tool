import { usePersistentState } from "@app/state";
import { emptyField } from "@app/state/field/field";
import type { HolePlan, HoleExecutionState } from "@core";
import type { HoleMachiningFields } from "@ui/pages/holeMachining/types/holetypes";


/**
 * Hook for å håndtere inputfelter, plan, state, målinger og reset for HoleMachining.
 */
export function useHoleMachiningSection() {
  // Input fields
  const [fields, setFields] = usePersistentState<HoleMachiningFields>(
    "hole:fields", () => ({
    D_start: emptyField(),
    D_target: emptyField(),
    N: emptyField(),
    ae: emptyField(),
  }));


  // Plan, execution, measurements, error
  const [plan, setPlan] = usePersistentState<HolePlan | null>("hole:plan", null);
  const [state, setState] = usePersistentState<HoleExecutionState | null>("hole:state", null);
  const [measurements, setMeasurements] = usePersistentState<Record<number, string>>("hole:measurements", {});
  const [error, setError] = usePersistentState<string | null>("hole:error", null);

  function reset() {
    setFields({
      D_start: emptyField(),
      D_target: emptyField(),
      N: emptyField(),
      ae: emptyField(),
    });


    setPlan(null);
    setState(null);
    setMeasurements({});
    setError(null);
  }

  return {
    fields, setFields,
    plan, setPlan,
    state, setState,
    measurements, setMeasurements,
    error, setError,
    reset
  };
}
