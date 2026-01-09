import { useEffect, useRef } from "react";
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
  const prevDriver = useRef<D | null>(null);

  useEffect(() => {
    if (!driver || driver === prevDriver.current) return;

    prevDriver.current = driver;

    setFields(prev => {
      let changed = false;
      const next = { ...prev };

      for (const other of mapping[driver] ?? []) {
        if (prev[other]?.value !== "") {
          next[other] = emptyField() as F[D];
          changed = true;
        }
      }

      return changed ? next : prev;
    });
  }, [driver, setFields, mapping]);
}
