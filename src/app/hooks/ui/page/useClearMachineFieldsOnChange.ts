import { useEffect } from "react";
import type { FieldState } from "@app/state/field";
import { clearMachineFields } from "@app/state/field";

type Options = {
  clearResult?: () => void;
  clearErrors?: () => void;
};

export function useClearMachineFieldsOnChange<
  F extends Record<string, FieldState>,
  T
>(
  trigger: T,
  setFields: React.Dispatch<React.SetStateAction<F>>,
  options?: Options
) {
  useEffect(() => {
    setFields(prev => clearMachineFields(prev));

    options?.clearResult?.();
    options?.clearErrors?.();
  }, [trigger, setFields]);
}
