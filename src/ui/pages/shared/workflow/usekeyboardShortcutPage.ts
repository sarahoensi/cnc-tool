import { useEnterNavigation } from "@app/hooks/ui/keyboard/useEnterNavigation";
import { useKeyboardShortcuts } from "@app/hooks/ui/keyboard/useKeyboardShortcuts";

type Params = {
  onSolve: () => void;
  onReset: () => void;
};

export function useKeyboardShortcutsPage({
  onSolve,
  onReset,
}: Params) {
  // Enter / Shift+Enter navigasjon i felter
  const { onKeyDown: onEnterKeyDown } =
    useEnterNavigation({
        
      onSubmit: onSolve,
    });
    

  // Globale snarveier
  useKeyboardShortcuts({
    Escape: onReset,
    "Ctrl+Enter": onSolve,
  });

  return {
    onEnterKeyDown,
  };
}