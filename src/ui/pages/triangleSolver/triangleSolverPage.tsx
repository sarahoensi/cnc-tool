// ui/pages/triangleSolver/triangleSolverPage.tsx

import "./triangleSolverPage.css";

import { solveTriangle } from "@core";
import type { TriangleSolverInput } from "@core";

import { NumberField } from "@ui/components/NumberField";
import {
  CalculateButton,
  ResetButton,
} from "@ui/components/Button/Button";

import {
  emptyField,

} from "@app/state/field";
import { usePersistentState } from "@app/state";
import { applySolveResult } from "@app/solver/applySolveResult";


import { toNumber } from "@utils/number";
import { usePageReset } from "@app/hooks/ui/usePageReset";
import { useFieldErrors } from "@app/hooks/form/useFieldErrors";

import {
  SplitPage,
  InputPanel,
  SidePanel,
} from "@ui/components/Layout";

import { FieldValidationError } from "@core/errors";
import { Ref} from "react";


import type { TriangleFields } from "./triangleTypes";
import { useFieldUpdater } from "@app/hooks";

// --------------------------------------------------
// TYPES
// --------------------------------------------------

type FieldKeys = keyof TriangleFields;

const TRIANGLE_KEYS: FieldKeys[] = [
  "a",
  "b",
  "c",
  "alpha",
  "beta",
];

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

  const updateField = useFieldUpdater<TriangleFields>({
    setFields,
    clearError: () => setError(null),
    clearFieldError,
  });

  const [error, setError] =
    usePersistentState<string | null>("triangle:error", null);



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
  // FELTOPPDATERING
  // --------------------------------------------------



  // --------------------------------------------------
  // BEREGNING (CORE)
  // --------------------------------------------------
  function handleSolve() {
    setError(null);
    clearAllFieldErrors();

    const input: TriangleSolverInput = {};
    const errors: Partial<Record<FieldKeys, string>> = {};

    // --------------------------------------------------
    // Bygg core-input + valider brukerinput
    // --------------------------------------------------
    for (const key of TRIANGLE_KEYS) {
      const raw = fields[key].value;
      if (raw === "") continue;

      const parsed = toNumber(raw);

      if (!Number.isFinite(parsed)) {
        errors[key] = "Ugyldig tallverdi";
        continue;
      }

      if (parsed <= 0) {
        errors[key] = "Verdien må være > 0";
        continue;
      }

      input[key] = parsed;
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    // --------------------------------------------------
    // Core-solve
    // --------------------------------------------------
    try {
      const res = solveTriangle(input);

      setFields(prev =>
        applySolveResult(prev, res)
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
          onChange={next => {
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
          {renderInput("a", "Katet a", "mm", true)}
          {renderInput("b", "Katet b", "mm")}
          {renderInput("c", "Hypotenus c", "mm")}
          {renderInput("alpha", "Vinkel α", "°")}
          {renderInput("beta", "Vinkel β", "°")}

          

          <div className="button-row">
            <CalculateButton
              onClick={handleSolve}
              
            />
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
