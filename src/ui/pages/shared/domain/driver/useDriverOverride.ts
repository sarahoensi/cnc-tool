// src/app/hooks/driver/useDriverOverride.ts

import { useState } from "react";

export type DriverOverride<K extends string> = {
  driver: K | null;
  setDriver: (value: K | null) => void;
  clearDriver: () => void;
  isDriver: (key: K) => boolean;
};

export function useDriverOverride<K extends string>(): DriverOverride<K> {
  const [driver, setDriver] = useState<K | null>(null);

  return {
    driver,
    setDriver,
    clearDriver: () => setDriver(null),
    isDriver: (key: K) => driver === key,
  };
}
