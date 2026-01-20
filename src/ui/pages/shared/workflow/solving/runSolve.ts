// shared/workflow/solving/runSolve.ts
import { FieldValidationError } from "@core/errors";

export function runSolve<
  Input,
  Result,
  FieldKey extends string
>(params: {
  before?: () => void;
  buildInput: () => Input | null;
  solve: (input: Input) => Result;
  onSuccess?: (result: Result) => void;
  onValidationError?: (
    errors: Partial<Record<FieldKey, string>>
  ) => void;
  onError?: (message: string) => void;
}) {
  return () => {
    params.before?.();

    const input = params.buildInput();
    if (!input) return;

    try {
      const result = params.solve(input);
      params.onSuccess?.(result);
    } catch (e) {
      if (e instanceof FieldValidationError) {
        params.onValidationError?.(e.fieldErrors);
        return;
      }

      params.onError?.(
        e instanceof Error ? e.message : "Ukjent feil"
      );
    }
  };
}
