// SpiralMachiningPage.tsx

import "./spiralMachiningPage.css";
import "./ui/SpiralModeSelector.css"

import type { HelixSolution } from "@core/helix";

import { CalculateButton, ResetButton } from "@ui/components/Button/Button";
import { InputPanel, SidePanel } from "@ui/components/PanelSections";
import { SplitPage } from "@ui/pages/shared/layout/SplitPage";

import { usePersistentState } from "@app/state";

import { useFieldErrors, useFieldUpdater, usePageReset, useClearMachineFieldsOnChange, useReformatOnDecimalsChange } from "@ui/pages/shared/workflow";
import { useSpiralSolve } from "./workflow/useSpiralSolve";

import { getSpiralDisabledMap } from "./domain/policy/spiralDisabledPolicy";
import { useSpiralDrivers } from "./domain/driver/useSpiralDrivers";

import {
  useSpiralFieldsState,
  type SpiralFields,
  useSpiralModeState,
} from "./model";

import { spiralFieldConfig } from "./ui/spiralFieldConfig";
import { useFormFieldRenderer } from "@ui/pages/shared/workflow";
import { SpiralModeSelector } from "./ui/SpiralModeSelector";
import { useState } from "react";
import { SpiralFigureInner, SpiralFigureOuter } from "./ui/Figur";
import { useFormFocus } from "@ui/pages/shared/workflow/fields/useFormFocus";
import { useWorkflowReset } from "@ui/pages/shared/workflow/fields/useWorkflowReset";
import { useKeyboardShortcutsPage } from "@ui/pages/shared/workflow/usekeyboardShortcutPage";


export function SpiralMachining() {
  /* ---------------- MODE ---------------- */

  const { mode, setMode, modeRef } = useSpiralModeState();
  /* ---------------- FIELDS ---------------- */

  const [fields, setFields, resetFields] =
    useSpiralFieldsState();

  const [activeField, setActiveField] =
    useState<keyof SpiralFields | null>(null);



  /*
   * Drivers
   */
  const { helixDriver } = useSpiralDrivers(fields, setFields);

  const disabledMap = getSpiralDisabledMap({
    fields,
    driver: helixDriver.driver,
  });


  /* ---------------- RESULT / ERROR ---------------- */

  const [, setResult] =
    usePersistentState<HelixSolution | null>(
      "spiral:result",
      null
    );

  const [error, setError] =
    usePersistentState<string | null>(
      "spiral:error",
      null
    );

  /* ---------------- FIELD ERRORS ---------------- */

  const {
    fieldErrors,
    setFieldErrors,
    clearFieldError,
    clearAllFieldErrors,
  } = useFieldErrors<keyof SpiralFields>();

  const updateField = useFieldUpdater({
    setFields,
    clearError: () => {
      setResult(null);
      setError(null);
    },
    clearFieldError,
  });

  const { applyFormattedResult } =
    useReformatOnDecimalsChange<SpiralFields>(setFields);



/* ---------------- FOCUS MANAGEMENT ---------------- */
const fieldOrder = spiralFieldConfig.map(f => f.key);

const focus = useFormFocus({
  keys: fieldOrder,
  fields,
  disabledMap,
  autoFocusOnMount: true,
});


  /* ---------------- RESET ---------------- */
  //TODO: Ikke bytte mode ved reset
  const resetPage = usePageReset("spiral:");

  const { reset } = useWorkflowReset({
    steps: [
      resetPage,
      resetFields,
      clearAllFieldErrors,
      () => setError(null),
    ],
    onAfterReset: () => {
      focus.focusFirst();
    },
  });

  useClearMachineFieldsOnChange(mode, setFields, {
    clearResult: () => setResult(null),
    clearErrors: clearAllFieldErrors,
  });

  /* ---------------- SOLVE ---------------- */

  const { handleSolve } = useSpiralSolve({
    fields,
    modeRef,
    clearAllFieldErrors,
    setFieldErrors,
    setError,
    setResult,
    applyFormattedResult,
  });


  const { onEnterKeyDown } = useKeyboardShortcutsPage({
    onSolve: handleSolve,
    onReset: reset,
  });

  /* ---------------- INPUT ---------------- */

  const renderField =
    useFormFieldRenderer<SpiralFields>({
      fields,
      fieldErrors,
      disabledMap,
      updateField,
      onKeyDown: onEnterKeyDown,
      
      onAfterChange: () => {
        setResult(null);
      },
      focus,
      onFocus: (key) => setActiveField(key),
      onBlur: () => setActiveField(null),
    });

  /* ---------------- RENDER ---------------- */

  return (
    <SplitPage
      left={
        <InputPanel title="Spiral / Helix">
          <SpiralModeSelector
            mode={mode}
            setMode={setMode}
          />


          {spiralFieldConfig.map((f) =>
            renderField(
              f.key,
              f.label,
              f.unit,
              f.tooltip,
              f.autoFocus,
            )
          )}


          <div className="button-row">
            <CalculateButton onClick={handleSolve} />
            <ResetButton  onClick={reset} />
          </div>

          {error && <div className="error">{error}</div>}
        </InputPanel>
      }
      right={
        <SidePanel title="Figur">
          {mode === "inner" ? (
            <SpiralFigureInner
              activeField={activeField}
              disabledMap={disabledMap}
            />
          ) : (
            <SpiralFigureOuter
              activeField={activeField}
              disabledMap={disabledMap}
            />
          )}
        </SidePanel>

      }
    />
  );
}
