// src/ui/pages/cuttingData/cuttingDataPage.tsx

import "./cuttingDataPage.css";

import {
  CalculateButton,
  ResetButton,
} from "@ui/components/Button/Button";
import {
  SplitPage,
  InputPanel,
  SidePanel,
} from "@ui/components/Layout";

import { usePageReset, useReformatOnDecimalsChange} from "@ui/pages/shared/workflow";
import { useFieldErrors} from "@ui/pages/shared/workflow";
import type { CuttingFields } from "./state/cuttingFields";import { cuttingTooltips } from "./ui/cuttingTooltips";
import { useEnterNavigation } from "@app/hooks/ui/keyboard/useEnterNavigation";
import { useKeyboardShortcuts } from "@app/hooks/ui/keyboard/useKeyboardShortcuts";
import { useCuttingFieldsState } from "./state";
import { useSpeedFeedDrivers } from "./domain/drivers/useSpeedFeedDrivers";
import { getCuttingDisabledMap, useCuttingAvailability } from "./domain/policy";
import { useFieldUpdater } from "@ui/pages/shared/workflow";
import { usePersistentState } from "@app/state";
import { CuttingDataInput, CuttingDataSolution, solveCuttingData } from "@core/cuttingData";
import { useClearDrivers } from "@ui/pages/shared/domain/driver";
import { toNumber } from "@utils/number";
import { FieldValidationError } from "@core/errors";
import {useFormFieldRenderer} from "@ui/pages/shared/workflow";


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

  // --------------------------------------------------
  // DRIVER (UI-INTENSJON, IKKE VALIDERING)
  // --------------------------------------------------

  const { speedDriver, feedDriver } = useSpeedFeedDrivers(
    fields,
    setFields
  );

  // --------------------------------------------------
  // RESULTAT / FEIL
  // --------------------------------------------------
const [result, setResult] = usePersistentState<CuttingDataSolution | null>(
  "cutting:result",
  null
);

const [error, setError] = usePersistentState<string | null>(
  "cutting:error",
  null
);

  // --------------------------------------------------
  // RESET
  // --------------------------------------------------
  const resetPage = usePageReset("cutting:");
  const clearDrivers = useClearDrivers(speedDriver, feedDriver);

  const reset = () => {
  resetPage();
  resetFields();
  clearAllFieldErrors();
  setResult(null);
  setError(null);
  clearDrivers();
};

  // --------------------------------------------------
  // FELTOPPDATERING
  // --------------------------------------------------
const updateField = useFieldUpdater({
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
const { applyFormattedResult } =
  useReformatOnDecimalsChange<CuttingFields>(setFields);

  
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

    applyFormattedResult(res);
    setResult(res);

  } catch (e) {
    if (e instanceof FieldValidationError) {
      setFieldErrors(e.fieldErrors);
      return;
    }

    setError(e instanceof Error ? e.message : "Ukjent feil");
  }
}

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
  const renderField = useFormFieldRenderer<CuttingFields>({
  fields,
  fieldErrors,
  disabledMap,
  updateField,
  onKeyDown: onEnterKeyDown,
  onAfterChange: () => {
    setResult(null);
  },
});

  // --------------------------------------------------
  // RENDER
  // --------------------------------------------------
  return (
    <SplitPage
      left={
        <InputPanel title="Skjæredata">
          {renderField("D", "Verktøydiameter D", "mm", cuttingTooltips.D, true)}
          {renderField("z", "Antall tenner z", "", cuttingTooltips.z, false)}
          {renderField("Vc", "Skjærehastighet Vc", "m/min", cuttingTooltips.Vc, false)}
          {renderField("n", "Omdreininger n", "rpm", cuttingTooltips.n, false)}
          {renderField("F", "Matning F", "mm/min", cuttingTooltips.F, false)}
          {renderField("fz", "Matning per tann fz", "mm/tann", cuttingTooltips.fz, false)}

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
