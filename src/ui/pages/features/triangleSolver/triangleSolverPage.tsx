import "./triangleSolverPage.css";
import "@ui/pages/shared/styles/forms.css";
import { useState } from "react";


import {
  CalculateButton,
  ResetButton,
} from "@ui/components/Button/Button";
import {
  InputPanel,
  SidePanel,
} from "@ui/components/PanelSections";

import { usePersistentState } from "@app/state";
import { useFormFieldRenderer } from "@ui/pages/shared/workflow/fields";

import { usePageReset } from "@ui/pages/shared/workflow";
import { useFieldErrors, useFieldUpdater } from "@ui/pages/shared/workflow";
import { useReformatOnDecimalsChange } from "@ui/pages/shared/workflow";

import { SplitPage } from "@ui/pages/shared/layout/SplitPage";

import type { TriangleFields } from "./model/triangleFields";
import { getTriangleDisabledMap } from "./domain/policy/triangleDisabledPolicy";

import { useTriangleConstraints } from "./domain/constraints/useTriangleConstraints";
import { useTriangleFieldsState } from "./model";

import { triangleFieldConfig } from "./ui/triangleFieldConfig";
import { useTriangleSolve } from "./workflow/useTriangleSolve";
import { TriangleFigure } from "./ui/Figur/triangleFigure";
import { useFormFocus } from "@ui/pages/shared/workflow/fields/useFormFocus";
import { useWorkflowReset } from "@ui/pages/shared/workflow/fields/useWorkflowReset";
import { useKeyboardShortcutsPage } from "@ui/pages/shared/workflow/usekeyboardShortcutPage";


// --------------------------------------------------
// TYPES
// --------------------------------------------------

type FieldKeys = keyof TriangleFields;

// --------------------------------------------------
// COMPONENT
// --------------------------------------------------

export function TriangleSolver() {
  // --------------------------------------------------
  // FELTER
  // --------------------------------------------------
  const [fields, setFields, resetFields] =
    useTriangleFieldsState();

  const [activeField, setActiveField] =
    useState<FieldKeys | null>(null);


  // --------------------------------------------------
  // FEIL
  // --------------------------------------------------
  const {
    fieldErrors,
    setFieldErrors,
    clearFieldError,
    clearAllFieldErrors,
  } = useFieldErrors<FieldKeys>();

  const [error, setError] =
    usePersistentState<string | null>("triangle:error", null);

  const updateField = useFieldUpdater<TriangleFields>({
    setFields,
    clearError: () => setError(null),
    clearFieldError,
  });

  const { applyFormattedResult } =
    useReformatOnDecimalsChange<TriangleFields>(setFields);



  // --------------------------------------------------
  // CONSTRAINT 
  // --------------------------------------------------


  const { constraints } =
    useTriangleConstraints(fields, setFields);

  const disabledMap =
    getTriangleDisabledMap(fields, constraints);


  // --------------------------------------------------
  // FOCUS MANAGEMENT
  // --------------------------------------------------

 const fieldOrder = triangleFieldConfig.map(f => f.key);

const focus = useFormFocus({
  keys: fieldOrder,
  fields,
  disabledMap,
  autoFocusOnMount: true,
});


  // --------------------------------------------------
  // RESET
  // --------------------------------------------------
  const resetPage = usePageReset("triangle:");

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



  // --------------------------------------------------
  // BEREGNING
  // --------------------------------------------------
  const { handleSolve } = useTriangleSolve({
    fields,
    clearAllFieldErrors,
    setFieldErrors,
    setError,
    applyFormattedResult,

    onValidationError: () => {
    console.log("FIELDS ON VALIDATION ERROR:", fields);
    focus.focusFirst();
},

  });


  const { onEnterKeyDown} =
    useKeyboardShortcutsPage({
      onSolve: handleSolve,
      onReset: reset,
    });

  //useKeyboardShortcuts(shortcuts);


  // --------------------------------------------------
  // INPUT-RENDER
  // --------------------------------------------------
  const renderField =
    useFormFieldRenderer<TriangleFields>({
      fields,
      fieldErrors,
      disabledMap,
      updateField,
      onKeyDown: onEnterKeyDown,

      focus,
      onFocus: (key) => setActiveField(key),
      onBlur: () => setActiveField(null),
    });

  // --------------------------------------------------
  // RENDER
  // --------------------------------------------------
  return (
    <SplitPage
      left={
        <InputPanel title="Rettvinklet trekant">
          {triangleFieldConfig.map((f) =>
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
            <ResetButton onClick={reset} />
          </div>

          {error && <div className="error">{error}</div>}
        </InputPanel>
      }
      right={
        <SidePanel title="Figur">
          <TriangleFigure
            activeField={activeField}
            disabledMap={disabledMap}
          />
        </SidePanel>
      }
    />
  );
}
