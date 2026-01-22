import "./holeMachiningPage.css";


import { CalculateButton, ResetButton } from "@ui/components/Button/Button";
import { InputPanel, SidePanel } from "@ui/components/PanelSections";
import { SplitPage } from "@ui/pages/shared/layout/SplitPage";

import { HoleExecutionTable } from "./execution/table/ExecutionTable";

import { usePageReset } from "@ui/pages/shared/workflow";
import { useFieldErrors, useFieldUpdater, useFormFieldRenderer } from "@ui/pages/shared/workflow/fields";

import { useHoleFieldsState } from "./model/useHoleFieldsState";
import { useHoleExecution } from "./execution/workflow/useHoleExecution";
import { useHolePlanSolve } from "./plan/workflow/useHolePlanSolve";

import { useHoleAvailability } from "./plan/domain/useHoleAvailability";
import { getHoleDisabledMap } from "./plan/domain/holeDisabledPolicy";
import { useHoleDrivers } from "./plan/domain/useHoleDrivers";

import { holeFieldConfig} from "./ui";

import { usePersistentState } from "@app/state";
import { useHoleExecutionState } from "./model/useHoleExecutionState";
import { HoleFields } from "./model/holeFields";


import { useFormFocus } from "@ui/pages/shared/workflow/fields/useFormFocus";
import { useWorkflowReset } from "@ui/pages/shared/workflow/fields/useWorkflowReset";
import { useKeyboardShortcutsPage } from "@ui/pages/shared/workflow/usekeyboardShortcutPage";



/* --------------------------------------------------
 * UI-policy helper
 * -------------------------------------------------- */
function confirmDiscardExecution(): boolean {
  return window.confirm(
    "Du har en pågående utførelse.\n\n" +
    "Dette vil slette all fremdrift.\n\n" +
    "Vil du fortsette?"
  );
}

export function HoleMachining() {
  const [fields, setFields, resetFields] =
    useHoleFieldsState();

  const {
    plan,
    state,
    measurements,
    setMeasurements,
    setPlan,
    setState,
  } = useHoleExecutionState(); // kun state

  const [error, setError] =
    usePersistentState<string | null>("hole:error", null);

  const { planDriver } =
    useHoleDrivers(fields, setFields);

  const {
    submitMeasurement,
    updateMeasurement,
    nextTarget,
  } = useHoleExecution({
    state,
    setState,
    measurements,
    setError,
  });


  const {
    fieldErrors,
    setFieldErrors,
    clearAllFieldErrors,
  } = useFieldErrors<keyof typeof fields>();


  //const resetPage = usePageReset("hole:");

  const updateField = useFieldUpdater({
    setFields,
    clearError: () => setError(null),
  });



  const availability = useHoleAvailability(fields);

  const disabledMap = getHoleDisabledMap({
    fields,
    availability,
    drivers: {
      plan: planDriver.driver,
    },
  });

  const { handleSolve } = useHolePlanSolve({
    fields,
    clearAllFieldErrors,
    setFieldErrors,
    setPlan,
    setState,
    setMeasurements,
    setError,
  });

  const fieldOrder = holeFieldConfig.map(f => f.key);
  
  const focus = useFormFocus({
  keys: fieldOrder,
  fields,
  disabledMap,
  autoFocusOnMount: true,
});



  /* --------------------------------------------------
   * RESET
   * -------------------------------------------------- */
  const resetPage = usePageReset("hole:");
  /*
  const { focus: focusFirstField } =
    useAutoFocusOnVisibility<HTMLInputElement>();

  const { reset } = useHoleReset({
    resetPage,
    resetFields,
    clearAllFieldErrors,
    setPlan,
    setState,
    setMeasurements,
    setError,
  });*/

 const { reset } = useWorkflowReset({
     steps: [
       resetPage,
       resetFields,
       clearAllFieldErrors,
       () => setError(null),
       () => setState(null),
       () => setPlan(null),
       () => setMeasurements({}),
       () => setError(null),
     ],
     onAfterReset: () => {
       focus.focusFirst();
     },
   });

  function handleReset() {
    if (state && state.log.length > 0) {
      if (!confirmDiscardExecution()) return;
    }

    reset();
  }



  /* --------------------------------------------------
   * SHORTCUT
   * -------------------------------------------------- */
  const { onEnterKeyDown} =
    useKeyboardShortcutsPage({
      onSolve: handleSolve,
      onReset: handleReset,
    });



  /* --------------------------------------------------
   * INPUT-RENDER
   * -------------------------------------------------- */
  const renderField = useFormFieldRenderer<HoleFields>({
    fields,
    fieldErrors,
    disabledMap,
    updateField,
    onKeyDown: onEnterKeyDown,
    focus

  });

  /* --------------------------------------------------
   * RENDER
   * -------------------------------------------------- */
  return (
    <SplitPage
      left={
        <InputPanel title="Fres Ø – Planlegging">
          {holeFieldConfig.map(f =>
            renderField(
              f.key,
              f.label,
              f.unit,
              f.tooltip,
              f.autoFocus
            )
          )}

          <div className="button-row">
            <CalculateButton onClick={handleSolve} />
            <ResetButton onClick={handleReset} />
          </div>

          {error && <div className="error">{error}</div>}
        </InputPanel>
      }
      right={
        <SidePanel title="Fres Ø – Utførelse">
          {state && plan ? (
            <HoleExecutionTable
              plan={plan}
              state={state}
              nextTarget={nextTarget}
              measurements={measurements}
              setMeasurements={setMeasurements}
              onSubmit={submitMeasurement}
              onUpdate={updateMeasurement}
            />
          ) : (
            <p className="hint">Ingen utførelse startet ennå.</p>
          )}
        </SidePanel>
      }
    />
  );
}
