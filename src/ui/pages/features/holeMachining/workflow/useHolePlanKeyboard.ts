import { useEnterNavigation } from "@app/hooks/ui/keyboard/useEnterNavigation";

type Params = {
  onSolve: () => void;
  onReset: () => void;
};

export function useHoleKeyboard({
  onSolve,
  onReset,
}: Params) {
  // Enter i input-felt
  const { onKeyDown: onEnterKeyDown } =
    useEnterNavigation({
      onSubmit: onSolve,
    });

  // Globale shortcuts
  const shortcuts = {
    Escape: onReset,
    "Ctrl+Enter": onSolve,
  };

  return {
    onEnterKeyDown,
    shortcuts,
  };
}
