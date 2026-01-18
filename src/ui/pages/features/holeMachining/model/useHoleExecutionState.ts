import { usePersistentState } from "@app/state";
import type {
  HolePlan,
  HoleExecutionState,
} from "@core/holeMachining";

/**
 * Ren state-hook for hole execution.
 * Ingen domene- eller workflow-logikk.
 */
export function useHoleExecutionState() {
  const [plan, setPlan] =
    usePersistentState<HolePlan | null>("hole:plan", null);

  const [state, setState] =
    usePersistentState<HoleExecutionState | null>("hole:state", null);

  const [measurements, setMeasurements] =
    usePersistentState<Record<number, string>>(
      "hole:measurements",
      {}
    );

  function resetExecutionState() {
    setPlan(null);
    setState(null);
    setMeasurements({});
  }

  return {
    plan,
    setPlan,

    state,
    setState,

    measurements,
    setMeasurements,

    resetExecutionState,
  };
}
