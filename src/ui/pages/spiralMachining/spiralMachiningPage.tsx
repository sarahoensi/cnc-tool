// SpiralMachiningPage.tsx

import "./spiralMachiningPage.css";

import { useEffect, useRef, useState } from "react";
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


import { toNumber } from "@utils/number";

import type { SpiralFields } from "./spiralTypes";

import { LabelWithTooltip } from "@ui/components/LabelWithTooltip";
import { helixTooltips } from "./spiralTooltips";

import { useReformatOnDecimalsChange } from "@app/hooks/ui/useReformatOnDecimalsChange";
import { useClearMachineFieldsOnChange } from "@app/hooks/ui/useClearMachineFieldsOnChange";
import { ActiveSpiralPart, SpiralDiagramInner, SpiralDiagramOuter } from "./Diagram";


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

    const [activePart, setActivePart] = useState<ActiveSpiralPart>(null);

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

  const { applyFormattedResult } =
    useReformatOnDecimalsChange<SpiralFields>(setFields);


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

  useClearMachineFieldsOnChange(mode, setFields, {
  clearResult: () => setResult(null),
  clearErrors: clearAllFieldErrors,
});


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

      applyFormattedResult({
        pitch: res.pitch,
        angle: res.angle,
      });

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
    tooltip?: string,
    autoFocus?: boolean,
    inputRef?: React.Ref<HTMLInputElement>
  ) {
    return (
      <NumberField
        label={label}
        field={fields[key]}
        unit={unit}
        tooltip={tooltip}
        error={fieldErrors[key]}
        autoFocus={autoFocus}
        inputRef={inputRef}
        onChange={next => updateField(key, next)}
        onFocus={() => setActivePart(key)}
    onBlur={() => setActivePart(null)}
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
            <label className="nf-label">
              <LabelWithTooltip
                label="Modus"
                tooltip={helixTooltips.mode}
              />
            </label>
            <div className="nf-radio-group">
              <label>
                <input
                  type="radio"
                  checked={mode === "inner"}
                  onChange={() => setMode("inner")}
                />
                <LabelWithTooltip
                  label="Inner"
                  tooltip={helixTooltips.inner}
                />
              </label>
              <label>
                <input
                  type="radio"
                  checked={mode === "outer"}
                  onChange={() => setMode("outer")}
                />
                <LabelWithTooltip
                  label="Outer"
                  tooltip={helixTooltips.outer}
                />
              </label>
            </div>
          </div>

          {renderInput("diameter", "Diameter", "mm", helixTooltips.diameter, true, firstFieldRef)}
          {renderInput("toolDiameter", "Verktøydiameter", "mm", helixTooltips.toolDiameter)}
          {renderInput("pitch", "Pitch", "mm/rev", helixTooltips.pitch)}
          {renderInput("angle", "Vinkel", "°", helixTooltips.angle)}

          <div className="button-row">
            <CalculateButton onClick={handleSolve} />
            <ResetButton onClick={handleReset} />
          </div>

          {error && <div className="error">{error}</div>}
        </InputPanel>
      }
      right={
        <SidePanel title="Geometri">
  {mode === "inner" && (
    <SpiralDiagramInner
      diameter={Number(fields.diameter.value) || undefined}
      toolDiameter={Number(fields.toolDiameter.value) || undefined}
      pitch={Number(fields.pitch.value) || undefined}
      angle={Number(fields.angle.value) || undefined}
      activePart={activePart}
    />
  )}

  {mode === "outer" && (
    <SpiralDiagramOuter
      diameter={Number(fields.diameter.value) || undefined}
      toolDiameter={Number(fields.toolDiameter.value) || undefined}
      pitch={Number(fields.pitch.value) || undefined}
      angle={Number(fields.angle.value) || undefined}
      activePart={activePart}
    />
  )}
</SidePanel>

      }
    />
  );
}
