import "./triangleSolverPage.css";

import { solveTriangle, TriangleSolverInput } from "@core";

import { NumberField } from "@ui/components/NumberField";
import {
  CalculateButton,
  ResetButton,
} from "@ui/components/Button/Button";

import { emptyField } from "@app/state/field";
import { usePersistentState } from "@app/state";
import { applySolveResult } from "@app/solver/applySolveResult";
import { parseNumberFields } from "@app/solver/parseNumberFields";

import { usePageReset } from "@app/hooks/ui/usePageReset";
import { useFieldErrors } from "@app/hooks/form/useFieldErrors";
import { useFieldUpdater } from "@app/hooks";

import {
  SplitPage,
  InputPanel,
  SidePanel,
} from "@ui/components/Layout";

import { FieldValidationError } from "@core/errors";
import type { Ref } from "react";

import type { TriangleFields } from "./triangleTypes";

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

  // --------------------------------------------------
  // RESET
  // --------------------------------------------------
  const resetPage = usePageReset("triangle:");

  function handleReset() {
    resetPage();
    clearAllFieldErrors();
    setError(null);
  }

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

    setFields(prev =>
      applySolveResult(prev, result)
    );
  } catch (e) {
    if (e instanceof FieldValidationError) {
      setFieldErrors(e.fieldErrors);
      return;
    }

    setError(e instanceof Error ? e.message : "Ukjent feil");
  }
}


  // --------------------------------------------------
  // INPUT-RENDER
  // --------------------------------------------------
  function renderInput(
    key: FieldKeys,
    label: string,
    unit?: string,
    autoFocus?: boolean,
    inputRef?: Ref<HTMLInputElement>
  ) {
    return (
      <div className="field">
        <NumberField
          label={label}
          field={fields[key]}
          unit={unit}
          error={fieldErrors[key]}
          autoFocus={autoFocus}
          inputRef={inputRef}
          onChange={next => updateField(key, next)}
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
          {renderInput("a", "Katet a", "mm", true)}
          {renderInput("b", "Katet b", "mm")}
          {renderInput("c", "Hypotenus c", "mm")}
          {renderInput("alpha", "Vinkel α", "°")}
          {renderInput("beta", "Vinkel β", "°")}

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
