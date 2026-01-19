import "./triangleSolverPage.css";


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

import { useKeyboardShortcuts } from "@app/hooks/ui/keyboard/useKeyboardShortcuts";
import { useTriangleConstraints } from "./domain/constraints/useTriangleConstraints";
import { useTriangleFieldsState } from "./model";

import { useTriangleReset } from "./workflow/useTriangleReset";
import { useTriangleKeyboard } from "./workflow/useTriangleKeyboard";
import { triangleFieldConfig } from "./ui/triangleFieldConfig";
import { useTriangleSolve } from "./workflow/useTriangleSolve";

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
  // RESET
  // --------------------------------------------------
  const resetPage = usePageReset("triangle:");

  const { reset } = useTriangleReset({
  resetPage,
  resetFields,
  clearAllFieldErrors,
  setError,
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
});


const { onEnterKeyDown, shortcuts } =
  useTriangleKeyboard({
    onSolve: handleSolve,
    onReset: reset,
  });

useKeyboardShortcuts(shortcuts);


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
        <SidePanel title="Resultat" children={undefined}>
          {/* kan bygges senere */}
        </SidePanel>
      }
    />
  );
}
