import { useDerivedDrivers } from "./useDerivedDrivers";
import { useClearSiblingDriverFields } from "./useClearSiblingDriverFields";
import type { FieldState } from "@app/state/field";

type DriverLike<K extends string> = {
  setDriver: (key: K) => void;
  clearDriver: () => void;
};

type DriverGroup<F extends Record<string, FieldState>> = {
  fields: readonly (keyof F & string)[];
  driver: DriverLike<any>;
};

export function useDriverGroups<
  F extends Record<string, FieldState>
>({
  fields,
  setFields,
  groups,
}: {
  fields: F;
  setFields: React.Dispatch<React.SetStateAction<F>>;
  groups: readonly DriverGroup<F>[];
}) {
  // 1. Clear sibling fields on machine -> user
  useClearSiblingDriverFields(
    groups.map(g => ({ fields: g.fields })),
    fields,
    setFields
  );

  // 2. Derive drivers
  useDerivedDrivers({
    fields,
    groups: groups.map(g => ({
      fields: [g.fields[0], g.fields[1]] as [
        keyof F & string,
        keyof F & string
      ],
      driver: g.driver,
    })),
  });
}