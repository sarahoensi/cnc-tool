import "./holeMachiningPage.css";

import { useState } from "react";

import { CalculateButton, ResetButton } from "@ui/components/Button/Button";
import { InputPanel, SidePanel } from "@ui/components/PanelSections";
import { SplitPage } from "@ui/pages/shared/layout/SplitPage";

import { DiameterExecutionTable } from "./execution/table/ExecutionTable";

import { usePageReset } from "@ui/pages/shared/workflow";
import { useFieldErrors, useFieldUpdater, useFormFieldRenderer } from "@ui/pages/shared/workflow/fields";

import { useHoleFieldsState } from "./model/useHoleFieldsState";
//import { useHoleExecution } from "./execution/workflow/useHoleExecution.ts";
import { useHolePlanSolve } from "./plan/workflow/useHolePlanSolve";
import { useDiameterExecution } from "./execution/workflow/useDiameterExecution.ts";

import { useHoleAvailability } from "./plan/domain/useHoleAvailability";
import { getHoleDisabledMap } from "./plan/domain/holeDisabledPolicy";
import { useHoleDrivers } from "./plan/domain/useHoleDrivers";

import { holeFieldConfig } from "./ui";

import { usePersistentState } from "@app/state";
import { useHoleExecutionState } from "./model/useHoleExecutionState";
import { HoleFields } from "./model/holeFields";


import { useFormFocus } from "@ui/pages/shared/workflow/fields/useFormFocus";
import { useWorkflowReset } from "@ui/pages/shared/workflow/fields/useWorkflowReset";
import { useKeyboardShortcutsPage } from "@ui/pages/shared/workflow/usekeyboardShortcutPage";

import { useDiameterModeState } from "./model/useDiameterModeState.ts";

import { DiameterModeSelector } from "./ui/DiameterModeSelector.tsx";


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

function confirmChangeExecutionMode(): boolean {
  return window.confirm(
    "Du har en pågående utførelse.\n\n" +
    "Dette vil slette all fremdrift.\n\n" +
    "Vil du fortsette?"
  );
}

export function HoleMachining() {

  const { mode, setMode } = useDiameterModeState();


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
  } = useDiameterExecution({
    state,
    setState,
    measurements,
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



  const [activeField, setActiveField] =
    useState<keyof HoleFields | null>(null);


  const availability = useHoleAvailability(fields);

  const disabledMap = getHoleDisabledMap({
    fields,
    availability,
    drivers: {
      plan: planDriver.driver,
    },
  });

  const { solve } = useHolePlanSolve({
    mode,
    fields,
    clearAllFieldErrors,
    setFieldErrors,
    setPlan,
    setState,
    setMeasurements,
    setError,
  });

  function setUsage(
    fields: HoleFields,
    usage: "idle" | "active",
    keys?: (keyof HoleFields)[]
  ): HoleFields {
    const target = keys ?? (Object.keys(fields) as (keyof HoleFields)[]);
    return {
      ...fields,
      ...Object.fromEntries(
        target.map(k => [k, { ...fields[k], usage }])
      ),
    };
  }
  const hasActiveExecution =
  Boolean(state && !state.finished && state.log.length > 0);

  function handleSolve() {
    if (hasActiveExecution) {
      if (!confirmDiscardExecution()) return;
    }

    solve();

    
  }
  function handleChangeMode(nextMode: typeof mode) {
    if (nextMode === mode) return;

    if (hasActiveExecution) {
      const confirmed = confirmChangeExecutionMode();
      if (!confirmed) return;

      // Viktig: nullstill utførelsen før modusbytte
      //reset();
    }

    setMode(nextMode);
    setPlan(null);
    setState(null);
    setMeasurements({});
    setActiveField(null);
    setFields(prev => setUsage(prev, "idle"));

  }




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
      setFields(prev => setUsage(prev, "idle"));
    },
  });

  function handleReset() {
    if (hasActiveExecution) {
      if (!confirmDiscardExecution()) return;
    }

    reset();

  }




  /* --------------------------------------------------
   * SHORTCUT
   * -------------------------------------------------- */
  const { onEnterKeyDown } =
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
    focus,
    onFocus: (key) => setActiveField(key),
    onBlur: () => setActiveField(null),

  });



  /* --------------------------------------------------
   * RENDER
   * -------------------------------------------------- */
  return (
    <SplitPage
      left={
        <InputPanel title="Finkjøring – Planlegging">
          <DiameterModeSelector
            mode={mode}
            setMode={handleChangeMode}
          />


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
            {!hasActiveExecution && (
              <CalculateButton onClick={handleSolve} />
            )}
            <ResetButton onClick={handleReset} />
          </div>

          {error && <div className="error">{error}</div>}
        </InputPanel>
      }
      right={
        <SidePanel title="Finkjøring Ø – Utførelse">
          {state && plan ? (
            <DiameterExecutionTable
              plan={plan}
              state={state}
              nextTarget={nextTarget}
              measurements={measurements}
              setMeasurements={setMeasurements}
              onSubmit={submitMeasurement}
              onUpdate={updateMeasurement}
              disableAutoFocus={activeField !== null}

              onStarted={() => {
                setFields(prev =>
                  setUsage(prev, "active", [
                    "D_start",
                    "D_target",
                    "N",
                    "ae",
                  ])
                );
              }}

              onFinished={() => {
                setFields(prev => setUsage(prev, "idle"));
              }}
            />
          ) : (
            <p className="hint">Ingen utførelse startet ennå.</p>
          )}

        </SidePanel>
      }

    />
  );
}
