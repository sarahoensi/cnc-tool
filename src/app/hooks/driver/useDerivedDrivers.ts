import { useEffect, useRef } from "react";

type FieldLike = {
  source: string;
  value: string;
};

type DriverLike<K extends string> = {
  setDriver: (key: K) => void;
  clearDriver: () => void;
};

export function useDerivedDrivers<
  F extends Record<string, FieldLike>
>({
  fields,
  isSolvingRef,
  groups,
}: {
  fields: F;
  isSolvingRef: React.MutableRefObject<boolean>;
  groups: {
    fields: readonly [keyof F & string, keyof F & string];
    driver: DriverLike<any>;
  }[];
}) {
  const prevSourcesRef = useRef<Record<string, string> | null>(null);

  useEffect(() => {
    if (isSolvingRef.current) return;

    const keys = Object.keys(fields);

    // Init prev on first run
    if (!prevSourcesRef.current) {
      const initial: Record<string, string> = {};
      for (const key of keys) {
        initial[key] = fields[key].source;
      }
      prevSourcesRef.current = initial;
      return;
    }

    const prev = prevSourcesRef.current;

    for (const group of groups) {
      const [a, b] = group.fields;

      const prevA = prev[a];
      const prevB = prev[b];

      const currA = fields[a].source;
      const currB = fields[b].source;

      const aBecameUser = prevA === "machine" && currA === "user";
      const bBecameUser = prevB === "machine" && currB === "user";

      // Bevisst: ikke sett driver i samme render
      if (aBecameUser || bBecameUser) {
        continue;
      }

      if (currA === "user" && currB !== "machine") {
        group.driver.setDriver(a);
      } else if (currB === "user" && currA !== "machine") {
        group.driver.setDriver(b);
      } else {
        group.driver.clearDriver();
      }
    }

    const nextPrev: Record<string, string> = {};
    for (const key of keys) {
      nextPrev[key] = fields[key].source;
    }
    prevSourcesRef.current = nextPrev;
  }, [fields, groups, isSolvingRef]);
}
