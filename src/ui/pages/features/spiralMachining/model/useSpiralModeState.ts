import { useEffect, useRef } from "react";
import { usePersistentState } from "@app/state";
import type { HelixMode } from "@core/helix/types";

export function useSpiralModeState() {
  const [mode, setMode] =
    usePersistentState<HelixMode>("spiralMode", "inner");

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
