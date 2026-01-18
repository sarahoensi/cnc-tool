import { useEnterNavigation } from "@app/hooks/ui/keyboard/useEnterNavigation";
import { useKeyboardShortcuts } from "@app/hooks/ui/keyboard/useKeyboardShortcuts";

type Params = {
  onSolve: () => void;
  onReset: () => void;
};

export function useCuttingKeyboard({ onSolve, onReset }: Params) {
  const { onKeyDown } = useEnterNavigation({
    onSubmit: onSolve,
  });

  useKeyboardShortcuts({
    Escape: onReset,
    "Ctrl+Enter": onSolve,
  });

  return {
    onEnterKeyDown: onKeyDown,
  };
}
