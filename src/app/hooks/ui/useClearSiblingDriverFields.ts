import { useEffect, useRef } from "react";
import type { FieldState } from "@app/state/field";

type DriverGroup<K extends string> = {
  driver: K | null;
  fields: readonly K[];
};

type Options = {
  clearResult?: () => void;
  clearErrors?: () => void;
};

export function useClearSiblingDriverFields<
  F extends Record<string, FieldState>,
  K extends keyof F & string
>(
  groups: readonly DriverGroup<K>[],
  setFields: React.Dispatch<React.SetStateAction<F>>,
  options?: Options
) {
  const prevDrivers = useRef<Record<string, string | null>>({});

  useEffect(() => {
    setFields(prev => {
      let next = prev;
      let changed = false;

      for (const group of groups) {
        const prevDriver = prevDrivers.current[group.fields.join(",")] ?? null;
        const currentDriver = group.driver;

        // Kun reager når driver faktisk har endret seg
        if (currentDriver && currentDriver !== prevDriver) {
          for (const field of group.fields) {
            if (field !== currentDriver && prev[field]?.value !== "") {
              if (!changed) {
                next = { ...prev };
                changed = true;
              }
              next[field] = { ...prev[field], value: "" };
            }
          }
        }

        prevDrivers.current[group.fields.join(",")] = currentDriver;
      }

      return next;
    });

    options?.clearResult?.();
    options?.clearErrors?.();
  }, [groups.map(g => g.driver).join("|"), setFields]);
}
