import { useCallback } from "react";
import { solveCuttingData, type CuttingDataInput } from "@core/cuttingData";
import { FieldValidationError } from "@core/errors";
import { toNumber } from "@utils/number";

import type { CuttingFields } from "../state/cuttingFields";

type FieldKeys = keyof CuttingFields;

interface UseSolveCuttingDataParams {
  fields: CuttingFields;
  clearAllFieldErrors: () => void;
  setFieldErrors: (errors: Partial<Record<FieldKeys, string>>) => void;
  setError: (error: string | null) => void;
  setResult: (result: any | null) => void;
  applyFormattedResult: (result: any) => void;
  isSolvingRef: React.MutableRefObject<boolean>;
}

export function useSolveCuttingData({
  fields,
  clearAllFieldErrors,
  setFieldErrors,
  setError,
  setResult,
  applyFormattedResult,
  isSolvingRef,
}: UseSolveCuttingDataParams) {
  const handleSolve = useCallback(() => {
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
      applyFormattedResult(res);
    } catch (e) {
      if (e instanceof FieldValidationError) {
        setFieldErrors(e.fieldErrors as Partial<Record<FieldKeys, string>>);
        return;
      }

      setError(e instanceof Error ? e.message : "Ukjent feil");
    } finally {
      isSolvingRef.current = false;
    }
  }, [
    fields,
    clearAllFieldErrors,
    setError,
    setResult,
    setFieldErrors,
    applyFormattedResult,
    isSolvingRef,
  ]);

  return { handleSolve };
}
