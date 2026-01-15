// src/app/hooks/constraint/useConstraintGroups.ts

import type { FieldState } from "@app/state/field";
import { useDerivedConstraintSet } from "./useDerivedConstraintSet";
import { useClearInvalidConstraintFields } from "./useClearInvalidConstraintFields";

export function useConstraintGroups<
  F extends Record<string, FieldState>,
  K extends keyof F & string
>({
  fields,
  setFields,
  validSets,
}: {
  fields: F;
  setFields: React.Dispatch<React.SetStateAction<F>>;
  validSets: readonly K[][];
}) {
  const activeSet = useDerivedConstraintSet<F, K>({
    fields,
    validSets,
  });

  useClearInvalidConstraintFields<F, K>({
    fields,
    setFields,
    validSets,
  });

  return activeSet;
}
