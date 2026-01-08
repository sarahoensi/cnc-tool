// src/app/hooks/driver/useDerivedDrivers.ts

import { useEffect, useRef } from "react";
import type { FieldState } from "@app/state/field";
import type { DriverOverride } from "@app/hooks/driver/useDriverOverride";

// En gruppe er alltid to felter
type Group = readonly [string, string];

// Bygger "Vc|n" fra ["Vc", "n"]
type GroupKey<G extends Group> = `${G[0]}|${G[1]}`;

// Props er bundet til de faktiske gruppene – ikke en global union
type Props<G extends readonly Group[]> = {
  fields: Record<G[number][0] | G[number][1], FieldState>;
  groups: G;
  drivers: {
    [I in G[number] as GroupKey<I>]: DriverOverride<I[0] | I[1]>;
  };
  isSolvingRef?: React.MutableRefObject<boolean>;
};

export function useDerivedDrivers<G extends readonly Group[]>({
  fields,
  groups,
  drivers,
  isSolvingRef,
}: Props<G>) {
  type K = G[number][0] | G[number][1];

  const prevSourcesRef = useRef<Record<K, FieldState["source"]>>(
    {} as Record<K, FieldState["source"]>
  );

  // init once
  if (Object.keys(prevSourcesRef.current).length === 0) {
    for (const [a, b] of groups) {
      prevSourcesRef.current[a as K] = fields[a as K].source;
      prevSourcesRef.current[b as K] = fields[b as K].source;
    }
  }

  useEffect(() => {
    if (isSolvingRef?.current) return;

    const prev = prevSourcesRef.current;

    for (const [a, b] of groups) {
      const key = `${a}|${b}` as GroupKey<[typeof a, typeof b]>;
      const controller = drivers[key];
      if (!controller) continue;

      const aKey = a as K;
      const bKey = b as K;

      const aPrev = prev[aKey];
      const bPrev = prev[bKey];
      const aNow = fields[aKey].source;
      const bNow = fields[bKey].source;

      const aBecameUser = aPrev === "machine" && aNow === "user";
      const bBecameUser = bPrev === "machine" && bNow === "user";

      if (aBecameUser || bBecameUser) {
        prev[aKey] = aNow;
        prev[bKey] = bNow;
        continue;
      }

      if (aNow === "user" && bNow !== "machine") {
        controller.setDriver(aKey);
      } else if (bNow === "user" && aNow !== "machine") {
        controller.setDriver(bKey);
      } else {
        controller.clearDriver();
      }

      prev[aKey] = aNow;
      prev[bKey] = bNow;
    }
  }, [fields, groups, drivers, isSolvingRef]);
}
