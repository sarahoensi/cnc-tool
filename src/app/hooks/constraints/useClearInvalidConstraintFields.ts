import { useEffect, useRef } from "react";
import type { FieldState } from "@app/state/field";
import { emptyField } from "@app/state/field/field";

export function useClearInvalidConstraintFields<
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
  const prevFieldsRef = useRef<F | null>(null);

  useEffect(() => {
    if (!fields) return; // 🔴 VIKTIG GUARD

    const prev = prevFieldsRef.current;
    prevFieldsRef.current = fields;

    if (!prev) return;

    const filled = (Object.keys(fields) as K[])
      .filter(k => fields[k]?.source === "user");

    if (filled.length <= 1) return;

    const matching = validSets.filter(set =>
      filled.every(f => set.includes(f))
    );

    if (matching.length === 0) return;

    const allowed = new Set<K>();
    for (const set of matching) {
      for (const f of set) allowed.add(f);
    }

    setFields(current => {
      if (!current) return current;

      let changed = false;
      let next = current;

      for (const key of Object.keys(current) as K[]) {
        if (
          current[key]?.source === "user" &&
          !allowed.has(key)
        ) {
          if (!changed) {
            next = { ...current };
            changed = true;
          }
          next[key] = emptyField() as F[K];
        }
      }

      return changed ? next : current;
    });
  }, [fields, setFields, validSets]);
}
