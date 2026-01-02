// app/hooks/ui/useTheme.ts
export function setTheme(theme: string) {
  localStorage.setItem("ui.theme", theme);
  document.documentElement.dataset.theme = theme;
}

export function getTheme() {
  return localStorage.getItem("ui.theme") ?? "default";
}
