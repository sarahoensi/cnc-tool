// src/app/hooks/driver/useMutuallyExclusiveFields.ts

import type { FieldState } from "@app/state/field/field";
import { emptyField } from "@app/state/field/field";
import type React from "react";

export function useExclusiveDriver<
  F extends Record<string, FieldState>,
  D extends keyof F
>({
  setFields,
  setDriver,
  clearDriver,
}: {
  setFields: React.Dispatch<React.SetStateAction<F>>;
  setDriver: (k: D) => void;
  clearDriver: () => void;
}) {
  function activateDriver(
    key: D,
    otherKeys: readonly D[]
  ) {
    setDriver(key);

    setFields(prev => {
      const next = { ...prev };

      next[key] = emptyField() as F[D];
      for (const other of otherKeys) {
        next[other] = emptyField() as F[D];
      }

      return next;
    });
  }

  function onUserClearedValue(_: D) {
    clearDriver();
  }

  return {
    activateDriver,
    onUserClearedValue,
  };
}
