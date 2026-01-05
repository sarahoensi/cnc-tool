// SpiralMachiningPage.tsx

import "./spiralMachiningPage.css";

import { useEffect, useRef } from "react";
import { solveHelix } from "@core/helix";
import type { HelixInput, HelixSolution, HelixMode } from "@core/helix";
import { FieldValidationError } from "@core/errors";

import { NumberField } from "@ui/components/NumberField";
import { CalculateButton, ResetButton } from "@ui/components/Button/Button";
import { SplitPage, InputPanel, SidePanel } from "@ui/components/Layout";

import { emptyField } from "@app/state/field";
import { usePersistentState } from "@app/state";
import { usePageReset } from "@app/hooks/ui/usePageReset";
import { useFieldErrors } from "@app/hooks/form/useFieldErrors";
import { useFieldUpdater } from "@app/hooks/form/useFieldUpdater";
import { useAutoFocusOnVisibility } from "@app/hooks/ui/useAutoFocusOnVisibility";

import { applySolveResult } from "@app/solver/applySolveResult";
import { toNumber } from "@utils/number";

import type { SpiralFields } from "./spiralTypes";

export function SpiralMachining() {
  /* ---------------- MODE ---------------- */

  const [mode, setMode] =
    usePersistentState<HelixMode>("spiral:mode", "inner");

  const modeRef = useRef(mode);
  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  /* ---------------- FIELDS ---------------- */

  const [fields, setFields] =
    usePersistentState<SpiralFields>("spiral:fields", () => ({
      diameter: emptyField(),
      toolDiameter: emptyField(),
      pitch: emptyField(),
      angle: emptyField(),
    }));

  /* ---------------- RESULT / ERROR ---------------- */

  const [result, setResult] =
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

  const {
    ref: firstFieldRef,
    focus: focusFirstField,
  } = useAutoFocusOnVisibility<HTMLInputElement>();

  /* ---------------- RESET ---------------- */
//TODO: Ikke bytte mode ved reset
  const resetPage = usePageReset("spiral:");

  function handleReset() {
    resetPage();
    clearAllFieldErrors();
    setResult(null);
    setError(null);
    focusFirstField();
  }

  /* ---------------- SOLVE ---------------- */

  function handleSolve() {
    setError(null);
    clearAllFieldErrors();
    setResult(null);

    try {
      const input: HelixInput = {
        mode: modeRef.current,
        diameter: toNumber(fields.diameter.value),
        toolDiameter: toNumber(fields.toolDiameter.value),
        pitch:
          fields.pitch.value !== ""
            ? toNumber(fields.pitch.value)
            : undefined,
        angle:
          fields.angle.value !== ""
            ? toNumber(fields.angle.value)
            : undefined,
      };

      const res = solveHelix(input);

      // maskin fyller ut det som manglet
      setFields(prev =>
        applySolveResult(prev, {
          pitch: res.pitch,
          angle: res.angle,
        })
      );

      setResult(res);
    } catch (e) {
      if (e instanceof FieldValidationError) {
        setFieldErrors(e.fieldErrors);
        return;
      }

      setError(
        e instanceof Error ? e.message : "Ukjent feil"
      );
    }
  }

  /* ---------------- INPUT ---------------- */

  function renderInput(
    key: keyof SpiralFields,
    label: string,
    unit?: string,
    autoFocus?: boolean,
    inputRef?: React.Ref<HTMLInputElement>
  ) {
    return (
      <NumberField
        label={label}
        field={fields[key]}
        unit={unit}
        error={fieldErrors[key]}
        autoFocus={autoFocus}
        inputRef={inputRef}
        onChange={next => updateField(key, next)}
      />
    );
  }

  /* ---------------- RENDER ---------------- */

  return (
    <SplitPage
      left={
        <InputPanel title="Spiral / Helix">
          <p className="hint">
            Velg indre/ytre. Oppgi diameter,
            verktøydiameter og enten pitch eller vinkel.
          </p>

          <div className="number-field">
            <label className="nf-label">Modus</label>
            <div className="nf-radio-group">
              <label>
                <input
                  type="radio"
                  checked={mode === "inner"}
                  onChange={() => setMode("inner")}
                />
                Inner
              </label>
              <label>
                <input
                  type="radio"
                  checked={mode === "outer"}
                  onChange={() => setMode("outer")}
                />
                Outer
              </label>
            </div>
          </div>

          {renderInput("diameter", "Diameter", "mm", true, firstFieldRef)}
          {renderInput("toolDiameter", "Verktøydiameter", "mm")}
          {renderInput("pitch", "Pitch", "mm/rev")}
          {renderInput("angle", "Vinkel", "°")}

          <div className="button-row">
            <CalculateButton onClick={handleSolve} />
            <ResetButton onClick={handleReset} />
          </div>

          {error && <div className="error">{error}</div>}
        </InputPanel>
      }
      right={
        <SidePanel title="Resultat">
          {result ? (
            <>
              <div>
                Effektiv diameter:{" "}
                {result.effectiveDiameter.toFixed(4)}
              </div>
              <div>Pitch: {result.pitch.toFixed(4)}</div>
              <div>
                Vinkel: {result.angle.toFixed(4)}°
              </div>
            </>
          ) : (
            <p className="hint">
              Ingen beregning utført ennå.
            </p>
          )}
        </SidePanel>
      }
    />
  );
}
