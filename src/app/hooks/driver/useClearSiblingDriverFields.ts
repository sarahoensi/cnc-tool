import { useEffect, useRef } from "react";
import type { FieldState } from "@app/state/field";
import { emptyField } from "@app/state/field/field";


type DriverGroup<K extends string> = {
  fields: readonly K[];
};

export function useClearSiblingDriverFields<
  F extends Record<string, FieldState>,
  K extends keyof F & string
>(
  groups: readonly DriverGroup<K>[],
  fields: F,
  setFields: React.Dispatch<React.SetStateAction<F>>
) {
  const prevFieldsRef = useRef<F | null>(null);

  useEffect(() => {
    const prev = prevFieldsRef.current;
    prevFieldsRef.current = fields;

    if (!prev) return;

    setFields(current => {
      let next = current;
      let changed = false;

      for (const group of groups) {
        for (const key of group.fields) {
          const prevField = prev[key];
          const currField = fields[key];

          if (
            prevField.source === "machine" &&
            currField.source === "user"
          ) {
            for (const sibling of group.fields) {
              if (sibling === key) continue;

              if (current[sibling].value !== "") {
                if (!changed) {
                  next = { ...current };
                  changed = true;
                }
                next[sibling] = emptyField() as F[K];

              }
            }
          }
        }
      }

      return changed ? next : current;
    });
  }, [fields, groups, setFields]);
}
