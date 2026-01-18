import { solveTriangle, TriangleSolverInput } from "@core";
import { FieldValidationError } from "@core/errors";
import { parseNumberFields } from "@ui/pages/shared/workflow/fields";
import type { TriangleFields } from "../model/triangleFields";

type FieldKeys = keyof TriangleFields;

type Params = {
  fields: TriangleFields;
  clearAllFieldErrors: () => void;
  setFieldErrors: (errors: Partial<Record<FieldKeys, string>>) => void;
  setError: (error: string | null) => void;
  applyFormattedResult: (result: TriangleSolverInput) => void;
};

export function useTriangleSolve({
  fields,
  clearAllFieldErrors,
  setFieldErrors,
  setError,
  applyFormattedResult,
}: Params) {
  function handleSolve() {
    setError(null);
    clearAllFieldErrors();

    const fieldMap: {
      [K in keyof TriangleSolverInput]: { value: string }
    } = {
      a: fields.a,
      b: fields.b,
      c: fields.c,
      alpha: fields.alpha,
      beta: fields.beta,
    };

    const { input, errors } =
      parseNumberFields<TriangleSolverInput>(fieldMap);

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    try {
      const result = solveTriangle(input);

      applyFormattedResult(result);
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
