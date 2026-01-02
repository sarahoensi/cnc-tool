// useFieldUpdater.ts
import { clearMachineFields, emptyField, userField } from "@app/state/field/field";
import type { FieldState } from "@app/state/field/field";
import type React from "react";

export function useFieldUpdater<
  F extends Record<string, FieldState>
>({
  setFields,
  clearError,
  clearFieldError,
}: {
  setFields: React.Dispatch<React.SetStateAction<F>>;
  clearError?: () => void;
  clearFieldError?: (key: keyof F) => void;
}) {
  return function updateField<K extends keyof F>(
    key: K,
    next: FieldState
  ) {
    clearError?.();
    clearFieldError?.(key);

    setFields(prev =>
      clearMachineFields(
        {
          ...prev,
          [key]:
            next.value === ""
              ? emptyField()
              : userField(next.value),
        },
        [key]
      )
    );
  };
}
