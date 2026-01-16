// src/app/hooks/constraint/useConstraintOverride.ts

import { useState } from "react";

export type ConstraintOverride<K extends string> = {
  activeSet: readonly K[] | null;
  setActiveSet: (set: readonly K[]) => void;
  clearActiveSet: () => void;
  isAllowed: (key: K) => boolean;
};

export function useConstraintOverride<K extends string>(): ConstraintOverride<K> {
  const [activeSet, setActiveSetState] = useState<readonly K[] | null>(null);

  return {
    activeSet,
    setActiveSet: (set) => setActiveSetState(set),
    clearActiveSet: () => setActiveSetState(null),
    isAllowed: (key) => !activeSet || activeSet.includes(key),
  };
}
