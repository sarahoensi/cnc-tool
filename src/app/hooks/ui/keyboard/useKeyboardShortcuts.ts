import { useEffect } from "react";

type ShortcutMap = {
  [combo: string]: (e: KeyboardEvent) => void;
};

export function useKeyboardShortcuts(map: ShortcutMap) {
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      const combo = [
        e.ctrlKey ? "Ctrl" : "",
        e.shiftKey ? "Shift" : "",
        e.altKey ? "Alt" : "",
        e.key,
      ]
        .filter(Boolean)
        .join("+");

      const fn = map[combo];
      if (fn) {
        e.preventDefault();
        fn(e);
      }
    }

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [map]);
}
