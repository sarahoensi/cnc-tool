import { useEffect, useRef } from "react";
import { usePersistentState } from "@app/state";
import type { DiameterMode } from "../model/diameterMode";

export function useDiameterModeState() {
  const [mode, setMode] =
    usePersistentState<DiameterMode>("diameterMode", "inner");

  const modeRef = useRef(mode);

  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  return {
    mode,
    setMode,
    modeRef,
  };
}
