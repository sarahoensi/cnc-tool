// src/app/hooks/driver/useDriverInvariant.ts

import { useEffect } from "react";
import { emptyField } from "@app/state/field/field";
import type { FieldState } from "@app/state/field/field";

export function useDriverInvariant<
  F extends Record<string, FieldState>,
  D extends keyof F
>({
  driver,
  setFields,
  mapping,
}: {
  driver: D | null;
  setFields: React.Dispatch<React.SetStateAction<F>>;
  mapping: Record<D, readonly D[]>;
}) {
  useEffect(() => {
    if (!driver) return;

    setFields(prev => {
      const next = { ...prev };

      for (const other of mapping[driver] ?? []) {
        next[other] = emptyField() as F[D];
      }

      return next;
    });
  }, [driver, setFields, mapping]);
}
