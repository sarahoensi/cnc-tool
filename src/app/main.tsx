import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { AppStateProvider } from "@app/state";

/* 🎨 Theme system */
import "@ui/styles/tokens/tokens.colors.css";
import "@ui/styles/tokens/tokens.layout.css";

import "@ui/styles/themes/theme-default.css";
import "@ui/styles/themes/theme-pink.css";
import "@ui/styles/themes/theme-forest.css";


/* 🧱 Base styles */
import "@ui/styles/base.css";
import "@ui/shell/AppShell.css";

/* ============================== */
/* 🔑 Theme init (single source)  */
/* ============================== */

const THEME_KEY = "ui.theme";

(function initTheme() {
  const stored = localStorage.getItem(THEME_KEY);

  // Sett tema før React rendres (ingen flash, ingen reset)
  document.documentElement.dataset.theme =
    stored && stored !== "system" ? stored : "default";
})();

ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
).render(
  <React.StrictMode>
    <AppStateProvider>
      <RouterProvider router={router} />
    </AppStateProvider>
  </React.StrictMode>
);
