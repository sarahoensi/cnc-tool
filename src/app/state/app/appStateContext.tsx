import {
  createContext,
  useMemo,
  useReducer,
  useRef,
  type ReactNode,
} from "react";

type Store = Record<string, unknown>;

export type AppStateContextValue = {
  storeRef: React.MutableRefObject<Store>;
  version: number;
  bumpVersion: () => void;
};

export const AppStateContext =
  createContext<AppStateContextValue | null>(null);

export function AppStateProvider({ children }: { children: ReactNode }) {
  // 🔑 AppState = kun data (ingen UI-preferanser)
  const storeRef = useRef<Store>({});

  const [version, bumpVersion] = useReducer(n => n + 1, 0);

  const value = useMemo(
    () => ({
      storeRef,
      version,
      bumpVersion,
    }),
    [version]
  );

  return (
    <AppStateContext.Provider value={value}>
      {children}
    </AppStateContext.Provider>
  );
}
