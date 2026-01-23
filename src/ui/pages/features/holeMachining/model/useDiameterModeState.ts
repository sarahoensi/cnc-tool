import { useEffect, useRef } from "react";
import { usePersistentState } from "@app/state";
import type { DiameterMode } from "@core/holeMachining/types";

export function useDiameterModeState() {
  const [mode, setMode] =
    usePersistentState<DiameterMode>("diameterMode", "ID");

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
