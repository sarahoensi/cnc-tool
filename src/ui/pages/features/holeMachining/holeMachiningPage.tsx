import "./holeMachiningPage.css";


import { CalculateButton, ResetButton } from "@ui/components/Button/Button";
import { SplitPage, InputPanel, SidePanel } from "@ui/components/Layout";

import { HoleExecutionTable } from "./ui/HoleExecutionTable";

import { useAutoFocusOnVisibility } from "@app/hooks/ui";
import { usePageReset } from "@ui/pages/shared/workflow";
import { useFieldErrors, useFieldUpdater, useFormFieldRenderer } from "@ui/pages/shared/workflow/fields";

import { useHoleFieldsState } from "./model/useHoleFieldsState";
import { useHoleExecution } from "./workflow/useHoleExecution";
import { useHolePlanSolve } from "./workflow/useHolePlanSolve";
import { useHoleReset } from "./workflow/useHoleReset";

import { useHoleAvailability } from "./domain/availability/useHoleAvailability";
import { getHoleDisabledMap } from "./domain/policy/holeDisabledPolicy";
import { useHoleDrivers } from "./domain/driver/useHoleDrivers";

import { holeFieldConfig } from "./ui/holeFieldConfig";

import { useEnterNavigation } from "@app/hooks/ui/keyboard/useEnterNavigation";
import { usePersistentState } from "@app/state";
import { useHoleExecutionState } from "./model/useHoleExecutionState";
import { HoleFields } from "./model/holeFields";

import { useKeyboardShortcuts } from "@app/hooks/ui/keyboard/useKeyboardShortcuts";
import { useHoleKeyboard } from "./workflow/useHolePlanKeyboard";



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


  /* --------------------------------------------------
   * RESET
   * -------------------------------------------------- */
  const resetPage = usePageReset("hole:");
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
  focusFirstField,
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
  const { onEnterKeyDown, shortcuts } =
  useHoleKeyboard({
    onSolve: handleSolve,
    onReset: handleReset,
  });

useKeyboardShortcuts(shortcuts);

  /* --------------------------------------------------
   * INPUT-RENDER
   * -------------------------------------------------- */
  const renderField = useFormFieldRenderer<HoleFields>({
      fields,
      fieldErrors,
      disabledMap,
      updateField,
      onKeyDown: onEnterKeyDown,
      
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
