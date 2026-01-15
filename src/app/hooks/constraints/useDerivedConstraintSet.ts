// src/app/hooks/constraint/useDerivedConstraintSet.ts

import { useEffect, useState } from "react";
import type { FieldState } from "@app/state/field";

export function useDerivedConstraintSet<
  F extends Record<string, FieldState>,
  K extends keyof F & string
>({
  fields,
  validSets,
}: {
  fields: F;
  validSets: readonly K[][];
}) {
  const [activeSet, setActiveSet] = useState<readonly K[] | null>(null);

  useEffect(() => {
    if (!fields) {
      setActiveSet(null);
      return;
    }
    const filled = (Object.keys(fields) as K[])
      .filter(k => fields[k].source === "user");

    if (filled.length === 0) {
      setActiveSet(null);
      return;
    }

    const matching = validSets.filter(set =>
      filled.every(f => set.includes(f))
    );

    if (matching.length === 1) {
      setActiveSet(matching[0]);
    } else {
      setActiveSet(null);
    }
  }, [fields, validSets]);

  return activeSet;
}
