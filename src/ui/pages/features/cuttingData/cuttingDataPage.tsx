// src/ui/pages/cuttingData/cuttingDataPage.tsx
import "./cuttingDataPage.css";

import {
  CalculateButton,
  ResetButton,
} from "@ui/components/Button/Button";
import {
  InputPanel,
  SidePanel,
} from "@ui/components/PanelSections";

import { usePersistentState } from "@app/state";
import { CuttingDataSolution } from "@core/cuttingData";

import {
  useFormFieldRenderer, useFieldUpdater, useFieldErrors, 
  usePageReset, useReformatOnDecimalsChange
} from "@ui/pages/shared/workflow";
import { SplitPage } from "@ui/pages/shared/layout/SplitPage";


import { useCuttingSolve, useCuttingKeyboard } from "./workflow";
import { getCuttingDisabledMap, useCuttingAvailability, 
  useSpeedFeedDrivers } from "./domain";
import { cuttingFieldConfig } from "./ui/cuttingFieldConfig";
import { useCuttingFieldsState, CuttingFields } from "./model";
import { useFormFocus } from "@ui/pages/shared/workflow/fields/useFormFocus";
import { useWorkflowReset } from "@ui/pages/shared/workflow/fields/useWorkflowReset";



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
  
  const availability = useCuttingAvailability(fields);
  const disabledMap = getCuttingDisabledMap({
    fields,
    availability,
    drivers: {
      speed: speedDriver.driver,
      feed: feedDriver.driver,
    },
  });

  /* FOCUS MANAGEMENT */
  const fieldOrder = cuttingFieldConfig.map(f => f.key);
  
  const focus = useFormFocus({
  keys: fieldOrder,
  fields,
  disabledMap,
  autoFocusOnMount: true,
});


  // --------------------------------------------------
  // RESET
  // --------------------------------------------------
  const resetPage = usePageReset("cutting:");

 /* const { reset } = useCuttingReset({
    resetPage,
    resetFields,
    clearAllFieldErrors,
    setResult,
    setError,
    clearDrivers,
  });*/
  const { reset } = useWorkflowReset({
    steps: [
      resetPage,
      resetFields,
      clearAllFieldErrors,
      () => setError(null),
    ],
    onAfterReset: () => {
      focus.focusFirst();
    },
  });


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

  

  // --------------------------------------------------
  // BEREGNING
  // --------------------------------------------------
  const { applyFormattedResult } =
    useReformatOnDecimalsChange<CuttingFields>(setFields);

  const { handleSolve } = useCuttingSolve({
    fields,
    clearAllFieldErrors,
    setFieldErrors,
    setError,
    setResult,
    applyFormattedResult,

    
  });

  const { onEnterKeyDown } = useCuttingKeyboard({
    onSolve: handleSolve,
    onReset: reset,
  });


  // --------------------------------------------------
  // INPUT-RENDER
  // --------------------------------------------------
  const renderField = useFormFieldRenderer<CuttingFields>({
    fields,
    fieldErrors,
    disabledMap,
    focus,
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
          {cuttingFieldConfig.map((f) =>
            renderField(
              f.key,
              f.label,
              f.unit,
              f.tooltip,
              f.autoFocus
            )
          )}
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
