//src/ui/components/Settings/theme/useTheme

export type Theme = "default" | "pink" | "forest" | "system";

const THEME_KEY = "ui.theme";

export function setTheme(theme: Theme) {
  localStorage.setItem(THEME_KEY, theme);

  document.documentElement.dataset.theme =
    theme === "system" ? "default" : theme;
}

export function getTheme(): Theme {
  return (localStorage.getItem(THEME_KEY) as Theme) ?? "default";
}
