import { createContext, useCallback, useContext, useMemo, useReducer, useRef, type Dispatch, type ReactNode, type SetStateAction } from "react";

type Store = Record<string, unknown>;

type AppStateContextValue = {
  storeRef: React.MutableRefObject<Store>;
  version: number;
  bumpVersion: () => void;
};

const AppStateContext = createContext<AppStateContextValue | null>(null);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const storeRef = useRef<Store>({});
  const [version, bumpVersion] = useReducer(n => n + 1, 0);

  const value = useMemo(() => ({ storeRef, version, bumpVersion }), [version]);

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppStateActions() {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error("useAppStateActions must be used within AppStateProvider");

  const clearAll = () => {
    ctx.storeRef.current = {};
    ctx.bumpVersion();
  };

  const clearMatching = (prefix: string) => {
    const store = ctx.storeRef.current;

    for (const key of Object.keys(store)) {
      if (key.startsWith(prefix)) {
        delete store[key];
      }
    }

    ctx.bumpVersion(); // trigger re-render
  };

  return { clearAll, clearMatching };
}



export function usePersistentState<T>(
  key: string,
  initial: T | (() => T)
): [T, Dispatch<SetStateAction<T>>, () => void] {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error("usePersistentState must be used within AppStateProvider");

  const [, forceRender] = useReducer(n => n + 1, 0);

  const getInitialValue = useCallback(
    () => (typeof initial === "function" ? (initial as () => T)() : initial),
    [initial]
  );

  // Initialize once
  if (!(key in ctx.storeRef.current)) {
    ctx.storeRef.current[key] = getInitialValue();
  }

  const setValue = useCallback(
    (next: SetStateAction<T>) => {
      const prev = ctx.storeRef.current[key] as T;
      const resolved = typeof next === "function"
        ? (next as (value: T) => T)(prev)
        : next;

      if (Object.is(prev, resolved)) return;

      ctx.storeRef.current[key] = resolved;
      forceRender();
    },
    [key]
  );

  // ⭐ NEW: RESET FUNKSJON
  const reset = useCallback(() => {
    ctx.storeRef.current[key] = getInitialValue();
    forceRender(); // re-render so UI updates
  }, [key, getInitialValue]);

  return [ctx.storeRef.current[key] as T, setValue, reset];
}
