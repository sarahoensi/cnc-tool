import { useEffect, useRef } from "react";
import "./SettingsMenu.css";

type Theme = "default" | "pink" | "forest" | "system";

interface SettingsMenuProps {
  onClose: () => void;
}

const THEME_KEY = "ui.theme";

export function SettingsMenu({ onClose }: SettingsMenuProps) {
  const ref = useRef<HTMLDivElement>(null);

  function setTheme(theme: Theme) {
    // 🔑 Én sannhet
    localStorage.setItem(THEME_KEY, theme);

    document.documentElement.dataset.theme =
      theme === "system" ? "default" : theme;

    onClose();
  }

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (
    <div ref={ref} className="settings-menu">
      <div className="settings-title">Tema</div>

      <button onClick={() => setTheme("default")}>🌤 Standard</button>
      <button onClick={() => setTheme("pink")}>🌸 Rosa</button>
      <button onClick={() => setTheme("forest")}>🌲 Forest</button>
      <button onClick={() => setTheme("system")}>🖥 System</button>
    </div>
  );
}
