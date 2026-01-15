// useEnterNavigation.ts
import { useCallback } from "react";

function getFocusableElements() {
  return Array.from(
    document.querySelectorAll<HTMLElement>(
      'input, button, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
  ).filter(el =>
    !el.hasAttribute("disabled") &&
    el.getAttribute("aria-disabled") !== "true" &&
    el.offsetParent !== null
  );
}

export function useEnterNavigation(options: { onSubmit?: () => void }) {
  const { onSubmit } = options;

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key !== "Enter") return;

      const focusables = getFocusableElements();
      const current = document.activeElement as HTMLElement;
      const index = focusables.indexOf(current);

      if (index === -1) return;

      e.preventDefault();

      const next = focusables[index + 1];

      if (next) {
        next.focus();
      } else {
        onSubmit?.();
      }
    },
    [onSubmit]
  );

  return { onKeyDown };
}
