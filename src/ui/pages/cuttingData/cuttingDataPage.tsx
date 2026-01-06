// src/ui/pages/cuttingData/cuttingDataPage.tsx

import "./cuttingDataPage.css";

import { Ref } from "react";
import { solveCuttingData } from "@core/cuttingData";
import type {
  CuttingDataInput,
  CuttingDataSolution,
} from "@core/cuttingData";
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

import { usePersistentState } from "@app/state";
import { emptyField } from "@app/state/field/field";
import { applySolveResult } from "@app/solver/applySolveResult";
import { toNumber } from "@utils/number";

import { usePageReset } from "@app/hooks/ui/usePageReset";
import { useFieldErrors } from "@app/hooks/form/useFieldErrors";
import { useFieldUpdater } from "@app/hooks/form/useFieldUpdater";

import type { CuttingFields } from "./cuttingTypes";
import {
  SpeedDriver,
  FeedDriver,
} from "./cuttingTypes";
import { useDriverOverride } from "@app/hooks/driver/useDriverOverride";
import { cuttingTooltips } from "./cuttingTooltips";

import { getDecimals } from "@ui/components/Settings/decimals/useDecimals";
import { formatNumber } from "@utils/format";


type FieldKeys = keyof CuttingFields;

export function CuttingData() {
  // --------------------------------------------------
  // FELTER
  // --------------------------------------------------
  const [fields, setFields] =
    usePersistentState<CuttingFields>(
      "cutting:fields",
      () => ({
        D: emptyField(),
        z: emptyField(),
        Vc: emptyField(),
        n: emptyField(),
        F: emptyField(),
        fz: emptyField(),
      })
    );

  // --------------------------------------------------
  // FELTFEIL
  // --------------------------------------------------
  const {
    fieldErrors,
    setFieldErrors,
    clearFieldError,
    clearAllFieldErrors,
  } = useFieldErrors<FieldKeys>();

  // --------------------------------------------------
  // DRIVER (UI-INTENSJON, IKKE VALIDERING)
  // --------------------------------------------------
  const speedDriver =
    useDriverOverride<SpeedDriver>();
  const feedDriver =
    useDriverOverride<FeedDriver>();

  // --------------------------------------------------
  // RESULTAT / FEIL
  // --------------------------------------------------
  const [result, setResult] =
    usePersistentState<CuttingDataSolution | null>(
      "cutting:result",
      null
    );

  const [error, setError] =
    usePersistentState<string | null>(
      "cutting:error",
      null
    );

  // --------------------------------------------------
  // RESET
  // --------------------------------------------------
  const resetPage = usePageReset("cutting:");

  function handleReset() {
    resetPage();
    clearAllFieldErrors();
    setError(null);
    setResult(null);
    speedDriver.clearDriver();
    feedDriver.clearDriver();
  }

  // --------------------------------------------------
  // FELTOPPDATERING
  // --------------------------------------------------
  const updateField = useFieldUpdater({
    setFields,
    clearError: () => {
      setError(null);
      setResult(null);
    },
    clearFieldError,
  });

  // --------------------------------------------------
  // BEREGNING
  // --------------------------------------------------
  function handleSolve() {
    clearAllFieldErrors();
    setError(null);
    setResult(null);

    // Bygg core-input (kun parsing)
    const input: CuttingDataInput = {};

    for (const key of Object.keys(fields) as FieldKeys[]) {
      const raw = fields[key].value;
      if (raw === "") continue;

      const parsed = toNumber(raw);
      if (Number.isFinite(parsed)) {
        input[key] = parsed;
      }
    }

    try {
      const res = solveCuttingData(input);

      setResult(res);

      // Etter solve: ingen driver låst
      speedDriver.clearDriver();
      feedDriver.clearDriver();

      
    const decimals = getDecimals();

    setFields(prev =>
      applySolveResult(prev, res, {
        format: (value) => formatNumber(value, decimals),
      })
    );
    
    } catch (e) {
      if (e instanceof FieldValidationError) {
        setFieldErrors(e.fieldErrors);
        return;
      }

      setError(
        e instanceof Error
          ? e.message
          : "Ukjent feil"
      );
    }
  }

  // --------------------------------------------------
  // INPUT-RENDER
  // --------------------------------------------------
  function renderInput(
    key: FieldKeys,
    label: string,
    unit?: string,
    tooltip?: string,
    autoFocus?: boolean,
    inputRef?: Ref<HTMLInputElement>
  ) {
    return (
      <div className="field">
        <NumberField
          label={label}
          field={fields[key]}
          error={fieldErrors[key]}
          unit={unit}
          tooltip={tooltip}
          autoFocus={autoFocus}
          inputRef={inputRef}
          onChange={next => {
            updateField(key, next);

            // Driver settes kun av brukerinput
            if (key === "Vc" || key === "n") {
              next.value === ""
                ? speedDriver.clearDriver()
                : speedDriver.setDriver(key);
            }

            if (key === "F" || key === "fz") {
              next.value === ""
                ? feedDriver.clearDriver()
                : feedDriver.setDriver(key);
            }

            setResult(null);
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
        <InputPanel title="Skjæredata">
          {renderInput("D", "Verktøydiameter D", "mm", cuttingTooltips.D, true)}
          {renderInput("z", "Antall tenner z","", cuttingTooltips.z)}
          {renderInput("Vc", "Skjærehastighet Vc", "m/min", cuttingTooltips.Vc)}
          {renderInput("n", "Omdreininger n", "rpm", cuttingTooltips.n)}
          {renderInput("F", "Matning F", "mm/min", cuttingTooltips.F)}
          {renderInput(
            "fz",
            "Matning per tann fz",
            "mm/tann", cuttingTooltips.fz
          )}

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
              <div>Vc: {result.Vc.toFixed(3)}</div>
              <div>n: {result.n.toFixed(0)}</div>
              <div>F: {result.F.toFixed(3)}</div>
              <div>fz: {result.fz.toFixed(4)}</div>
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
