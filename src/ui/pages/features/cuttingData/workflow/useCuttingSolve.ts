import { CuttingDataInput, solveCuttingData, CuttingDataSolution } from "@core/cuttingData";
import { FieldValidationError } from "@core/errors";
import { toNumber } from "@utils/number";
import type { CuttingFields } from "../model/cuttingFields";

type FieldKeys = keyof CuttingFields;

type Params = {
  fields: CuttingFields;
  clearAllFieldErrors: () => void;
  setFieldErrors: (errors: Partial<Record<FieldKeys, string>>) => void;
  setError: (error: string | null) => void;
  setResult: (result: CuttingDataSolution | null) => void;
  applyFormattedResult: (result: CuttingDataSolution) => void;
};

export function useCuttingSolve({
  fields,
  clearAllFieldErrors,
  setFieldErrors,
  setError,
  setResult,
  applyFormattedResult,
}: Params) {
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

  return { handleSolve };
}
