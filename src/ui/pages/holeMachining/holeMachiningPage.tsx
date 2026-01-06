import "./holeMachiningPage.css";

import { Ref } from "react";

import {
  createHolePlan,
  startExecution,
  registerMeasurement,
  computeNextTarget,
} from "@core/holeMachining";

import { FieldValidationError } from "@core/errors";

import { NumberField } from "@ui/components/NumberField";
import {
  CalculateButton,
  ResetButton,
} from "@ui/components/Button/Button";
import { SplitPage, InputPanel, SidePanel } from "@ui/components/Layout";

import { HoleExecutionTable } from "./HoleExecutionTable";

import { useHoleMachiningSection } from "@app/hooks/domain/useHoleMachiningSection";
import { usePageReset } from "@app/hooks/ui/usePageReset";
import { useFieldErrors } from "@app/hooks/form/useFieldErrors";
import { useFieldUpdater } from "@app/hooks/form/useFieldUpdater";
import { useAutoFocusOnVisibility } from "@app/hooks/ui/useAutoFocusOnVisibility";

import { toNumber } from "@utils/number";
import { holeTooltips } from "./holeTooltips";

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
  const {
    fields,
    setFields,
    plan,
    setPlan,
    state,
    setState,
    measurements,
    setMeasurements,
    error,
    setError,
  } = useHoleMachiningSection();

  const {
    fieldErrors,
    setFieldErrors,
    clearAllFieldErrors,
  } = useFieldErrors<keyof typeof fields>();

  const {
    ref: firstFieldRef,
    focus: focusFirstField,
  } = useAutoFocusOnVisibility<HTMLInputElement>();

  const resetPage = usePageReset("hole:");

  const updateField = useFieldUpdater({
    setFields,
    clearError: () => setError(null),
  });

  /* --------------------------------------------------
   * RESET
   * -------------------------------------------------- */
  function handleReset() {
    if (state && state.log.length > 0) {
      if (!confirmDiscardExecution()) return;
    }

    resetPage();
    clearAllFieldErrors();
    setError(null);
    focusFirstField();
  }

  /* --------------------------------------------------
   * PLANLEGGING
   * -------------------------------------------------- */
  function buildPlan() {
    setError(null);
    clearAllFieldErrors();

    if (state && state.log.length > 0) {
      if (!confirmDiscardExecution()) return;
    }

    try {
      const input = {
        D_start: toNumber(fields.D_start.value),
        D_target: toNumber(fields.D_target.value),
        N: toNumber(fields.N.value),
        ae: toNumber(fields.ae.value),
      };

      const plan = createHolePlan(input);

      setPlan(plan);
      setState(startExecution(plan));
      setMeasurements({});
    } catch (e) {
      if (e instanceof FieldValidationError) {
        setFieldErrors(e.fieldErrors);
        return;
      }
      setError(e instanceof Error ? e.message : "Ukjent feil");
    }
  }

  /* --------------------------------------------------
   * UTFØRELSE
   * -------------------------------------------------- */
  function submitMeasurement(step: number) {
    if (!state) return;

    const raw = measurements[step];
    if (!raw) return;

    try {
      const updated = registerMeasurement(
        state,
        toNumber(raw)
      );
      setState(updated);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Ukjent feil");
    }
  }

  function updateMeasurement(step: number, value: string) {
    if (!state) return;

    try {
      const trimmed = state.log.filter(l => l.step < step);

      const rewound = {
        ...state,
        log: trimmed,
        step: step - 1,
        lastDiameter:
          trimmed.length > 0
            ? trimmed[trimmed.length - 1].measured
            : state.D_start,
        finished: false,
      };

      const updated = registerMeasurement(
        rewound,
        toNumber(value)
      );

      setState(updated);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Ukjent feil");
    }
  }

  const nextTarget =
    state ? computeNextTarget(state) : null;

  /* --------------------------------------------------
   * INPUT-RENDER
   * -------------------------------------------------- */
  function renderInput(
    key: keyof typeof fields,
    label: string,
    unit?: string,
    tooltip?:string,
    autoFocus?: boolean,
    inputRef?: Ref<HTMLInputElement>
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
      />
    );
  }

  /* --------------------------------------------------
   * RENDER
   * -------------------------------------------------- */
  return (
    <SplitPage
      left={
        <InputPanel title="Fres Ø – Planlegging">
          {renderInput(
            "D_start",
            "Start Ø",
            "mm",
            holeTooltips.D_start,
            true,
            firstFieldRef
          )}
          {renderInput("D_target", "Target Ø", "mm", holeTooltips.D_target)}
          {renderInput("N", "Antall kutt","", holeTooltips.N)}
          {renderInput("ae", "Radialt inngrep", "mm", holeTooltips.ae)}

          <div className="button-row">
            <CalculateButton onClick={buildPlan} />
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
