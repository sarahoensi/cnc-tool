// src/app/hooks/useAutoFocusOnVisibility.ts
import { useEffect, useCallback, useRef } from "react";

export function useAutoFocusOnVisibility<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  const focus = useCallback(() => {
    ref.current?.focus();
  }, []);

  useEffect(() => {
    focus();

    const onVisibility = () => {
      if (document.visibilityState === "visible") {
        focus();
      }
    };

    window.addEventListener("focus", focus);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      window.removeEventListener("focus", focus);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [focus]);

  return {
    ref,
    focus,
  };
}
