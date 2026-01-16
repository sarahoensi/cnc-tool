// src/ui/pages/cuttingData/cuttingDataPage.tsx

import "./cuttingDataPage.css";

import { useRef } from "react";
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

import { usePageReset, useReformatOnDecimalsChange } from "@ui/pages/shared/workflow";
import { useFieldErrors} from "@ui/pages/shared/workflow";


import type { CuttingFields } from "./state/cuttingFields";

import { cuttingTooltips } from "./ui/cuttingTooltips";
import { useEnterNavigation } from "@app/hooks/ui/keyboard/useEnterNavigation";
import { useKeyboardShortcuts } from "@app/hooks/ui/keyboard/useKeyboardShortcuts";
import { useCuttingFieldsState, useCuttingResultState, useCuttingErrorState } from "./state";
import { useSpeedFeedDrivers } from "./domain/drivers/useSpeedFeedDrivers";
import { useSolveCuttingData } from "./workflow/useSolveCuttingData";
import { getCuttingDisabledMap, useCuttingAvailability } from "./domain/policy";
import { useCuttingReset } from "./workflow/useCuttingReset";
import { useCuttingFieldUpdate } from "./workflow/useCuttingFieldUpdate";


type FieldKeys = keyof CuttingFields;

export function CuttingData() {
  // --------------------------------------------------
  // FELTER
  // --------------------------------------------------
  const [fields, setFields, resetFields] = useCuttingFieldsState();

  // --------------------------------------------------
  // FELTFEIL
  // --------------------------------------------------
  const {
    fieldErrors,
    setFieldErrors,
    clearFieldError,
    clearAllFieldErrors,
  } = useFieldErrors<FieldKeys>();

  const { applyFormattedResult } =
    useReformatOnDecimalsChange<CuttingFields>(setFields);

  // --------------------------------------------------
  // DRIVER (UI-INTENSJON, IKKE VALIDERING)
  // --------------------------------------------------
  const isSolvingRef = useRef(false);

  const { speedDriver, feedDriver } = useSpeedFeedDrivers(
    fields,
    setFields
  );

  // --------------------------------------------------
  // RESULTAT / FEIL
  // --------------------------------------------------
  const [result, setResult, resetResult] = useCuttingResultState();
  const [error, setError, resetError] = useCuttingErrorState();


  // --------------------------------------------------
  // RESET
  // --------------------------------------------------
  const resetPage = usePageReset("cutting:");

  const reset = useCuttingReset({
    resetPage,
    resetFields,
    resetResult,
    resetError,
    clearAllFieldErrors,
    speedDriver,
    feedDriver,
  });

  // --------------------------------------------------
  // FELTOPPDATERING
  // --------------------------------------------------
  const updateField = useCuttingFieldUpdate({
  setFields,
  clearFieldError,
  clearError: () => {
    setError(null);
    setResult(null);
  },
});


  const availability = useCuttingAvailability(fields);

  const disabledMap = getCuttingDisabledMap({
    fields,
    availability,
    drivers: {
      speed: speedDriver.driver,
      feed: feedDriver.driver,
    },
  });


  // --------------------------------------------------
  // BEREGNING
  // --------------------------------------------------

  const { handleSolve } = useSolveCuttingData({
    fields,
    clearAllFieldErrors,
    setFieldErrors,
    setError,
    setResult,
    applyFormattedResult,
    isSolvingRef,
  });


  const { onKeyDown: onEnterKeyDown } = useEnterNavigation({
    onSubmit: handleSolve,
  });

  useKeyboardShortcuts({
    Escape: reset,
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
          error={fieldErrors[key]}
          unit={unit}
          tooltip={tooltip}
          autoFocus={autoFocus}
          disabled={disabled}
          onKeyDown={onEnterKeyDown}
          onChange={next => {
            if (disabled) return;
            updateField(key, next);
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
          {renderInput("z", "Antall tenner z", "", cuttingTooltips.z, false)}
          {renderInput("Vc", "Skjærehastighet Vc", "m/min", cuttingTooltips.Vc, false)}
          {renderInput("n", "Omdreininger n", "rpm", cuttingTooltips.n, false)}
          {renderInput("F", "Matning F", "mm/min", cuttingTooltips.F, false)}
          {renderInput("fz", "Matning per tann fz", "mm/tann", cuttingTooltips.fz, false)}



          <div className="button-row">
            <CalculateButton onClick={handleSolve} />
            <ResetButton onClick={reset} />
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
