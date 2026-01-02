// src/app/hooks/driver/useDriverOverride.ts

import { useState } from "react";

/**
 * Generic hook for "driver field" logic.
 *
 * K = union av lovlige driver-felter (f.eks "pitch" | "angle")
 */
export function useDriverOverride<K extends string>() {
  const [driver, setDriver] = useState<K | null>(null);

  return {
    driver,
    setDriver,
    clearDriver: () => setDriver(null),
    isDriver: (key: K) => driver === key,
  };
}
