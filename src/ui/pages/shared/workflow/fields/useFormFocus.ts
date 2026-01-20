import { useCallback, useEffect, useMemo, useRef } from "react";
import type { FieldState } from "@app/state";

export function useFormFocus<K extends string>(options: {
  keys: readonly K[];
  fields: Record<K, FieldState>;
  disabledMap?: Partial<Record<K, boolean>>;
  autoFocusOnMount?: boolean;
}) {
  const { keys, disabledMap, autoFocusOnMount } = options;

  // ---------------- refs ----------------
  const refs = useRef<Partial<Record<K, HTMLInputElement>>>({});
  const lastFocused = useRef<K | undefined>(undefined);
  const isProgrammatic = useRef(false);
  const didAutoFocus = useRef(false);

  // ---------------- registration ----------------
  const register = useCallback(
    (key: K) => (el: HTMLInputElement | null) => {
      if (el) {
        refs.current[key] = el;
      }
    },
    []
  );

  // ---------------- focus primitive ----------------
  const focus = useCallback((key?: K) => {
    if (!key) return;

    const el = refs.current[key];
    if (!el) return;

    isProgrammatic.current = true;
    el.focus();
    lastFocused.current = key;

    // reset after this call stack
    queueMicrotask(() => {
      isProgrammatic.current = false;
    });
  }, []);

  // ---------------- derived key ----------------
  // ÉN regel: første enabled felt som er "empty"
  // ÉN regel: første enabled felt i rekkefølge
const firstField = useMemo(() => {
  return keys.find((k) => !disabledMap?.[k]);
}, [keys, disabledMap]);


  // ---------------- effects ----------------
  useEffect(() => {
    if (!autoFocusOnMount) return;
    if (didAutoFocus.current) return;
    if (!firstField) return;

    didAutoFocus.current = true;
    focus(firstField);
  }, [autoFocusOnMount, firstField, focus]);
  // ---------------- event helpers ----------------
  const onFieldFocus = useCallback((key: K) => {
    if (!isProgrammatic.current) {
      lastFocused.current = key;
    }
  }, []);

  // ---------------- public API ----------------
  return {
    // refs
    register,

    // focus actions
    focus,
    focusFirst: () => focus(firstField),
    restoreLast: () => focus(lastFocused.current),

    // events
    onFieldFocus,
  };
}
