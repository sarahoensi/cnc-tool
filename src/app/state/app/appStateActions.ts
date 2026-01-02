import { useContext } from "react";
import { AppStateContext } from "../app/appStateContext";

const THEME_KEY = "ui.theme";

export function useAppStateActions() {
  const ctx = useContext(AppStateContext);
  if (!ctx) {
    throw new Error("useAppStateActions must be used within AppStateProvider");
  }

  /* ============================== */
  /* Clear all (preserve UI prefs)  */
  /* ============================== */

  const clearAll = () => {
    const store = ctx.storeRef.current;

    // Bevar UI-preferanser
    const preservedTheme = store[THEME_KEY];

    ctx.storeRef.current = {};

    if (preservedTheme !== undefined) {
      ctx.storeRef.current[THEME_KEY] = preservedTheme;
    }

    ctx.bumpVersion();
  };

  /* ============================== */
  /* Clear matching prefix safely   */
  /* ============================== */

  const clearMatching = (prefix: string) => {
    if (!prefix) return;

    const store = ctx.storeRef.current;

    for (const key of Object.keys(store)) {
      // 🛡️ Aldri rør UI-preferanser
      if (key === THEME_KEY) continue;

      // Ekstra sikkerhet: beskytt alt ui.*
      if (key.startsWith("ui.")) continue;

      if (key.startsWith(prefix)) {
        delete store[key];
      }
    }

    ctx.bumpVersion();
  };

  /* ============================== */
  /* 🎨 Theme actions               */
  /* ============================== */

  const setTheme = (theme: string) => {
    ctx.storeRef.current[THEME_KEY] = theme;
    ctx.bumpVersion();
  };

  const toggleTheme = () => {
    const current = ctx.storeRef.current[THEME_KEY];
    ctx.storeRef.current[THEME_KEY] =
      current === "pink" ? "default" : "pink";
    ctx.bumpVersion();
  };

  return {
    clearAll,
    clearMatching,
    setTheme,
    toggleTheme,
  };
}
