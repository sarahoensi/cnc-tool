// src/ui/pages/cuttingData/cuttingDataPage.tsx

import "./cuttingDataPage.css";

import { Ref, useRef } from "react";
import { solveCuttingData } from "@core/cuttingData";
import type {
  CuttingDataInput,
  CuttingDataSolution,
} from "@core/cuttingData";
import { FieldValidationError } from "@core/errors";
import { getCuttingDisabledMap } from "@app/policies/cutting/cuttingDisabledPolicy";
import { useCuttingAvailability } from "@app/hooks/domain/useCuttingAvailability";


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
import { toNumber } from "@utils/number";

import { usePageReset } from "@app/hooks/ui/usePageReset";
import { useFieldErrors } from "@app/hooks/form/useFieldErrors";
import { useFieldUpdater } from "@app/hooks/form/useFieldUpdater";

import { useClearSiblingDriverFields } from "@app/hooks/driver/useClearSiblingDriverFields";
import { useDerivedDrivers } from "@app/hooks/driver/useDerivedDrivers";


import type { CuttingFields } from "./cuttingTypes";
import {
  SpeedDriver,
  FeedDriver,
} from "./cuttingTypes";
import { useDriverOverride } from "@app/hooks/driver/useDriverOverride";
import { cuttingTooltips } from "./cuttingTooltips";

import { useReformatOnDecimalsChange } from "@app/hooks/ui/useReformatOnDecimalsChange";

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

  const { applyFormattedResult } =
    useReformatOnDecimalsChange<CuttingFields>(setFields);


  // --------------------------------------------------
  // DRIVER (UI-INTENSJON, IKKE VALIDERING)
  // --------------------------------------------------
  const speedDriver = useDriverOverride<SpeedDriver>();
  const feedDriver = useDriverOverride<FeedDriver>();

    // --------------------------------------------------
  // AVAILABILITY + DISABLED
  // --------------------------------------------------

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
  // CLEAR SIBLING FIELDS
  // --------------------------------------------------

  useClearSiblingDriverFields<CuttingFields, "Vc" | "n">(
    [{ fields: ["Vc", "n"] }],
    fields,
    setFields
  );

  useClearSiblingDriverFields<CuttingFields, "F" | "fz">(
    [{ fields: ["F", "fz"] }],
    fields,
    setFields
  );

  // --------------------------------------------------
  // DERIVED DRIVERS
  // --------------------------------------------------

  const isSolvingRef = useRef(false);

/*
 const prevSourcesRef = useRef({
  Vc: fields.Vc.source,
  n: fields.n.source,
  F: fields.F.source,
  fz: fields.fz.source,
});

useEffect(() => {
  if (isSolvingRef.current) return;

  const prev = prevSourcesRef.current;

  const vcBecameUser = prev.Vc === "machine" && fields.Vc.source === "user";
  const nBecameUser  = prev.n  === "machine" && fields.n.source  === "user";
  const fBecameUser  = prev.F  === "machine" && fields.F.source  === "user";
  const fzBecameUser = prev.fz === "machine" && fields.fz.source === "user";

  // -------- SPEED --------
  if (vcBecameUser || nBecameUser) {
    // bevisst: ikke sett driver i samme render
  } else if (
    fields.Vc.source === "user" &&
    fields.n.source !== "machine"
  ) {
    speedDriver.setDriver("Vc");
  } else if (
    fields.n.source === "user" &&
    fields.Vc.source !== "machine"
  ) {
    speedDriver.setDriver("n");
  } else {
    speedDriver.clearDriver();
  }

  // -------- FEED --------
  if (fBecameUser || fzBecameUser) {
    // samme her
  } else if (
    fields.fz.source === "user" &&
    fields.F.source !== "machine"
  ) {
    feedDriver.setDriver("fz");
  } else if (
    fields.F.source === "user" &&
    fields.fz.source !== "machine"
  ) {
    feedDriver.setDriver("F");
  } else {
    feedDriver.clearDriver();
  }

  prevSourcesRef.current = {
    Vc: fields.Vc.source,
    n: fields.n.source,
    F: fields.F.source,
    fz: fields.fz.source,
  };
}, [
  fields.Vc.source,
  fields.n.source,
  fields.F.source,
  fields.fz.source,
  fields.Vc.value,
  fields.n.value,
  fields.F.value,
  fields.fz.value,
]);

*/
useDerivedDrivers({
  fields,
  isSolvingRef,
  groups: [
    {
      driver: speedDriver,
      fields: ["Vc", "n"],
    },
    {
      driver: feedDriver,
      fields: ["F", "fz"],
    },
  ],
});


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
      isSolvingRef.current = true;
      const res = solveCuttingData(input);

      setResult(res);

      /* Etter solve: ingen driver låst
      speedDriver.clearDriver();
      feedDriver.clearDriver();
*/

      applyFormattedResult(res);


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
    } finally {
      isSolvingRef.current = false;
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
    inputRef?: Ref<HTMLInputElement>,
    disabled?: boolean
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
          disabled={disabled}
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
          {renderInput("D", "Verktøydiameter D", "mm", cuttingTooltips.D, true, undefined, disabledMap.D)}
          {renderInput("z", "Antall tenner z", "", cuttingTooltips.z, false, undefined, disabledMap.z)}
          {renderInput("Vc", "Skjærehastighet Vc", "m/min", cuttingTooltips.Vc, false, undefined, disabledMap.Vc)}
          {renderInput("n", "Omdreininger n", "rpm", cuttingTooltips.n, false, undefined, disabledMap.n)}
          {renderInput("F", "Matning F", "mm/min", cuttingTooltips.F, false, undefined, disabledMap.F)}
          {renderInput("fz", "Matning per tann fz", "mm/tann", cuttingTooltips.fz, false, undefined, disabledMap.fz)}



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
