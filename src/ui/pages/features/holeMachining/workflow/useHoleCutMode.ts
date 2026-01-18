import { useState } from "react";

export type CutMode = "deltaD" | "ae";

export function useHoleCutMode() {
  const [mode, setMode] = useState<CutMode>("deltaD");

  return {
    mode,
    setMode,
  };
}
