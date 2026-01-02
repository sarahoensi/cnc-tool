// src/ui/pages/cuttingData/cuttingDataPage.tsx

import "./cuttingDataPage.css";

import { solveCuttingData } from "@core";
import type { CuttingDataInput, CuttingDataSolution } from "@core";

import { NumberField } from "@ui/components/NumberField";

import {
  CalculateButton,
  ResetButton,
} from "@ui/components/Button/Button";

import { usePersistentState } from "@app/state";
import { emptyField } from "@app/state/field/field";
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
import { Ref } from "react";
import { useFieldUpdater } from "@app/hooks/form/useFieldUpdater";

import {
  CuttingFields,
  SpeedDriver,
  FeedDriver,
} from "./cuttingTypes";

import { getCuttingFieldUI } from "./cuttingFieldUI";
import { getCuttingAvailability } from "./getCuttingAvailability";

import { useDriverOverride } from "@app/hooks/driver/useDriverOverride";
import { getSolveStatus } from "./cuttingSolveStatus";

type FieldKeys = keyof CuttingFields;

export function CuttingData() {
  // -------------------------------------------------------
  // FELTER
  // -------------------------------------------------------
  const [fields, setFields] = usePersistentState<CuttingFields>(
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

  const {
    fieldErrors,
    setFieldErrors,
    clearFieldError,
    clearAllFieldErrors,
  } = useFieldErrors<FieldKeys>();



  // -------------------------------------------------------
  // DRIVER (kun brukerintensjon)
  // -------------------------------------------------------
  const speedDriver = useDriverOverride<SpeedDriver>();
  const feedDriver = useDriverOverride<FeedDriver>();

  // -------------------------------------------------------
  // AVAILABILITY (UI-sannhet)
  // -------------------------------------------------------
  const availability = getCuttingAvailability(fields);

  // -------------------------------------------------------
  // RESULTAT / FEIL
  // -------------------------------------------------------
  const [result, setResult] =
    usePersistentState<CuttingDataSolution | null>(
      "cutting:result",
      null
    );

  const [error, setError] =
    usePersistentState<string | null>("cutting:error", null);

  // -------------------------------------------------------
  // RESET
  // -------------------------------------------------------
  const resetSection = usePageReset("cutting:");

  function handleReset() {
    resetSection();
    clearAllFieldErrors();
    setError(null);
    setResult(null);

    speedDriver.clearDriver();
    feedDriver.clearDriver();
  }

  // -------------------------------------------------------
  // FELT-OPPDATERING
  // -------------------------------------------------------
  const updateField = useFieldUpdater({
    setFields,
    clearError: () => {
      setError(null);
      setResult(null);
    },
    clearFieldError,
  });

  // -------------------------------------------------------
  // BEREGNING
  // -------------------------------------------------------
  function handleSolve() {
  clearAllFieldErrors();
  setError(null);
  setResult(null);

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

    // Etter beregning: UI skal ikke være låst
    speedDriver.clearDriver();
    feedDriver.clearDriver();

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


  // -------------------------------------------------------
  // UI-STATE PER FELT
  // -------------------------------------------------------
  const fieldUI = getCuttingFieldUI(
    fields,
    availability,
    {
      speedDriver: speedDriver.driver,
      feedDriver: feedDriver.driver,
      hasResult: !!result,
    }
  );

  // -------------------------------------------------------
  // Solve status
  // -------------------------------------------------------
  const solveStatus = getSolveStatus(availability);


  // -------------------------------------------------------
  // INPUT-RENDER
  // -------------------------------------------------------
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
          enabled={fieldUI[key].enabled}
          lockedReason={fieldUI[key].lockedReason}
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

  // -------------------------------------------------------
  // RENDER
  // -------------------------------------------------------
  return (
    <SplitPage
      left={
        <InputPanel title="Skjæredata">
          {renderInput("D", "Verktøydiameter D", "mm")}
          {renderInput("z", "Antall tenner z")}
          {renderInput("Vc", "Skjærehastighet Vc", "m/min")}
          {renderInput("n", "Omdreininger n", "rpm")}
          {renderInput("F", "Matning F", "mm/min")}
          {renderInput("fz", "Matning per tann fz", "mm/tann")}


          <div className="solve-status">
            <div className={solveStatus.speedReady ? "ok" : "missing"}>
              {solveStatus.speedReady
                ? "✓ Spindel: OK"
                : "✗ Spindel: oppgi D og enten Vc eller n"}
            </div>

            <div className={solveStatus.feedReady ? "ok" : "missing"}>
              {solveStatus.feedReady
                ? "✓ Mating: OK"
                : "✗ Mating: oppgi z og enten F eller fz"}
            </div>
          </div>

          <div className="button-row">
            <CalculateButton onClick={handleSolve} 
            disabled={!solveStatus.canSolve} />
            <ResetButton onClick={handleReset} />
          </div>

          {error && <div className="error">{error}</div>}
        </InputPanel>
      }
      right={
        <SidePanel title="Resultat" children={undefined}>
          {/* Kan bygges senere */}
        </SidePanel>
      }
    />
  );
}

