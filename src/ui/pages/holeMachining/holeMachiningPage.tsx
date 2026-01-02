import {
  createPlanFromN,
  createPlanFromAe,
  createPlanFromNoStart,
  startExecution,
  registerMeasurement,
} from "@core";

import type { HolePlan } from "@core/holeMachining";

import { NumberField } from "@ui/components/NumberField";
import {
  CalculateButton,
  ResetButton,
} from "@ui/components/Button/Button";

import { useHoleMachiningSection } from "@app/hooks/domain/useHoleMachiningSection";
import { usePageReset } from "@app/hooks/ui/usePageReset";

import { toNumber } from "@utils/number";

import { HoleExecutionTable } from "./HoleExecutionTable";

import { SplitPage, InputPanel, SidePanel } from "@ui/components/Layout";
import "./holeMachiningPage.css";
import { useFieldErrors } from "@app/hooks/form/useFieldErrors";
import { FieldValidationError } from "@core/errors";
import {
  machineField,
} from "@app/state/field/field";
import { useAutoFocusOnVisibility } from "@app/hooks/ui/useAutoFocusOnVisibility";
import { Ref } from "react";
import { useFieldUpdater } from "@app/hooks/form/useFieldUpdater";

// ----------------------------------------------------------
// Validation helper
// ----------------------------------------------------------
function parsePositive(
  field: string,
  label: string,
  raw: string
): number {
  const n = toNumber(raw);
  if (!Number.isFinite(n) || n <= 0) {
    throw new FieldValidationError({
      [field]: `${label} må være > 0`,
    });
  }
  return n;
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

  function handleReset() {
    resetPage();
    clearAllFieldErrors();
    setError(null);
    focusFirstField();
  }

  // ----------------------------------------------------------
  // FELTOPPDATERING
  // ----------------------------------------------------------
  const updateField = useFieldUpdater({
  setFields,
  clearError: () => setError(null),
});

  // ----------------------------------------------------------
  // PLANLEGGING
  // ----------------------------------------------------------
  function buildPlan() {
    setError(null);
    clearAllFieldErrors();

    if (state && state.log?.length > 0) {
      const ok = window.confirm(
        "Du har en pågående utførelse.\n" +
          "Dette vil slette all fremdrift.\n\n" +
          "Vil du fortsette?"
      );
      if (!ok) return;
    }

    try {
      const startRaw = fields.D_start.value.trim();
      const targetRaw = fields.D_target.value.trim();
      const nRaw = fields.N.value.trim();
      const aeRaw = fields.ae.value.trim();

      const startFilled = startRaw !== "";
      const targetFilled = targetRaw !== "";
      const nFilled = nRaw !== "";
      const aeFilled = aeRaw !== "";

      const errors: Partial<Record<keyof typeof fields, string>> = {};

      if (!targetFilled) {
        errors.D_target = "Target Ø må fylles inn";
      }

      let startVal: number | undefined;
      let targetVal: number | undefined;
      let nVal: number | undefined;
      let aeVal: number | undefined;

      if (startFilled) {
        const n = toNumber(startRaw);
        if (!Number.isFinite(n) || n <= 0) {
          errors.D_start = "Start Ø må være et tall > 0";
        } else {
          startVal = n;
        }
      }

      if (targetFilled) {
        const n = toNumber(targetRaw);
        if (!Number.isFinite(n) || n <= 0) {
          errors.D_target = "Target Ø må være et tall > 0";
        } else {
          targetVal = n;
        }
      }

      if (nFilled) {
        const n = toNumber(nRaw);
        if (!Number.isInteger(n) || n <= 0) {
          errors.N = "Antall kutt må være et heltall ≥ 1";
        } else {
          nVal = n;
        }
      }

      if (aeFilled) {
        const n = toNumber(aeRaw);
        if (!Number.isFinite(n) || n <= 0) {
          errors.ae = "Radialt inngrep må være > 0";
        } else {
          aeVal = n;
        }
      }

      let planType:
        | "FROM_N"
        | "FROM_AE"
        | "NO_START"
        | null = null;

      if (startFilled && targetFilled && nFilled && !aeFilled) {
        planType = "FROM_N";
      } else if (startFilled && targetFilled && !nFilled && aeFilled) {
        planType = "FROM_AE";
      } else if (!startFilled && targetFilled && nFilled && aeFilled) {
        planType = "NO_START";
      } else {
        errors.D_start = errors.D_start ?? "Start Ø må fylles inn";
        errors.N = errors.N ?? "Fyll inn antall kutt eller radielt inngrep";
        errors.ae = errors.ae ?? "Fyll inn antall kutt eller radielt inngrep";
      }

      if (Object.keys(errors).length > 0) {
        throw new FieldValidationError(errors);
      }

      let p: HolePlan;

      if (planType === "FROM_N") {
        p = createPlanFromN({
          D_start: startVal!,
          D_target: targetVal!,
          N: nVal!,
        });
      } else if (planType === "FROM_AE") {
        p = createPlanFromAe({
          D_start: startVal!,
          D_target: targetVal!,
          ae: aeVal!,
        });
      } else {
        p = createPlanFromNoStart({
          D_target: targetVal!,
          N: nVal!,
          ae: aeVal!,
        });

        setFields(prev => ({
          ...prev,
          D_start: machineField(p.D_start.toFixed(4)),
        }));
      }

      setPlan(p);
      setState(startExecution(p));
      setMeasurements({});
    } catch (e) {
      if (e instanceof FieldValidationError) {
        setFieldErrors(e.fieldErrors);
        return;
      }

      setError(e instanceof Error ? e.message : "Ukjent feil");
    }
  }

  // ----------------------------------------------------------
  // REGISTRER MÅLING
  // ----------------------------------------------------------
  function submitMeasurement(step: number) {
    if (!state) return;

    const raw = measurements[step];
    if (!raw) return;

    try {
      const measured = parsePositive(
        "measurement",
        "Målt diameter",
        raw
      );

      if (measured > state.D_target) {
        alert("Målt diameter kan ikke overstige target.");
        return;
      }

      const updated = registerMeasurement(state, measured);
      setState(updated);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Ukjent feil");
    }
  }

  function updateMeasurement(step: number, value: string) {
    if (!state) return;

    try {
      const newValue = parsePositive(
        "measurement",
        "Målt diameter",
        value
      );

      if (newValue > state.D_target) {
        alert("Målt diameter kan ikke overstige target.");
        return;
      }

      const trimmed = state.log.filter(x => x.step < step);

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

      const updated = registerMeasurement(rewound, newValue);
      setState(updated);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Ukjent feil");
    }
  }

  // ----------------------------------------------------------
  // RESET
  // ----------------------------------------------------------
  function resetSection() {
    if (state && state.log?.length > 0) {
      const ok = window.confirm(
        "Du har en pågående utførelse.\n" +
          "Dette vil slette all fremdrift.\n\n" +
          "Vil du fortsette?"
      );
      if (!ok) return;
    }

    handleReset();
  }

  // ----------------------------------------------------------
  // INPUT-RENDERER
  // ----------------------------------------------------------
  function renderInput(
    key: keyof typeof fields,
    label: string,
    unit?: string,
    tooltip?: string,
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

  // ----------------------------------------------------------
  // RENDER
  // ----------------------------------------------------------
  return (
    <SplitPage
      left={
        <InputPanel title="Fres Ø – Planlegging">
          <div className="hole-grid">
            {renderInput(
              "D_start",
              "Start Ø",
              "mm",
              "Målt startdiameter før fresing",
              true,
              firstFieldRef
            )}
            {renderInput(
              "D_target",
              "Target Ø",
              "mm",
              "Endelig ønsket diameter"
            )}
            {renderInput(
              "N",
              "Antall kutt",
              undefined,
              "Hvor mange steg fresingen deles i"
            )}
            {renderInput(
              "ae",
              "Radialt inngrep",
              "mm",
              "Hvor mye verktøyet flyttes radielt per steg"
            )}
          </div>

          <div className="button-row">
            <CalculateButton onClick={buildPlan} />
            <ResetButton onClick={resetSection} />
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
