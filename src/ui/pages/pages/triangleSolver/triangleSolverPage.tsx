import "./triangleSolverPage.css";


import { solveTriangle, TriangleSolverInput } from "@core";
import { FieldValidationError } from "@core/errors";

import { NumberField } from "@ui/components/NumberField";
import {
  CalculateButton,
  ResetButton,
} from "@ui/components/Button/Button";
import {
  SplitPage,
  InputPanel,
  SidePanel,
} from "@ui/components/Layout";

import { emptyField } from "@app/state/field";
import { usePersistentState } from "@app/state";
import { parseNumberFields } from "@ui/pages/shared/workflow/fields";

import { usePageReset } from "@ui/pages/shared/workflow";
import { useFieldErrors, useFieldUpdater } from "@ui/pages/shared/workflow";
import { useReformatOnDecimalsChange } from "@ui/pages/shared/workflow";

import { triangleTooltips } from "./ui/triangleTooltips";


import type { TriangleFields } from "./types/triangleTypes";
import { getTriangleDisabledMap } from "./policy/triangleDisabledPolicy";
import { useConstraintGroups } from "@ui/pages/shared/domain/constraints";

import { useKeyboardShortcuts } from "@app/hooks/ui/keyboard/useKeyboardShortcuts";
import { useEnterNavigation } from "@app/hooks/ui/keyboard/useEnterNavigation";

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
  const [fields, setFields] =
    usePersistentState<TriangleFields>("triangle:fields", () => ({
      a: emptyField(),
      b: emptyField(),
      c: emptyField(),
      alpha: emptyField(),
      beta: emptyField(),
    }));

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
  // CONSTRAINT SETUP
  // --------------------------------------------------


  const validSets: (keyof TriangleFields)[][] = [
    ["a", "b"],
    ["a", "alpha"],
    ["b", "beta"],
    ["c", "alpha"],
    ["c", "beta"],
  ];

  useConstraintGroups({
    fields,
    setFields,
    validSets,
  });

  const disabledMap = getTriangleDisabledMap(fields, validSets);

  // --------------------------------------------------
  // RESET
  // --------------------------------------------------
  const resetPage = usePageReset("triangle:");

  function handleReset() {
    resetPage();
    clearAllFieldErrors();
    setError(null);
  }
const { onKeyDown: onEnterKeyDown } = useEnterNavigation({
      onSubmit: handleSolve,
    });
  // --------------------------------------------------
  // BEREGNING
  // --------------------------------------------------
  function handleSolve() {
    setError(null);
    clearAllFieldErrors();

    const fieldMap: {
      [K in keyof TriangleSolverInput]: { value: string }
    } = {
      a: fields.a,
      b: fields.b,
      c: fields.c,
      alpha: fields.alpha,
      beta: fields.beta,
    };

    const { input, errors } =
      parseNumberFields<TriangleSolverInput>(fieldMap);

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    try {
      const result = solveTriangle(input);

      applyFormattedResult(result);


    } catch (e) {
      if (e instanceof FieldValidationError) {
        setFieldErrors(e.fieldErrors);
        return;
      }

      setError(e instanceof Error ? e.message : "Ukjent feil");
    }
  }

  // --------------------------------------------------
  // KEYBOARD SHORTCUTS
  // --------------------------------------------------
 
  useKeyboardShortcuts({
    Escape: () => handleReset(),
    "Ctrl+Enter": () => handleSolve(),
  });

  // --------------------------------------------------
  // INPUT-RENDER
  // --------------------------------------------------
  function renderInput(
    key: FieldKeys,
    label: string,
    unit?: string,
    tooltip?: string,
    autoFocus?: boolean,
  ) {
    const disabled = disabledMap[key];

    return (
      <div className="field">
        <NumberField
          label={label}
          field={fields[key]}
          unit={unit}
          tooltip={tooltip}
          error={fieldErrors[key]}
          autoFocus={autoFocus}
          disabled={disabled}
          //inputRef={register}
          //onChange={next => updateField(key, next)}

          onKeyDown={onEnterKeyDown}
          onChange={next => {
            if (disabled) return;
            updateField(key, next);
          }}

        />
      </div>
    );
  }

  // --------------------------------------------------
  // RENDER
  // --------------------------------------------------
  return (
    <SplitPage
      left={
        <InputPanel title="Rettvinklet trekant">
          {renderInput("a", "Katet a", "mm", triangleTooltips.a, true)}
          {renderInput("b", "Katet b", "mm", triangleTooltips.b)}
          {renderInput("c", "Hypotenus c", "mm", triangleTooltips.c)}
          {renderInput("alpha", "Vinkel α", "°", triangleTooltips.alpha)}
          {renderInput("beta", "Vinkel β", "°", triangleTooltips.beta)}

          <div className="button-row">
            <CalculateButton onClick={handleSolve} />
            <ResetButton onClick={handleReset} />
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
