import {
  useCallback,
  useContext,
  useReducer,
  type Dispatch,
  type SetStateAction,
} from "react";

import { AppStateContext } from "../app/appStateContext";

const UI_PREFIX = "ui.";

export function usePersistentState<T>(
  key: string,
  initial: T | (() => T)
): [T, Dispatch<SetStateAction<T>>, () => void] {
  const ctx = useContext(AppStateContext);
  if (!ctx) {
    throw new Error("usePersistentState must be used within AppStateProvider");
  }

  const [, forceRender] = useReducer(n => n + 1, 0);

  const getInitialValue = useCallback(
    () =>
      typeof initial === "function"
        ? (initial as () => T)()
        : initial,
    [initial]
  );

  // 🔒 Aldri initialiser UI-preferanser her
  if (key.startsWith(UI_PREFIX)) {
    throw new Error(
      `usePersistentState must not be used for UI keys (${key}). ` +
      `Use a dedicated preference/theme hook instead.`
    );
  }

  if (!(key in ctx.storeRef.current)) {
    ctx.storeRef.current[key] = getInitialValue();
  }

  const setValue = useCallback(
    (next: SetStateAction<T>) => {
      const prev = ctx.storeRef.current[key] as T;
      const resolved =
        typeof next === "function"
          ? (next as (value: T) => T)(prev)
          : next;

      if (Object.is(prev, resolved)) return;

      ctx.storeRef.current[key] = resolved;
      forceRender();
    },
    [key]
  );

  const reset = useCallback(() => {
    ctx.storeRef.current[key] = getInitialValue();
    forceRender();
  }, [key, getInitialValue]);

  return [ctx.storeRef.current[key] as T, setValue, reset];
}
